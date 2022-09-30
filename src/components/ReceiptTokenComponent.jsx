import React from "react";

export class ReceiptTokenComponent extends React.Component {
   render() {
      return (
         <div className="menu-form">
            <div className="receive-amount">{this.props.estimate}</div>
            <div className="token-modal">
               <img className="token-logo" src={this.props.logo} alt={this.props.tokenName}/>
               <div className="token-text">{this.props.tokenName}</div>
            </div>
         </div>
      );
   }
}
