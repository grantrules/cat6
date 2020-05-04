import React, { useEffect, useState } from 'react';
import Ctx from '../Ctx';
import WeightConversion from '../components/WeightConversion';
import { connect, devices, addToArray } from '../utils/bluetooth';
import DeviceData from './DeviceData';



function Details({ Next }) {
  const [powerRequiredError, /* setPowerRequiredError */] = useState(false);

  const { connected: connectedField } = devices.get('power');
  const store = React.useContext(Ctx);
  const powerConnected = store.use(() => store.get(connectedField));

  /*
  const checkPowerConnected = () => {
    if (!powerConnected && !DONT_FORCE_POWERMETER) {
      setPowerRequiredError(true);
    } else {
      setGameState('name_select');
    }
  }
*/
  return (
    <>
      <div className="details">
        <DeviceSelectScreen connected={powerConnected} powerRequiredError={powerRequiredError} />
        <PlayerDetailScreen />
      </div>
      {Next}
    </>);
}


function DeviceSelector({ type, name }) {
  const { connected: connectedField } = devices.get(type);

  const store = React.useContext(Ctx);
  const connected = store.use(() => store.get(connectedField));
  const data = store.use(() => store.get(`${type}Data`));
  const gameRoom = store.use(() => store.get('gameRoom'));

  const setConnected = (value) => store.set(connectedField, value);
  const setData = (value) => {
    const newData = addToArray(data, value);
    if (gameRoom) {
      gameRoom.send(type, value);
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
  const errClass = powerRequiredError && !connected ? "error" : "";
  return (
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
  );
}


function PlayerInput({ name, title, Input }) {
  return (<div className={`${name}-playerInput playerInput`}>
    <div className="title">{title}:</div>
    {Input}
  </div>);
}

function PlayerDetailScreen() {

  const store = React.useContext(Ctx);
  const name = store.use(() => store.get("playerName"));
  const weightObj = store.use(() => store.get("playerWeight"));
  const { weight, isKg } = weightObj;

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
        <PlayerInput
          name="name"
          title="Player Name"
          Input={<input type="text" name="playerName" maxLength="16" value={name} onChange={handleChange('playerName')} />}
        />
        <PlayerInput
          name="weight"
          title="Player Weight"
          Input={<WeightConversion name="weight" weightObj={weightObj} update={update} />}
        />
      </fieldset>
    </>);
}

function DeviceStatus({ type }) {

  const { connected: connectedField, name, unit } = devices.get(type);
  const store = React.useContext(Ctx);
  const connected = store.use(() => store.get(connectedField));

  return (<>
    <div className={`${type}-device device-${connected ? 'connected' : 'unconnected'}`}>
      {name}
      <span className={`${type}-icon`}></span>
      {connected && <><DeviceData type={type} /> {unit}</>}
    </div>
  </>)
}

function DeviceStatuses() {
  return (<>
    <DeviceStatus type="power" />
    <DeviceStatus type="cadence" />
    <DeviceStatus type="heart" />
  </>)
}

export { Details, DeviceSelectScreen, PlayerDetailScreen, DeviceStatuses, DeviceStatus }