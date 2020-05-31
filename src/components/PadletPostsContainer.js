import React from "react";
import "../styles/PadletPostsContainer.css";

/*Component that creates a container with rows and columns of posts that contain some data from Padlet's message API,
changes the amount of columns on the fly depending on window width*/

const MAX_POST_WIDTH = 260;


class PadletPostsContainer extends React.PureComponent {

	  componentDidMount() {
	  	//So it can check window.innerwidth again so it can lay the correct amount of columns for the posts
	  	this.forceMyUpdate = this.forceMyUpdate.bind(this);
	    window.addEventListener('resize', this.forceMyUpdate);
	  }

	  componentWillUnmount() {
		window.removeEventListener("resize", this.forceMyUpdate);
	  }

	render() {
		const pageWidth = window.innerWidth;
		const columnsPerRow = Math.floor(pageWidth / MAX_POST_WIDTH);
		const postsData = this.props.postsData;
		const phrases = this.props.phrases;
		if (postsData === null || postsData === undefined) { return <div></div>;}
		let postsJSX = [];
		let rowsJSX = [];
		let columnCounter = 0;
		let post, postClasses, dateTextClasses,statusWord;
		for (let j = 0; j < postsData.length; j++) {
			post = postsData[j];
			statusWord = "";
			postClasses = " bg-light";
			dateTextClasses = " text-primary";
			if (post.hasOwnProperty("status")) { //So far only "NEW" posts get special status
				if (post.status === "new") {  postClasses=" border-success"; statusWord= phrases[1];}
			}
			postsJSX.push( <div className="col mainPostsCol"  key={post.subject+columnCounter}>
				<div className={"card mb-3 text-center mainPost" + postClasses}>
			  		<div className={"card-header greyerbg" }>
			  			<div className="statusWord text-success">{statusWord}</div>
			  			<b>{post.subject}</b>
			 		 </div>
			  		<div className="card-body">
			  			<p className={"text-center dateInPost" + dateTextClasses}>{new Date(parseInt(Date.parse(post.created_at))).toLocaleString()}</p>
			    		<p className="card-text">{post.body}</p>
			  		</div>
				</div>
			</div>);
			columnCounter++;
			if (columnCounter >= columnsPerRow || j === postsData.length - 1) {
				rowsJSX.push(postsJSX);
				postsJSX = [];
				columnCounter = 0;
			}
		}
		let finalJSX = [];
		//Should never come up, button to open the collapsible is inactive when no messages are found
		if (rowsJSX.length === 0) { finalJSX = [<p key="lonelyboy">{phrases[2]}</p>];}
		else {
			for (let i = 0; i < rowsJSX.length; i++) {
				finalJSX.push(<div className="row" key={"postMsg"+i}>{rowsJSX[i]}</div>);
			}
		}

		return ( <div className="container-fluid">
					<div className="row justify-content-center">
						<div className="collapse container-fluid" id="collapsePosts">
						<div className="postListTitle">
							<h3 className="d-inline messageListTitle">{phrases[0]}</h3>&nbsp;&nbsp;
							<button className="btn btn-light btn-sm btnGoUp d-inline" 
							onClick={() => {
									setTimeout( () => {var elmnt = document.getElementById("topContainer");
									elmnt.scrollIntoView();},200);}}>
									{phrases[3]+ "⠀⠀"}<i className="arrowUp"></i></button>
						</div>
						{finalJSX.length > 0 && finalJSX}
						</div>
					</div>					
				</div>);
	}

	//Not anonymous so I can remove the function handler on unmount
	forceMyUpdate() {
		this.forceUpdate();
	}


}


export default PadletPostsContainer;