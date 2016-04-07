(function() {


var LibraryBox = React.createClass({
  render: function() {
    return (
      <div>
        <SongList data={this.props.data}/>
      </div>
    );
  }
});

var SongList = React.createClass({
	getInitialState: function() {
		return ({
			playlist_id: songPlayer.current_id,
			isPaused: songPlayer.isPaused(),
		});
	},
	playSong: function(song) {
		if (this.state.playlist_id == song.playlist_id) {
			if (!this.state.isPaused) {
				this.setState({isPaused: true}, function() {
					songPlayer.pause();
				});
			} else {
				this.setState({isPaused: false}, function() {
					songPlayer.play();
				})
			}
		} else {
			this.setState({playlist_id: song.playlist_id, isPaused: false}, function() {
				songPlayer.playNew(song.playlist_id)			
			});			
		}
	},
    render: function() {
    	var songNodes = this.props.data.map(function(song, i) {
	      	return (
	      		<div key={i}>
		          <Song song={song} playSong={this.playSong} playlist_id={this.state.playlist_id} isPaused={this.state.isPaused} ></Song>
		          <hr/>
	          	</div>
	        );
	    }, this);

		return (
		<div className="songList">
		  {songNodes}
		</div>
		);
    }
});

var Song = React.createClass({
	playSong: function() {
		console.log(this.props.isPaused)
		this.props.playSong(this.props.song);
	},
	render: function() {
		var glyph = (this.props.playlist_id === this.props.song.playlist_id && !this.props.isPaused) ? "pause" : "play-circle";
		var glyph_class = "glyphicon glyphicon-"+glyph;
		return (
			<div>
				<h3> {this.props.song.user.username} </h3>
				<p> {this.props.song.title} </p>
				<span className={glyph_class} onClick={this.playSong}></span>
			</div>
		);
	}
});

//------------------------------------------------------------------------------------------------
var renderLibrary = function(displayList, filterOnly) {
	$('#main').empty();
	var filteredPlaylist = filterLibrary(displayList);
	var sortedPlaylist = sortLibrary(filteredPlaylist);	
	songPlayer.playlist = applyPlaylistIDs(sortedPlaylist);
	ReactDOM.render(
	  <SongList data={songPlayer.playlist}/>,
	  document.getElementById('main')
	);
}

var applyPlaylistIDs = function(playlist) {
	for (var i = 0; i < playlist.length; i++) {
		playlist[i].playlist_id = i;
	}
	return playlist;
}

var filterLibrary = function(library) {
	var returnLibrary = [];
	library.forEach(function(song) {

		var title = song.title.toLowerCase();
		var user = song.user.username.toLowerCase();
		var term = $('#searchbar').val().toLowerCase();
		if (term.length > 0) {
			if (title.indexOf(term) > -1 || user.toLowerCase().indexOf(term) > -1) {
				var isRemix = false;
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
			}
		} else {
			var isRemix = false;
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
		}
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
var responseList = [];
var searchTimer = null;
var librarySort = null;
var songPlayer = {
	playlist: null,
	audio: null,
	prev_id: null,
	current_id: null,
	next_id: null,
	playNew: function(playlist_id) {
		if (this.audio) this.audio.pause();
		this._setIDs(playlist_id);	
		var full_stream_url = this.playlist[playlist_id].stream_url+'?client_id=96089e67110795b69a95705f38952d8f';
		this.audio = new Audio(full_stream_url);
		this.audio.addEventListener('ended', this._addNextSongHandler.bind(this));
		this.audio.play();
	},
	play: function() {
		console.log("Play");
		songPlayer.audio.play();
	},
	pause: function() {
		console.log("Pause");
		songPlayer.audio.pause();
	},
	isPaused: function() {
		if (this.audio) {
			return this.audio.paused;			
		} else {
			return true;
		}
	},
	playNext: function() {
		this.audio.pause();
		this._setIDs(this.next_id);
		var full_stream_url = this.playlist[this.current_id].stream_url+'?client_id=96089e67110795b69a95705f38952d8f';
		this.audio = new Audio(full_stream_url);
		this.audio.play();
		renderLibrary(fullLibrary);			
	},
	playPrevious: function() {
		this.audio.pause();
		this._setIDs(this.prev_id);
		var full_stream_url = this.playlist[this.current_id].stream_url+'?client_id=96089e67110795b69a95705f38952d8f';
		this.audio = new Audio(full_stream_url);
		this.audio.play();
		renderLibrary(fullLibrary);				
	},
	_setIDs: function(playlist_id) {
		this.next_id = playlist_id+1;
		this.current_id = playlist_id;
		this.prev_id = playlist_id-1;	
	},
	_addNextSongHandler: function() {
		this._setIDs(this.current_id+1);
		var full_stream_url = this.playlist[this.current_id].stream_url+'?client_id=96089e67110795b69a95705f38952d8f';
		this.audio = new Audio(full_stream_url);
		this.audio.addEventListener('ended', this._addNextSongHandler.bind(this));
		this.audio.play();
		renderLibrary(fullLibrary);				
	}
}

 $('#play_next').click(function() {
 	songPlayer.playNext();
 });
$('#play_prev').click(function() {
	songPlayer.playPrevious();
});
var loadLibrary = function() {
	var client_id = 'client_id=96089e67110795b69a95705f38952d8f'
	$('#main').html('<p id="load-status"> Loading Your Full Library </p>');
	$.get('http://api.soundcloud.com/users/29864265/favorites?'+client_id+'&limit=200&linked_partitioning=1', function(response) {
			responseList.push(response.collection);
			buildLibrary(response.next_href);
			$('#load-status').text('Loading Your Full Library ('+response.collection.length+' songs)');
		});		
}

//Recursive function to sequentially get list of songs in library.
var buildLibrary = function(next_href) {
	$.get(next_href).then(function(response) {
		console.log("Still loading...");
		responseList.push(response.collection);
		if (response.next_href) {
			var loadedCount = 0;
			responseList.forEach(function(collection) {
				loadedCount += collection.length;
			});
			$('#load-status').text('Loading Your Full Library ('+loadedCount+' songs)');			
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
		renderLibrary(fullLibrary, true);
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
});


})();





