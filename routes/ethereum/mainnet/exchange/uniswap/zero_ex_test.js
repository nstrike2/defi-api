const qs = require("qs");
const axios = require("axios");
const { ethers } = require("ethers");

const params = {
	buyToken: 'DAI',
	sellToken: 'ETH',
	buyAmount: '100000000000000000000',
	takerAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'
}

async function getQuote() {
	console.log("Hi, my name is...")
	const response = await axios.get(
		`https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`
	);
	
	const data = response.data;
	
	const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
	const transactionHash = await provider.send("eth_sendTransaction", data);
	console.log(transactionHash)
}

getQuote();

// console.log(web3);
