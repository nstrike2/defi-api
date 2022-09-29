import React from "react";

export class ActionOption extends React.Component {
   constructor(props) {
      super(props);
      console.log("ActionOption", props);
   }
   render() {
      return (
         <div className="Search-cell" onClick={() => this.props.onClick(this)}>
            <div className="Search-img-container">
               <img src={this.props.logo} className="Search-img" alt="Protocol Logo" />
            </div>
            <div className="Search-text">{this.props.children}</div>
         </div>
      );
   }
}
