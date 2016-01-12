var inputData = [{result: 1, title: "Song 1", artist: "Artist 1"},
	{result: 2, title: "Song 2", artist: "Artist 2"},
	{result: 3, title: "Song 3", artist: "Artist 3"},
	{result: 4, title: "Song 4", artist: "Artist 4"}];

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

//LNYMSC userid = 29864265

var library = []
var responseList = []
SC.initialize({
	client_id: '96089e67110795b69a95705f38952d8f',
	redirect_uri: 'http://sclibrary.testing.com:3000/callback.html',
});

var buildLibrary = function(next_href) {
	console.log("Called");
	$.get(next_href).then(function(response) {
		console.log("poop");
		responseList.push(response.collection);
		if (response.next_href) {
			buildLibrary(response.next_href);
		} 
		else combineLists();
	});
}

var combineLists = function() {
	for (var i = 0; i < responseList.length; i++) {
		library = library.concat(responseList[i])
	}
	console.log(library);
	localStorage["library"] = JSON.stringify(library);
	ReactDOM.render(
	  <SongList data={library}/>,
	  document.getElementById('main')
	);		
}


var getMostRecentTracks = function() {
	console.log("Getting most recent tracks");
	SC.get('/users/29864265/favorites', {limit: 25, linked_partitioning: 1}).then(function(response) {
			compareForNewTracks(response);
		});	
}

var compareForNewTracks = function(response) {
	console.log("Comparing newest tracks");
	console.log(response.collection);
	var j = 0;
	// Could fuck shit uuuuupppp so don't run this yet.
	
	// for (var i = 0; i < response.collection.length; i++) {
	// 	if (response.collection[j].id == library[i].id) {
	// 		console.log("Same");
	// 	} else {
	// 		library.unshift(response.collection.shift);
	// 		j++;
	// 	}
	// }


}
//Kick off the site.
$(document).ready(function() {
		if (localStorage.getItem("library") == null) {
			//Basically if it's a new user that hasn't used the site and doesn't have their library saved.
			console.log("Starting library load.");
			SC.get('/users/29864265/favorites', {limit: 200, linked_partitioning: 1}).then(function(response) {
					responseList.push(response.collection);
					buildLibrary(response.next_href);
					console.log(response);			
					// ReactDOM.render(
					//   <SongList data={response.collection}/>,
					//   document.getElementById('main')
					// );			
				});	
		} else {
			console.log("Loading from local storage.");
			getMostRecentTracks();
			library = JSON.parse(localStorage["library"]);
			ReactDOM.render(
			  <SongList data={library}/>,
			  document.getElementById('main')
			);	
		}	
	}
);




