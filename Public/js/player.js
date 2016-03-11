(function() {


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



var renderLibrary = function(displayList, filterOnly) {
	// ReactDOM.render(
	//   <SongList data={fullLibrary}/>,
	//   document.getElementById('main')
	// );
	$('#main').empty();
	if (!filterOnly) displayList = sortLibrary(displayList);	
	sortedFullLibrary = displayList;
	displayList = filterLibrary(displayList);

	displayList.forEach(function(song) {
		var container = document.createElement('div');
		$(container).attr('song_id', song.id).addClass('song-container');
		var title = document.createElement('p');
		$(title).addClass('song-title');
		var artist = document.createElement('h3');
		$(artist).addClass('song-artist')
		var play = $('<span class="glyphicon glyphicon-play-circle" aria-hidden="true" style="font-size: 4em;"></span>')
		play.click(function() {
			if (currentSong) currentSong.pause();
			currentSong = new Audio(song.stream_url+'?client_id=96089e67110795b69a95705f38952d8f');
			currentSong.play();
			$('#player').empty();
			$('#player').append(song.user.username + ' : '+song.title);
		});
		$(artist).text(song.user.username);
		$(title).text(song.title);
		$(container).append(play);		
		$(container).append(artist);
		$(container).append(title);
		$(container).append($('<p> Favorites: '+song.favoritings_count+' </p>').addClass('song-favorites'));
		$(container).append($('<p> Plays: '+song.playback_count+'</p>').addClass('song-plays'));


		$('#main').append(container);
	});

}

var filterLibrary = function(library) {
	var returnLibrary = [];
	library.forEach(function(song) {
		var isRemix = false;
		var title = song.title.toLowerCase();
		if (title.indexOf("remix") > -1 ||
				title.indexOf("edit") > -1 ||
				title.indexOf("mashup") > -1 || 
				title.indexOf("flip") > -1 || 
				title.indexOf("cover") > -1 ||
				title.indexOf("bootleg") > -1 ||
				title.indexOf('redo') > -1) {
			isRemix = true;
		} 		
		if ($('#remixes').is(':checked') && isRemix == true) returnLibrary.push(song);
		if ($('#originals').is(':checked') && isRemix == false) returnLibrary.push(song); 
	});
	return returnLibrary;
}

var sortLibrary = function(library) {
	switch(librarySort) {
		case 0:
			library.sort(sortTitle);
			break;
		case 1:
			library.sort(sortArtist);
			break;
		case 2:
			library.sort(sortDate);
			break;
		case 3:
			library.sort(sortFavorites);
			break;
		case 4:
			library.sort(sortPlays);
			break;
		case 5:
			library = shuffle(library);
			break;
	}
	return library;
}

var sortTitle = function(a, b) {
	if ($('#sort-title').attr('sort') == 'ascending') {
		b = [a, a = b][0];
	} 
	if (a.title.replace(/\W/g, '').toLowerCase() < b.title.replace(/\W/g, '').toLowerCase()) {
		return -1;		
	}
	else if (a.title.replace(/\W/g, '').toLowerCase() > b.title.replace(/\W/g, '').toLowerCase()) {
		return 1;
	} 
	else return 0;
}

var sortArtist = function(a, b) {
	if ($('#sort-artist').attr('sort') == 'ascending') {
		b = [a, a = b][0];
	} 
	if (a.user.username.replace(/\W/g, '').toLowerCase() < b.user.username.replace(/\W/g, '').toLowerCase()) {
		return -1;		
	}
	else if (a.user.username.replace(/\W/g, '').toLowerCase() > b.user.username.replace(/\W/g, '').toLowerCase()) {
		return 1;
	} 
	else return 0;
}

var sortDate = function(a, b) {
		if ($('#sort-date').attr('sort') == 'descending') {
			b = [a, a = b][0];
		} 
		if (a.sclibrary_id < b.sclibrary_id) {
			return -1;		
		}
		else if (a.sclibrary_id > b.sclibrary_id) {
			return 1;
		} 
		else return 0;
	}

var sortFavorites = function(a, b) {
	if ($('#sort-favorites').attr('sort') == 'ascending') {
		b = [a, a = b][0];
	} 
	if (parseInt(a.favoritings_count) < parseInt(b.favoritings_count)) {
		return -1;		
	}
	else if (parseInt(a.favoritings_count) > parseInt(b.favoritings_count)) {
		return 1;
	} 
	else return 0;
}

var sortPlays = function(a, b) {
	if ($('#sort-plays').attr('sort') == 'ascending') {
		b = [a, a = b][0];
	} 
	if (parseInt(a.playback_count) < parseInt(b.playback_count)) {
		return -1;		
	}
	else if (parseInt(a.playback_count) > parseInt(b.playback_count)) {
		return 1;
	} 
	else return 0;
}

var shuffle = function(library) {
	var currentIndex = library.length, temporaryValue, randomIndex;
	while(currentIndex !== 0) {
		randomIndex = Math.floor(Math.random()*currentIndex);
		currentIndex -= 1;

		temporaryValue = library[currentIndex];
		library[currentIndex] = library[randomIndex];
		library[randomIndex] = temporaryValue;
	}
	return library;
}
//----------------------------------------------------------------------------------------------------//


var fullLibrary = [];
var sortedFullLibrary = [];
var responseList = [];
var searchTimer = null;
var currentSong = null;
var librarySort = null;

var loadLibrary = function() {
	var client_id = 'client_id=96089e67110795b69a95705f38952d8f'
	$('#main').html('<p> Loading ... </p>');
	$.get('http://api.soundcloud.com/users/29864265/favorites?'+client_id+'&limit=200&linked_partitioning=1', function(response) {
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
		else {
			console.log('Done');
			combineLists();
		} 
	});
}

//After each batch is loaded, goes through and combines them into one library.
var combineLists = function() {
	console.log('Called combineLists...')
	fullLibrary = [];
	for (var i = 0; i < responseList.length; i++) {
		fullLibrary = fullLibrary.concat(responseList[i])
	}
	for (var i = 0; i < fullLibrary.length; i++) {
		fullLibrary[i].sclibrary_id = i;
	}
	console.log('Setting localstorage..');
	console.log(fullLibrary);
	localStorage.setItem("fullLibrary", JSON.stringify(fullLibrary));
	$('#main').empty();
	fullLibrary = fullLibrary;
	console.log('Calling render...')
	renderLibrary(fullLibrary);	
}

// var addNewFavorites = function() {
// 	SC.get('/users/29864265/favorites', {limit: 50, linked_partitioning: 1}).then(function(response) {
// 		var responseLength = response.collection.length;
// 		var recentSongs = [];
// 		for (var i = 0; i < 25; i++) {
// 			recentSongs.push(fullLibrary[i].title);
// 		}
// 		for (var i = 0; i < responseLength; i++) {
// 			if (recentSongs.indexOf(response.collection[i].title) > -1) {
// 				localStorage.setItem("fullLibrary", JSON.stringify(fullLibrary));
// 				fullLibrary = fullLibrary;
// 				renderLibrary(fullLibrary);
// 				return;
// 			} 
// 			else {
// 				fullLibrary.unshift(response.collection[i]);
// 			}
// 		}
// 	});	
// }

var loadPlaylists = function() {
	var client_id ='96089e67110795b69a95705f38952d8f'
	$.get('http://api.soundcloud.com/users/29864265/playlists?client_id='+client_id, function(response) {
			response.forEach(function(playlist) {
				$('#main').append('<h1>'+playlist.title+'</h1>');
				playlist.tracks.forEach(function(song) {
					$('#main').append('<h3>'+song.user.username+'</h3>');
					$('#main').append('<p>'+song.title+'</p>');					
				});
			})
		});		
}

//-------------------------------------------------------------------------------------------------------//
var toggle = function(button) {
	if ($('#sort-'+button).attr('sort') == 'descending') {
		$('#sort-'+button).attr('sort', 'ascending');
	} else {
		$('#sort-'+button).attr('sort', 'descending');
	}	
}

$('#sort-title').click(function() {
	toggle('title');
	librarySort = 0;
	renderLibrary(fullLibrary);
});

$('#sort-artist').click(function() {
	toggle('artist');
	librarySort = 1;
	renderLibrary(fullLibrary);
});

$("#sort-date").click(function() {
	toggle('date');
	librarySort = 2;
	renderLibrary(fullLibrary);
});

$("#sort-favorites").click(function() {
	toggle('favorites');
	librarySort = 3;
	renderLibrary(fullLibrary);
});

$("#sort-plays").click(function() {
	toggle('plays');
	librarySort = 4;
	renderLibrary(fullLibrary);
});

$("#shuffle").click(function() {
	librarySort = 5;
	renderLibrary(fullLibrary);
});

$("#remixes").change(function() {
	renderLibrary(sortedFullLibrary, true);
});

$("#originals").change(function() {
	renderLibrary(sortedFullLibrary, true);
});

$('#refresh').click(function() {
	loadLibrary();
});

$('#searchbar').keyup(function() {
	clearTimeout(searchTimer);
	searchTimer = setTimeout(function() {
		var term = $('#searchbar').val();
		var searchLibrary = []
		fullLibrary.forEach(function(song) {
			if (song.title.toLowerCase().indexOf(term.toLowerCase()) > -1 || song.user.username.toLowerCase().indexOf(term.toLowerCase()) > -1) searchLibrary.push(song);
		});
		renderLibrary(searchLibrary, true);
	}, 250);
});

//-------------------------------------------------------------------------------------------------------------//

var startLibrary = function() {
	if (localStorage.getItem("fullLibrary") == null) {
		//Basically if it's a new user that hasn't used the site and doesn't have their library saved.
		console.log("Starting library load.");
		loadLibrary();

	} else {
		console.log("Loading from local storage.");
		fullLibrary = JSON.parse(localStorage.getItem("fullLibrary"));
		//addNewFavorites();
		fullLibrary = fullLibrary;
		renderLibrary(fullLibrary);	
	}	
}

// client_id: '96089e67110795b69a95705f38952d8f'
// redirect_uri: 'http://sclibrary.testing.com:3000/callback.html'

//Kick off the site.
$(document).ready(function() {

	startLibrary();
	//loadPlaylists();
});


})();





