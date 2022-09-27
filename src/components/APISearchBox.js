import React from "react";
import APIOptions from "../utils/APIOptions.json";
import "./APISearchBox.css";

import {ActionUI} from "./ActionUI";
import {ActionOption} from "./ActionOption";
import {axel} from "../axel_inst";

export class APISearchBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchText: "",
			filteredData: APIOptions,
			isSearching: true,
			selectedId: -1,
		};

		this.chooseOption = this.chooseOption.bind(this);
		this.exitUI = this.exitUI.bind(this);
	}

	exitUI() {
		this.setState({
			isSearching: true,
		});
	}

	async chooseOption(component) {
		if(axel.provider !== null) {
			this.setState({
				isSearching: false,
				actionFn: component.props.actionFn,
				protocol: component.props.protocol,
			});
		} else {
			alert("Please connect your wallet.");
		}
	}
	
	getActionUI() {
		return (<ActionUI axel={axel} protocol={this.state.protocol} actionFn={this.state.actionFn} exitUI={this.exitUI} />);
	}

	render() {
		return (
			<div className="Search-container">
				{this.state.isSearching ? (
					<div>
						<div className="Search-buffer"></div>
						<ActionOption onClick={this.chooseOption} protocol="Aave" actionFn={amount => axel.lend({protocol: "aave", token: "ETH", amount})} />
						<ActionOption onClick={this.chooseOption} protocol="Compound" actionFn={amount => axel.lend({protocol: "compound", token: "ETH", amount})} />
						<ActionOption onClick={this.chooseOption} protocol="Uniswap" actionFn={sell_amount => axel.swap({protocol: "uniswap", sell_token: "ETH", buy_token: "USDC", sell_amount})} />
						<ActionOption onClick={this.chooseOption} protocol="Sushiswap" actionFn={sell_amount => axel.swap({protocol: "sushiswap", sell_token: "ETH", buy_token: "USDC", sell_amount})} />
						<ActionOption onClick={this.chooseOption} protocol="Lido" actionFn={amount => axel.stake({protocol: "lido", amount})} />
						<ActionOption onClick={this.chooseOption} protocol="Yearn" actionFn={amount => axel.yield({protocol: "yearn", token: "ETH", amount})} />
						<ActionOption onClick={this.chooseOption} protocol="Rocket Pool" actionFn={amount => axel.stake({protocol: "rocketpool", amount})} />
					</div>
				) : (this.getActionUI())}
			</div>
		);
	}
}
