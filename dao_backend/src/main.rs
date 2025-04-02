use warp::Filter;
use ethers::prelude::*;
use ethers::abi::Abi;
use std::sync::Arc;
use dotenv::dotenv;
use std::env;
use chrono::{NaiveDateTime, Utc, TimeZone, FixedOffset};

#[tokio::main]
async fn main() -> eyre::Result<()> {
    dotenv().ok();

    // Get contract address from env
    let contract_address: Address = env::var("CONTRACT_ADDRESS")?.parse()?;
    let abi: Abi = serde_json::from_str(include_str!("../abi.json"))?;

    // Create provider for read-only operations
    let provider = Provider::<Http>::try_from(env::var("INFURA_API_URL")?)?;
    let client = Arc::new(provider);

    // Create contract instance for read-only operations
    let contract = Contract::new(contract_address, abi, client.clone());

    //allowed cors for methods
    let cors = warp::cors().allow_any_origin().allow_headers(vec!["Content-Type"]).allow_methods(vec!["POST", "GET"]);

    // Endpoint to get contract info
    let contract_info = warp::path("contract-info")
        .and(warp::get())
        .map(move || {
            let response = serde_json::json!({
                "address": contract_address,
                "abi": include_str!("../abi.json")
            });
            warp::reply::json(&response)
        })
        .with(cors.clone());

    // get proposal details
    let get_proposal = warp::path!("proposal" / u64)
        .and(warp::get())
        .and_then({
            let contract = contract.clone();
            move |proposal_id| {
                let contract = contract.clone();
                async move {
                    let method = contract
                    .method::<_, (String, String, U256, U256, U256, bool)>("getProposal", proposal_id)
                    .unwrap();
                    let proposal = method.call().await.unwrap();

                    let response = ProposalResponse {
                        id: proposal_id,
                        title: proposal.0,
                        description: proposal.1,
                        deadline: format_deadline_ist(proposal.2.as_u64()),
                        votes_for: proposal.3.as_u64(),
                        votes_against: proposal.4.as_u64(),
                        executed: proposal.5,
                    };
                    Ok::<_, warp::Rejection>(warp::reply::json(&response))
                }
            }
        }).with(cors.clone());

    // list of all proposals
    let list_proposals = warp::path("proposals")
        .and(warp::get())
        .and_then({
            let contract = contract.clone();
            move || {
                let contract = contract.clone();
                async move {
                    let method = contract
                        .method::<_, Vec<(U256, String, String, U256, U256, U256, bool)>>("getAllProposals", ())
                        .unwrap();
                    let proposals = method.call().await.unwrap();

                    let response: Vec<ProposalResponse> = proposals.into_iter().map(|p| ProposalResponse {
                        id: p.0.as_u64(),
                        title: p.1,
                        description: p.2,
                        deadline: format_deadline_ist(p.3.as_u64()),
                        votes_for: p.4.as_u64(),
                        votes_against: p.5.as_u64(),
                        executed: p.6,
                    }).collect();
                    Ok::<_, warp::Rejection>(warp::reply::json(&response))
                }
            }
        }).with(cors.clone());

    //Combined routes
    let routes = contract_info.or(get_proposal).or(list_proposals);
    //localhost:3030
    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;
    Ok(())
}

//format deadline in IST
fn format_deadline_ist(timestamp: u64) -> String {
    let naive_utc = NaiveDateTime::from_timestamp_opt(timestamp as i64, 0)
        .unwrap_or_else(|| NaiveDateTime::from_timestamp(0, 0));
    
    // Convert into IST
    let ist_offset = FixedOffset::east_opt(5 * 3600 + 1800).unwrap();  
    let ist_time = ist_offset.from_utc_datetime(&naive_utc);

    ist_time.format("%Y-%m-%d %H:%M:%S IST").to_string()
}

#[derive(serde::Serialize)]
struct ProposalResponse {
    id: u64,
    title: String,
    description: String,
    deadline: String,
    votes_for: u64,
    votes_against: u64,
    executed: bool,
}
