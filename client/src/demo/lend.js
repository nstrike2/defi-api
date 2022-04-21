import Axel from "Axel.js";
const apiKey = "861302973";
const axel = Axel(`http://axelplatform.xyz/${apiKey}`);
await axel.start();
await axel.lend("Rari", {
	amount: 0.1 // ETH
});
