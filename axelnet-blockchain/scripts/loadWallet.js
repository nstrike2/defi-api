const ethers = require('ethers');

// get regular ETH balance
const getEthBalance = async (provider, walletAddress) => {
    const ethBalance = await provider.send("eth_getBalance",[
        walletAddress,
        "latest"
    ]);
    return ethers.utils.formatEther(ethBalance);
};

// load the inputted wallet with 10 ETH
const loadWalletETH = async (provider, walletAddress) => {
    const amount = "10";
    await provider.send("hardhat_setBalance", [
        walletAddress,
        ethers.utils.parseEther(amount).toHexString(),
    ]);
};

const main = async () => {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    // load wallet address, RPC_URL, and blockchain node provider
    const walletAddress = "0xEc644B2e080F0653809e2B40B6C90773498dF07c";
    const RPC_URL = "http://localhost:8545";
    const provider = ethers.providers.getDefaultProvider(RPC_URL);

    // log previous ETH balance
    console.log(`Previous ETH Balance: ${await getEthBalance(provider, walletAddress)}`);

     // load our wallet with ETH
     console.log(`Loading wallet ${walletAddress} with 10 ETH!!`);
     await loadWalletETH(provider, walletAddress);

    // log current ETH balance
    console.log(`Current ETH Balance: ${await getEthBalance(provider, walletAddress)}`);

};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });