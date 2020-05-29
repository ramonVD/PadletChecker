This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Padlet Checker

React Component that Checks for posts added or removed in a public padlet. If there is moderation, it won't see
a post until it has been accepted by a moderator.

It basically lets you make API calls to a Padlet of your choosing to get the existant post IDs. Then it stores
those in a cookie. Afterwards it just keeps comparing the IDs in your cookies with those when you make the API
call again.

### Setting it up

Needs to set up an .env file with REACT_APP_PADLETID, REACT_APP_APIKEY and REACT_APP_PADLETURL.

The api rules are here: https://padlet.readme.io/docs/post-object
As it says there, after you get an API key you can find your padlet id executing 

curl -XGET -H 'App-Id: 4705250fa45571490b6e3b55fcd8b08d3377d654c985d7af794b08005c35b892' -H "Content-type: application/json" 'https://padlet.com/api/0.9/public_padlets?username=deepan'

on the command line, using your own API key and username.

REACT_APP_PADLETURL is simply the url of your Padlet. There is an .env.example file.

Also, there's a file in /public called dummyJSON which contains the data structure you'll get from the API.

### Uses

I made this to check on a personal padlet since, unless I'm mistaken, I only get notifications when the Padlet is open,
and also sometimes it is difficult to know if there's a new post since it can be positioned anywhere on the wall.

### Limitations

Secret, private and passworded Padlets dont show the data to the API. Also, non approved posts (if you allow moderation on your Padlet) 
also don't show up in the list of posts, which limits a lot the scope of this app. 

Basically, it works okay only if you have a public, non moderated Padlet, which is a pretty narrow limitation.

### In closing

Even if it doesn't have that many uses or isn't that well written, I still had fun making it and maybe somebody can use it, so I hope you like it.


