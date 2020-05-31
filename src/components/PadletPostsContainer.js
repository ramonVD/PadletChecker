import React from "react";
import "../styles/PadletPostsContainer.css";

/*Component that creates a container with rows and columns of posts that contain some data from Padlet's message API,
changes the amount of columns on the fly depending on window width*/

class PadletPostsContainer extends React.PureComponent {

	render() {
		const postsData = this.props.postsData;
		const phrases = this.props.phrases;
		if (postsData === null || postsData === undefined) { return <div></div>;}
		let postsJSX = [];
		let post, postClasses, dateTextClasses,statusWord;
		for (let j = 0; j < postsData.length; j++) {
			post = postsData[j];
			statusWord = "";
			postClasses = " bg-light";
			dateTextClasses = " text-primary";
			if (post.hasOwnProperty("status")) { //So far only "NEW" posts get special status
				if (post.status === "new") {  postClasses=" border-success"; statusWord= phrases[1];}
			}
			postsJSX.push( <div className="col-3 mainPostsCol"  key={post.subject+j}>
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
		}
		let finalJSX = <div className="row justify-content-center" key={"postMsgCont"}>{postsJSX}</div>;
		//Should never come up, button to open the collapsible is inactive when no messages are found
		if (postsJSX.length === 0) { finalJSX = <p key="lonelyboy">{phrases[2]}</p>;}

		return ( <div className="container-fluid">
					<div className="row justify-content-center">
						<div className="collapse container-fluid" id="collapsePosts">
						<div className="postListTitle" id="zoomToFirstPost">
							<h3 className="d-inline messageListTitle">{phrases[0]}</h3>&nbsp;&nbsp;
							<button className="btn btn-secondary btn-sm btnGoUp d-inline" 
							onClick={() => {
									setTimeout( () => {var elmnt = document.getElementById("topContainer");
									elmnt.scrollIntoView();},100);}}>
									{phrases[3]+ "⠀⠀"}<i className="arrowUp"></i></button>
						</div>
						{finalJSX}
						</div>
					</div>					
				</div>);
	}

}


export default PadletPostsContainer;