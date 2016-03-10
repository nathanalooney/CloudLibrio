// var LibraryBox = React.createClass({
//   render: function() {
//     return (
//       <div>
//         <h1> SCLibrary </h1>
//         <SongList data={this.props.data}/>
//       </div>
//     );
//   }
// });

// var PlayButton = React.createClass({
// 	playSong: function() {
// 		var id = this.props.id
// 		console.log("/tracks/"+id);
// 		SC.stream("/tracks/"+id).then(function(player) {
// 			console.log(player);
// 			player.play();
// 		}).catch(function(error) {
// 				console.log(error);
// 			});
// 	},
// 	render: function() {
// 		return (
// 			<p onClick={this.playSong}>
// 				PLAY
// 			</p>
// 			);
// 	}
// });

// var Song = React.createClass({
// 	render: function() {
// 		return (
// 			<div>
// 				<h3> {this.props.artist} </h3>
// 				<p> {this.props.title} </p>
// 				<PlayButton id={this.props.id}></PlayButton>
// 			</div>
// 		);
// 	}
// });

// var SongList = React.createClass({
//     render: function() {
//       var songNodes = this.props.data.map(function(song) {
//         return (
//           <Song artist={song.user.username} title={song.title} id={song.id}>
//           </Song>
//         );
//       });

//       return (
//         <div className="songList">
//           {songNodes}
//         </div>
//       );
//     }
// });



var renderLibrary = function(libraryToRender) {
	// ReactDOM.render(
	//   <SongList data={visibleLibrary}/>,
	//   document.getElementById('main')
	// );
	$('#main').empty();
	libraryToRender.forEach(function(song) {
		var container = document.createElement('div');
		$(container).attr('song_id', song.id);
		var title = document.createElement('p');
		var artist = document.createElement('h1');
		var play = document.createElement('p');
		$(play).text('Play');
		$(play).click(function() {
			// $.get(song.stream_url+'?client_id=96089e67110795b69a95705f38952d8f', function(response) {

			// });

			if (currentSong) currentSong.pause();
			currentSong = new Audio(song.stream_url+'?client_id=96089e67110795b69a95705f38952d8f');
			currentSong.play();
			$('#player').empty();
			$('#player').append(song.user.username + ' : '+song.title);
		});
		$(artist).text(song.user.username);
		$(title).text(song.title);
		$(container).append(artist);
		$(container).append(title);
		$(container).append(play);

		$('#main').append(container);
	});
}

//----------------------------------------------------------------------------------------------------//


var fullLibrary = [];
var visibleLibrary = [];
var responseList = [];
var searchTimer = null;
var currentSong = null;

var loadLibrary = function() {
	var client_id = 'client_id=96089e67110795b69a95705f38952d8f'
	$('#main').html('<p> Loading ... </p>');
	$.get('http://api.soundcloud.com/users/29864265/favorites?'+client_id+'&limit=200&linked_partitioning=1', function(response) {
			console.log(response.collection);
			responseList.push(response.collection);
			buildLibrary(response.next_href);	
		});		
}

//Recursive function to sequentially get list of songs in library.
var buildLibrary = function(next_href) {
	$.get(next_href).then(function(response) {
		console.log("Still loading...");
		responseList.push(response.collection);
		if (response.next_href) {
			buildLibrary(response.next_href);
		} 
		else combineLists();
	});
}

//After each batch is loaded, goes through and combines them into one library.
var combineLists = function() {
	for (var i = 0; i < responseList.length; i++) {
		fullLibrary = fullLibrary.concat(responseList[i])
	}
	for (var i = 0; i < fullLibrary.length; i++) {
		fullLibrary[i].sclibrary_id = i;
	}
	localStorage.setItem("fullLibrary", JSON.stringify(fullLibrary));
	$('#main').empty();
	visibleLibrary = fullLibrary;
	renderLibrary(visibleLibrary);	
}

var addNewFavorites = function() {
	SC.get('/users/29864265/favorites', {limit: 50, linked_partitioning: 1}).then(function(response) {
		var responseLength = response.collection.length;
		var recentSongs = [];
		for (var i = 0; i < 25; i++) {
			recentSongs.push(fullLibrary[i].title);
		}
		for (var i = 0; i < responseLength; i++) {
			if (recentSongs.indexOf(response.collection[i].title) > -1) {
				localStorage["fullLibrary"] = JSON.stringify(fullLibrary);
				visibleLibrary = fullLibrary;
				renderLibrary(visibleLibrary);
				return;
			} 
			else {
				fullLibrary.unshift(response.collection[i]);
			}
		}
	});	
}

//-------------------------------------------------------------------------------------------------------//
$('#sortTitle').click(function() {
	visibleLibrary.sort(function(a, b) {
		if ($('#sortArtist').attr('sort') == 'ascending') {
			b = [a, a = b][0];
		} 
		if (a.title.replace(/\W/g, '').toLowerCase() < b.title.replace(/\W/g, '').toLowerCase()) {
			return -1;		
		}
		else if (a.title.replace(/\W/g, '').toLowerCase() > b.title.replace(/\W/g, '').toLowerCase()) {
			return 1;
		} 
		else return 0;
	});
	if ($('#sortArtist').attr('sort') == 'descending') {
		$('#sortArtist').attr('sort', 'ascending');
	} else {
		$('#sortArtist').attr('sort', 'descending');
	}
	renderLibrary(visibleLibrary);
});

$('#sortArtist').click(function() {
	visibleLibrary.sort(function(a, b) {
		if ($('#sortArtist').attr('sort') == 'ascending') {
			b = [a, a = b][0];
		} 
		if (a.user.username.replace(/\W/g, '').toLowerCase() < b.user.username.replace(/\W/g, '').toLowerCase()) {
			return -1;		
		}
		else if (a.user.username.replace(/\W/g, '').toLowerCase() > b.user.username.replace(/\W/g, '').toLowerCase()) {
			return 1;
		} 
		else return 0;
	});
	if ($('#sortArtist').attr('sort') == 'descending') {
		$('#sortArtist').attr('sort', 'ascending');
	} else {
		$('#sortArtist').attr('sort', 'descending');
	}
	renderLibrary(visibleLibrary);
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
	renderLibrary(visibleLibrary);
});

$("#remixes").click(function() {
	console.log("Remixes");
	visibleLibrary = [];
	length = fullLibrary.length;
	for (var i = 0; i < length; i++) {
		var title = fullLibrary[i].title.toLowerCase();
		if (title.toLowerCase().indexOf("remix") > -1 ||
				title.toLowerCase().indexOf("edit") > -1 ||
				title.toLowerCase().indexOf("mashup") > -1 || 
				title.toLowerCase().indexOf("flip") > -1 || 
				title.toLowerCase().indexOf("cover") > -1) {
			visibleLibrary.push(fullLibrary[i]);
		}
	}
	renderLibrary(visibleLibrary);
});

$("#date").click(function() {
	visibleLibrary = fullLibrary;
	visibleLibrary.sort(function(a, b) {
		if ($('#sortArtist').attr('sort') == 'ascending') {
			b = [a, a = b][0];
		} 
		if (a.sclibrary_id < b.sclibrary_id) {
			return -1;		
		}
		else if (a.sclibrary_id > b.sclibrary_id) {
			return 1;
		} 
		else return 0;
	});
	if ($('#sortArtist').attr('sort') == 'descending') {
		$('#sortArtist').attr('sort', 'ascending');
	} else {
		$('#sortArtist').attr('sort', 'descending');
	}
	renderLibrary(visibleLibrary);
});


$('#refresh').click(function() {
	localStorage.clear();
	startLibrary();
});

$('#searchbar').keyup(function() {
	clearTimeout(searchTimer);
	searchTimer = setTimeout(function() {
		var term = $('#searchbar').val();
		console.log(term);
		visibleLibrary = [];
		fullLibrary.forEach(function(song) {
			if (song.title.toLowerCase().indexOf(term.toLowerCase()) > -1 || song.user.username.toLowerCase().indexOf(term.toLowerCase()) > -1) visibleLibrary.push(song);
		});
		renderLibrary(visibleLibrary);
	}, 250);

});

//-------------------------------------------------------------------------------------------------------------//

var startLibrary = function() {
	if (localStorage.getItem("fullLibrary") == null) {
		localStorage.clear();
		//Basically if it's a new user that hasn't used the site and doesn't have their library saved.
		console.log("Starting library load.");
		loadLibrary();

	} else {
		console.log("Loading from local storage.");
		fullLibrary = JSON.parse(localStorage["fullLibrary"]);
		addNewFavorites();
		visibleLibrary = fullLibrary;
		renderLibrary(visibleLibrary);	
	}	
}


// client_id: '96089e67110795b69a95705f38952d8f'
// redirect_uri: 'http://sclibrary.testing.com:3000/callback.html'



//Kick off the site.
$(document).ready(function() {

	startLibrary();
});