import React from "react";
import "./App.css";
import APISearchBox from "./components/APISearchBox";
import Title from "./components/Title";
import Adam from "./adam";


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isWalletConnected: false
		};
		this.connectToMetaMask = this.connectToMetaMask.bind(this);
	}

	async connectToMetaMask() {
		// All it takes to connect to metamask
		if(await Adam.connect()) {
			this.setState({isWalletConnected: Adam.isWalletConnected()});
		}
	}

	async componentDidMount() {
		await Adam.initialize();
		this.setState({isWalletConnected: Adam.isWalletConnected()});
	}

	render() {
		return (
		<div className="App">
			<header className="App-header">
				<p className="Text-header">Axel</p>
				{this.state.isWalletConnected
				? (<button className="Wallet-button Green-border">Wallet Connected</button>)
				: (<button className="Wallet-button" onClick={this.connectToMetaMask}> Connect Wallet </button>)}
			</header>

			<div className="Main-container" >
				<Title text = "Lend. Stake. Yield."/>
				<div className="Text-title-small">
				Showcasing the world's most powerful universal DeFi API.
				</div>

			<APISearchBox/>
			</div>
		</div>
		);
	}
}

export default App;
