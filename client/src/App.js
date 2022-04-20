import React from "react";
import "./App.css";
import APISearchBox from "./components/APISearchBox";
import Title from "./components/Title";
import Axel from "./Axel";


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isWalletConnected: false
		};
		this.connectToMetaMask = this.connectToMetaMask.bind(this);
		
		this.axel = Axel.make("http://localhost:4000");
		window.axel = this.axel;
	}
	
	componentDidMount() {
		this.axel.on("walletConnect", () => {this.setState({isWalletConnected: true})});
		this.axel.on("walletDisconnect", () => {this.setState({isWalletConnected: false})});
		this.axel.start();
	}
	
	async connectToMetaMask() {
		// All it takes to connect to metamask
		await this.axel.connect();
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
				
				<APISearchBox axel = {this.axel}/>
			</div>
		</div>
		);
	}
}

export default App;
