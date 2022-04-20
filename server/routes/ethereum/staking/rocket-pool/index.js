const express = require('express');
const router = express.Router();
const ethers = require('ethers');

router.post('/stake', async (req, res) => {
	try {
		let network = (req.query && req.query.network) || "mainnet";
		const folderPath = "./" + network;
		const tokenJSON = require(folderPath + "/token.json");
		const abi = require(folderPath + "/abi.json");
		
		const {walletAddress, sellToken, amount, gasPriority} = req.body;
		if(sellToken && sellToken.toLowerCase() != "eth") {
			throw new Error(`Unable to stake token ${token}! Only able to stake eth. (Token parameter is optional, so null can be passed in.)`);
		}
		
		const gatewayAddress = tokenJSON.gatewayAddress;
		const contract = new ethers.Contract(gatewayAddress, abi)
		const data = await contract.populateTransaction.deposit();

		data.from = walletAddress;
		data.walletAddress = walletAddress;
		data.value = ethers.utils.parseUnits(amount, 'ether').toHexString();
		data.gasPriority = gasPriority;
		res.json(data);
	} catch (error) {
		console.log(error);
		res.status(400).send(error.message);
	}
});

module.exports = router;
