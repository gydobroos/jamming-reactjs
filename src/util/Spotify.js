const clientId = 'd13542fa73cd43888ccdb73468944dbe';
const redirectUri = 'http://gydo.surge.sh/';
const spotifyUri = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=playlist-modify-public`;
let accessToken;
let expiresIn;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        const spAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const accessTokenExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
        
        if (spAccessToken && accessTokenExpiresIn) {
            accessToken = spAccessToken[1];
            expiresIn = accessTokenExpiresIn[1];
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
        } else {
            window.location = spotifyUri;
        }
    },

    search(term) {
        const searchUrl = `https://api.spotify.com/v1/search?type=track&q=${encodeURI(term)}`;
        return fetch(searchUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    },

    savePlaylist(name, trackURIs) {
        if (!name || !trackURIs) return;
        const userUrl = 'https://api.spotify.com/v1/me';
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        let userId;
        let playlistID;
        fetch(userUrl, {
            headers: headers
        })
        .then(response => response.json())
        .then(jsonResponse => userId = jsonResponse.id)
        .then(() => {
            const createPlaylistUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
            fetch(createPlaylistUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    name: name
                })
            })
                .then(response => response.json())
                .then(jsonResponse => playlistID = jsonResponse.id)
                .then(() => {
                    const addPlaylistTracksUrl = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`;
                    fetch(addPlaylistTracksUrl, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({
                            uris: trackURIs
                        })
                    });
                })
        })
    }
};

export default Spotify;
