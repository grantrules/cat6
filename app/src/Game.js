import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';
import Ctx from './Ctx';
import WeightConversion from './components/WeightConversion';
import { Lobby } from './components/Lobby';
import { connect, devices } from './utils/bluetooth';

const DONT_FORCE_POWERMETER = true;



function DeviceSelector({ type, name }) {
  const { connected: connectedField } = devices.get(type);

  const store = React.useContext(Ctx);
  const connected = store.use(() => store.get(connectedField));
  const setConnected = (value) => store.set(connectedField, value);
  const setData = (data) => console.log('react got data', data);

  return (
    <span className={`${type}Select`}>
      {!connected ?
        <button onClick={() => connect(type, setConnected, setData)}>Connect {name}</button>
        :
        <div>{name} connected</div>
      }
    </span>
  )
}

function DeviceSelectScreen({ Next, powerRequiredError, connected }) {
  //console.log(`connected?`, connected);
  const errClass = powerRequiredError && !connected ? "error" : "";
  return (
    <>
      <div>
        <span className={errClass}>Required --&gt;</span> <DeviceSelector type="power" name="Power Meter" /> <span className={errClass}>&lt;-- Required</span>
      </div>
      <div>
        <DeviceSelector type="cadence" name="Cadence Sensor" />
      </div>
      <div>
        <DeviceSelector type="heart" name="Heart Rate Sensor" />
      </div>
      {Next}
    </>);
}

function PlayerDetailScreen({ Next }) {

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
    store.set('playerWeight', { weight, isKg });
  }

  const handleChange = (name) => (e) => store.set(name, e.target.value);

  return (
    <>
      <div>
        Player Name: <input type="text" name="playerName" maxLength="16" value={name} onChange={handleChange('playerName')} />
      </div>
      <div>
        Player Weight: <WeightConversion name="weight" weight={weight} isKg={isKg} update={update} />
      </div>
      {Next}
    </>);
}

function DeviceStatus({ type }) {

  const { connected: connectedField, name } = devices.get(type);
  const store = React.useContext(Ctx);
  const connected = store.use(() => store.get(connectedField));

  return (<>
    <div className={`device-${connected ? 'connected' : 'unconnected'}`}>{name}</div>
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
        <DeviceSelectScreen connected={powerConnected} powerRequiredError={powerRequiredError} Next={<NextBtn state="name_select" />} />
      }

      {isGameState('name_select') &&
        <PlayerDetailScreen Next={<NextBtn state="lobby" />} />
      }

      {isGameState('lobby') &&
        <Lobby />
      }

      <DeviceStatuses />
    </div>
  );
}

export default Game;
