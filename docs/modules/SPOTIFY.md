# Spotify Module

## Description
The Spotify Module integrates Spotify using the [Spotify Web API](https://developer.spotify.com/) to allow current track display and playback control(pause/play, next/previous song). 

## Usage
- The current album artwork, as well as the artist's name and current song title will appear in the bottom left corner of the website. 
- In the bottom-middle of the website are previous song, pause/play, and next song buttons to control track playback

## Configuration
Create a Spotify Application [here](https://developer.spotify.com/dashboard/applications)(Note: Spotify Premium is most likely required) and add your local IP and URL(i.e. 192.168.1.78:3000/tablet) to the list of redirect URI's, and copy your client id and client secret to the ```view-settings.json``` file like below. 

In ```view-settings.json```:
- ```use-toastify``` - Boolean to indicate whether the server should use [Toastify](https://github.com/aleab/toastify) and send the according shortcuts to control Spotify playback. Setting it to false tells the server to use the Spotify Web API endpoints to control the playback of Spotify, which has more of a delay than using the Toastify keyboard shortcuts.
- ```spotify_client_id``` - Copy your Spotify Application's Client ID here
- ```spotify_client_secret``` - Copy your Spotify Application's Client Secret here


## Todo
- Add track duration display and control
- Add a local file bug check