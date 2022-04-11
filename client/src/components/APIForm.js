import React from "react";
import APIOptions from "../utils/APIOptions.json";
import networks from "../utils/networks.json";
import "./APIForm.css";
import { Box } from "@mui/material";

class APIForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      tokens: {
        "ethereum": {
          "image": "ethereum-logo.png",
          "text": "Ethereum",
          "acronym": "ETH"
        }
      },
      gasSetting: {
        0: "Slow",
        1: "Normal",
        2: "Fast"
      }
    };
    this.actions = {
      "Lend": this.lendAction.bind(this),
      "Stake": this.stakeAction.bind(this),
      "Exchange": this.exchangeAction.bind(this),
      "Earn": this.earnAction.bind(this)
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.revealProtocol = this.revealProtocol.bind(this);
  }

  handleChange(event) {
    this.setState({ amount: event.target.value });
  }

  async requestNetworkChange(networkName) {
    return await this.requestNetworkChangeJSON(networks[networkName]);
  }

  async requestNetworkChangeJSON(networkJSON) {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        ...networkJSON
      }],
    });
  }

  /* TODO this remains unimplemented */
  lendAction(state) {
    // const data = "???";
    // const requestJson = {
    //   "walletAddress": ethereum.selectedAddress,
    //   "amount": this.state.amount,
    // }
    // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // // Prompt user for account connections
    // await provider.send("eth_requestAccounts", []);
    // const signer = provider.getSigner();
    // const address = await signer.getAddress();
    // console.log("Account:", address);

    // // Acccounts now exposed
    // const params = [{
    //   from: data.walletAddress,
    //   to: data.to,
    //   value: data.value,
    //   data: data.data,
    // }];

    // console.log("Params:", params)

    // const transactionHash = await provider.send("eth_sendTransaction", params);
    // console.log('transactionHash is ' + transactionHash);
  }

  stakeAction(state) {
    alert("User staked " + this.state.amount + " ETH!!");
  }

  exchangeAction(state) {
    alert("User exchanged " + this.state.amount + " ETH!!");
  }

  earnAction(state) {
    alert("User submitted " + this.state.amount + " ETH to earn yield!!");
  }

  handleSubmit(event) {
    event.preventDefault();
    const APIConfig = APIOptions[this.props.id];
    const necessaryNetwork = networks[APIConfig.network];
    const necessaryChainId = parseInt(necessaryNetwork.chainId);
    const currentChainId = parseInt(window.ethereum.chainId);
    console.log(currentChainId, necessaryChainId);
    if(currentChainId != necessaryChainId) {
      // The line below only works for non-standard networks
      // await this.requestNetworkChangeJSON(necessaryNetwork);
      alert(`Please switch your wallet to the ${necessaryNetwork.chainName} network to perform this action.`)
      return;
    }
    this.actions[APIConfig.action](this.state);
    // TODO: Fetch respective API endpoint using this.props.id
    // this.state.amount is the input value
  }

  revealProtocol(id) {
    return APIOptions[id].protocol;
  }

  render() {
    return (
      <div className="menu-modal">
        <div className="protocol">
          <img
            src={APIOptions[this.props.id].img}
            className="Search-img"
            alt=""
          />
          <div className="Search-text">{this.revealProtocol(this.props.id)}</div>
          <div>

          </div>
          <img className="close-icon" src="close-icon.svg" alt="Close icon" onClick={this.props.exitAPIForm}/>
        </div>
        
          <form className="input-api-form" onSubmit={this.handleSubmit} autoComplete="off">
            <label>
              <div className="description">Amount</div>
              <div className="menu-form">
                <input
                  className="amount"
                  type="number"
                  placeholder="0"
                  value={this.state.amount}
                  onChange={this.handleChange}
                />
                <Box
                  className="token-modal"
                  sx={ {
                    width: "40%",
                    marginTop: "7px",
                    marginLeft: "14px",
                    height: "50px",
                    border: 1,
                    borderColor: "#464646",
                    borderRadius: 2
                  } }
                >
                  <img className="token-logo" src={this.state.tokens["ethereum"]["image"]} alt="Ethereum logo"/>
                  <div className="token-text">{this.state.tokens["ethereum"]["text"]}</div>
                </Box>
              </div>

              <div className="description">Transaction Details</div>
              <div className="menu-form">
                <Box
                    className="transaction-detail-form"
                    sx={ {
                      width: "100%",
                      marginTop: "7px",
                      height: "100%",
                      border: 1,
                      borderColor: "#464646",
                      borderRadius: 2,
                      input: {
                        textAlign: "center",
                        color: "#BDBDBD"
                      }
                    } }
                >
                  <div className="transaction-details">
                    <div className="transaction-detail-cell">
                      <div className="label">Supply APY</div>
                      <div className="data">{0.39}%</div>
                    </div>
                    <div className="transaction-detail-cell">
                      <div className="label">Rewards APY</div>
                      <div className="data">{0.11}%</div>
                    </div>
                    <div className="transaction-detail-cell">
                      {/* TODO: Logic for choosing the index within gasSetting mapping */}
                      <div className="label">
                        Gas | <span className="gas-setting">{this.state.gasSetting[1]}</span>
                        <img className="gear-logo" src="gear.svg" alt="Ethereum logo"/>
                      </div>
                      <div className="data">${58.08}</div>
                    </div>
                  </div>
                </Box>
              </div>
            </label>
            <input className="supply-button" type="submit" value={"Supply " + this.state.tokens["ethereum"]["acronym"]} />
          </form>
      </div>
    );
  }
}

export default APIForm;

/* <TextField id="outlined-basic" type="number" sx={{ input: { color: 'red' }, width: "50%", color: "warning" } } focused /> */
