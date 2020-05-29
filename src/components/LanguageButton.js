import React from 'react';
import "../styles/LanguageButton.css";

class LanguageButton extends React.PureComponent {

	render() {
		let options = [];
		const selectedLang = this.props.selectedLang;
		const possibleLanguages = this.props.possibleLanguages;
		const beforeTitle = (this.props.languageName === undefined) ? "" : this.props.languageName;
		for (let lang of possibleLanguages) {
			options.push(<option value={lang} key={lang+"LB"}>{lang}</option>);
		}
		return  (
			<div className="languageElements"><span>{beforeTitle}</span>
			<select  className="mainSelectLanguageElement" name="chooseLang" value={selectedLang} onChange={(e) => {this.props.changeLanguage(e);}}>
			  {options}
			</select> 
			</div>
		);
	}


}

export default LanguageButton;