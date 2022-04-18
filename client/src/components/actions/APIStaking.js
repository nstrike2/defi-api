import APIForm from "../APIForm.js"
import APIOptions from "../../utils/APIOptions.json";

class APIStaking extends APIForm {
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
			formToken: APIOptions[this.props.id].token,
		});
	}

	handleChange(event) {
		this.setState({ amount: event.target.value });
	}
	
	getRequestJSON() {
		return {
			"walletAddress": this.ethereum.selectedAddress,
			"amount": this.state.amount,
			"token": "eth",
			"gasPriority": "medium"
		};
	}
	
	buildTransaction(data) {
		return {
			from: data.walletAddress,
			to: data.to,
			value: data.value,
			data: data.data,
		};
	}
}

export default APIStaking;
