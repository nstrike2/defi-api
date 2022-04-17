import React from "react";
import APIOptions from "../utils/APIOptions.json";
import networks from "../utils/networks.json";
import "./APIForm.css";
import { Box } from "@mui/material";
import axios from "axios";
import { ethers } from "ethers";
import qs from "qs";

function fetchJSON(URL) {
	return new Promise((resolve, reject) => {
		fetch(URL)
			.then(response => {
				console.log(response);
				response.json()
			})
			.then(json => resolve(json));
	});
	// let res = await fetch(URL);
	// console.log(res);
	// let json = await res.json();
	// return json;
}

class APIForm extends React.Component {
	static rgx = /\/v\d+((\/[^]+)?)$/;
	
	constructor(props) {
		super(props);
		this.state = {
			ethBalance: "test",
			formTokenBalance: "test",
		};
		
		this.loadImplementation();
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.revealProtocol = this.revealProtocol.bind(this);
		this.changeChain = this.changeChain.bind(this);
		this.changeAddress = this.changeAddress.bind(this);
		this.getETHBalance = this.getETHBalance.bind(this);
		this.getERC20TokenBalance = this.getERC20TokenBalance.bind(this);
		this.getFormTokenBalance = this.getFormTokenBalance.bind(this);
		
		this.loadWallet();
	}
	
	loadImplementation() {
		try {
			this.handleChange = this.handleChange.bind(this);
			this.getRequestJSON = this.getRequestJSON.bind(this);
			this.buildTransaction = this.buildTransaction.bind(this);
		} catch(e) {
			// Not implemented error
			throw e;
		}
	}
	
	changeAddress(address) {
		console.log("Address", address);
		this.address = address;
	}
	
	changeChain(chainId) {
		this.currentChainId = chainId;
		if(networks[chainId].isPrivateTestnet) {
			console.log("Giving free monet!!1!");
			this.provider.send("hardhat_setBalance", [
				this.ethereum.selectedAddress,
				ethers.utils.parseEther("10").toHexString(),
			]);
		}
	}
	
	loadWallet() {
		this.ethereum = window.ethereum;
		this.provider = new ethers.providers.Web3Provider(this.ethereum, "any");
		this.changeAddress(this.ethereum.selectedAddress);
		this.changeChain(this.ethereum.chainId);
		this.ethereum.on('accountChanged', this.changeAddress);
		this.ethereum.on('chainChanged', this.changeChain);
	}

	// Chain is used as state
	async getETHBalance(walletAddress) {
		const ethBalance = await this.provider.send("eth_getBalance",[
			walletAddress,
			"latest"
		]);
		return ethers.utils.formatEther(ethBalance);
	}
	
	async getERC20TokenBalance(walletAddress, token, network) {
		const path = `../utils/tokens/${token}/${network}`;
		const abi = await fetchJSON(path + "/abi.json");
		console.log(abi);
		const tokenAddress = await fetchJSON(path + "/address.json");
		const contract = new ethers.Contract(tokenAddress, abi, this.provider);
		const balance = await contract.balanceOf(walletAddress);
		return ethers.utils.formatEther(balance);
	}
	
	async getFormTokenBalance() {
		const network = networks[this.currentChainId].network;
		return await this.getERC20TokenBalance(this.address, this.state.formToken, network);
	}

	handleChange(event) {
		this.setState({ amount: event.target.value });
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
		console.log("Account:", address);
		const transactionHash = await this.provider.send("eth_sendTransaction", [transactionParams]);
		console.log('transactionHash is ' + transactionHash);
	}

	async doAction() {
		// Get the requestJSON from the action implementation
		const requestJSON = this.getRequestJSON();
		// Get configuration data from APIOptions.json
		const APIConfig = APIOptions[this.props.id];
		const postURL = "http://localhost:4000" + APIConfig.postURL + "?network=" + networks[this.currentChainId].network;
		console.log("POST URL:", postURL);
		// Call the backend to get the data for the transaction
		const data = await this.fetchData(postURL, requestJSON);
		console.log("Data:", data);
		// Build transaction parameters from data
		const transactionParams = this.buildTransaction(data);
		console.log("Transaction params:", transactionParams);
		// Send the transaction
		this.sendTransaction(transactionParams);
	}
	
	checkChain() {
		const APIConfig = APIOptions[this.props.id];
		const possibleChainIds = APIConfig.chainIds;
		const currentChainId = this.ethereum.chainId;
		if(!possibleChainIds.includes(currentChainId)) {
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
	}

	revealProtocol(id) {
		return APIOptions[id].protocol;
	}

	render() {
		
		// render ETH balance in UI whenever provider returns wallet's balance
		this.getETHBalance(this.walletAddress).then(value => {
			this.state.ethBalance = value;
		});
		
		// render form's token balance in UI whenever provider returns wallet's balance
		this.getFormTokenBalance().then(value => {
			this.state.formTokenBalance = value;
		});
		
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
									width: "50%",
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
							<Box 
								className="transaction-detail-form"
								sx={{
									width: "50%",
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
										<div className="label">Current ETH (fixed)</div>
										<div className="data">{this.state.ethBalance}</div>
									</div>
									<div className="transaction-detail-cell">
										<div className="label">Current {this.state.formToken} (variable)</div>
										<div className="data">{this.state.formTokenBalance}</div>
									</div>
								</div>
							</Box>
						</div>
					</label>
					<input className="supply-button" type="submit" value={"Supply " + this.state.tokens["ethereum"]["acronym"]} />
				</form>
			</div>
		);
	}
	
	
	// This can be overridden by the Implementation
	buildTransaction(data) {
		return Object.assign({from: data.walletAddress}, data);
	}
}

export default APIForm;
