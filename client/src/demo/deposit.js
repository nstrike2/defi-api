import Axel from "Axel.js";
const apiKey = "861302973";
const axel = Axel(`http://axelplatform.xyz/${apiKey}`);
await axel.start();
await axel.deposit("Yearn", {
	amount: 0.337 // ETH
});
