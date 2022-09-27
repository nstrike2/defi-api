import React from "react";
import APIOptions from "../utils/APIOptions.json";
import "./APISearchBox.css";

export class ActionOption extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="Search-cell" onClick={() => this.props.onClick(this)}>
				<div className="Search-img-container">
					<img src={APIOptions[this.props.protocol].img} className="Search-img" alt="Protocol Logo"/>
				</div>
				<div className="Search-text">{APIOptions[this.props.protocol].text}</div>
			</div>
		);
	}
}
