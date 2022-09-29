import React from "react";
import "./AxelUI.css";

import {ActionOption} from "../components/ActionOption";
import {axel} from "../axel_inst";
import {logos} from "../logos";
import {AaveActionUI, CompoundActionUI, UniswapActionUI, SushiswapActionUI, LidoActionUI, YearnActionUI, RocketPoolActionUI} from "./actionUIs";

export class AxelUI extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected_protocol: null,
		};

		this.chooseOption = this.chooseOption.bind(this);
		this.exitUI = this.exitUI.bind(this);
	}

	exitUI() {
		this.setState({
			selected_protocol: null,
		});
	}

	async chooseOption(component) {
		if (axel.provider !== null) {
			this.setState({
				selected_protocol: component.props.protocol,
			});
		} else {
			alert("Please connect your wallet.");
		}
	}
	
	getActionUI() {
		switch (this.state.selected_protocol) {
			case "aave":       return (<AaveActionUI       exit={this.exitUI}/>);
			case "compound":   return (<CompoundActionUI   exit={this.exitUI}/>);
			case "uniswap":    return (<UniswapActionUI    exit={this.exitUI}/>);
			case "sushiswap":  return (<SushiswapActionUI  exit={this.exitUI}/>);
			case "lido":       return (<LidoActionUI       exit={this.exitUI}/>);
			case "yearn":      return (<YearnActionUI      exit={this.exitUI}/>);
			case "rocketpool": return (<RocketPoolActionUI exit={this.exitUI}/>);
			
			default: throw new Error(`Unknown protocol ${this.state.selected_protocol}!`);
		}
	}
	
	render() {
		return (
			<div className="Search-container">
				{this.state.selected_protocol ? this.getActionUI() : (
					<div>
						<div className="Search-buffer"></div>
						<ActionOption protocol="aave"       onClick={this.chooseOption} logo={logos.aave}      >Lend on Aave</ActionOption>
						<ActionOption protocol="compound"   onClick={this.chooseOption} logo={logos.compound}  >Lend on Compound</ActionOption>
						<ActionOption protocol="uniswap"    onClick={this.chooseOption} logo={logos.uniswap}   >Swap on Uniswap</ActionOption>
						<ActionOption protocol="sushiswap"  onClick={this.chooseOption} logo={logos.sushiswap} >Swap on Sushiswap</ActionOption>
						<ActionOption protocol="lido"       onClick={this.chooseOption} logo={logos.lido}      >Stake on Lido</ActionOption>
						<ActionOption protocol="yearn"      onClick={this.chooseOption} logo={logos.yearn}     >Earn Yield on Yearn</ActionOption>
						<ActionOption protocol="rocketpool" onClick={this.chooseOption} logo={logos.rocketpool}>Stake on Rocket Pool</ActionOption>
					</div>
				)}
			</div>
		);
	}
}
