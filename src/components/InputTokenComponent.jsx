import React from "react";
import {Box} from "@mui/material";

export class InputTokenComponent extends React.Component {
  render() {
    return (
      <div className="menu-form">
        <input
          className="send-amount"
          type="number"
          placeholder="0"
          value={this.props.amount}
          onChange={this.props.handleChange}
        />
        <Box
          className="token-modal"
          sx={{
            width: "40%",
            marginTop: "7px",
            marginLeft: "14px",
            height: "50px",
            border: 1,
            borderColor: "#464646",
            borderRadius: 2,
          }}
        >
          <img
            className="eth-logo token-logo"
            src={this.props.logo}
            alt="Ethereum logo"
          />
          <div className="token-text">{this.props.tokenName}</div>
        </Box>
      </div>
    );
  }
}
