const qs = require("qs");
const axios = require("axios");
const express = require('express');
const router = express.Router();
const ethers = require('ethers');

router.post('/earn', async (req, res) => {
	try {
		const { walletAddress, amount, buyToken, sellToken, gasPriority } = req.body;
		
		if (sellToken.toLowerCase() === "eth") {
			const walletAddress = req.body.walletAddress;
			const amount = req.body.amount;
			const gasPriority = req.body.gasPriority;
			const queryParams = {
				affiliateAddress: "0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52",
				slippagePercentage: "0.01",
				poolAddress: "0xa258C4606Ca8206D8aA700cE2143D7db854D168c",
				sellTokenAddress: "0x0000000000000000000000000000000000000000",
				sellAmount: ethers.utils.parseEther(amount).toString(),
				ownerAddress: walletAddress,
				api_key:"96e0cc51-a62e-42ca-acee-910ea7d2a241"
				
			};

			try {
				const postURL = `https://api.zapper.fi/v1/zap-in/yearn/transaction?${qs.stringify(queryParams)}`;
				const response = await axios.get(postURL);

				const data = response.data;
				delete data.gas;

				res.json(data);
			} catch (error) {
				res.status(500).send(error.response.data.message);
			}
		} else {
			res.status(400).send("Invalid sell token");
		}
	} catch (error) {
		res.status(400).send(error);
	}
});

module.exports = router;