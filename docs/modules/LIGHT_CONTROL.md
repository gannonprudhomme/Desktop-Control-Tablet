# Light Control

## Description
The light control module allows control of TP-LINK Smart Bulbs from the website using the [tplink-lightbulb](https://www.npmjs.com/package/tplink-lightbulb) npm package. 

## Configuration
In the modules settings file(public/views/modules/[light-control.json](public/views/modules/light-control.json)):
- ```ip``` - Set this to the IP of the light bulb
- ```minColor``` - Set this to the minimum color temperature of the smart bulb
- ```maxColor``` - Set this to the maximum color temperature of the smart bulb

## f.lux integration (Windows only)
In f.lux, add your local ip and the /flux route(i.e. ```192.168.1.78:3000/flux```, or ```localhost:3000/flux```) to the f.lux settings to ping the URL on any light change, and the [light.js](routes/lights.js) route will adjust the smart bulb's temperature accordingly.