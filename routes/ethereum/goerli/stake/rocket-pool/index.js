const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const abi = require('./abi.json');
const chain = require('../../goerli.json');

router.post('/stake', async (req, res) => {
	try {
		const walletAddress = req.body.walletAddress;
		const amount = req.body.amount;
		const gasPriority = req.body.gasPriority;

		
		const contractAddress = "0x923ed282cda8952910b71b5efca7cda09e39c633";
		const contract = new ethers.Contract(contractAddress, abi)
		const data = await contract.populateTransaction.deposit();

		data.walletAddress = walletAddress;
		data.value = ethers.utils.parseUnits(amount, 'ether').toHexString();
		data.gasPriority = gasPriority;
		data.chain = chain;
		res.json(data);
	} catch (error) {
		console.log(error);
		res.status(400).send(error);
	}
});

module.exports = router;