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
          <Song artist={song.artist} title={song.title}>
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

ReactDOM.render(
  <SongList data={inputData}/>,
  document.getElementById('main')
);