import APIForm from "../APIForm.js"
import "../APIForm.css";
import { Box } from "@mui/material";

class APIExchange extends APIForm {
	constructor(props) {
		super(props);
		this.state = {
			amount: "",
			tokens: {
				"ethereum": {
					"image": "ethereum-logo.png",
					"text": "Ethereum",
					"acronym": "ETH"
				}
			},
			gasSetting: {
				0: "Slow",
				1: "Normal",
				2: "Fast"
			}
		};
	}

	handleChange(event) {
		this.setState({ amount: event.target.value });
	}
	
	getRequestJSON() {
		return {
			"walletAddress": this.ethereum.selectedAddress,
			"buyToken": "DAI",
			"sellToken": "ETH",
			"amount": this.state.amount,
		};
	}
}

export default APIExchange;
