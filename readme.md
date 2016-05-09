#[CloudLibr.io](http://cloudlibr.io)
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
