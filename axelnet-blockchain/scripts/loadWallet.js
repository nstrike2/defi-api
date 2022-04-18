const ethers = require('ethers');
const abi = require('../../server/routes/ethereum/rinkeby/lend/compound/abi.json');

async function main() {
    // load the inputted wallet with ETH
    const provider = ethers.providers.getDefaultProvider("http://localhost:8545");
    await provider.send("hardhat_setBalance", [
        "0xEc644B2e080F0653809e2B40B6C90773498dF07c",
        ethers.utils.parseEther("10").toHexString(),
    ]);


    // get inputted ERC20 token balance
    const contractAddress = "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5";
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const balance = await contract.balanceOf("0xEc644B2e080F0653809e2B40B6C90773498dF07c");
    console.log(ethers.utils.formatEther(balance));

    // get regular ETH balance
    const ethBalance = await provider.send("eth_getBalance",[
        "0xEc644B2e080F0653809e2B40B6C90773498dF07c",
        "latest"
    ]);
    console.log(ethers.utils.formatEther(ethBalance));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });