import React from "react";
import "./TransactionDetails.css";

export class TransactionDetails extends React.Component {
   constructor(props) {
      super(props);
      console.log(props);
   }
   render() {
      return (
         <div className="transaction-details" style={{width: this.props.width}}>
            {this.props.children}
         </div>
      );
   }
}
