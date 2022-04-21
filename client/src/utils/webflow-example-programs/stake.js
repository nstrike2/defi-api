import Axel from "Axel";
const { apiKey } = process.env;

const axel = Axel.initialize(`http://axelplatform.xyz/${apiKey}`);
await axel.start();

await axel.stake("Lido", {
	amount: 0.08 // ETH
});
