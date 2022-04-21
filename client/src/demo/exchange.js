import Axel from "Axel.js";
const apiKey = "861302973";
const axel = Axel(`http://axelplatform.xyz/${apiKey}`);
await axel.start();
await axel.exchange("Uniswap", {
	amount: 0.2, // ETH
	buyToken: "DAI"
});
