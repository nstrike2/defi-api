import { ethers } from "ethers";

export default class Adam {
	static async initialize() {
		await this._configureWallet();
	}

	static async connect() {
		if (!this._hasWallet()) {
			throw new Error("Wallet not found on browser.");
		}
		if (this.isWalletConnected()) {
			// do stuff
			console.log("Connected!");
		} else {
			await this._connectToWallet();
			await this._configureWallet();
		}
	}

	static _configureWallet = async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const accounts = await provider.listAccounts();
		const signer = accounts.length > 0 ? await provider.getSigner(accounts[0]) : null;
		const network = await provider.getNetwork();
		const signerAddress = signer != null ? await signer.getAddress() : null;

		this.provider = provider;
		this.accounts = accounts;
		this.signer = signer;
		this.network = network;
		this.signerAddress = signerAddress;
	};

	static _hasWallet = () => {
		return !!window.ethereum;
	};

	static isWalletConnected = () => {
		return this.signer != null;
	};

	static _connectToWallet = async () => {
		await this.provider.send("eth_requestAccounts", []);
	};
}
