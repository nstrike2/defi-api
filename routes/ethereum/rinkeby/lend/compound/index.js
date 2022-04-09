const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const abi = require('./compound.json');

router.get('/:token/:amount', async (req, res) => {
    const token = req.params.token;
    const amount = req.params.amount;

    if (token.toLowerCase() === 'eth') {
        const contractAddress = "0xd6801a1dffcd0a410336ef88def4320d6df1883e";
        const contract = new ethers.Contract(contractAddress, abi)
        const data = await contract.populateTransaction.mint();
        data.amount = ethers.utils.parseUnits(amount, 'ether').toHexString();
        res.json(data);
    }
});

module.exports = router;