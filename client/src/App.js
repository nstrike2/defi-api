import React from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { ethers } from "ethers";

function App() {
  const [data, setData] = React.useState("");

  const postAaveUrl = "http://localhost:4000/v1/ethereum/kovan/lend/aave/supply";
  const postCompoundUrl = "http://localhost:4000/v1/ethereum/rinkeby/lend/compound/supply";
  const marcusAddress = "0x1c87Ba20aB980f0c4C26AFEf9502967f6C4fD502";
  const requestJson = {
      "walletAddress": marcusAddress,
      "token": "eth",
      "amount": ".001",
      "gasPriority": "medium"
    }

  const fetchData = React.useCallback(async () => {
    axios
      .post(postAaveUrl, requestJson)
      // .post(postCompoundUrl, requestJson)
      .then((response) => setData(response.data));
  }, []);
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  function checkMetamask() {
    if (typeof window.ethereum === "undefined" && window.ethereum === null) {
      console.log('No metamask!')
    } else {
      console.log("Metamask good")
    }
    // console.log("Metamask");
  }

  async function transact() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log("Account:", address);

    // Acccounts now exposed
    const params = [{
      from: data.walletAddress,
      to: data.to,
      value: data.value,
      data: data.data,
      chainid: data.chain.chainId
    }];

    console.log(params)

    const transactionHash = await provider.send("eth_sendTransaction", params);
    console.log('transactionHash is ' + transactionHash);
  }

  async function printConsole() {
    console.log(data);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <button onClick={checkMetamask}>Check Metamask</button><br/>
          <button onClick={transact}>Transact</button>
        </p>
      </header>
    </div>
  );
}

export default App;