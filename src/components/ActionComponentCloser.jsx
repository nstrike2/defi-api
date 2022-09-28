import React from "react";
export class ActionComponentCloser extends React.Component {
	render() {
		return (
			<div className="protocol">
				<img src={this.props.logo} className="Search-img" alt="" />
				<div className="Search-text">{this.props.token}</div>
				<img className="close-icon" src="close-icon.svg" alt="Close icon" onClick={this.props.onClick} />
			</div>
		);
	}
}
