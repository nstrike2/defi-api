const express = require('express');
const router = express.Router();
const ethers = require('ethers');
const abi = require('./aave.json');
const chain = require('../../kovan.json');

router.post('/supply', async (req, res) => {
    const walletAddress = req.body.walletAddress;
    const token = req.body.token;
    const amount = req.body.amount;
    const gasPriority = req.body.gasPriority;

    if (token.toLowerCase() === 'eth') {
        const contractAddress = "0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70";
        const contract = new ethers.Contract(contractAddress, abi)
        const data = await contract.populateTransaction.depositETH("0xE0fBa4Fc209b4948668006B2bE61711b7f465bAe", walletAddress, 0);

        data.walletAddress = walletAddress;
        data.value = ethers.utils.parseUnits(amount, 'ether').toHexString();
        data.gasPriority = gasPriority;
        data.chain = chain;
        res.json(data);
    }
});

module.exports = router;