import React, { useState } from 'react';
import Logo from './components/Logo';
import { Lobby } from './components/Lobby';
import './Game.scss';
import { Details, DeviceStatuses } from './components/Details';
import { NextBtn, BackBtn } from './components/Buttons';

function Game() {

  const [gameState, setGameState] = useState('details');
  const isGameState = (state) => state === gameState;
  console.log('rendering game...');

  return (
    <>
      <header className="logo">
        <Logo />
      </header>
      <section>
        {isGameState('details') &&
          <Details Next={(<NextBtn onClick={() => setGameState("lobby")} />)} />

        }

        {isGameState('lobby') &&
          <Lobby Back={(<BackBtn onClick={() => setGameState('details')} />)} />
        }
      </section>

      <footer>
        <DeviceStatuses />
      </footer>
    </>
  );
}

export default Game;
