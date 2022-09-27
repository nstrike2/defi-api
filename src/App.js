import {Wallet} from "ethers";
import React from "react";
import "./App.css";
import {APISearchBox} from "./components/APISearchBox";
import {Title} from "./components/Title";
import {WalletConnectButton} from "./axel-integrations/WalletConnectButton";

import {axel} from "./axel_inst";

class App extends React.Component {
  constructor(props) {
    super(props);
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
          <WalletConnectButton/>
        </header>

        <div className="Main-container">
          <Title text="Lend. Stake. Yield. Swap."/>
          <div className="Text-title-small">
            Showcasing the world's most powerful, composable, and universal DeFi
            developer platform.
          </div>

          <APISearchBox/>
        </div>
      </div>
    );
  }
}

export default App;
