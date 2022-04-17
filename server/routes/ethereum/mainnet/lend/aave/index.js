const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const abi = require('./abi.json');
const chain = require('../../ethereum.json');

router.post('/supply', async (req, res) => {
	try {
		const walletAddress = req.body.walletAddress;
		const token = req.body.token;
		const amount = req.body.amount;
		const gasPriority = req.body.gasPriority;

		if (token.toLowerCase() === 'eth') {
			const wETHGatewayContract = "0xcc9a0B7c43DC2a5F023Bb9b738E45B0Ef6B06E04";
			const contract = new ethers.Contract(wETHGatewayContract, abi)
			const lendingPool = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";
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
