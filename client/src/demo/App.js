import React from "react";
import "./App.css";
import Axel from "./Axel";

class AxelForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"amount": 0,
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleChange(event) {
		this.setState({amount: event.target.value})
	}
	handleSubmit(event) {
		this.props.handleSubmit(this.props.protocol + this.state.amount);
		event.preventDefault();
	}
	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<img className="token-logo" src={APIOptions[this.props.id].img} alt="Ethereum logo" />
				<label>
					Name:
					<input type="text" value={this.state.value} onChange={this.handleChange} />
				</label>
				<input type="submit" value="Submit" />
			</form>
		);
	}
 }

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isWalletConnected: false
		};
		this.connectToMetaMask = this.connectToMetaMask.bind(this);
		
		this.axel = Axel.make("http://localhost:4000");
	}
	
	componentDidMount() {
		this.axel.start();
	}
	
	async connectToMetaMask() {
		// All it takes to connect to metamask
		await this.axel.connect();
	}
	
	render() {
		return (
			<div className="App">
				<header className="navbar">
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
							: (<button className="Wallet-button" onClick={() => this.axel.connect()}> Connect Wallet </button>)}
					</li>
				</header>

				<div className="Main-container" >
					<AxelForm protocol="Aave" handleSubmit={amount => this.axel.lend("Aave", {amount})} />
				</div>
			</div>
		);
	}
}

export default App;
