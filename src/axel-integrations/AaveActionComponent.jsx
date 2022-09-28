import React from "react";
import "../components/ActionUI.css";
import {Box} from "@mui/material";
import {axel} from "../axel_inst";
import {logos} from "../logos";
import {lookers} from "@axelapi/sdk";
import {ActionComponentCloser} from "../components/ActionComponentCloser";
import {InputTokenComponent} from "../components/InputTokenComponent";
import {ReceiptTokenComponent} from "../components/ReceiptTokenComponent";

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
		this.eth_looker = lookers.make_balance_looker(axel, {
			token: "ETH",
			chain: null,
		}, function callback () {
			
		});
		this.aWETH_looker = lookers.make_balance_looker(axel, {
			token: "aWETH",
			chain: null,
		}, function callback () {
			
		});
	}
	componentWillUnmount() {
		this.mounted = false;
		this.eth_looker.stop();
		this.aWETH_looker.stop();
	}
	
	async handleChange(event) {
		const amount = event.target.value;
		let estimate = 0;
		if(!isNaN(amount) && amount > 0) {
			const exchangeRate = await axel.swap_rate({sell_token: "ETH", buy_token: "ETH"});
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
				<ActionComponentCloser logo={logos.aWETH} token="Aave" onClick={this.props.exitUI}/>
				<form className="input-api-form" onSubmit={this.handleSubmit.bind(this)} autoComplete="off">
					<label>
						<div className="description">Amount &#38; Token To Lend</div>
						<InputTokenComponent amount={this.state.amount} handleChange={this.handleChange.bind(this)} logo={logos.ETH} tokenName="ETH"/>

						<div className="description">Amount &#38; Token To Receive</div>
						{/* TODO Replace estimate with swap rate SDK call */}
						<ReceiptTokenComponent estimate={this.state.estimate} logo={logos.aWETH} tokenName="aWETH"/>

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
