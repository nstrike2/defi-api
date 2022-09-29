import React from "react";
import "./App.css";
import {AxelUI} from "./axel-integrations";
import {Title} from "./components/Title";
import {WalletConnectButton} from "./axel-integrations/WalletConnectButton";

class App extends React.Component {
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

          <AxelUI/>
        </div>
      </div>
    );
  }
}

export default App;
