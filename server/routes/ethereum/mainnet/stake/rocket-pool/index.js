const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const abi = require('./abi.json');
const chain = require('../../ethereum.json');

router.post('/stake', async (req, res) => {
	try {
		const walletAddress = req.body.walletAddress;
		const amount = req.body.amount;
		const gasPriority = req.body.gasPriority;

		// TODO I'm not sure about this contract address
		// the rocket-pool site was down so I just searched on google
		const contractAddress = "0x4D05E3d48a938db4b7a9A59A802D5b45011BDe58";
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
