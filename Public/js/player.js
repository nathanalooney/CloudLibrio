(function() {

    var LibraryBox = React.createClass({
        render: function() {
            return (
                <div>
        <SongList songs={this.props.songs}/>
      </div>
            );
        }
    });

    var SongList = React.createClass({
        getInitialState: function() {
            return ({
                soundcloud_id: songPlayer.soundcloud_id,
                isPaused: songPlayer.isPaused(),
            });
        },
        playSong: function(song) {
            if (this.state.soundcloud_id == song.id) {
                if (!this.state.isPaused) {
                    this.setState({ isPaused: true }, function() {
                        songPlayer.pause();
                    });
                } else {
                    this.setState({ isPaused: false }, function() {
                        songPlayer.play();
                    })
                }
            } else {
                this.setState({ soundcloud_id: song.id, isPaused: false }, function() {
                    songPlayer.playNew(song);
                });
            }
        },
        render: function() {
            var songNodes = this.props.songs.map(function(song, i) {
                return (
                    <div key={i}>
                  <Song song={song} playSong={this.playSong} soundcloud_id={this.state.soundcloud_id} isPaused={this.state.isPaused} ></Song>
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
            this.props.playSong(this.props.song);
        },
        registerClick: function(event) {
            var div = ReactDOM.findDOMNode(this)
            var svg = div.querySelector('svg')
            var rect = svg.getBoundingClientRect();
            var left = rect.x || rect.left;
            var width = rect.width;
            var percentage = ((event.clientX - left) / width);
            var time = parseFloat(Math.floor((percentage * songPlayer.audio.duration)))
            songPlayer.audio.currentTime = time;
        },
        render: function() {
            var is_current_song = (this.props.soundcloud_id === this.props.song.id);
            var glyph = (is_current_song && !this.props.isPaused) ? "pause" : "play-circle";
            var glyph_class = "glyphicon glyphicon-" + glyph;
            var currTime = "0:00"
            return (
                <div>
                <span className={glyph_class} onClick={this.playSong}></span>
                <div className={"song-info-container"}>
                    <h3> {this.props.song.user.username} </h3>
                    <h4> {this.props.song.title} </h4>
                </div>
                <div id={'player_'+this.props.song.id} onClick={this.registerClick}></div>
               {is_current_song ? <div><div className={"current-time"} id={"current-time-"+this.props.song.id}>{'0:00'}</div><div className={"duration"} id={"duration"+this.props.song.id}> {songPlayer.millisToMinutesAndSeconds(this.props.song.duration)}</div></div> : null}
            </div>
            );
        }
    });

    //------------------------------------------------------------------------------------------------
    var renderLibrary = function(displayList) {
        $('#main').empty();
        var filteredPlaylist = filterLibrary(displayList);
        var sortedPlaylist = sortLibrary(filteredPlaylist);
        songPlayer.playlist = applyPlaylistIDs(sortedPlaylist);
        ReactDOM.render(
            <SongList songs={songPlayer.playlist}/>,
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
        var term = document.getElementById('searchbar').value.toLowerCase();
        library.forEach(function(song) {
            var title = song.title.toLowerCase();
            var user = song.user.username.toLowerCase();
            if (term.length > 0) {
                if (title.indexOf(term) > -1 || user.indexOf(term) > -1) {
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
        switch (songPlayer.librarySort) {
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
                if (!songPlayer.is_shuffled) {
                    console.log("Shuffling");
                    library = shuffle(library);
                    songPlayer.shuffled_playlist = library;
                    songPlayer.is_shuffled = true;
                } else {
                    library = songPlayer.shuffled_playlist;
                }
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
        } else if (a.title.replace(/\W/g, '').toLowerCase() > b.title.replace(/\W/g, '').toLowerCase()) {
            return 1;
        } else return 0;
    }

    var sortArtist = function(a, b) {
        if ($('#sort-artist').attr('sort') == 'ascending') {
            b = [a, a = b][0];
        }
        if (a.user.username.replace(/\W/g, '').toLowerCase() < b.user.username.replace(/\W/g, '').toLowerCase()) {
            return -1;
        } else if (a.user.username.replace(/\W/g, '').toLowerCase() > b.user.username.replace(/\W/g, '').toLowerCase()) {
            return 1;
        } else return 0;
    }

    var sortDate = function(a, b) {
        if ($('#sort-date').attr('sort') == 'descending') {
            b = [a, a = b][0];
        }
        if (a.sclibrary_id < b.sclibrary_id) {
            return -1;
        } else if (a.sclibrary_id > b.sclibrary_id) {
            return 1;
        } else return 0;
    }

    var sortFavorites = function(a, b) {
        if ($('#sort-favorites').attr('sort') == 'ascending') {
            b = [a, a = b][0];
        }
        if (parseInt(a.favoritings_count) < parseInt(b.favoritings_count)) {
            return -1;
        } else if (parseInt(a.favoritings_count) > parseInt(b.favoritings_count)) {
            return 1;
        } else return 0;
    }

    var sortPlays = function(a, b) {
        if ($('#sort-plays').attr('sort') == 'ascending') {
            b = [a, a = b][0];
        }
        if (parseInt(a.playback_count) < parseInt(b.playback_count)) {
            return -1;
        } else if (parseInt(a.playback_count) > parseInt(b.playback_count)) {
            return 1;
        } else return 0;
    }

    var shuffle = function(library) {
            var currentIndex = library.length,
                temporaryValue, randomIndex;
            while (currentIndex !== 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
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
    var songPlayer = {
        librarySort: null,
        is_shuffled: false,
        is_dissociated: false,
        shuffled_playlist: null,
        dissociated_playlist: null,
        playlist: null,
        audio: null,
        soundcloud_id: null,
        prev_id: null,
        current_id: null,
        next_id: null,
        audioSrc: null,
        audioCtx: null,
        animation_id: null,
        user_id: null,
        playNew: function(song) {
            this.associate();
            if (this.audio) this.pause();
            this._setIDs(song.playlist_id);
            this.soundcloud_id = song.id;
            var full_stream_url = this.playlist[song.playlist_id].stream_url + '?client_id=96089e67110795b69a95705f38952d8f';
            this.audio = new Audio(full_stream_url);
            this.audio.crossOrigin = 'anonymous';
            this.audio.addEventListener('ended', this._addNextSongHandler.bind(this));
            this.audio.addEventListener('timeupdate', function(event) {
                var timeInMinutes = songPlayer.millisToMinutesAndSeconds(this.currentTime * 1000)
                var currentTimeDisplay = document.getElementById('current-time-' + songPlayer.soundcloud_id);
                if (currentTimeDisplay) currentTimeDisplay.innerHTML = timeInMinutes;

            });
            this.play();
            clearVisualizer();
            visualizer(true);
        },
        play: function() {
            document.getElementById('play_pause').className = "glyphicon glyphicon-pause"
            songPlayer.audio.play();
        },
        pause: function() {
            document.getElementById('play_pause').className = "glyphicon glyphicon-play"
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
            this.pause();
            this._setIDs(this.next_id);

            if (!this.is_dissociated) {
                this.soundcloud_id = this.playlist[this.current_id].id;
                var full_stream_url = this.playlist[this.current_id].stream_url + '?client_id=96089e67110795b69a95705f38952d8f';
            } else {
                this.soundcloud_id = this.dissociated_playlist[this.current_id].id;
                var full_stream_url = this.dissociated_playlist[this.current_id].stream_url + '?client_id=96089e67110795b69a95705f38952d8f';
            }
            this.audio = new Audio(full_stream_url);
            this.audio.crossOrigin = "anonymous";
            this.audio.addEventListener('ended', this._addNextSongHandler.bind(this));
            this.audio.addEventListener('timeupdate', function(event) {
                var timeInMinutes = songPlayer.millisToMinutesAndSeconds(this.currentTime * 1000)
                var currentTime = document.getElementById('current-time-' + songPlayer.soundcloud_id);
                if (currentTime) currentTime.innerHTML = timeInMinutes;
            });
            this.play();
            renderLibrary(fullLibrary);
            clearVisualizer();
            visualizer(true);
        },
        playPrevious: function() {
            this.pause();
            this._setIDs(this.prev_id);
            if (!this.is_dissociated) {
                this.soundcloud_id = this.playlist[this.current_id].id;
                var full_stream_url = this.playlist[this.current_id].stream_url + '?client_id=96089e67110795b69a95705f38952d8f';
            } else {
                this.soundcloud_id = this.dissociated_playlist[this.current_id].id;
                var full_stream_url = this.dissociated_playlist[this.current_id].stream_url + '?client_id=96089e67110795b69a95705f38952d8f';
            }
            this.audio = new Audio(full_stream_url);
            this.audio.crossOrigin = "anonymous";
            this.audio.addEventListener('ended', this._addNextSongHandler.bind(this));
            this.audio.addEventListener('timeupdate', function(event) {
                var timeInMinutes = songPlayer.millisToMinutesAndSeconds(this.currentTime * 1000)
                document.getElementById('current-time-' + songPlayer.soundcloud_id).innerHTML = timeInMinutes;
            });
            this.play();
            renderLibrary(fullLibrary);
            clearVisualizer();
            visualizer(true);
        },
        _setIDs: function(playlist_id) {
            this.next_id = playlist_id + 1;
            this.current_id = playlist_id;
            this.prev_id = playlist_id - 1;
        },
        _addNextSongHandler: function() {
            this.pause();
            this._setIDs(this.next_id);
            if (!this.is_dissociated) {
                this.soundcloud_id = this.playlist[this.current_id].id;
                var full_stream_url = this.playlist[this.current_id].stream_url + '?client_id=96089e67110795b69a95705f38952d8f';
            } else {
                this.soundcloud_id = this.dissociated_playlist[this.current_id].id;
                var full_stream_url = this.dissociated_playlist[this.current_id].stream_url + '?client_id=96089e67110795b69a95705f38952d8f';
            }
            this.audio = new Audio(full_stream_url);
            this.audio.crossOrigin = "anonymous";
            this.audio.addEventListener('ended', this._addNextSongHandler.bind(this));
            this.audio.addEventListener('timeupdate', function(event) {
                var timeInMinutes = songPlayer.millisToMinutesAndSeconds(this.currentTime * 1000)
                document.getElementById('current-time-' + songPlayer.soundcloud_id).innerHTML = timeInMinutes;
            });
            this.play();
            renderLibrary(fullLibrary);
            clearVisualizer();
            visualizer(true);
        },
        dissociate: function() {
            if (this.is_dissociated) return;
            this.is_dissociated = true;
            this.dissociated_playlist = this.playlist.slice();
        },
        associate: function() {
            this.is_dissociated = false;
            this.dissociated_playlist = null;
        },
        millisToMinutesAndSeconds: function(millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        }
    }

    var loadLibrary = function() {
        var client_id = 'client_id=96089e67110795b69a95705f38952d8f'
        $('#main').html('<p id="load-status"> Loading Your Full Library </p>');
        $.get('https://api.soundcloud.com/users/' + songPlayer.user_id + '/favorites?' + client_id + '&limit=200&linked_partitioning=1', function(response) {
            try {
                var collection = JSON.parse(response.collection);
            } catch (e) {
                var collection = response.collection
            }
            responseList.push(collection);
            buildLibrary(response.next_href);
            $('#load-status').text('Loading Your Full Library (' + response.collection.length + ' songs)');
        });
    }

    //Recursive function to sequentially get list of songs in library.
    var buildLibrary = function(next_href) {
        $.get(next_href).then(function(response) {
            console.log("Still loading...");
            try {
                var collection = JSON.parse(response.collection);
            } catch (e) {
                var collection = response.collection
            }
            responseList.push(collection);
            if (response.next_href) {
                var loadedCount = 0;
                responseList.forEach(function(collection) {
                    loadedCount += collection.length;
                });
                $('#load-status').text('Loading Your Full Library (' + loadedCount + ' songs)');
                buildLibrary(response.next_href);
            } else {
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
            var trimmedSong = {
                duration: fullLibrary[i].duration,
                favoritings_count: fullLibrary[i].favoritings_count,
                id: fullLibrary[i].id,
                permalink_url: fullLibrary[i].permalink_url,
                playback_count: fullLibrary[i].playback_count,
                stream_url: fullLibrary[i].stream_url,
                title: fullLibrary[i].title,
                uri: fullLibrary[i].uri,
                artwork_url: fullLibrary[i].artwork_url,
                user: {
                    id: fullLibrary[i].user.id,
                    username: fullLibrary[i].user.username,
                },
                sclibrary_id: i
            }
            fullLibrary[i] = trimmedSong
        }
        console.log('Setting localstorage..');
        localStorage.setItem("fullLibrary", JSON.stringify(fullLibrary));
        $('#main').empty();
        fullLibrary = fullLibrary;
        console.log('Calling render...')
        renderLibrary(fullLibrary);
    }

    //-------------------------------------------------------------------------------------------------------//
    document.getElementById("sort-title").addEventListener('click', function() {
        songPlayer.librarySort = 0;
        songPlayer.dissociate();
        songPlayer.is_shuffled = false;
        renderLibrary(fullLibrary);
        visualizer();
    });

    document.getElementById("sort-artist").addEventListener('click', function() {
        songPlayer.librarySort = 1;
        songPlayer.dissociate();
        songPlayer.is_shuffled = false;
        renderLibrary(fullLibrary);
        visualizer();
    });

    document.getElementById("sort-date").addEventListener('click', function() {
        songPlayer.librarySort = 2;
        songPlayer.dissociate();
        songPlayer.is_shuffled = false;
        renderLibrary(fullLibrary);
        visualizer();
    });

    // document.getElementById("ssort-favorites").addEventListener('click', function() {
    //     songPlayer.librarySort = 3;
    //     songPlayer.dissociate();
    //     songPlayer.is_shuffled = false;
    //     renderLibrary(fullLibrary);
    //     visualizer();
    // });

    document.getElementById("sort-plays").addEventListener('click', function() {
        songPlayer.librarySort = 4;
        songPlayer.dissociate();
        songPlayer.is_shuffled = false;
        renderLibrary(fullLibrary);
        visualizer();
    });

    document.getElementById("shuffle").addEventListener('click', function() {
        songPlayer.librarySort = 5;
        songPlayer.dissociate();
        songPlayer.is_shuffled = false;
        renderLibrary(fullLibrary);
        visualizer();
    });

    document.getElementById("remixes").addEventListener('change', function() {
        songPlayer.dissociate();
        renderLibrary(fullLibrary, true);
        visualizer();
    });

    document.getElementById("originals").addEventListener('change', function() {
        songPlayer.dissociate();
        renderLibrary(fullLibrary, true);
        visualizer();
    });

    document.getElementById('refresh').addEventListener('click', function() {
        songPlayer.dissociate();
        loadLibrary();
    });

    document.getElementById('searchbar').addEventListener('keyup', function() {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function() {
            songPlayer.dissociate();
            renderLibrary(fullLibrary, true);
            visualizer();
        }, 500);
    });

    document.getElementById('play_next').addEventListener('click', function() {
        songPlayer.playNext();
    });

    document.getElementById('play_current').addEventListener('click', function(event) {
        if (songPlayer.audio) {
            if (songPlayer.isPaused()) {
                songPlayer.play();
                renderLibrary(fullLibrary);
                visualizer();
            } else {
                songPlayer.pause();
                renderLibrary(fullLibrary);
                visualizer();
            }
        }
    });

    document.getElementById('play_prev').addEventListener('click', function() {
        songPlayer.playPrevious();
    });

    document.getElementById('change-user').addEventListener('click', function() {
        $('#overlay, #overlay-back').fadeIn(500);
        $('body').addClass('stop-scrolling');
    });
    document.getElementById('signin-submit').addEventListener('click', function() {
        $('#overlay, #overlay-back').fadeOut(500);
        $('body').removeClass('stop-scrolling');
        var username = document.getElementById('signin-field').value;
        $('#user-select').html(username);
        authenticateUsername(username);
    })
    document.getElementById('signin-field').addEventListener('keyup', function(event) {
        if (event.keyCode === 13) {
            $('#overlay, #overlay-back').fadeOut(500);
            $('body').removeClass('stop-scrolling');
            var username = document.getElementById('signin-field').value;
            $('#user-select').html(username);
            authenticateUsername(username);

        }
    })

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

    var clearVisualizer = function() {
        var svg = document.getElementsByTagName('svg')[0];
        if (svg) svg.parentNode.removeChild(svg);
        if (songPlayer.audioCtx) songPlayer.audioCtx.close();
        songPlayer.audioCtx = null;
    }

    var visualizer = function(new_song) {
        if (new_song) {
            window.cancelAnimationFrame(songPlayer.animation_id);
            songPlayer.audioCtx = new(window.AudioContext || window.webkitAudioContext)();
            songPlayer.audioSrc = songPlayer.audioCtx.createMediaElementSource(songPlayer.audio);
            songPlayer.analyser = songPlayer.audioCtx.createAnalyser();

            // Bind our songPlayer.analyser to the media element source.
            songPlayer.audioSrc.connect(songPlayer.analyser);
            songPlayer.audioSrc.connect(songPlayer.audioCtx.destination);
        }

        var song_id = songPlayer.soundcloud_id;
        if (!document.getElementById('player_' + song_id)) {
            window.cancelAnimationFrame(songPlayer.animation_id);
            return;
        }

        //var frequencyData = new Uint8Array(songPlayer.analyser.frequencyBinCount);
        var frequencyData = new Uint8Array(256);

        var svgHeight = '128';
        var svgWidth = document.getElementById('player_' + song_id).offsetWidth;
        var barPadding = '1';

        function createSvg(parent, height, width) {
            return d3.select(parent).append('svg').attr('height', height).attr('width', width);
        }
        var svg = createSvg('#player_' + song_id, svgHeight, svgWidth);

        // Create our initial D3 chart.
        svg.selectAll('rect')
            .data(frequencyData)
            .enter()
            .append('rect')
            .attr('x', function(d, i) {
                return i * (svgWidth / frequencyData.length);
            })
            .attr('width', svgWidth / frequencyData.length - barPadding);

        // Continuously loop and update chart with frequency data.
        function renderChart() {
            var song_id = songPlayer.soundcloud_id;
            if (!document.getElementById('player_' + song_id)) {
                window.cancelAnimationFrame(songPlayer.animation_id);
                return;
            }

            songPlayer.animation_id = window.requestAnimationFrame(renderChart);
            // Copy frequency data to frequencyData array.
            songPlayer.analyser.getByteFrequencyData(frequencyData);

            // Update d3 chart with new data.
            svgWidth = document.getElementById('player_' + song_id).offsetWidth;
            svg.attr('width', svgWidth);

            svg.selectAll('rect')
                .data(frequencyData)
                .attr('x', function(d, i) {
                    return i * (svgWidth / frequencyData.length);
                })
                .attr('width', svgWidth / frequencyData.length - barPadding)
                .attr('y', function(d) {
                    d = Math.max((d / 255) * svgHeight, 3);
                    return svgHeight - d;
                })
                .attr('height', function(d) {
                    d = Math.max((d / 255) * svgHeight, 3)
                    return d;
                })
                .attr('fill', function(d, i) {
                    d = Math.max((d / 255) * svgHeight, 3);
                    if ((i / 256) < (songPlayer.audio.currentTime / songPlayer.audio.duration)) {
                        return 'rgb(66,133,244)';
                    } else {
                        return 'rgba(255,135,50, 0.35)'

                    }
                });
        }
        // Run the loop
        renderChart();
    };
    // client_id: '96089e67110795b69a95705f38952d8f'
    // redirect_uri: 'https://sclibrary.testing.com:3000/callback.html'

    var clearLocalData = function() {
        fullLibrary = []
        responseList = [];
        songPlayer.shuffled_playlist = null;
        songPlayer.playlist = null;
        localStorage.clear();
    }

    var authenticateUsername = function(username) {
            clearLocalData();
            var url = 'https://api.soundcloud.com/resolve?url=https://soundcloud.com/' + String(username) + '&client_id=96089e67110795b69a95705f38952d8f';
            $.get({
                    url: url,
                    dataType: 'json'
                })
                .success(function(data, status) {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        console.log(e);
                    }
                    console.log(data);
                    songPlayer.user_id = data.id;
                    localStorage.clear();
                    localStorage.setItem("soundcloud_user_id", data.id);
                    localStorage.setItem("soundcloud_user_name", data.permalink);
                    document.getElementById('user-menu').innerHTML = data.permalink;
                    if (songPlayer.audio) songPlayer.pause();
                    startLibrary();
                })
                .fail(function(data, status) {
                    console.log(data, status);
                });
        }
        //Kick off the site.
    $(document).ready(function() {
        var user_id = localStorage.getItem("soundcloud_user_id");
        var user_name = localStorage.getItem("soundcloud_user_name");
        if (user_id && user_name) {
            songPlayer.user_id = user_id;
            document.getElementById('user-menu').innerHTML = user_name;
            startLibrary();
        } else {
            document.getElementById('overlay-back').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
        }
    });
})();
