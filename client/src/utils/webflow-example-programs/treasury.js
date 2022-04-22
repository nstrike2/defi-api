import Axel from "Axel.js";
const { apiKey, routingNumber, accountNumber } = process.env;

const axel = Axel.initialize(apiKey);
await axel.start();

const DeFiAccount = await axel.treasury.createDeFiAccount();
const fiatBank = await axel.treasury.loadFiatAccount({routingNumber, accountNumber});
await axel.treasury.fiatOnRamp(fiatBank, DeFiAccount, {
	"token": "USDC",
	"amount": 10000,
});
await DeFiAccount.lend("Rari", {
	"amount": 1000,
	"sellToken": "USDC"
});
