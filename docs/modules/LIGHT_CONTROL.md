# Light Control
## Description
The light control module allows control of multiple Smart Bulbs(LIFX, TP-Link) from the website using the [tplink-lightbulb](https://www.npmjs.com/package/tplink-lightbulb) npm package. 

## Configuration
In the modules settings file(public/views/modules/[light-control.json](public/views/modules/light-control.json)):
- ```name``` - Set this to whatever you want to have displayed in the light-control module for this light
- ```id``` - Set this to whatever you want to call the light, without spaces
- ```type``` - Set this to the brand of the bulb, either ```lifx``` or ```tp-link```
- ```rgb``` - Boolean, set this if your light supports RGB
- ```ip``` - Set this to the IP of the light bulb
- ```minColor``` - Set this to the minimum color temperature of the smart bulb
- ```maxColor``` - Set this to the maximum color temperature of the smart bulb

## f.lux integration (Windows only)
In f.lux, add your local ip and the /flux route(i.e. ```192.168.1.78:3000/flux```, or ```localhost:3000/flux```) to the f.lux settings to ping the URL on any light change, and the [light.js](routes/lights.js) route will adjust the smart bulb's temperature accordingly.

## TODO
- Consider removing the need to have both an ID and a name
- Consider adding light brand icons to the module view