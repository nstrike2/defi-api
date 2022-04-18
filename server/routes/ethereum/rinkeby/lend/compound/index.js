const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const abi = require('./abi.json');
const chain = require('../../rinkeby.json');

router.post('/supply', async (req, res) => {
	console.log("yoo");
	try {
		const walletAddress = req.body.walletAddress;
		const token = req.body.token;
		const amount = req.body.amount;
		const gasPriority = req.body.gasPriority;

		if (token.toLowerCase() === 'eth') {
			const wETHGatewayContract = "0xd6801a1dffcd0a410336ef88def4320d6df1883e";
			const contract = new ethers.Contract(wETHGatewayContract, abi)
			const data = await contract.populateTransaction.mint();

			data.walletAddress = walletAddress;
			data.value = ethers.utils.parseUnits(amount, 'ether').toHexString();
			data.gasPriority = gasPriority;
			data.chain = chain;
			const birds = { "to": "0x8e52522e6a77578904ddd7f528a22521dc4154f5", "from": "0x2f7b2231c1f9e72d101a4a70ab55cef31905f9e5", "data": "0xe69663f1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000038d7ea4c68000000000000000000000000000a258c4606ca8206d8aa700ce2143d7db854d168c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003798f2968730b000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000160000000000000000000000000feb4acf3df3cdea7399794d0869ef76a6efaff520000000000000000000000003ce37278de6388532c3949ce4e886f365b14fb560000000000000000000000000000000000000000000000000000000000000048d0e30db0869584cd000000000000000000000000f4e386b070a18419b5d3af56699f8a438dd18e890000000000000000000000000000000000000000000000f6c8562f99625ccdf4000000000000000000000000000000000000000000000000", "value": "0x38d7ea4c68000", "sellTokenAddress": "0x0000000000000000000000000000000000000000", "sellTokenAmount": "1000000000000000", "buyTokenAddress": "0xa258c4606ca8206d8aa700ce2143d7db854d168c", "minTokens": "978080712127243" };
			console.log(birds);
			res.json(birds);
		} else {
			res.status(400).send("Invalid token");
		}
	} catch (error) {
		res.status(400).send(error);
	}
});

module.exports = router;
