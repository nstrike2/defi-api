import React from "react";

export class TransactionDetail extends React.Component {
   render() {
      return (
         <div className="transaction-detail-cell">
            <div className="label">{this.props.name}</div>
            <div className="data">{this.props.value}</div>
         </div>
      );
   }
}
