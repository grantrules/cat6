import React, { useState } from 'react';
import Logo from './Logo';
import { Lobby } from './Lobby';
import { Details, DeviceStatuses } from './Details';
import { NextBtn, BackBtn } from './Buttons';

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
