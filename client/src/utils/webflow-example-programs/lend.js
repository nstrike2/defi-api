import Axel from "Axel";
const { apiKey } = process.env;

const axel = Axel.initialize(apiKey);
await axel.start();

await axel.lend("Rari", {
	amount: 0.1 // ETH
});

