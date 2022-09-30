import React from "react";

// I take these props:
// * amount: the value in the input element
// * handleChange: what to do when the input changes
// * logo: the token image to use
// * logoAlt: the alt to use for the token image
// * tokenName: the name of the token
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
            <div className="token-modal">
               <img
                  className="token-logo"
                  src={this.props.logo}
                  alt={this.props.tokenName}
               />
               <div className="token-text">{this.props.tokenName}</div>
            </div>
         </div>
      );
   }
}
