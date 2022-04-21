import React from "react";
import APIOptions from "../utils/APIOptions.json";
import "./ActionUI.css";
import { Box } from "@mui/material";

class ActionUI extends React.Component {
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
		if(this.mounted) this.setState(obj);
	}
	
	bindFunctions() {
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	
	componentDidMount() {
		this.mounted = true;
		this.axel = this.props.axel;
		this.axel.verbose = true;
		this.axel.on("walletChange", walletAddress => this._setState({walletAddress}));
		this.axel.on("chainChange", chainId => this._setState({chainId}));
		this.axel.on("balanceChange", ethBalance => this._setState({ethBalance}));
		this.axel.onTokenChange(this.defaultToken, formTokenBalance => this._setState({formTokenBalance}));
	}
	
	async handleChange(event) {
		const amount = event.target.value;
		let estimate = 0;
		if(!isNaN(amount) && amount > 0) {
			const exchangeRate = await this.axel.estimateTokenPerETH(this.defaultToken);
			estimate = (exchangeRate * amount).toFixed(this.axel.precision);
		}
		this._setState({ amount, estimate });
	}
	
	async handleSubmit(event) {
		event.preventDefault();
		// If specialRequestParams is not implemented, it defaults to undefined and adds no properties
		const {protocol} = this.props;
		if(this.axel.protocolSupportsNetwork(protocol)) {
			const transactionHash = await this.actionFn(this.state.amount);
			if(transactionHash == null) {
				console.warn("Transaction failed.");
			}
		} else {
			const supportedNetworks = this.axel.getNetworksSupportedByProtocol(protocol);
			alert(`Please switch your wallet one of the following networks to perform this action: ${supportedNetworks}`)
		}
		this.props.exitUI();
	}
	
	componentWillUnmount() {
		this.mounted = false;
		this.axel.clearListeners();
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
					<img className="close-icon" src="close-icon.svg" alt="Close icon" onClick={this.props.exitUI} />
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
								<img className="eth-logo token-logo" src={this.state.tokens["ethereum"]["image"]} alt="Ethereum logo" />
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
								<img className="token-logo" src={APIOptions[this.props.protocol].img} alt={this.defaultToken} />
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
										<div className="data">{0.39}%</div>
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
										<div className="label">{this.defaultToken}:</div>
										<div className="data">{this.state.formTokenBalance}</div>
									</div>
								</div>
							</Box>
						</div>
					</label>
					<input className="supply-button" type="submit" value={APIOptions[this.props.protocol].actionDisplay + " " + this.state.tokens["ethereum"]["acronym"]} />
				</form>
			</div>
		);
	}
	
	// This can be overridden by the Implementation
	buildTransaction(data) {
		return Object.assign({from: this.state.walletAddress}, data);
	}
}

export default ActionUI;
