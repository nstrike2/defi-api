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

		// TODO run init setbalance script here if chainID maps to AxelNet and wallet is connected
		// if (accounts.length > 0 && window.ethereum.chainId === "AxelNet") {
		// 	// use accounts[0] to get wallet address of client
		// 	// Hardhat always runs the compile task when running scripts with its command
		// 	// line interface.
		// 	//
		// 	// If this script is run directly using `node` you may want to call compile
		// 	// manually to make sure everything is compiled
		// 	// await hre.run('compile');

		// 	// load the inputted wallet with ETH
		// 	// const provider = ethers.providers.getDefaultProvider("http://localhost:8545");
		// 	// await provider.send("hardhat_setBalance", [
		// 	// 	"0xEc644B2e080F0653809e2B40B6C90773498dF07c",
		// 	// 	ethers.utils.parseEther("10").toHexString(),
		// 	// ]);
		// 	// // get inputted ERC20 token balance
		// 	// const contractAddress = "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5";
		// 	// const contract = new ethers.Contract(contractAddress, abi, ethersProvider);
		// 	// const balance = await contract.balanceOf("0xEc644B2e080F0653809e2B40B6C90773498dF07c");
		// 	// console.log(ethers.utils.formatEther(balance));

		// 	// // get regular ETH balance
		// 	// const ethBalance = await provider.send("eth_getBalance", [
		// 	// 	"0xEc644B2e080F0653809e2B40B6C90773498dF07c",
		// 	// 	"latest"
		// 	// ]);
		// 	// console.log(ethers.utils.formatEther(ethBalance));
		// }

		const signer =
			accounts.length > 0 ? await provider.getSigner(accounts[0]) : null;
		const network = await provider.getNetwork();
		const signerAddress = signer != null ? await signer.getAddress() : null;

		this.provider = provider;
		this.accounts = accounts;
		this.signer = signer;
		this.network = network;
		this.signerAddress = signerAddress;
	};

	static _hasWallet = () => {
		return typeof window.ethereum !== "undefined" && window.ethereum !== null;
	};

	static isWalletConnected = () => {
		return this.signer != null;
	};

	static _connectToWallet = async () => {
		await this.provider.send("eth_requestAccounts", []);
	};

	static lend = () => {

	}
}
