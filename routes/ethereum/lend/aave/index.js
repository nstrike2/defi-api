const ethers = require('ethers');
const express = require('express');
const router = express.Router();

router.post('/supply', async (req, res) => {
	try {
		const network = (req.query && req.query.network) || "mainnet";
		const folderPath = "./" + network;
		const tokenJSON = require(folderPath + "/token.json");
		const abi = require(folderPath + "/abi.json");
		
		const walletAddress = req.body.walletAddress;
		const token = req.body.token;
		const amount = req.body.amount;
		const gasPriority = req.body.gasPriority;

		if (token.toLowerCase() === 'eth') {
			const wETHGatewayContract = tokenJSON.gatewayAddress;
			const contract = new ethers.Contract(wETHGatewayContract, abi)
			const lendingPoolContractAddress = tokenJSON.lendingPoolAddress;
			const data = await contract.populateTransaction.depositETH(lendingPoolContractAddress, walletAddress, 0);

			data.walletAddress = walletAddress;
			data.value = ethers.utils.parseUnits(amount, 'ether').toHexString();
			data.gasPriority = gasPriority;
			// TODO is this line necessary
			// data.chain = chain;
			res.json(data);
		} else {
			res.status(400).send("Invalid token");
		}
	} catch (error) {
		res.status(400).send(error);
	}
});

module.exports = router;
