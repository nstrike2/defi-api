import React from "react";
import "../App.css";

class Title extends React.Component {
	static endDelay = 1000;
	static startDelay = 200;
	static minorTypeDelay = 100;
	static spaceTypeDelay = 20;
	static majorTypeDelay = 400;
	static initDelay = 3000;

	constructor(props) {
		super(props);
		this.state = {
			forward: false,
			text: this.props.text,
			index: this.props.text.length,
			isTyping: false,
		};
		this.isTyping = false;
	}
	type(time = 0) {
		setTimeout(() => {
			if (this.state.forward) {
				if (this.state.index == this.props.text.length) {
					this.setState({
						forward: false
					});
					this.type(Title.endDelay);
				} else {
					const char = this.props.text[this.state.index];
					this.setState({
						text: this.state.text + char,
						index: this.state.index + 1,
					});
					this.type(char == "." ? Title.majorTypeDelay : Title.minorTypeDelay);
				}
			} else {
				if (this.state.index == 0) {
					this.setState({
						forward: true
					});
					this.type(Title.startDelay);
				} else {
					const char = this.props.text[this.state.index - 1];
					this.setState({
						text: this.state.text.slice(0, -1),
						index: this.state.index - 1,
					});
					this.type(char == " " ? Title.spaceTypeDelay : Title.minorTypeDelay);
				}
			}
		}, time);
	}
	render() {
		if(!this.isTyping) {
			this.isTyping = true;
			this.type(Title.initDelay);
		}
		return (
			<div className = "Text-title-big">{ this.state.text }</div>
		);
	}
}

export default Title;