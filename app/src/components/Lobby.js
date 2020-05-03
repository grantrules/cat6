import React, { useState } from 'react';
import { client, join, host } from '../utils/game';
import Ctx from '../Ctx';
import Room from './Room';
import { BackBtn } from './Buttons';

function RoomCode({ join, back }) {

  const [value, setValue] = useState('');

  const updateValue = (e) => setValue(e.target.value);

  return (
    <>
      <div><input type="text" name="roomCode" value={value} onChange={updateValue} size="4" className="large-input" /></div>
      <button onClick={() => join(value)}>Enter</button>
      {back}
    </>
  )
}

function StartGame({ name, hostGame, joinGame, Back }) {
  return (<>
    <h1>Welcome {name}</h1>
    <ul>
      <li><button onClick={hostGame}>Host Game</button></li>
      <li><button onClick={joinGame}>Join Game</button></li>
      <li>{Back}</li>
    </ul>
  </>)
}

function JoinGame({ join, setLobbyState, error }) {

  return (<>
    <h1>Enter the game code:</h1>
    <RoomCode join={join} back={<button onClick={() => setLobbyState('start')}>Back</button>} />
    {error && <div className="error">{error}</div>}

  </>)

}

export function Lobby({ Back }) {

  console.log('rendering lobby');
  console.log(client);

  const store = React.useContext(Ctx);
  const playerName = store.use(() => store.get("playerName"));
  const playerWeight = store.use(() => store.get("playerWeight"));
  const gameRoom = store.use(() => store.get("gameRoom"));

  const [error, setError] = useState(null);
  const connected = client !== null;
  const inRoom = gameRoom !== null;

  const [lobbyState, setLobbyState] = useState('start');

  const onStateChange = (state) => {
    store.set("gameState", state);
  }

  const onMessage = (message) => {
    console.log("react getting message", message);
  }

  const joinRoom = (room) => {
    join(room, playerName, playerWeight.weight, onStateChange, onMessage).then(room => store.set('gameRoom', room)).catch((err) =>
      setError(err.message)
    )
  }

  const joinGame = () => setLobbyState('join');
  const hostGame = () => host(playerName, playerWeight.weight, onStateChange, onMessage).then(room => store.set('gameRoom', room))


  return (<>
    {!connected &&
      <>
        <h1>Not connected to server</h1>
        <button onClick={() => {/* connect();*/ }}>Reload</button>
      </>
    }

    {connected && !inRoom &&
      <>
        {lobbyState === 'start' &&
          <StartGame name={playerName} hostGame={hostGame} joinGame={joinGame} Back={Back}/>}

        {lobbyState === 'join' &&
          <JoinGame setLobbyState={setLobbyState} join={joinRoom} error={error} Back={<BackBtn onClick={()=>setLobbyState('start')}/>}/>}
      </>
    }

    {inRoom && <Room Back={Back} />}

  </>
  )
}