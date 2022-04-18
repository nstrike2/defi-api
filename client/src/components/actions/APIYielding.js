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
			from: data.walletAddress,
			to: data.to,
			value: data.value,
			data: data.data,
		};
	}

	async getERC20TokenBalance() {
		const APIConfig = APIOptions[this.props.id];
		if(APIConfig.protocol === "Yearn") {
			const walletAddress = this.state.walletAddress;
			const tokenAddress = "0xa258C4606Ca8206D8aA700cE2143D7db854D168c";
			const postURL = `https://api.zapper.fi/v2/apps/yearn/balances?addresses%5B%5D=${walletAddress}&network=ethereum`;
			const response = await axios.get(postURL);
			const products = response.data.balances[walletAddress].products;
			let balance = 0;
			for(let product of products) {
				for(let asset of product.assets) {
					if(asset.address.toLowerCase() === tokenAddress.toLowerCase()) {
						balance += asset.balance;
					}
				}
			}
			return balance;
		} else {
			return "Yielding token not supported yet.";
		}
	}
}

export default APIYielding;
