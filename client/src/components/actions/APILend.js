import APIForm from "../APIForm.js"
import "../APIForm.css";
import { Box } from "@mui/material";

class APILend extends APIForm {
	constructor(props) {
		super(props);
		this.state = {
			amount: "",
			tokens: {
				"ethereum": {
					"image": "ethereum-logo.png",
					"text": "Ethereum",
					"acronym": "ETH"
				}
			},
			gasSetting: {
				0: "Slow",
				1: "Normal",
				2: "Fast"
			}
		};
	}

	handleChange(event) {
		this.setState({ amount: event.target.value });
	}
	
	getRequestJSON() {
		return {
			"walletAddress": this.ethereum.selectedAddress,
			"amount": this.state.amount,
			"token": "eth",
			"gasPriority": "medium"
		};
	}

	renderAPI() {
		return (
			<form className="input-api-form" onSubmit={this.handleSubmit} autoComplete="off">
				<label>
					<div className="description">Amount</div>
					<div className="menu-form">
						<input
							className="amount"
							type="number"
							placeholder="0"
							value={this.state.amount}
							onChange={this.handleChange}
						/>
						<Box
							className="token-modal"
							sx={{
								width: "40%",
								marginTop: "7px",
								marginLeft: "14px",
								height: "50px",
								border: 1,
								borderColor: "#464646",
								borderRadius: 2
							}}
						>
							<img className="token-logo" src={this.state.tokens["ethereum"]["image"]} alt="Ethereum logo" />
							<div className="token-text">{this.state.tokens["ethereum"]["text"]}</div>
						</Box>
					</div>

					<div className="description">Transaction Details</div>
					<div className="menu-form">
						<Box
							className="transaction-detail-form"
							sx={{
								width: "100%",
								marginTop: "7px",
								height: "100%",
								border: 1,
								borderColor: "#464646",
								borderRadius: 2,
								input: {
									textAlign: "center",
									color: "#BDBDBD"
								}
							}}
						>
							<div className="transaction-details">
								<div className="transaction-detail-cell">
									<div className="label">Supply APY</div>
									<div className="data">{0.39}%</div>
								</div>
								<div className="transaction-detail-cell">
									<div className="label">Rewards APY</div>
									<div className="data">{0.11}%</div>
								</div>
								<div className="transaction-detail-cell">
									{/* TODO: Logic for choosing the index within gasSetting mapping */}
									<div className="label">
										Gas | <span className="gas-setting">{this.state.gasSetting[1]}</span>
										<img className="gear-logo" src="gear.svg" alt="Ethereum logo" />
									</div>
									<div className="data">${58.08}</div>
								</div>
							</div>
						</Box>
					</div>
				</label>
				<input className="supply-button" type="submit" value={"Supply " + this.state.tokens["ethereum"]["acronym"]} />
			</form>
		);
	}
}

export default APILend;
