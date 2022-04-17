const ethers = require("ethers");
const qs = require("qs");
const axios = require("axios");
const express = require("express");
const router = express.Router();

function toHex(data, props) {
	for(let prop of props) {
		data[prop] = parseInt(data[prop]).toString(16);
	}
}

router.post("/swap", async (req, res) => {
	try {
		const { walletAddress, amount, buyToken, sellToken, gasPriority } = req.body;
		
		if (sellToken.toLowerCase() === "eth") {
			const params = {
				buyToken,
				sellToken,
				sellAmount: Math.floor(amount*10**18).toString(10),
			}
			const response = await axios.get(
				`https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`
			);
			const data = Object.assign({walletAddress}, response.data);
			const toHexProps = ["sellAmount", "buyAmount", "estimatedGas", "gas", "gasPrice", "value"];
			for(let prop of toHexProps) {
				data[prop] = "0x" + parseInt(data[prop]).toString(16);
			}
			res.json(data);
		} else {
			res.status(400).send("Invalid sell token");
		}
	} catch (error) {
		res.status(400).send(error);
	}
});

module.exports = router;
