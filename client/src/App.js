import React from "react";
import "./App.css";
import APISearchBox from "./components/APISearchBox";
import Title from "./components/Title";
import Axel from "./Axel";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isWalletConnected: false,
    };
    this.connectToMetaMask = this.connectToMetaMask.bind(this);

    this.axel = Axel.make("http://localhost:4000");
    window.axel = this.axel;
  }

  componentDidMount() {
    this.axel.on("walletConnect", () => {
      this.setState({ isWalletConnected: true });
    });
    this.axel.on("walletDisconnect", () => {
      this.setState({ isWalletConnected: false });
    });
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
            {/* <div className="navbar-item Text-header">axel</div> */}
          </span>
          <li id="wallet-button" className="navbar-item">
            {this.state.isWalletConnected ? (
              <button className="Wallet-button button-border">
                <div className="connected-wallet-info">
                  <img
                    className="wallet-checkmark"
                    src="wallet-checkmark.svg"
                    alt="Wallet Connection Checkmark"
                  />
                  <span>Wallet Connected</span>
                </div>
              </button>
            ) : (
              <button
                className="Wallet-button"
                onClick={this.connectToMetaMask}
              >
                {" "}
                Connect Wallet{" "}
              </button>
            )}
          </li>
        </header>

        <div className="Main-container">
          <Title text="Lend. Stake. Yield. Exchange." />
          <div className="Text-title-small">
            Showcasing the world's most powerful, composable, and universal DeFi
            developer platform.
          </div>

          <APISearchBox axel={this.axel} />
        </div>
      </div>
    );
  }
}

export default App;
