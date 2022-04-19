import APIForm from "../APIForm.js"
import APIOptions from "../../utils/APIOptions.json";
import qs from "qs";
import axios from "axios";


class APIYielding extends APIForm {
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
			from: this.state.walletAddress,
			to: data.to,
			value: data.value,
			data: data.data,
		};
	}
	
	async getFormTokenBalance() {
		const walletAddress = this.state.walletAddress;
		
		const params = [{
			data: "0x70a08231000000000000000000000000" + walletAddress.slice(2),
			from: "0x0000000000000000000000000000000000000000",
			to: "0xa258c4606ca8206d8aa700ce2143d7db854d168c",
		}, "latest"]
		const response = await this.provider.send("eth_call", params);
		return APIForm.formatValue(response);
	}
}

export default APIYielding;
