# cat6
Multiplayer game for cycling smart trainers. Right now, this just connects a few BT devices in Chrome and has a multiplayer lobby. Game coming.. eventually.

### Description

Lets you select cycling bluetooth devices and create a private lobby for your friends.

Built with:

* [React](https://github.com/facebook/react)
* [Colyseus](https://github.com/colyseus/colyseus)
* [Three.js](https://github.com/mrdoob/three.js) <-- maybe?

Yeah apparently there's a Web Bluetooth API. Only works in Chrome (apparently Edge and Opera are supported, my react app didn't load in Edge and i didn't look much futher into it and I haven't tried Opera)

Here's some resources I've found helpful:

* https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web
* https://googlechrome.github.io/samples/web-bluetooth/
* https://github.com/aboutjax/framerx-bluetooth-sensors/
* https://www.bluetooth.com/specifications/gatt/services/
* https://www.bluetooth.com/specifications/gatt/characteristics/

I'm still trying to figure out if it's possible to control my kickr with this.

Is it a fitness_device?

### Running

Use docker:

`docker-compose up -d`

(runs on port 8081)

Otherwise, run `npm install` in app and server then:

Start the server:

`cd server && npm run start`

(runs on 2567)

Start the client:

`cd app && npm run start`

(runs on 3000)
