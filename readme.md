#[CloudLibr.io](http://cloudlibr.io/bigwild.html)
![alt tag](/readme_image.png)
**Lightweight application built using React.js which turns your SoundCloud Likes Playlist into a fully navigable, searchable, sortable, and randomizable music library.**

##Motivation
CloudLibrio is a small project that began when I decided it was too much effort to sort through my 2,000+ song Likes playlist on SoundCloud just to find music I was listening to not even a year ago. I initially began designing it using pure HTML/CSS/Javascript while bored and over the course of a few weeks built a website that's fairly close in functioning to how it appears today. 

After losing interest for awhile, I decided that I wanted to learn React.js, and resurrected this project as a way to do so. I began reimplementing the rendering of the library using React components, and eventually ported a majority of the project. It was only halfway through this implementation that I realized I didn't design the site with React's concepts of state and unidirectional data flow in mind, and as such I realized I should have started from scratch in order to do so.

As such, my personal opinion of this project is that it was a learning experience, and a labor of love. While looking back some of this code is, in my opinion, hackish in an attempt to circumvent barriers I placed in my own way by not fully understanding React's way of doing things, I'm proud of what I was able to produce.

##How It Works

[Here is a short youtube video displaying the website in action.](https://www.youtube.com/watch?v=xakspFctrKQ)

CloudLibr.io works by first loading all metadata for available songs from a user's Likes Playlist into memory. From there, the full likes library is displayed in order by most recently added. A list of the features that CloudLibr.io provides are:

**Sorting by:**
- Date Added
- Artist Name
- Song Title
- Play Count

**Filter by:**
- Originals
- Remixes

**Search:**
- Search through all song titles and artist names to filter out results.

**Shuffle:**
- Fully randomize your library's ordering after filters and search terms have been applied.

 **Export**
- Export your entire music library to CSV format.

##Reception
After sending my website to some close friends for refinement, I decided to post the website on reddit's r/electronicmusic subreddit in order to gauge reaction and to get input on how to better improve the project. [The post I made can be found here](https://www.reddit.com/r/electronicmusic/comments/4hsjss/hey_guys_i_built_a_website_that_takes_all_your/). I did not anticipate the positive reaction that the website would have, staying as the number one post in the subreddit for almost 2 days, becoming the #81 post within the community of all time. 

My reddit post led to hundreds of positive responses, and numerous individuals contacted me in support of the website, with questions about my implementation, and offers to collaborate on future projects. [A collection of the responses I received in support of the website can be found here](http://imgur.com/a/6T0DM). The website also became the subject of posts made by some very popular electronic music websites such as YourEDM, [which called it "The SoundCloud Update that Should Have Been Made Years Ago"](http://www.youredm.com/2016/05/04/redditor-turns-soundcloud-virtual-itunes-library/). By the time it came to light that this use of SoundCloud's API violated their terms of service two days after launch, the website had gained over 15,000 users.

##Project
All of the core code for the project resides within the public/ directory within the project. Player.js encapsulates the entirety of the websites functionality, with index.html representing the basic structure of the app. Within index.html is a minified version of style.css. The top level holds a small express server in server.js used for testing purposes. The top level of the project also holds a deploy.sh script which compiles player.js using Babel, minifies the resulting javascript, appends it directly to index.html, and pushes the single html file to Amazon S3. This design choice to compile the entirety of the app into a single page was made largely for the fun of it and to minimize hosting costs.
