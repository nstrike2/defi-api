import React from "react";
import "../App.css";

export class Title extends React.Component {
   static endDelay = 1000;
   static startDelay = 200;
   static minorTypeDelay = 50;
   static spaceTypeDelay = 20;
   static majorTypeDelay = 200;
   static deleteDelay = 50;
   static initDelay = 200;

   constructor(props) {
      super(props);
      this.state = {
         text: "",
         index: 0,
      };
   }
   type(time = 0) {
      setTimeout(() => {
         if (this.state.index !== this.props.text.length) {
            const char = this.props.text[this.state.index];
            this.setState({
               text: this.state.text + char,
               index: this.state.index + 1,
            });
            if (this.state.index > 0) {
               this.appear = true;
            }
            this.type(char === "." ? Title.majorTypeDelay : Title.minorTypeDelay);
         }
      }, time);
   }
   render() {
      if (!this.isTyping) {
         this.isTyping = true;
         this.appear = false;
         this.type(Title.initDelay);
      }
      return (
         <div className="Text-title-big">
            {(this.appear) ? this.state.text : <span>&nbsp;&nbsp;</span>}
         </div>
      );
   }
}
