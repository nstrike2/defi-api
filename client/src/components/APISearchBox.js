import React from "react";
import APIOptions from "../utils/APIOptions.json";
import APIForm from "./APIForm";
import "./APISearchBox.css";

class APISearchBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchText: "",
			filteredData: APIOptions,
			isSearching: true,
			selectedId: -1,
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.optionClick = this.optionClick.bind(this);
		this.apiAction = this.apiAction.bind(this);
		this.exitAPIForm = this.exitAPIForm.bind(this);
	}

	handleChange(event) {
		const query = event.target.value;
		this.setState({
			searchText: query,
			filteredData: APIOptions.filter((el) => {
				//if no input the return the original
				if (this.state === undefined || query === "") {
					return true;
				}
				//return the item which contains the user input
				else {
					return el.text.toLowerCase().includes(query.toLowerCase().trim());
				}
			}),
		});
	}

	handleSubmit(event) {
		event.preventDefault();
	}

	optionClick(id) {
		this.setState({
			isSearching: false,
			selectedId: id,
		});
	}

	apiAction() {

	}

	exitAPIForm() {
		this.setState({
			isSearching: true,
			selectedId: -1,
		});
	}

	render() {
		return (
			<div className="Search-container">
				<form onSubmit={this.handleSubmit} autoComplete="off">
					<label>
						<input
							type="text"
							name="apiSearchText"
							className="Input"
							value={this.state.searchText}
							placeholder="What do you want to do?"
							onChange={this.handleChange}
						/>
					</label>
				</form>
				<hr className="line-break"></hr>
				{this.state.isSearching ? (
					this.state.filteredData.map((item) => (
						<div key={item.id} className="Search-cell" onClick={this.optionClick.bind(this, item.id)}>
							<div className="Search-img-container">
								<img src={item.img} className="Search-img" alt="Protocol Logo" />
							</div>
							<div className="Search-text">{item.text}</div>
						</div>
					))
				)
					: (
						<APIForm exitAPIForm={this.exitAPIForm} id={this.state.selectedId} />
					)}
			</div>
		);
	}
}
export default APISearchBox;