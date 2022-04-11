const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const abi = require('./compound.json');
const chain = require('../../rinkeby.json');

router.post('/supply', async (req, res) => {
	try {
		const walletAddress = req.body.walletAddress;
		const token = req.body.token;
		const amount = req.body.amount;
		const gasPriority = req.body.gasPriority;

		if (token.toLowerCase() === 'eth') {
			const contractAddress = "0xd6801a1dffcd0a410336ef88def4320d6df1883e";
			const contract = new ethers.Contract(contractAddress, abi)
			const data = await contract.populateTransaction.mint();

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