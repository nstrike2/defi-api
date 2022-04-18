import { ethers } from "ethers";

export default class Adam {
	static provider = null;
	static async initialize() {
		if (!this._hasWallet()) {
			console.error("Wallet not found on browser.");
			return false;
		}
		this.provider = new ethers.providers.Web3Provider(window.ethereum, "any");
		await this._configureWallet();
		return true;
	}
	static async connect() {
		if (!this._hasWallet()) {
			console.error("Wallet not found on browser.");
			return false;
		}
		if (!this.isWalletConnected()) {
			await this._connectToWallet();
			await this._configureWallet();
		}
		return this.isWalletConnected();
	}

	static _configureWallet = async () => {
		this.accounts = await this.provider.listAccounts();
		this.signer = this.accounts.length > 0 ? await this.provider.getSigner(this.accounts[0]) : null;
		this.network = await this.provider.getNetwork();
		this.signerAddress = this.signer != null ? await this.signer.getAddress() : null;
		console.log("Configured:", this.isWalletConnected());
	};

	static _hasWallet = () => {
		return !!window.ethereum;
	};

	static isWalletConnected = () => {
		return this.signer != null;
	};

	static _connectToWallet() {
		return new Promise((resolve, reject) => {
			console.log("Connecting");
			this.provider.send("eth_requestAccounts", [])
				.then(() => {
					console.log("Done connecting");
					resolve();
				}, () => {
					console.log("Error")
					reject()
				});
		});
	};
}
