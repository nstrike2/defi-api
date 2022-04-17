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

		const proxyContractAddress = "0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F";
		const contract = new ethers.Contract(proxyContractAddress, abi);
		const _referral = "0x0000000000000000000000000000000000000000";
		const data = await contract.populateTransaction.submit(_referral);
        
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