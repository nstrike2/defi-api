import React from "react";
import APIOptions from "../utils/APIOptions.json";
import "./APISearchBox.css";

import {ActionUI} from "./ActionUI";
import {ActionOption} from "./ActionOption";
import {AaveActionComponent} from "../axel-integrations/AaveActionComponent";
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
		// if (this.state.protocol === "Aave") {
		// 	return (<AaveActionComponent axel={axel} protocol={this.state.protocol} actionFn={this.state.actionFn} exitUI={this.exitUI} />);
		// } else {
		// }
	}

	render() {
		return (
			<div className="Search-container">
				{this.state.isSearching ? (
					<div>
						<div className="Search-buffer"></div>
						<ActionOption onClick={this.chooseOption} protocol="Aave" actionFn={amount => axel.lend("Aave", {amount})} />
						<ActionOption onClick={this.chooseOption} protocol="Compound" actionFn={amount => axel.lend("Compound", {amount})} />
						<ActionOption onClick={this.chooseOption} protocol="Uniswap" actionFn={amount => axel.exchange("Uniswap", {amount, "buyToken": "DAI"})} />
						<ActionOption onClick={this.chooseOption} protocol="Sushiswap" actionFn={amount => axel.exchange("Sushiswap", {amount, "buyToken": "DAI"})} />
						<ActionOption onClick={this.chooseOption} protocol="Lido" actionFn={amount => axel.stake("Lido", {amount})} />
						<ActionOption onClick={this.chooseOption} protocol="Yearn" actionFn={amount => axel.deposit("Yearn", {amount})} />
						<ActionOption onClick={this.chooseOption} protocol="Rocket Pool" actionFn={amount => axel.lend("Rocket Pool", {amount})} />
					</div>
				) : (this.getActionUI())}
			</div>
		);
	}
}
