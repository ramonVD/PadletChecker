This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Padlet Checker

React Component that Checks for posts added or removed in a public padlet. If there is moderation, it won't see
a post until it has been accepted by a moderator.

It basically lets you make API calls to a Padlet of your choosing to get the existant post IDs. Then it stores
those in a cookie. Afterwards it just keeps comparing and updating the IDs in your cookies with those when you 
make the API call again, and tells you how many were added/removed.

It also shows the message titles, dates and text that you got from the API.

### Setting it up

It's a standard node project, just install node, download the project files then run npm install on the download directory
to download and install the node_modules files. Then it uses the standard create react app scripts to run such as npm start.

Needs to set up an .env file with REACT_APP_APIKEY and REACT_APP_PADLETURL.

The api rules are here: https://padlet.readme.io/docs/post-object

REACT_APP_PADLETURL is simply the url of your Padlet. There is an .env.example file.

Also, there's a file in /public called dummyJSON.json which contains an example of the data structure you'll get from the API.

### Uses

I made this to check on a personal padlet since, unless I'm mistaken, I only get notifications when that Padlets' page is open,
and it is sometimes difficult to know if there's a new post or even where it is, since it can be positioned anywhere on the wall.

The API also sends more data and you could do way more stuff than I do with the data you get, just check the json structure.

### Limitations

Secret, private and passworded Padlets dont show their data via the API. Also, non approved posts (if you allow moderation on your Padlet) 
don't show up either in the list of posts, which limits a lot the scope of this app. 

Basically, it works okay only if you have a public, non moderated Padlet, which is a pretty narrow limitation.

### In closing

Even if it doesn't have that many uses or isn't that well written, I still had fun making it and maybe somebody can use it, so I hope you like it.


