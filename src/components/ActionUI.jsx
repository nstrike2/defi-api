import React from "react";
import APIOptions from "../utils/APIOptions.json";
import "./ActionUI.css";
import {Box} from "@mui/material";
import {axel} from "../axel_inst";

export class ActionUI extends React.Component {
	constructor(props) {
		super(props);
		this.mounted = null;
		this.defaultToken = APIOptions[this.props.protocol].defaultToken;
		this.actionFn = this.props.actionFn;
		this.state = {
			ethBalance: "Loading...",
			formTokenBalance: "Loading...",
			walletAddress: null,
			chainId: -1,
			amount: "",
			estimate: 0,
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
			},
		};
		this.bindFunctions();
	}
	
	_setState(obj) {
		if (this.mounted) this.setState(obj);
	}
	
	bindFunctions() {
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.on_accounts_update = this.on_accounts_update.bind(this);
		this.on_chain_update = this.on_chain_update.bind(this);
	}
	
	on_accounts_update(accounts_update) {
		if (accounts_update.status === "error") {
			console.error(accounts_update.error);
			return;
		}
		this._setState({account: accounts_update.accounts[0]});
	}
	
	on_chain_update(chain_update) {
		if (chain_update.status === "error") {
			console.error(chain_update.error);
			return;
		}
		this._setState({chain_id: chain_update.chain_id});
	}
	
	componentDidMount() {
		this.mounted = true;
		axel.on("accounts_update", this.on_accounts_update);
		axel.on("chain_update", this.on_chain_update);
	}
	
	async handleChange(event) {
		const amount = event.target.value;
		let estimate = 0;
		if (!isNaN(amount) && amount > 0) {
			const exchangeRate = 1;
			// const exchangeRate = await axel.swap_rate({sell_token: "ETH", buy_token: this.defaultToken});
			estimate = (exchangeRate * amount).toFixed(3);
		}
		this._setState({ amount, estimate });
	}
	
	async handleSubmit(event) {
		event.preventDefault();
		// If specialRequestParams is not implemented, it defaults to undefined and adds no properties
		await this.actionFn(Number(this.state.amount));
		this.props.exitUI();
	}
	
	componentWillUnmount() {
		this.mounted = false;
		axel.off("accounts_update", this.on_accounts_update);
		axel.off("chain_update", this.on_chain_update);
	}
	
	render() {
		return (
			<div className="menu-modal">
				<div className="protocol">
					<img
						src={APIOptions[this.props.protocol].img}
						className="Search-img"
						alt=""
					/>
					<div className="Search-text">{this.props.protocol}</div>
					<div>

					</div>
					<img className="close-icon" src="close-icon.svg" alt="Close icon" onClick={this.props.exitUI}/>
				</div>
				
				<form className="input-api-form" onSubmit={this.handleSubmit} autoComplete="off">
					<label>
						<div className="description">Amount &#38; Token To { APIOptions[this.props.protocol].actionDisplay }</div>
						<div className="menu-form">
							<input
								className="send-amount"
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
								<img className="eth-logo token-logo" src={this.state.tokens["ethereum"]["image"]} alt="Ethereum logo"/>
								<div className="token-text">{this.state.tokens["ethereum"]["acronym"]}</div>
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
								<img className="token-logo" src={APIOptions[this.props.protocol].img} alt={this.defaultToken}/>
								<div className="token-text">{this.defaultToken}</div>
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
										<div className="label">{APIOptions[this.props.protocol].actionPhrase}</div>
										<div className="data">{"TODO"}%</div>
									</div>
									<div className="transaction-detail-cell">
										{/* TODO: Logic for choosing the index within gasSetting mapping */}
										<div className="label">
											Gas | <span className="gas-setting">{this.state.gasSetting[1]}</span>
											<img className="gear-logo" src="gear.svg" alt="Gear logo"/>
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
										<div className="label">{this.defaultToken}:</div>
										<div className="data">{this.state.formTokenBalance}</div>
									</div>
								</div>
							</Box>
						</div>
					</label>
					<input className="supply-button" type="submit" value={APIOptions[this.props.protocol].actionDisplay + " " + this.state.tokens["ethereum"]["acronym"]}/>
				</form>
			</div>
		);
	}
	
	// This can be overridden by the Implementation
	buildTransaction(data) {
		return Object.assign({from: this.state.walletAddress}, data);
	}
}
