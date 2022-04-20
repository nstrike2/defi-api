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
		if (await Adam.connect()) {
			this.setState({ isWalletConnected: Adam.isWalletConnected() });
		}
	}

	async componentDidMount() {
		await Adam.initialize();
		this.setState({ isWalletConnected: Adam.isWalletConnected() });
	}

	render() {
		return (
			<div className="App">
				<header class="navbar">
					<span id="navbar-items">
						<img
							className="navbar-item Title-img"
							src="axel-logo.svg"
							alt="Axel Logo"
						/>
						<div className="navbar-item Text-header">axel</div>
					</span>
					<li id="wallet-button" className="navbar-item">
						{this.state.isWalletConnected
							? (<button className="Wallet-button Green-border">Wallet Connected</button>)
							: (<button className="Wallet-button" onClick={this.connectToMetaMask}> Connect Wallet </button>)}
					</li>
				</header>

				<div className="Main-container" >
					<Title text="Lend. Stake. Yield. Exchange." />
					<div className="Text-title-small">
						Showcasing the world's most powerful, composable, and universal DeFi developer platform.
					</div>

					<APISearchBox />
				</div>
			</div>
		);
	}
}

export default App;
