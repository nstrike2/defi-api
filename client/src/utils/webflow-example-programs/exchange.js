import Axel from "Axel";
const { apiKey } = process.env;

const axel = Axel.initialize(`http://axelplatform.xyz/${apiKey}`);
await axel.start();

await axel.exchange("Uniswap", {
	amount: 0.2, // ETH
	buyToken: "DAI"
});
