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
			swap_rate: undefined,
			ETH_balance: "Loading...",
			aWETH_balance: "Loading...",
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
		this.ETH_looker = lookers.make_balance_looker(axel, {
			token: "ETH",
			chain: null,
		}, (evt: lookers.balance_looker_update) => {
			if (evt.status === "ok") {
				this._setState({ ETH_balance: evt.balance.toFixed(3) });
			} else {
				this._setState({ ETH_balance: "error" });
			}
		});
		this.aWETH_looker = lookers.make_balance_looker(axel, {
			token: "aWETH",
			chain: null,
		}, (evt: lookers.balance_looker_update) => {
			if (evt.status === "ok") {
				console.log("balance", evt.balance);
				this._setState({ aWETH_balance: evt.balance.toFixed(3) });
			} else {
				this._setState({ aWETH_balance: "error" });
			}
		});
	}
	componentWillUnmount() {
		this.mounted = false;
		this.ETH_looker.stop();
		this.aWETH_looker.stop();
	}
	
	async handleChange(event) {
		const amount = event.target.value;
		let estimate = 0;
		if(!isNaN(amount) && amount > 0) {
			let swap_rate = this.state.swap_rate;
			if (swap_rate === undefined) {
				swap_rate = await axel.get_swap_rate({sell_token: "ETH", buy_token: "ETH"});
				this._setState({swap_rate});
			}
			estimate = (swap_rate * amount).toFixed(3);
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
	}
	
	render() {
		return (
			<div className="menu-modal">
				<ActionComponentCloser logo={logos.aWETH} token="Aave" onClick={this.props.exitUI}/>
				<form className="input-api-form" onSubmit={this.handleSubmit.bind(this)} autoComplete="off">
					<label>
						<div className="description">Amount &#38; Token To Lend</div>
						<InputTokenComponent amount={this.state.amount} handleChange={this.handleChange.bind(this)} logo={logos.ETH} logoAlt="Ethereum logo" tokenName="ETH"/>

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
										<div className="data">{this.state.ETH_balance}</div>
									</div>
									<div className="transaction-detail-cell">
										<div className="label">aWETH:</div>
										<div className="data">{this.state.aWETH_balance}</div>
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
