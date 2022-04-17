const express = require('express');
const router = express.Router();
const ethers = require('ethers');

router.post('/stake', async (req, res) => {
	try {
		let network = (req.query && req.query.network) || "mainnet";
		const folderPath = "./" + network;
		const tokenJSON = require(folderPath + "/token.json");
		const abi = require(folderPath + "/abi.json");
		
		const walletAddress = req.body.walletAddress;
		const amount = req.body.amount;
		const gasPriority = req.body.gasPriority;

		const proxyContractAddress = tokenJSON.gatewayAddress;
		const contract = new ethers.Contract(proxyContractAddress, abi)
		const _referral = "0x0000000000000000000000000000000000000000";
		const data = await contract.populateTransaction.submit(_referral);
		
		data.walletAddress = walletAddress;
		data.value = ethers.utils.parseUnits(amount, 'ether').toHexString();
		data.gasPriority = gasPriority;
		// data.chain = chain;
		res.json(data);
	} catch (error) {
		console.log(error);
		res.status(400).send(error);
	}
});

module.exports = router;
