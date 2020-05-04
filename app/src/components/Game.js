import React, { useState } from 'react';
import Logo from './Logo';
import { Lobby } from './Lobby';
import { Details, DeviceStatuses } from './Details';
import { NextBtn, BackBtn } from './Buttons';

function NoBluetooth() {
  return (<>
    <h1>Sorry, you gotta use Chrome</h1>
    <p>Or any other browser with the Web Bluetooth API</p>
  </>
  )
}

function Game() {

  const [gameState, setGameState] = useState('details');
  const isGameState = (state) => state === gameState;
  console.log('rendering game...');

  const hasBluetooth = navigator['bluetooth'] !== undefined;

  return (
    <>
      <header className="logo">
        <Logo />
      </header>
      <section>
        {hasBluetooth ?
          <>
            {isGameState('details') &&
              <Details Next={(<NextBtn onClick={() => setGameState("lobby")} />)} />

            }

            {isGameState('lobby') &&
              <Lobby Back={(<BackBtn onClick={() => setGameState('details')} />)} />
            }
          </>
          :
          <NoBluetooth />
        }


      </section>

      <footer>
        <DeviceStatuses />
      </footer>
    </>
  );
}

export default Game;
