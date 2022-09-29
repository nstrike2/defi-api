import React from "react";
import {Box} from "@mui/material";

export class ReceiptTokenComponent extends React.Component {
   render() {
      return (
         <div className="menu-form">
            <div className="receive-amount">{this.props.estimate}</div>
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
               <img className="token-logo" src={this.props.logo} alt={this.props.tokenName} />
               <div className="token-text">{this.props.tokenName}</div>
            </Box>
         </div>
      );
   }
}
