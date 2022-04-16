import React from "react";
import APIOptions from "../utils/APIOptions.json";
import networks from "../utils/networks.json";
import "./APIForm.css";
import { Box } from "@mui/material";
import axios from "axios";
import { ethers } from "ethers";
import qs from "qs";

class APIForm extends React.Component {
	constructor(props) {
		super(props);
		
		this.loadImplementation();
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.revealProtocol = this.revealProtocol.bind(this);
		
		this.setWallet();
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
	
	setWallet() {
		this.ethereum = window.ethereum;
		this.provider = new ethers.providers.Web3Provider(this.ethereum, "any");
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
		const postURL = APIConfig.postURL;
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
				
				{this.renderAPI()}
			</div>
		);
	}
	
	
	// This can be overridden by the Implementation
	buildTransaction(data) {
		return Object.assign({from: data.walletAddress}, data);
	}
}

export default APIForm;
