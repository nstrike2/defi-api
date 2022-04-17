import APIForm from "../APIForm.js"

class APIExchanging extends APIForm {
	constructor(props) {
		super(props);
		this.state = Object.assign(this.state, {
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
			},
			formToken: "DAI",
		});
	}

	handleChange(event) {
		this.setState({ amount: event.target.value });
	}
	
	getRequestJSON() {
		return {
			"walletAddress": this.ethereum.selectedAddress,
			"buyToken": this.state.formToken,
			"sellToken": "ETH",
			"amount": this.state.amount,
		};
	}
}

export default APIExchanging;
