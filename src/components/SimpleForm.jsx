import React from "react";

export class SimpleForm extends React.Component {
   onSubmit(evt) {
      evt.preventDefault();
      this.props.onSubmit();
   }
   render() {
      return (
         <form className="input-api-form" onSubmit={this.onSubmit.bind(this)} autoComplete="off">
            {this.props.children}
         </form>
      )
   }
}
