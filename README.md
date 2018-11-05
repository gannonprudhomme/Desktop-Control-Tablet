# Desktop-Control-Tablet
A Desktop Companion Tablet built to control my Windows 10 home computer with a Raspberry Pi and touch screen

## Features
- Listen for Spotify Playback changes every second
- Control Spotify playback remotely
- Control volume mixer levels for various programs on desktop
- Change audio output device
- Live desktop performance(CPU, memory) monitoring and displaying
- Modular changes/customization

## Set up and usage
- First, install npm and clone the repo

1) After cd'ing into the repo, run npm install to install all of the relevant packages
2) Set the IP of your main computer in the files
3) Connect to http://IP/ on the Pi
4)

## How it works

## Screenshots

## Performance/Delay

## Libraries used
  #### Server side
  - Express
  - Socket.io
  - Spotify Web Api for receiving current tracks
  - os-utils for easy access to CPU & memory usage
  - querystring
  - body-parser
  - nircmd for access to more functions through the command line

  
  #### Client Side
  - jQuery
  - jQuery Transit for smooth transformations in jQuery for the performance dials
  - Handlebars for templating/modularity
  - Muuri for draggable components
  - Socket.io
  
  
