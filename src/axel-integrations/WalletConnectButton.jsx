import {Wallet} from "ethers";
import React from "react";
import "../App.css";
import {APISearchBox} from "../components/APISearchBox";
import {Title} from "../components/Title";

import {axel} from "../axel_inst";

export class WalletConnectButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {connected: axel.provider !== null};
  }

  componentDidMount() {
    axel.on("provider_connect", () => {
      this.setState({connected: true});
    })
    axel.on("provider_disconnect", () => {
      this.setState({connected: false});
    });
  }

  render() {
    return (
      <li id="wallet-button" className="navbar-item">
        {this.state.connected ? (
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
            onClick={async e => {console.log(e); await axel.connect()}}
          >
            {" "}
            Connect Wallet{" "}
          </button>
        )}
      </li>
    );
  }
}
