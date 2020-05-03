import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';
import Ctx from './Ctx';
import WeightConversion from './components/WeightConversion';
import { Lobby } from './components/Lobby';
import { connect, devices, addToArray } from './utils/bluetooth';
import DeviceData from './components/DeviceData';
import { joinedRoom } from './utils/game';
import './Game.scss';

const DONT_FORCE_POWERMETER = true;



function DeviceSelector({ type, name }) {
  const { connected: connectedField } = devices.get(type);

  const store = React.useContext(Ctx);
  const connected = store.use(() => store.get(connectedField));
  const data = store.use(() => store.get(`${type}Data`));
  const gameRoom = store.use(() => store.get('gameRoom'));

  const setConnected = (value) => store.set(connectedField, value);
  const setData = (value) => {
    const newData = addToArray(data, value);
    if (joinedRoom) {
      joinedRoom.send(type, value);
    }
    store.set(`${type}Data`, newData);
  };

  return (
    <span className={`${type}Select`}>
      {!connected ?
        <button onClick={() => connect(type, setConnected, setData)}>{name}</button>
        :
        <div>{name} connected</div>
      }
    </span>
  )
}

function DeviceSelectScreen({ powerRequiredError, connected }) {
  //console.log(`connected?`, connected);
  const errClass = powerRequiredError && !connected ? "error" : "";
  return (
    <>
      <fieldset>
        <legend>Devices</legend>
        <div>
          <DeviceSelector type="power" className={`powerButton ${errClass}`} name="Power Meter" />
        </div>
        <div>
          <DeviceSelector type="cadence" name="Cadence Sensor" />
        </div>
        <div>
          <DeviceSelector type="heart" name="Heart Rate Sensor" />
        </div>
      </fieldset>
    </>);
}

function PlayerDetailScreen() {

  const store = React.useContext(Ctx);
  const name = store.use(() => store.get("playerName"));
  const { weight, isKg } = store.use(() => store.get("playerWeight"));

  useEffect(() => {
    return () => {
      const data = { name, weight: { weight, isKg } };
      localStorage.setItem('cat6', JSON.stringify(data));
    }
  }, [name, weight, isKg]);

  const update = ({ weight, isKg }) => {
    console.log("what?")
    store.set('playerWeight', { weight, isKg });
  }

  const handleChange = (name) => (e) => store.set(name, e.target.value);

  return (
    <>
      <fieldset className="player">
        <legend>Player</legend>
        <div>Player Name:</div>
        <input type="text" name="playerName" maxLength="16" value={name} onChange={handleChange('playerName')} />
        <div>
        Player Weight:
        </div>
        <WeightConversion name="weight" weight={weight} isKg={isKg} update={update} />
      </fieldset>
    </>);
}

function DeviceStatus({ type }) {

  const { connected: connectedField, name } = devices.get(type);
  const store = React.useContext(Ctx);
  const connected = store.use(() => store.get(connectedField));

  return (<>
    <div className={`${type}-device device-${connected ? 'connected' : 'unconnected'}`}>{name} <span class="heart"></span>{connected && <><DeviceData type={type} /> bpm</>}</div>
  </>)
}

function DeviceStatuses() {
  return (<>
    <DeviceStatus type="power" />
    <DeviceStatus type="cadence" />
    <DeviceStatus type="heart" />
  </>)
}


function NextButton({ onClick }) {
  return (<button onClick={onClick}>Next</button>)
}

function Game() {

  const [gameState, setGameState] = useState('device_select');

  const [powerRequiredError, setPowerRequiredError] = useState(false);

  const isGameState = (state) => state === gameState;

  const NextBtn = ({ state }) => (<button onClick={() => setGameState(state)}>Next</button>)


  const { connected: connectedField } = devices.get('power');
  const store = React.useContext(Ctx);
  const powerConnected = store.use(() => store.get(connectedField));


  const checkPowerConnected = () => {
    if (!powerConnected && !DONT_FORCE_POWERMETER) {
      setPowerRequiredError(true);
    } else {
      setGameState('name_select');
    }
  }

  console.log('rendering game...');

  return (

    <div>
      <Logo />

      {isGameState('device_select') &&
        <>
          <div className="details">
            <DeviceSelectScreen connected={powerConnected} powerRequiredError={powerRequiredError} />
            <PlayerDetailScreen />
          </div>
          <NextBtn state="lobby" />
        </>
      }


      {isGameState('lobby') &&
        <Lobby />
      }

      <DeviceStatuses />
    </div>
  );
}

export default Game;
