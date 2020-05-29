import React from 'react';
import cookie from 'react-cookies';
import LanguageButton from "./LanguageButton";
import {possibleLanguages, getWord} from "./UIWords";

require('dotenv').config();

//Minimum wait time between making API calls in milliseconds (basically how often can you press the button)
const API_CALL_MINIMUM_WAIT_MS = 3000;
/*Component that Checks for posts added or removed in a public padlet. If there is moderation, it won't see
a post until it has been accepted by a moderator.*/
/*It basically makes a call to Padlet's API to check the ids of the existent posts in your Padlet (and more, like 
their title... although I don't do anything with that data) and saves them to a cookie. Then you can keep 
making API calls afterwards and it'll compare the new posts with what is stored in your cookie.
It keeps telling you the difference when the amount of posts changes, just the amount
that were added or eliminated. Needs a padlet id and an API key to make the calls, which should be setup in 
an .env file. Added support for language changing on the fly. The possible languages and words for every 
language are in UIWords.js*/

class PostChecker extends React.Component {
  	constructor(props) {
		super(props);
		const cookieLang = cookie.load("lang");
		const startingLang = (cookieLang === undefined) ? possibleLanguages[0] : cookieLang;
		/*LastAmountChanged just shows "the difference" amount of posts added or eliminated from last time,
		negative values on the first term imply first time checking data or error,
		done like this instead of a jsx object with the text to account for changing languages
		on the fly.*/
		this.state = {
		     checkedIds: undefined,
		      timeout: false,
		      lastAmountChanged: [-2,0],
		      error: false,
		      language: startingLang
		};	
	   	this.requestAndUpdatePosts = this.requestAndUpdatePosts.bind(this);
	   	this.changeLanguage = this.changeLanguage.bind(this);
	}
	
	componentDidMount() {
		//Checks for post updates in the padlet as the first thing ...
		this.requestAndUpdatePosts();
	}

	componentWillUnmount() { 	
		clearInterval(this.cooldownTimer);
	}

	render() {
		const lastAmountChanged = this.state.lastAmountChanged;
		const checkedIds = this.state.checkedIds;
		const language = this.state.language;

		let msgsData;
		//Loading animation, havent gotten the data from padlet yet
		if (checkedIds === undefined || this.state.timeout) {
			msgsData = <h5 className="card-title centralText"><div className="loader">{getWord(language,0)}</div></h5>;
		} else {
			if (lastAmountChanged[0] === -2) { //error
			} else if (lastAmountChanged[0] <= -1) { //first time visiting site
				msgsData = <h5 className="card-title centralText">{getWord(language,1)}</h5>;
			} else if (lastAmountChanged[0] === 0 && lastAmountChanged[1] === 0) { //equal messages amount
				msgsData = <h5 className="card-title centralText">{getWord(language,5)}</h5>;
			} else { //difference in messages amount
				msgsData= <h5 className="card-title centralText">
						<span className="text-danger">{getWord(language,2)}</span>
						<span>{lastAmountChanged[0] + getWord(language,3) + lastAmountChanged[1] + getWord(language,4)}</span></h5>; 

			}
		}
		if (this.state.error) {
			msgsData = getWord(language,6);
		}

		const lastCheck = cookie.load("lastCheck");
		const buttonText = (this.state.timeout) ? getWord(language,7) : getWord(language,8);
		const clickMeClass = (this.state.timeout) ?  "" : " pressMeButton";

		//change REACT_APP_PADLETURL in .env to send the user to the webpage of your padlet
		return(
			<div className="container text-center">
				<div className="row justify-content-end h-25">
					<LanguageButton possibleLanguages={possibleLanguages} selectedLang={this.state.language} 
					changeLanguage={this.changeLanguage} languageName={getWord(language,11)}/>
				</div>
				<div className="row justify-content-center h-75">
					<div className="card mb-3 mainContainer">
					  	<div className="card-header">
					  		<h4 style={{paddingTop: "10px"}}>{getWord(language,9)}<a href={process.env.REACT_APP_PADLETURL} 
					  		rel="noopener noreferrer" target="_blank">Padlet?</a></h4>
					 	</div>
					  	<div className="card-body">
					    	{msgsData}
					  	</div>
					  	{lastCheck !== undefined && !this.state.timeout && <p className="smallFont"><i>{getWord(language,10) +
					  		new Date(parseInt(lastCheck)).toLocaleString()}</i></p>}
					  	<div className="card-footer" style={{padding: "0"}}>
					  		<button className={"btn btn-primary btn-lg btn-block"+clickMeClass} 
						  		onClick={() => {this.requestAndUpdatePosts()}} 
								disabled={this.state.timeout}><b>{buttonText}</b>
							</button>
					  	</div>
					</div>
				</div>
			</div>);
	}

	/*Requests a json of posts inside a Padlet via the Padlet API, then updates the state with a list of their Ids*/
	requestAndUpdatePosts() { 
		if (this.state.timeout) { return; }
		this.setState({timeout: true});

		/*Using a proxy to avoid CORS problems, API isnt sending correct allow origin header or am I thick? tested a lot
		of things, only this worked, if someone can shed some light on this I'd be grateful*/
		const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

		//May need to change page number for differently styled padlets
		const targetUrl = 'https://padlet.com/api/0.9/public_posts?padlet_id='+process.env.REACT_APP_PADLETID+'&page=1';

		const timeBeforeCheck = Date.now();
		fetch(proxyUrl+targetUrl, {
			mode: 'cors',
			headers: {
	    		"App-Id": process.env.REACT_APP_APIKEY,
	    		"Content-Type": "application/json",
	    		Accept: "*/*"
	  			}
		    })
	    .then((res) => {
	    	return res.json();})
	    .then( (msgsData) => {
	    	let newIdArray = [];
	    	 for (let post of msgsData.data) {    
	    	 	if (post.hasOwnProperty("id")) {
		  			newIdArray.push(post.id);
		  		}
		  	}
		  	const timeWhenCheck = Date.now();
		  	const msDiff = timeWhenCheck - timeBeforeCheck;

		  	//Effectively sets a minimum wait time of 3s... dont wanna let users spam the API with calls
		  	const cooldownTimer = (msDiff < API_CALL_MINIMUM_WAIT_MS) ? (API_CALL_MINIMUM_WAIT_MS-msDiff) : 0;

		  	this.cooldownTimer = setTimeout( () => { 
		  		const lastSeenIds = cookie.load("seenIds");
				let lastMsgArray;

				/*Checks for the Ids of the posts the user has seen in the cookies vs the ones you get right now via API*/
				//If First time visitor of the site, save a cookie with the msg ids we got from padlet
				if (lastSeenIds === undefined) {
					lastMsgArray =[-1,0];
					cookie.save("seenIds", newIdArray, {path: "/padletrest", expires: new Date(new Date().getTime() +1000*60*60*24*365), sameSite: true});
				} else {
					const diffArray = comparePostAmounts(lastSeenIds, newIdArray);
					//If there are differences between old and new msg ids, write them to user and overwrite the cookie with new ids
					if (diffArray[0] !== 0 || diffArray[1] !== 0) { 
					cookie.save("seenIds", newIdArray, {path: "/padletrest", expires: new Date(new Date().getTime() +1000*60*60*24*365), sameSite: true});
					lastMsgArray = [diffArray[0], diffArray[1]];
					} else {
						//There are no differences with old data from padlet
						lastMsgArray = [0,0];
					}
				}

				//Update last time we checked with Padlet, could maybe save in the future for statistics of when users check? Iunno
				cookie.save("lastCheck", new Date().getTime(), {path: "/padletrest",expires: new Date(new Date().getTime() +1000*60*60*24*365), sameSite: "strict"});

				//Update the state
		  		this.setState({checkedIds: newIdArray, timeout: false, lastAmountChanged: lastMsgArray});
		  	}, cooldownTimer); 
		  	
	    }).catch(err => {
	        console.error('Error: ', err);
	        this.setState({
				error: true,
				timeout:false
			});
	    });
	}

	/*Changes language of the element, uses LanguageButton.js*/
	changeLanguage(e) {
		const lang = e.target.value;
		if (lang !== undefined && possibleLanguages.indexOf(lang !== -1)) {
			cookie.save("lang", lang, {path: "/padletrest",expires: new Date(new Date().getTime() +1000*60*60*24*365), sameSite: "strict"});
			this.setState({language: lang});
		}
	}
}

/*Compares Ids from the list of IDs the user has in his cookies vs the list of IDs we just got
from posts in the padlet, returns an array with the variation [numberOfPostsAdded, numberOfPostsRemoved]*/
function comparePostAmounts(idsBefore, idsAfter) {
		let newPostsAdded = 0, oldPostsEliminated = 0;

	    for (let newId of idsAfter) {
	  		if (idsBefore.indexOf(newId) === -1) { newPostsAdded++; }
	    }

	    for (let oldId of idsBefore) {
	    	if (idsAfter.indexOf(oldId) === -1) { oldPostsEliminated++;}
	    }

	  	return [newPostsAdded, oldPostsEliminated];
}


export default PostChecker;
