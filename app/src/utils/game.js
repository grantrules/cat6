import * as Colyseus from "colyseus.js";

const connect = () => {
  console.log("Connecting...");
  const protocol = window.location.protocol === "https:" ? 'wss' : 'ws';
  const host = window.location.port === "3000" ? 'localhost:2567' : window.location.host
  const client = new Colyseus.Client(`${protocol}://${host}` /* :2567' */);
  return client;
}

const client = connect();


const join = (roomId, name, weight, onStateChange, onMessage) => {
  const joinRoom = finishJoin(onStateChange, onMessage)
  return client.joinById(roomId, { playerName: name, playerWeight: weight })
    .then(room => { joinRoom(room); return room; })
    .catch((err) => {
      const error = err && err.message && err.message.indexOf("not found") ? "Room not found" : "Error joining room";
      throw new Error(error);
    })
};

let joinedRoom;

const host = (name, weight, onStateChange, onMessage) => {
  const joinRoom = finishJoin(onStateChange, onMessage)
  return client.create('room', { playerName: name, playerWeight: weight }).then(room => {
    joinRoom(room)
    return room;
  })
}
const finishJoin = (onStateChange, onMessage) => (room) => {
  joinedRoom = room;
  room.onStateChange.once((state) => {
    console.log("this is the first room state!", state);
    onStateChange(state);
  });
  room.onStateChange((state) => {
    console.log("the room state has been updated:", state);
    onStateChange(state);
  });
  room.onMessage((message) => {
    console.log('message received');
    console.log(message);
    onMessage(message);
  })
  room.onLeave(() => {
    console.log('something left');
  })
  room.onError(() => {
    console.log('error');
  })

}
export { client, join, host, joinedRoom }







