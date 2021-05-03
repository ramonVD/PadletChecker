import React from 'react';
import cookie from 'react-cookies';
import LanguageButton from "./LanguageButton";
import {possibleLanguages, getWord} from "./UIWords";
import PadletPostsContainer from "./PadletPostsContainer";

require('dotenv').config();

/*Component that Checks for posts added or removed in a public padlet. If there is moderation, it won't see
a post until it has been accepted by a moderator.*/
/*It basically makes a call to Padlet's API to check the ids of the existent posts in your Padlet (and more, like 
their title... although I don't do anything with that data) and saves them to a cookie. Then you can keep 
making API calls afterwards and it'll compare the new posts with what is stored in your cookie.
It keeps telling you the difference when the amount of posts changes, just the amount
that were added or eliminated. Needs a padlet id and an API key to make the calls, which should be setup in 
an .env file. Added support for language changing on the fly. The possible languages and words for every 
language are in UIWords.js*/

const API_CALL_MINIMUM_WAIT_MS = 3000;

const cookiesPath = "/padletrest";

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
		      postsData: [],
		      error: false,
		      showingPostList:false,
		      language: startingLang
		};	
	   	this.requestAndUpdatePosts = this.requestAndUpdatePosts.bind(this);
	   	this.changeLanguage = this.changeLanguage.bind(this);
	}
	
	componentDidMount() {
		//Get the padlet data from the API first thing...
		this.requestAndUpdatePosts();
	}

	componentWillUnmount() { 	
		clearInterval(this.cooldownTimer);
	}

	render() {
		const lastAmountChanged = this.state.lastAmountChanged;
		const checkedIds = this.state.checkedIds;
		const language = this.state.language;
		const timeout = this.state.timeout;
		const postsData = this.state.postsData;
		const showingPostList = this.state.showingPostList;

		let msgsData;
		//Loading animation, havent gotten the data from padlet yet
		if (checkedIds === undefined || timeout) {
			msgsData = <h4 className="card-title centralText"><div className="loader">{getWord(language,0)}</div></h4>;
		} else {
			if (lastAmountChanged[0] === -2) { //error
			} else if (lastAmountChanged[0] <= -1) { //first time visiting site
				msgsData = <h4 className="card-title centralText">{getWord(language,1)}</h4>;
			} else if (lastAmountChanged[0] === 0 && lastAmountChanged[1] === 0) { //equal messages amount
				msgsData = <h4 className="card-title centralText">{getWord(language,5)}</h4>;
			} else { //difference in messages amount
				msgsData= <h4 className="card-title centralText">
						<span className="text-danger">{getWord(language,2)}</span>
						<span>{lastAmountChanged[0] + getWord(language,3) + lastAmountChanged[1] + getWord(language,4)}</span></h4>; 

			}
		}
		if (this.state.error) {
			msgsData = <h4 className="card-title centralText">{getWord(language,6)}</h4>;
		}

		const lastCheck = cookie.load("lastCheck");
		const buttonText = (timeout) ? getWord(language,7) : getWord(language,8);
		const clickMeClass = (timeout) ?  "" : " pressMeButton";
		const invisButton = (postsData.length === 0 ) ? " " : "";
		//Could make this dynamic on window resize but meh
		const bigButton = (window.innerHeight > 600) ? " btn-lg" : "";
		return(
			<div className="container-fluid">
			<div className="container text-center" id="topContainer">
				<div className="row justify-content-end align-items-center">
						<LanguageButton possibleLanguages={possibleLanguages} selectedLang={language} 
						changeLanguage={this.changeLanguage} languageName={getWord(language,11)}/>
				</div>
				<div className="row justify-content-center">
					<div className="card mb-3 mainContainer">
					  	<div className="card-header">
					  		<h4 style={{paddingTop: "10px", paddingBottom: "5px"}}><b>{getWord(language,9)}<a href={process.env.REACT_APP_PADLETURL} 
					  		rel="noopener noreferrer" target="_blank">Padlet?</a></b></h4>

					 	</div>
					  	<div className="card-body minHeightCard align-items-center">
					    	{msgsData}
					  	</div>
					  	{lastCheck !== undefined && !timeout && <p className="dateSmallFont"><i>{getWord(language,10) +
					  		new Date(parseInt(lastCheck)).toLocaleString()}</i></p>}
					  	<div className="" style={{padding: "0"}}>
					  		<button className={"btn btn-primary btn-block" + clickMeClass + bigButton} 
						  		onClick={() => {this.requestAndUpdatePosts()}} 
								disabled={timeout}><b>{buttonText}</b>
							</button>
					  		<button className={"btn btn-success btn-block colListButton" + invisButton + bigButton} data-toggle="collapse" 
							href="#collapsePosts" aria-expanded="false" aria-controls="collapsePosts" id="collapsePostsButton"
							onClick={() => {
									setTimeout( () => {
										if (!showingPostList) {
											document.getElementById("zoomToFirstPost").scrollIntoView();
										} 
									},200);
								this.setState({showingPostList: !showingPostList});}} disabled={postsData.length === 0}>
								{getWord(language,12)}
							</button>
								</div>
					</div>
				</div>	
			</div>
					<PadletPostsContainer postsData={postsData} phrases={[getWord(language,13),getWord(language,14),
								getWord(language,15), getWord(language,16)]}  />

			</div>);
	}

	/*Requests a json of posts inside a Padlet via the Padlet API, then updates the state with a list of their Ids*/
	requestAndUpdatePosts() { 
		if (this.state.timeout) { return; }
		this.setState({timeout: true});

		/*Couldnt get this to work without a cors proxy (allow origin missing from head apparently), but I've seen
		someone using py.requests and it working fine so maybe I'm doing something wrong*/
		const proxyUrl = process.env.REACT_APP_APIURL;

		const targetUrl = process.env.REACT_APP_PADLETUSER + "/" + process.env.REACT_APP_PADLETID;

		const timeBeforeCheck = Date.now();
		fetch(proxyUrl+targetUrl, {
			mode: 'cors',
			headers: {
	    		"Content-Type": "application/json",
	    		Accept: "*/*"
	  			}
		    })
	    .then((res) => {
	    	console.log(res)
	    	return res.json();})
	    .then( (msgsData) => {
	    	let newIdArray = [];
	    	let titleBodyArray = [];
	    	 for (let post of msgsData.data) {    
	    	 	if (post.hasOwnProperty("id")) {
		  			newIdArray.push(post.id);
		  			//from https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
		  			const unformatBody = (post.body === undefined) ? "" : post["body"].replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "");
		  			titleBodyArray.push({"id": post.id, 
		  				"subject": post.subject, 
		  				"body": unformatBody, 
		  				"created_at": post.created_at});
		  		}
		  	}
		  	const timeWhenCheck = Date.now();
		  	const msDiff = timeWhenCheck - timeBeforeCheck;

		  	//Effectively sets a minimum wait time... dont wanna let users spam the API with calls
		  	const cooldownTimer = (msDiff < API_CALL_MINIMUM_WAIT_MS) ? (API_CALL_MINIMUM_WAIT_MS-msDiff) : 0;

		  	this.cooldownTimer = setTimeout( () => { 
		  		const lastSeenIds = cookie.load("seenIds");
				let lastMsgArray;

				/*Checks for the Ids of the posts the user has seen in the cookies vs the ones you get right now via API*/
				//If First time visitor of the site, save a cookie with the msg ids we got from padlet
				if (lastSeenIds === undefined) {
					lastMsgArray =[-1,0];
					cookie.save("seenIds", newIdArray, {path: cookiesPath, expires: new Date(new Date().getTime() +1000*60*60*24*365), sameSite: true});
				} else {
					const diffArray = comparePostAmountsAndUpdateNewPosts(lastSeenIds, newIdArray, titleBodyArray);
					//If there are differences between old and new msg ids, write them to user and overwrite the cookie with new ids
					if (diffArray[0] !== 0 || diffArray[1] !== 0) { 
					cookie.save("seenIds", newIdArray, {path: cookiesPath, expires: new Date(new Date().getTime() +1000*60*60*24*365), sameSite: true});
					lastMsgArray = [diffArray[0], diffArray[1]];
					} else {
						//There are no differences with old data from padlet
						lastMsgArray = [0,0];
					}
				}

				//Update last time we checked with Padlet, could maybe save in the future for statistics of when users check? Iunno
				cookie.save("lastCheck", new Date().getTime(), {path: cookiesPath, expires: new Date(new Date().getTime() +1000*60*60*24*365), sameSite: "strict"});

		  		this.setState({checkedIds: newIdArray, timeout: false, lastAmountChanged: lastMsgArray, postsData: titleBodyArray});
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
			cookie.save("lang", lang, {path: cookiesPath, expires: new Date(new Date().getTime() +1000*60*60*24*365), sameSite: "strict"});
			this.setState({language: lang});
		}
	}
}

/*Compares Ids from the list of IDs the user has in his cookies vs the list of IDs we just got
from posts in the padlet, returns an array with the variation [numberOfPostsAdded, numberOfPostsRemoved].
At the risk of overcrowding the function, it also updates the postlist so new or eliminated posts can
be shown with different colors or w/e. This is a hastily modified, terrible function*/
function comparePostAmountsAndUpdateNewPosts(idsBefore, idsAfter, elementsToUpdate) {
		let newPostsAdded = 0, oldPostsEliminated = 0;

	    for (let oldId of idsBefore) {
	    	if (idsAfter.indexOf(oldId) === -1) { 
	    		oldPostsEliminated++;
	    	}
	    }

	    for (let newId of idsAfter) {
	  		if (idsBefore.indexOf(newId) === -1) { 
	  			newPostsAdded++;
	  			/*New posts get to go first in the array which translates to a first position
	  			in the shown list*/
	  			for (let i = 0; i < elementsToUpdate.length; i++) {
	  				if (elementsToUpdate[i].id === newId) { 
	  					elementsToUpdate[i].status = "new";
	  					let tmpElement = elementsToUpdate[i];
	  					elementsToUpdate.splice(i,1);
	  					elementsToUpdate.unshift(tmpElement);
	  				}
	  			}
	  		}
	    }

	  	return [newPostsAdded, oldPostsEliminated];
}

export default PostChecker;