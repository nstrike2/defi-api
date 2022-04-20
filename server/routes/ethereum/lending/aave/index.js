const ethers = require('ethers');
const express = require('express');
const router = express.Router();

router.post('/lend', async (req, res) => {
	try {
		const network = (req.query && req.query.network) || "mainnet";
		const folderPath = "./" + network;
		const tokenJSON = require(folderPath + "/token.json");
		const abi = require(folderPath + "/abi.json");
		
		const {walletAddress, sellToken, amount, gasPriority} = req.body;

		if (sellToken.toLowerCase() === 'eth') {
			const wETHGatewayContract = tokenJSON.gatewayAddress;
			const contract = new ethers.Contract(wETHGatewayContract, abi)
			const lendingPoolContractAddress = tokenJSON.lendingPoolAddress;
			const data = await contract.populateTransaction.depositETH(lendingPoolContractAddress, walletAddress, 0);

			data.from = walletAddress;
			data.walletAddress = walletAddress;
			data.value = ethers.utils.parseUnits(amount, 'ether').toHexString();
			data.gasPriority = gasPriority;
			res.json(data);
		} else {
			res.status(400).send("Invalid token");
		}
	} catch (error) {
		console.log(error);
		res.status(400).send(error.message);
	}
});

module.exports = router;
