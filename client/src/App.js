import React from "react";
import "./App.css";
import APISearchBox from "./components/APISearchBox";
import  Adam from "./adam"

class App extends React.Component {
	constructor(props) {
		super(props);
		Adam.initialize();
		this.isWalletConnected = this.isWalletConnected.bind(this);
		this.connectToMetaMask = this.connectToMetaMask.bind(this);
	}

	isWalletConnected = () => {
		return Adam.isWalletConnected();
	}

	connectToMetaMask = async () => {
		// All it takes to connect to metamask
		Adam.connect();
	};

	render() {
		return (
		<div className="App">
			<header className="App-header">
				{console.log(this.isWalletConnected())}
				<p className="Text-header">Axel</p>
				{this.isWalletConnected()
				? (<button className="Wallet-button">Wallet Connected</button>)
				: (<button className="Wallet-button" onClick={this.connectToMetaMask}> Connect Wallet </button>)}
			</header>

			<div className="Main-container">
				<div className="Text-title-big">Lend. Stake. Yield.</div>
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
