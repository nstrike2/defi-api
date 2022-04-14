const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const abi = require('./abi.json');
const chain = require('../../kovan.json');

router.post('/supply', async (req, res) => {
	try {
		const walletAddress = req.body.walletAddress;
		const token = req.body.token;
		const amount = req.body.amount;
		const gasPriority = req.body.gasPriority;

		if (token.toLowerCase() === 'eth') {
			const contractAddress = "0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70";
			const contract = new ethers.Contract(contractAddress, abi)
			const lendingPool = "0xE0fBa4Fc209b4948668006B2bE61711b7f465bAe";
			const data = await contract.populateTransaction.depositETH(lendingPool, walletAddress, 0);

			data.walletAddress = walletAddress;
			data.value = ethers.utils.parseUnits(amount, 'ether').toHexString();
			data.gasPriority = gasPriority;
			data.chain = chain;
			res.json(data);
		} else {
			res.status(400).send("Invalid token");
		}
	} catch (error) {
		res.status(400).send(error);
	}
});

module.exports = router;