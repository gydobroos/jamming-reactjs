import React, { Component } from 'react';
import './App.css';

// Components
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
    constructor(props) {
        super(props);
        Spotify.getAccessToken();
        this.state = {
            searchResults: [{
                id: 0,
                name: 'Sample track',
                artist: 'John Doe',
                album: 'The more the merrier',
                uri: 'https://spotify.com/dasdad32d3123d1231'
            }],
            playlistName: 'Awesome Classics',
            playlistTracks: []
        };

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }

    addTrack( track ) {
        if (!this.state.playlistTracks.find(playlistTrack => playlistTrack.id === track.id)) {
            this.setState(prevState => ({
                playlistTracks: [...prevState.playlistTracks, track]
            }));
        }
    }

    removeTrack( track ) {
        this.setState({
            playlistTracks: this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)
        });
    }

    updatePlaylistName(name) {
        this.setState({playlistName: name});
    }

    savePlaylist() {
        const trackURIs = this.state.playlistTracks.map( track => {
            return track.uri;
        });

        Spotify.savePlaylist(trackURIs);

        this.setState({
            playlistName: 'New Playlist',
            playlistTracks: []
        })
    }

    search( searchTerm ) {
        const promise = Spotify.search( searchTerm );
        promise.then(response => response.json())
            .then(jsonResponse => {
                if (!jsonResponse.tracks) return [];
                jsonResponse = jsonResponse.tracks.items.map(track => {
                    return {
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    }
                });
                console.log(jsonResponse);
                this.setState({searchResults: jsonResponse});
            });

    }

    render() {
        return (
            <div>
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                    <SearchBar onSearch={this.search}/>
                    <div className="App-playlist">
                        <SearchResults searchResults={this.state.searchResults}
                                       onAdd={this.addTrack}
                                       onRemove={this.removeTrack} />
                        <Playlist name={this.state.playlistName}
                                  onSave={this.savePlaylist}
                                  onAdd={this.addTrack}
                                  onRemove={this.removeTrack}
                                  playlistName={this.state.playlistName}
                                  playlistTracks={this.state.playlistTracks}
                                  onNameChange={this.updatePlaylistName} />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
