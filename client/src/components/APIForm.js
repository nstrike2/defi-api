import React from "react";
import APIOptions from "../utils/APIOptions.json";
import "./APIForm.css";
import { Box } from "@mui/material";

class APIForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      protocols: [
        "Aave",
        "Compound",
        "Rari"
      ],
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
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.revealProtocol = this.revealProtocol.bind(this);
  }

  handleChange(event) {
    this.setState({ amount: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    alert("User submitted " + this.state.amount + " ETH!!");
    // TODO: Fetch respective API endpoint using this.props.id
    // this.state.amount is the input value
  }

  revealProtocol(id) {
    for (let protocol of this.state.protocols) {
      if (APIOptions[this.props.id].text.toLowerCase().includes(protocol.toLowerCase())) {
        return protocol;
      }
    }
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
        
          <form className="input-api-form"onSubmit={this.handleSubmit} autoComplete="off">
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
