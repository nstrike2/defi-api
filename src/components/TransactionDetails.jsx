import {Box} from "@mui/material";
import React from "react";

export class TransactionDetails extends React.Component {
	render() {
		return (
			<Box
				className="transaction-detail-form"
				sx={{
					width: this.props.width,
					marginTop: "7px",
					height: "100%",
					border: 1,
					borderColor: "#464646",
					borderRadius: 2,
					input: {
						textAlign: "center",
						color: "#BDBDBD",
					},
				}}
			>
				<div className="transaction-details">
					{this.props.children}
				</div>
			</Box>
		);
	}
}
