const express = require('express');
const router = express.Router();
const ethers = require('ethers');

router.post('/supply', async (req, res) => {
	try {
		let network = (req.query && req.query.network) || "mainnet";
		const folderPath = "./" + network;
		const tokenJSON = require(folderPath + "/token.json");
		const abi = require(folderPath + "/abi.json");
		
		const walletAddress = req.body.walletAddress;
		const token = req.body.token;
		const amount = req.body.amount;
		const gasPriority = req.body.gasPriority;

		if (token.toLowerCase() === 'eth') {
			const wETHGatewayContract = tokenJSON.gatewayAddress;
			const contract = new ethers.Contract(wETHGatewayContract, abi);
			const data = await contract.populateTransaction.mint();

			data.walletAddress = walletAddress;
			data.value = ethers.utils.parseUnits(amount, 'ether').toHexString();
			data.gasPriority = gasPriority;
			// data.chain = chain;
			res.json(data);
		} else {
			res.status(400).send("Invalid token");
		}
	} catch (error) {
		console.log(error);
		res.status(400).send(error.message);
	}
});

module.exports = router;
