const qs = require("qs");
const axios = require("axios");
const express = require('express');
const router = express.Router();
const ethers = require('ethers');

router.post('/deposit', async (req, res) => {
	try {
		//vitalik's address
		const richPersonAddress = "0x00000000219ab540356cBB839Cbe05303d7705Fa";
		const { walletAddress, amount, sellToken } = req.body;
		
		if (!sellToken || sellToken.toLowerCase() === "eth") {
			let network = (req.query && req.query.network) || "mainnet";
			const folderPath = "./" + network;
			const {affiliateAddress, poolAddress, api_key} = require(folderPath + "/token.json");

			const queryParams = {
				affiliateAddress, poolAddress, api_key,
				slippagePercentage: "0.01",
				sellTokenAddress: "0x0000000000000000000000000000000000000000",
				sellAmount: ethers.utils.parseEther(amount).toString(),
				ownerAddress: richPersonAddress,
			};

			try {
				const getURL = `https://api.zapper.fi/v1/zap-in/yearn/transaction?${qs.stringify(queryParams)}`;
				const response = await axios.get(getURL);

				const data = response.data;
				delete data.gas;
				data.from = walletAddress;
				data.walletAddress = walletAddress;
				res.json(data);
			} catch (error) {
				res.status(500).send("Internal error: " + error.response.data.message);
			}
		} else {
			res.status(400).send("Invalid sell token");
		}
	} catch (error) {
		res.status(400).send(error);
	}
});

module.exports = router;
