import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';
import Ctx from './Ctx';
import WeightConversion from './components/WeightConversion';
import { Lobby } from './components/Lobby';
import { connect, devices, addToArray } from './utils/bluetooth';
import DeviceData from './components/DeviceData';
import { joinedRoom } from './utils/game';
import './Game.scss';
import { Details, DeviceStatuses } from './components/Details';

const DONT_FORCE_POWERMETER = true;


function NextButton({ onClick }) {
  return (<button onClick={onClick}>Next</button>)
}

function Game() {

  const [gameState, setGameState] = useState('details');


  const isGameState = (state) => state === gameState;



  console.log('rendering game...');

  return (

    <div>
      <Logo />

      {isGameState('details') &&
        <Details Next={(<NextButton onClick={() => setGameState("lobby")}/>)} />

      }


      {isGameState('lobby') &&
        <Lobby />
      }

      <DeviceStatuses />
    </div>
  );
}

export default Game;
