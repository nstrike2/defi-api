import { ethers } from "ethers";
import axios from "axios";

import config from "./Axel_config.json";

class AxelObj {
	constructor(apiKey) {
		this.verbose = false;
		this.precision = 5;
		
		this.ethereum = null;
		this.provider = null;
		this.walletAddress = null;
		this.chainId = null;
		
		this.apiKey = apiKey;
		
		this._bindFunctions();
		this.clearListeners();
	}
	
	noop(){}
	
	_bindFunctions() {
		this.noop = this.noop.bind(this);
		this._bindFunctions = this._bindFunctions.bind(this);
		this._getWalletInterface = this._getWalletInterface.bind(this);
		this.walletInterfaceExists = this.walletInterfaceExists.bind(this);
		this.start = this.start.bind(this);
		this.configureWalletInterface = this.configureWalletInterface.bind(this);
		this._clearInternalListeners = this._clearInternalListeners.bind(this);
		this._configureInternalListeners = this._configureInternalListeners.bind(this);
		this.on = this.on.bind(this);
		this.changeWalletAddress = this.changeWalletAddress.bind(this);
		this.changeChain = this.changeChain.bind(this);
		this.getBalance = this.getBalance.bind(this);
		this.getTokenBalance = this.getTokenBalance.bind(this);
		this.connect = this.connect.bind(this);
		this.updateVariables = this.updateVariables.bind(this);
	}
	
	clearListeners() {
		this._listeners = {
			"walletConnect": this.noop,
			"walletDisconnect": this.noop,
			"walletChange": this.noop,
			"chainChange": this.noop,
			"balanceChange": this.noop,
		};
		this._tokenListeners = {};
	}
	
	_getWalletInterface() {
		return window.ethereum;
	}
	
	walletInterfaceExists() {
		return !!this._getWalletInterface();
	}
	
	async start() {
		if (this.walletInterfaceExists()) {
			await this.configureWalletInterface(this._getWalletInterface());
		} else {
			throw new Error("No wallet found. Use walletInterfaceExists to handle this case.");
		}
		
		// Fuck you metamask make your event listeners work
		setInterval(this.updateVariables, 1000);
		await this.updateVariables();
	}
	
	async setPrecision(precision) {
		this.precision = precision;
	}
	
	async formatValue(value, decimals = 18) {
		return (+ethers.utils.formatUnits(value, decimals)).toFixed(this.precision);
	}
	
	async configureWalletInterface(ethereum) {
		this._clearInternalListeners();
		this.ethereum = ethereum;
		if(ethereum) {
			this.provider = new ethers.providers.Web3Provider(ethereum, "any");
			this._configureInternalListeners();
		}
	}
	
	_clearInternalListeners() {
		if(this.ethereum) {
			this.ethereum.on('accountChanged', this.noop);
			this.ethereum.on('chainChanged', this.noop);
		}
	}
	
	_configureInternalListeners() {
		if(this.ethereum) {
			this.ethereum.on('accountChanged', this.changeWalletAddress);
			this.ethereum.on('chainChanged', this.changeChain);
		}
	}
	
	onTokenChange(token, callback) {
		if(token && token.toLowerCase() === "eth") {
			return this.on("balanceChange", callback);
		} else if(this.tokenSupported(token)) {
			this._tokenListeners[token] = callback;
		} else {
			this._throwTokenError();
		}
	}
	
	removeTokenChangeListener(token) {
		delete this._tokenListeners[token];
	}
	
	on(name, callback) {
		if(name in this._listeners) {
			if(typeof callback === "function") {
				this._listeners[name] = callback.bind(this);
			} else {
				throw new TypeError(`Callback must be a function. Instead, got ${callback}.`);
			}
		} else {
			throw new Error(`${name} is not a valid listener name.`);
		}
	}
	
	walletConnected() {
		return this.walletAddress !== null;
	}
	
	async changeWalletAddress(walletAddress) {
		if(this.walletAddress !== walletAddress) {
			const disconnecting = walletAddress === null;
			const connecting = this.walletAddress === null;
			if(disconnecting) {
				await this._listeners["walletDisconnect"]();
			}
			this.walletAddress = walletAddress;
			if(connecting) {
				await this._listeners["walletConnect"]();
			}
			await this._listeners["walletChange"](walletAddress);
		}
	}
	
	async changeChain(chainId) {
		if(this.chainId !== chainId) {
			this.chainId = chainId;
			if(chainId) {
				const networkObj = config.networks[chainId];
				this.network = networkObj.network;
				if(this.walletConnected() && networkObj.isPrivateTestnet) {
					const RPC_URL = networkObj.rpcUrls[0];
					ethers.providers.getDefaultProvider(RPC_URL)
						.send("hardhat_setBalance", [
							this.walletAddress,
							ethers.utils.parseEther("10").toHexString(),
						]);
				}
			} else {
				this.network = null;
			}
			await this._listeners["chainChange"](chainId);
		}
	}
	
	async getBalance(walletAddress = null, provider = null) {
		walletAddress = walletAddress || this.walletAddress;
		provider = provider || this.provider;
		const params = [walletAddress, "latest"];
		const ethBalance = await provider.send("eth_getBalance", params);
		return this.formatValue(ethBalance);
	}
	
	tokenSupported(token) {
		return token in config.tokens;
	}
	
	networkSupportsToken(token, network = null) {
		network = network || this.network;
		return network in config.tokens[token];
	}
	
	getNetworksSupportedByProtocol(protocol) {
		return config.protocols[protocol].chainIds.map(chainId => config.networks[chainId].network);
	}
	
	protocolSupportsNetwork(protocol, network = null) {
		network = network || this.network;
		return this.getNetworksSupportedByProtocol(protocol).includes(network);
	}
	
	protocolSupportsAction(protocol, action) {
		return config.protocols[protocol].actions.includes(action);
	}
	
	async getERC20TokenBalance(token, walletAddress = null) {
		walletAddress = walletAddress || this.walletAddress;
		if(this.tokenSupported(token)) {
			if(this.networkSupportsToken(token)) {
				if(token.toLowerCase() === "yvweth") {
					const params = [{
						data: "0x70a08231000000000000000000000000" + this.walletAddress.slice(2),
						from: "0x0000000000000000000000000000000000000000",
						to: "0xa258c4606ca8206d8aa700ce2143d7db854d168c",
					}, "latest"]
					const balance = await this.provider.send("eth_call", params);
					return this.formatValue(balance);
				} else {
					const {abijson, tokenjson} = config.tokens[token][this.network];
					const {decimals, tokenAddress} = tokenjson;
					const contract = new ethers.Contract(tokenAddress, abijson, this.provider);
					const balance = await contract.balanceOf(walletAddress);
					return this.formatValue(balance, decimals);
				}
			} else {
				return null;
			}
		} else {
			this._throwTokenError();
		}
	}
	
	async getTokenBalance(...args) {
		return await this.getERC20TokenBalance(...args);
	}
	
	async connect() {
		if (!this.walletInterfaceExists()) {
			if(this.verbose) console.error("Wallet not found on browser.");
			return false;
		}
		
		// Ask metamask to sign in
		await this.provider.send("eth_requestAccounts", []);
		
		await this.updateVariables();
		return true;
	}
	
	async updateVariables(){
		if(this.ethereum) {
			await this.changeWalletAddress(this.ethereum.selectedAddress);
			await this.changeChain(this.ethereum.chainId);
			if(this.walletConnected()) {
				const ethBalance = await this.getBalance();
				await this._listeners["balanceChange"](ethBalance);
				for(const token in this._tokenListeners) {
					const callback = this._tokenListeners[token];
					const tokenBalance = await this.getERC20TokenBalance(token);
					await callback(tokenBalance);
				}
			}
		}
	}
	
	_formatRequestJSON(requestData) {
		// Convert an ambiguous-type value into an object.
		const requestJSON = 
			typeof requestData === "object"
			? requestData // As is
			: null;
		
		// Alert the dev if they are bad.
		if(requestJSON === null) {
			throw new TypeError(`API request type ${typeof requestData} not supported.`);
		}
		
		// This loads the request JSON with some default values which can be overwritten by the user.
		return Object.assign({
			"sellToken": "eth",
			"gasPriority": "medium",
			"walletAddress": this.walletAddress,
		}, requestJSON);
	}
	
	_formatProtocol(protocol) {
		return protocol.toLowerCase().replace(/\W+/g,"-");
	}
	
	async estimateReturn(protocol, action, requestData, network = null) {
		network = network || this.network;
		if(this.protocolSupportsNetwork(protocol, network)
		&& this.protocolSupportsAction(protocol, action)) {
			const actionType = config.actionTypes[action];
			const formattedProtocol = this._formatProtocol(protocol);
			const postURL = `${this.apiKey}/v1/ethereum/${actionType}/${formattedProtocol}/${action}?network=${network}`;
			const requestJSON = this._formatRequestJSON(requestData);
			// Call the backend to get the transaction payload
			const transactionResponse = await axios.post(postURL, requestJSON);
			const transactionParams = transactionResponse.data;
			const estimatedReturn = transactionParams;
			return estimatedReturn;
		} else {
			return null;
		}
	}
	
	async send(protocol, action, requestData, network = null) {
		network = network || this.network;
		if(this.protocolSupportsNetwork(protocol, network)
		&& this.protocolSupportsAction(protocol, action)) {
			const actionType = config.actionTypes[action];
			const formattedProtocol = this._formatProtocol(protocol);
			const postURL = `${this.apiKey}/v1/ethereum/${actionType}/${formattedProtocol}/${action}?network=${network}`;
			const requestJSON = this._formatRequestJSON(requestData);
			// Call the backend to get the transaction payload
			const transactionResponse = await axios.post(postURL, requestJSON);
			const transactionParams = transactionResponse.data;
			if(this.verbose) console.log("Transacting:", transactionParams);
			// Build transaction parameters from data
			const transactionHash = await this.provider.send("eth_sendTransaction", [transactionParams]);
			return transactionHash;
		} else {
			return null;
		}
	}
	
	async lend(protocol, requestData, network = null) {
		return await this.send(protocol, "lend", requestData, network);
	}
	
	async stake(protocol, requestData, network = null) {
		return await this.send(protocol, "stake", requestData, network);
	}
	
	async exchange(protocol, requestData, network = null) {
		return await this.send(protocol, "exchange", requestData, network);
	}
	
	async deposit(protocol, requestData, network = null) {
		return await this.send(protocol, "deposit", requestData, network);
	}
	
	_throwTokenError() {
		throw new Error("Token not supported. We are vewy sowwy uwu ~");
	}
}

const Axel = {
	make(...args) {
		return new AxelObj(...args);
	}
}

window.Axel = Axel;

export default Axel;
