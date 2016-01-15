var LibraryBox = React.createClass({
  render: function() {
    return (
      <div>
        <h1> SCLibrary </h1>
        <SongList data={this.props.data}/>
      </div>
    );
  }
});

var Song = React.createClass({
	render: function() {
		return (
			<div>
				<h3> {this.props.artist} </h3>
				<p> {this.props.title} </p>
			</div>
		);
	}
});

var SongList = React.createClass({
    render: function() {

      var songNodes = this.props.data.map(function(song) {
        return (
          <Song artist={song.user.username} title={song.title}>
          </Song>
        );
      });

      return (
        <div className="songList">
          {songNodes}
        </div>
      );
    }
})

var fullLibrary = [];
var visibleLibrary = [];
var responseList = [];

var buildLibrary = function(next_href) {
	console.log("Building");
	$.get(next_href).then(function(response) {
		responseList.push(response.collection);
		if (response.next_href) {
			buildLibrary(response.next_href);
		} 
		else combineLists();
	});
}

var combineLists = function() {
	console.log("combiningLists");
	for (var i = 0; i < responseList.length; i++) {
		fullLibrary = fullLibrary.concat(responseList[i])
		console.log(responseList[i]);
	}
	console.log("Saving library...");
	localStorage.setItem("fullLibrary", JSON.stringify(fullLibrary));
	console.log("emptying main..")
	$('#main').empty();
	visibleLibrary = fullLibrary;
	console.log("rendering library..");
	renderLibrary();	
}

var renderLibrary = function() {
	console.log(visibleLibrary.length);
	ReactDOM.render(
	  <SongList data={visibleLibrary}/>,
	  document.getElementById('main')
	);	
}

$('#sortTitle').click(function() {
	visibleLibrary.sort(function(a, b) {
		if (a.title.replace(/\W/g, '').toLowerCase() < b.title.replace(/\W/g, '').toLowerCase()) {
			return -1;		
		}
		else if (a.title.replace(/\W/g, '').toLowerCase() > b.title.replace(/\W/g, '').toLowerCase()) {
			return 1;
		} 
		else return 0;
	});
	renderLibrary();
});

$('#sortArtist').click(function() {
	visibleLibrary.sort(function(a, b) {
		if (a.user.username.replace(/\W/g, '').toLowerCase() < b.user.username.replace(/\W/g, '').toLowerCase()) {
			return -1;		
		}
		else if (a.user.username.replace(/\W/g, '').toLowerCase() > b.user.username.replace(/\W/g, '').toLowerCase()) {
			return 1;
		} 
		else return 0;
	});
	renderLibrary();
});

$("#shuffle").click(function() {
	console.log("Shuffle");
	var currentIndex = visibleLibrary.length, temporaryValue, randomIndex;

	while(currentIndex !== 0) {
		randomIndex = Math.floor(Math.random()*currentIndex);
		currentIndex -= 1;

		temporaryValue = visibleLibrary[currentIndex];
		visibleLibrary[currentIndex] = visibleLibrary[randomIndex];
		visibleLibrary[randomIndex] = temporaryValue;
	}
	renderLibrary();
});

$("#remixes").click(function() {
	console.log("Remixes");
	visibleLibrary = [];
	length = fullLibrary.length;
	for (var i = 0; i < length; i++) {
		var title = fullLibrary[i].title.toLowerCase();
		if (title.indexOf("remix") > 0 || title.indexOf("edit") > 0 || title.indexOf("mashup") > 0 || title.indexOf("flip") > 0 || title.indexOf("cover") > 0) {
			visibleLibrary.push(fullLibrary[i]);
		}
	}
	console.log(visibleLibrary.length)
	renderLibrary();
});

//Kick off the site.
$(document).ready(function() {
	SC.initialize({
		client_id: '96089e67110795b69a95705f38952d8f',
		redirect_uri: 'http://sclibrary.testing.com:3000/callback.html',
	});
	if (localStorage.getItem("fullLibrary") == null) {
		localStorage.clear();
		//Basically if it's a new user that hasn't used the site and doesn't have their library saved.
		console.log("Starting library load.");
		$('#main').html('<p> Loading ... </p>');
		SC.get('/users/29864265/favorites', {limit: 200, linked_partitioning: 1}).then(function(response) {
				responseList.push(response.collection);
				buildLibrary(response.next_href);	
			});	
	} else {
		console.log("Loading from local storage.");
		fullLibrary = JSON.parse(localStorage["fullLibrary"]);
		visibleLibrary = fullLibrary;
		renderLibrary();	
	}	
});