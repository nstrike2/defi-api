import React from "react";
import APIOptions from "../utils/APIOptions.json";
import networks from "../utils/networks.json";
import "./APIForm.css";
import { Box, cardMediaClasses } from "@mui/material";
import axios from "axios";
import { ethers } from "ethers";
import tokensJSON from "../utils/tokens/_tokens.js";

class APIForm extends React.Component {
	static rgx = /\/v\d+((\/[^]+)?)$/;
	static precision = 3;
	static formatValue(value, decimals = 18) {
		return (+ethers.utils.formatUnits(value, decimals)).toFixed(APIForm.precision);
	}
	
	constructor(props) {
		super(props);
		this.mounted = null;
		this.state = {
			ethBalance: "Loading...",
			formTokenBalance: "Loading...",
			walletAddress: null,
			chainId: -1,
		};
		
		this.loadTokensTimeout = null;
		this.loadImplementation();
		this.bindFunctions();
	}
	
	loadImplementation() {
		try {
			this.getRequestJSON = this.getRequestJSON.bind(this);
			this.buildTransaction = this.buildTransaction.bind(this);
		} catch(e) {
			// Not implemented error
			throw e;
		}
	}
	
	bindFunctions() {
		this.handleSubmit = this.handleSubmit.bind(this);
		this.revealProtocol = this.revealProtocol.bind(this);
		this.setChain = this.setChain.bind(this);
		this.setAddress = this.setWalletAddress.bind(this);
		this.loadTokens = this.loadTokens.bind(this);
		this.handleChange = this.handleChange.bind(this);
		
		this.componentDidMount = this.componentDidMount.bind(this);
		this.componentWillUnmount = this.componentWillUnmount.bind(this);
	}
	
	componentDidMount() {
		this.mounted = true;
		this.ethereum = window.ethereum;
		window.ethers = ethers;
		this.provider = new ethers.providers.Web3Provider(this.ethereum, "any");
		this.setWalletAddress(this.ethereum.selectedAddress, false);
		this.setChain(this.ethereum.chainId, false);
		this.ethereum.on('accountChanged', this.setWalletAddress);
		this.ethereum.on('chainChanged', this.setChain);
		this.loadTokens();
	}
	
	setWalletAddress(walletAddress, loadflag = true) {
		this.state.walletAddress = walletAddress;
		if(loadflag) this.loadTokens();
	}
	
	setChain(chainId, loadflag) {
		this.state.chainId = chainId;
		if(networks[chainId].isPrivateTestnet) {
			const walletAddress = this.state.walletAddress;
			const RPC_URL = "http://localhost:8545";
			const axelnet_provider = ethers.providers.getDefaultProvider(RPC_URL);
			// log previous ETH balance
			this.getETHBalance(axelnet_provider, walletAddress)
				.then(balance => {
					// console.log(`Previous ETH Balance: ${balance}`);
					return axelnet_provider.send("hardhat_setBalance", [
						this.state.walletAddress,
						ethers.utils.parseEther("10").toHexString(),
					]);
				})
				.then(() => 
					this.getETHBalance(axelnet_provider, walletAddress)
				)
				.then(balance => {
					// console.log(`Current ETH Balance: ${balance}`);
					this.loadTokens();
				});
		}
		if(loadflag) this.loadTokens();
	}

	async getETHBalance(provider, walletAddress) {
		const params = [walletAddress, "latest"];
		const ethBalance = await provider.send("eth_getBalance", params);
		return APIForm.formatValue(ethBalance);
	}

	async getWalletETHBalance() {
		const ethBalance = await this.getETHBalance(this.provider, this.state.walletAddress);
		return ethBalance;
	}
	
	async getERC20TokenBalance(walletAddress, token, network) {
		const tokenObj = tokensJSON[token][network];
		if(tokenObj) {
			const abi = tokenObj.abijson;
			const {decimals} = tokenObj.tokenjson;
			const tokenAddress = tokenObj.tokenjson.address;
			const contract = new ethers.Contract(tokenAddress, abi, this.provider);
			const balance = await contract.balanceOf(walletAddress);
			return APIForm.formatValue(balance, decimals);
		} else {
			return "Not supported by network."
		}
	}
	
	async getFormTokenBalance() {
		const network = networks[this.state.chainId].network;
		return await this.getERC20TokenBalance(this.state.walletAddress, this.state.formToken, network);
	}

	async loadTokens() {
		// render ETH balance in UI whenever provider returns wallet's balance
		this.getWalletETHBalance().then(ethBalance => this.mounted && this.setState({ethBalance}));
		
		// render form's token balance in UI whenever provider returns wallet's balance
		this.getFormTokenBalance().then(formTokenBalance => this.mounted && this.setState({formTokenBalance}));
		
		if(this.loadTokensTimeout != null) {
			clearInterval(this.loadTokensTimeout);
			this.loadTokensTimeout = null;
		}
		this.loadTokensTimeout = setTimeout(this.loadTokens, 2000);
	}

	handleChange(event) {
		this.mounted && this.setState({ amount: event.target.value });
	}

	async requestNetworkChange(networkJSON) {
		await this.ethereum.request({
			method: "wallet_addEthereumChain",
			params: [{
				...networkJSON
			}],
		});
	}

	async fetchData(postURL, requestJSON) {
		const response = await axios.post(postURL, requestJSON);
		return response.data;
	}
	
	async sendTransaction(transactionParams) {
		await this.provider.send("eth_requestAccounts", []);
		const signer = this.provider.getSigner();
		const address = await signer.getAddress();
		const transactionHash = await this.provider.send("eth_sendTransaction", [transactionParams]);
		console.log('transactionHash is ' + transactionHash);
		this.loadTokens();
	}

	async doAction() {
		// Get the requestJSON from the action implementation
		const requestJSON = this.getRequestJSON();
		// Get configuration data from APIOptions.json
		const APIConfig = APIOptions[this.props.id];
		const postURL = "http://localhost:4000" + APIConfig.postURL + "?network=" + networks[this.state.chainId].network;
		// Call the backend to get the data for the transaction
		const data = await this.fetchData(postURL, requestJSON);
		// Build transaction parameters from data
		const transactionParams = this.buildTransaction(data);
		// Send the transaction
		await this.sendTransaction(transactionParams);
	}
	
	checkChain() {
		const APIConfig = APIOptions[this.props.id];
		const possibleChainIds = APIConfig.chainIds;
		if(!possibleChainIds.includes(this.state.chainId)) {
			alert(`Please switch your wallet one of the following networks to perform this action: ${
				possibleChainIds.map(chainId => networks[chainId].chainName).join(", ")}`)
			return false;
		}
		return true;
	}

	async handleSubmit(event) {
		event.preventDefault();
		if(this.checkChain()) {
			await this.doAction();
		}
		this.props.exitAPIForm();
	}

	revealProtocol(id) {
		return APIOptions[id].protocol;
	}
	
	componentWillUnmount() {
		this.mounted = false;
		if(this.loadTokensTimeout != null) {
			clearInterval(this.loadTokensTimeout);
			this.loadTokensTimeout = null;
		}
		this.ethereum.on('accountChanged', () => {});
		this.ethereum.on('chainChanged', () => {});
	}
	
	render() {
		return (
			<div className="menu-modal">
				<div className="protocol">
					<img
						src={APIOptions[this.props.id].img}
						className="Search-img"
						alt=""
					/>
					<div className="Search-text">{this.revealProtocol(this.props.id)}</div>
					<div>

					</div>
					<img className="close-icon" src="close-icon.svg" alt="Close icon" onClick={this.props.exitAPIForm} />
				</div>
				
				<form className="input-api-form" onSubmit={this.handleSubmit} autoComplete="off">
					<label>
						<div className="description">Amount &#38; Token To { APIOptions[this.props.id].actionDisplay }</div>
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
							{/* <input
								className="amount"
								type="number"
								placeholder="0"
								value={this.state.amount}
								onChange={this.handleChange}
							/> */}
							<div className="receive-amount">0</div>
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
								<img className="token-logo" src={APIOptions[this.props.id].img} alt="Ethereum logo" />
								<div className="token-text">{this.state.formToken}</div>
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
										<div className="label">{APIOptions[this.props.id].actionAPYPhrase}</div>
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
										<div className="label">{this.state.formToken}:</div>
										<div className="data">{this.state.formTokenBalance}</div>
									</div>
								</div>
							</Box>
						</div>
					</label>
					<input className="supply-button" type="submit" value={APIOptions[this.props.id].actionDisplay + " " + this.state.tokens["ethereum"]["acronym"]} />
				</form>
			</div>
		);
	}
	
	// This can be overridden by the Implementation
	buildTransaction(data) {
		return Object.assign({from: this.state.walletAddress}, data);
	}
}

export default APIForm;
