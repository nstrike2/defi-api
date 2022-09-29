import React from "react";

export class GasSetting extends React.Component {
   render() {
      return (
         <div className="gas-setting-container">
            Gas | <span className="gas-setting">{this.props.setting}</span>
            <img className="gear-logo" src="gear.svg" alt="Gear logo" />
         </div>
      );
   }
}
