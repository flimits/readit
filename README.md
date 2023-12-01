# readit
The only blog that you'll need to talk, chat, share

## MVP

This is going to be a Bogging application
Posts
Likes/dislikes
Logins

### As a user: I want to ...
* login/sign up
  * if you are not logged in, we can look around the front of th page. Perhaps see one or two posts
* Go to home site
* Set a like or don't like on a post
* Search posts
  * popularity
  * topic
* read all posts/threads
* ! edit someone elses posts
* be able to edit own posts
  * could have someone share with a friend/other user so that it shows
* I want a friends feature.
  * I'd like to be able to share posts with others?
  * Add them
  * see them
  * share with them
* We want to do the following with posts
  * I want to be able to react to someone's post
  * I want to comment on a post
* I want to see the most popular post (something that is viewed and commented on)
  * regardless of up or down votes
* Up vote, like, use smileys, etc .... apply this to the articles you have a thought on or just want a simple vote
  * a way to up or down vote or
  * use a icons

Notification?
---
  * You see new posts notifications
  * see reactions to a post you made
    * can click on it and view  the article


Sharing...
---
Have people that we want to share with (or friends).
Send them a URL
  - able to write the link to the article url or id to the user and have it write it into the database
  - 

Search
---
How to do this?
Tags in the post (cars, politics, food, cats, pets, etc)
Categorizing posts

What am I going to see?
---
User icon
Notifications
Posts (mine and others)

Requirements
* Use React
* Mongoose (Mongo)
* graphQL

### Models (for whatever db we use)
  * User
    * id (gets created for us)
    * Name
    * Username
    * email address
    * password
    * Friends []
    * posts [postids] // (remember the thoughts ... populate method with this one)

  * Posts
    * id
    * title
    * userid
    * post_text
    * reactions [upvote = 0, downvote=0] (one click possible:toggle only one or other)
    * comments [{
        userid:
        text:
        reactions: 
        }]

  * Reactions
    * id
    * post [ user, postid, reaction]

  * Notifications
    * id
    * username []


Things todo:
Session id?
How do we actually enable reactions for a logged in user?

Create a dashboard

## Things we'd like
* to be able to actually chat with someone online
* Need to have user and admin permissions
* 


Reactions
If a user clicks on it, it will only toggle either on or off.
Click once, it ups the number.
Click on it again, it will take it a way.
If a user clicks on one or the other, it will increment one and decrement the other.

Handler/Event listenter for reaction to a post
```js
if (!upvote && ! downvote){
    if (integer has value){
        decrement
    } else {
        Increment
    }
}
```

If (user clicks again on the same upvote)
counter button that shows up, be able to click on it. It will either increment or decrement a count number in the database.






