import React, {
	Component
} from 'react';
import {
	OCAlert
} from '@opuscapita/react-alerts';

export default class FormContact extends Component {
	
	constructor(props) {
	  super(props)
	
	  this.state = {
		  name: "",
		  email: "",
		  subject: "",
		  message: "",
		  senderRes: []
	  }
	}

	handleFormSubmit = (e, resumeData) => {
		e.preventDefault();

		let mailAPI = 'https://contact.princelle.org/php/email.php';

		var data = {
			name: this.state.name,
			email: this.state.email,
			subject: this.state.subject,
			message: this.state.message
		};

		var fd = new FormData();

		for (var i in data) {
			fd.append(i, data[i]);
		}

		let fetchData = {
			method: 'POST',
			body: fd
		};
			
		fetch(mailAPI, fetchData).then(
			response => this.handleResponse(resumeData, response)
		);
	};

	async handleResponse(resumeData, responseSender) {
		var response = JSON.parse(responseSender)
		var resMail = response.result.reSender

		if (resMail === "SPAM") {
			await OCAlert.alertWarning(resumeData.spamMsg, {
				timeOut: 3000
			});

		} else if (resMail === "ERROR") {
			await OCAlert.alertError(resumeData.errorMsg, {
				timeOut: 3000
			});

		} else if (resMail === "SUCCESS") {
			await OCAlert.alertSuccess(resumeData.successMsg, {
				timeOut: 3000
			});
		} else {
			await OCAlert.alertError(resumeData.errorMsg, {
				timeOut: 3000
			});
		}

		await this.cleanState()
	}

	cleanState = () => {
		this.setState({
			sentForm: false,
			senderRes: "",
			name: "",
			email: "",
			subject: "",
			message: ""
		})
	}
	
	
	render() {

		let resumeData = this.props.resumeData;

		return (
			<div className="form-container">
				<div className="form">
					<h3 style={{ color: "#FFF", paddingBottom: "1rem" }}>{resumeData.formTitle}</h3>

					<form id="contact-form">
						<div>
							<label style={{ color: "#FFF", fontSize: ".9rem" }} htmlFor="contact-name">{resumeData.formNameLabel}</label>
							<input style={{ width: "100%", marginBottom: "1.2rem" }} required type="text" name="name" id="contact-name" placeholder={resumeData.formNamePlaceholder} value={this.state.name} onChange={e => this.setState({ name: e.target.value })}/>
						</div>
                    
						<div>
							<label style={{ color: "#FFF", fontSize: ".9rem" }} htmlFor="contact-email">{resumeData.formMailLabel}</label>
							<input style={{ width: "100%", marginBottom: "1.2rem" }} required type="email" id="contact-email" name="emailcontact" placeholder={resumeData.formMailPlaceholder} value={this.state.email} onChange={e => this.setState({ email: e.target.value })}/>
						</div>

						<div>
							<label style={{ color: "#FFF", fontSize: ".9rem" }} htmlFor="contact-subject">{resumeData.formSujetLabel}</label>
							<input style={{ width: "100%", marginBottom: "1.2rem" }} required type="text" name="subject" id="contact-subject" placeholder={resumeData.formSujetPlaceholder} value={this.state.subject} onChange={e => this.setState({ subject: e.target.value })}/>
						</div>

						<label style={{ color: "#FFF", fontSize: ".9rem" }} htmlFor="contact-message">{resumeData.formMsgLabel}</label>
						<textarea style={{ width: "100%", marginBottom: "1.2rem" }} required name="message" placeholder={resumeData.formMsgPlaceholder} id="contact-message" onChange={e => this.setState({ message: e.target.value })} value={this.state.message}></textarea>

						<input className="btn" style={{ width: "100%" }} onClick={(e, resumeData) => this.handleFormSubmit(e)} type="submit" name="submit" value={resumeData.btnSend} />
					</form>
				</div>
			</div>
		)
	}
}
