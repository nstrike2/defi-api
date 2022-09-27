import React from "react";
import "../components/ActionUI.css";
import {Box} from "@mui/material";
import {axel} from "../axel_inst";
import {logos} from "../logos";

export class AaveActionComponent extends React.Component {
	constructor(props) {
		super(props);
		this.mounted = false;
		this.state = {
			ethBalance: "Loading...",
			formTokenBalance: "Loading...",
			amount: "",
			estimate: 0,
			gasSetting: {
				0: "Slow",
				1: "Normal",
				2: "Fast"
			},
		};
	}
	
	_setState(obj) {
		if(this.mounted) this.setState(obj);
	}
	
	componentDidMount() {
		this.mounted = true;
		// TODO: add token balance listeners to sdk and then here
	}
	componentWillUnmount() {
		this.mounted = false;
		// TODO: remove whatever token balance listeners are added above
	}
	
	async handleChange(event) {
		const amount = event.target.value;
		let estimate = 0;
		if(!isNaN(amount) && amount > 0) {
			const exchangeRate = 1;
			// TODO: get the sdk swap_rate working
			// const exchangeRate = await axel.swap_rate({sell_token: "ETH", buy_token: "aWETH"});
			estimate = (exchangeRate * amount).toFixed(2);
		}
		this._setState({ amount, estimate });
	}
	
	async handleSubmit(event) {
		event.preventDefault();
		
		await axel.lend({
			protocol: "aave",
			token: "ETH",
			amount: Number(this.state.amount),
		});
		
		this.props.exitUI();
	}
	
	render() {
		return (
			<div className="menu-modal">
				<div className="protocol">
					<img src={logos.aWETH} className="Search-img" alt="" />
					<div className="Search-text">Aave</div>
					<img className="close-icon" src="close-icon.svg" alt="Close icon" onClick={this.props.exitUI} />
				</div>
				
				<form className="input-api-form" onSubmit={this.handleSubmit.bind(this)} autoComplete="off">
					<label>
						<div className="description">Amount &#38; Token To Lend</div>
						<div className="menu-form">
							<input
								className="send-amount"
								type="number"
								placeholder="0"
								value={this.state.amount}
								onChange={this.handleChange.bind(this)}
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
								<img className="eth-logo token-logo" src={logos.ETH} alt="Ethereum logo" />
								<div className="token-text">ETH</div>
							</Box>
						</div>

						<div className="description">Amount &#38; Token To Receive</div>
						<div className="menu-form">
							<div className="receive-amount">{this.state.estimate}</div>
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
								<img className="token-logo" src={logos.aWETH} alt="aWETH" />
								<div className="token-text">aWETH</div>
							</Box>
						</div>

						<div className="description">Transaction Details</div>
						<div className="menu-form">
							<Box
								className="transaction-detail-form"
								sx={{
									width: "57.8%",
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
										<div className="label">Lend APY</div>
										<div className="data">{"TODO"}%</div>
									</div>
									<div className="transaction-detail-cell">
										{/* TODO: Logic for choosing the index within gasSetting mapping */}
										<div className="label">
											Gas | <span className="gas-setting">{this.state.gasSetting[1]}</span>
											<img className="gear-logo" src="gear.svg" alt="Gear logo" />
										</div>
										<div className="data">${8.08}</div>
									</div>
								</div>
							</Box>
							<Box 
								className="transaction-detail-form"
								sx={{
									width: "37.5%",
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
										<div className="label">ETH:</div>
										<div className="data">{this.state.ethBalance}</div>
									</div>
									<div className="transaction-detail-cell">
										<div className="label">aWETH:</div>
										<div className="data">{this.state.formTokenBalance}</div>
									</div>
								</div>
							</Box>
						</div>
					</label>
					<input className="supply-button" type="submit" value="Lend ETH" />
				</form>
			</div>
		);
	}
}
