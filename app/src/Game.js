import React, { useState } from 'react';
import Logo from './components/Logo';
import { Lobby } from './components/Lobby';
import './Game.scss';
import { Details, DeviceStatuses } from './components/Details';



function Button({ txt, onClick }) {
  return (<button onClick={onClick}>{txt}</button>)
}

function Game() {

  const [gameState, setGameState] = useState('details');


  const isGameState = (state) => state === gameState;



  console.log('rendering game...');

  return (

    <div>
      <Logo />

      {isGameState('details') &&
        <Details Next={(<Button txt="Next" onClick={() => setGameState("lobby")}/>)} />

      }


      {isGameState('lobby') &&
        <Lobby Back={(<Button txt="Back" onClick={() =>setGameState('details')}/>)} />
      }

      <DeviceStatuses />
    </div>
  );
}

export default Game;
