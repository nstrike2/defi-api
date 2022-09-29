import React from "react";
import {axel} from "../../axel_inst";
import {logos} from "../../logos";
import {lookers} from "@axelapi/sdk";
import {ActionComponentCloser} from "../../components/ActionComponentCloser";
import {InputTokenComponent} from "../../components/InputTokenComponent";
import {ReceiptTokenComponent} from "../../components/ReceiptTokenComponent";
import {GasSetting} from "../../components/GasSetting";
import {TransactionDetail} from "../../components/TransactionDetail";
import {TransactionDetails} from "../../components/TransactionDetails";
import {SimpleForm} from "../../components/SimpleForm";

export class AaveActionUI extends React.Component {
   constructor(props) {
      super(props);
      this.mounted = false;
      this.state = {
         swap_rate: undefined,
         ETH_balance: "Loading...",
         aWETH_balance: "Loading...",
         apy: "???",
         amount: "",
         estimate: 0,
         gasSetting: {
            0: "Slow",
            1: "Normal",
            2: "Fast"
         },
      };
   }

   _setState(obj) {
      if (this.mounted) this.setState(obj);
   }

   async componentDidMount() {
      this.mounted = true;

      // Set balance lookers to update balance in real-time
      this.ETH_looker = lookers.make_balance_looker(axel, {
         token: "ETH",
         chain: null,
      }, (evt: lookers.balance_looker_update) => {
         if (evt.status === "ok") {
            this._setState({ETH_balance: evt.balance.toFixed(3)});
         } else {
            this._setState({ETH_balance: "error"});
         }
      });
      this.aWETH_looker = lookers.make_balance_looker(axel, {
         token: "aWETH",
         chain: null,
      }, (evt: lookers.balance_looker_update) => {
         if (evt.status === "ok") {
            this._setState({aWETH_balance: evt.balance.toFixed(3)});
         } else {
            this._setState({aWETH_balance: "error"});
         }
      });

      this._setState({
         // Get Lend APY
         apy: (await axel.get_apy("lend", {
            protocol: "aave",
            token: "ETH",
         })).toFixed(2),

         // Get ETH/aWETH swap rate
         swap_rate: await axel.get_swap_rate({
            sell_token: "ETH",
            buy_token: "ETH",
         }),
      });
   }

   componentWillUnmount() {
      this.mounted = false;
      this.ETH_looker.stop();
      this.aWETH_looker.stop();
   }

   async handleChange(event) {
      const amount = event.target.value;
      const is_number = !isNaN(amount) && amount > 0;
      this._setState({
         amount,
         estimate: is_number ? this.state.swap_rate * amount : 0,
      });
   }

   async handleSubmit(event) {
      event.preventDefault();

      await axel.lend({
         protocol: "aave",
         token: "ETH",
         amount: Number(this.state.amount),
      });
   }

   render() {
      return (
         <div className="menu-modal">
            <ActionComponentCloser logo={logos.aWETH} token="Aave" onClick={this.props.exit}/>
            <SimpleForm onSubmit={e => { axel.lend({protocol: "aave", token: "ETH", amount: Number(this.state.amount)}) }}>

               <div className="description">Amount &#38; Token To Lend</div>
               <InputTokenComponent amount={this.state.amount} handleChange={this.handleChange.bind(this)} logo={logos.ETH} logoAlt="Ethereum logo" tokenName="ETH"/>

               <div className="description">Amount &#38; Token To Receive</div>
               <ReceiptTokenComponent estimate={this.state.estimate.toFixed(3)} logo={logos.aWETH} tokenName="aWETH"/>

               <div className="description">Transaction Details</div>
               <div className="menu-form">
                  <TransactionDetails width="57.8%">
                     <TransactionDetail name="Lend APY" value={this.state.apy + "%"}/>
                     <TransactionDetail name={(<GasSetting setting={this.state.gasSetting[1]}/>)}/>
                  </TransactionDetails>

                  <TransactionDetails width="40%">
                     <TransactionDetail name="ETH:" value={this.state.ETH_balance}/>
                     <TransactionDetail name="aWETH:" value={this.state.aWETH_balance}/>
                  </TransactionDetails>
               </div>

               <input className="supply-button" type="submit" value="Lend ETH"/>
            </SimpleForm>
         </div>
      );
   }
}
