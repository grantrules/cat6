# cat6
Multiplayer game for cycling smart trainers. Right now, this just connects a few BT devices in Chrome and has a multiplayer lobby. Game coming.. eventually.

### Description

Lets you select cycling bluetooth devices and create a private lobby for your friends.

Built with:

* [React](https://github.com/facebook/react)
* [Colyseus](https://github.com/colyseus/colyseus)
* [Three.js](https://github.com/mrdoob/three.js) <-- maybe?


### Running

Use docker:

`docker-compose up -d`

(runs on port 8081)

Start the server:

`cd server && npm run start`

(runs on 2567)

Start the client:

`cd app && npm run start`

(runs on 3000)
