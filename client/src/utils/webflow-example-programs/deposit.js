import Axel from "Axel";
const { apiKey } = process.env;

const axel = Axel.initialize(`http://axelplatform.xyz/${apiKey}`);
await axel.start();

await axel.deposit("Yearn", {
	amount: 0.337 // ETH
});
