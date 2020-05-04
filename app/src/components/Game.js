import React, { useState } from 'react';
import Logo from './Logo';
import { Lobby } from './Lobby';
import { Details, DeviceStatuses } from './Details';
import { NextBtn, BackBtn, Button } from './Buttons';

function NoBluetooth() {
  return (<>
    <h1>Sorry, you gotta use Chrome</h1>
    <p>Or any other browser with the Web Bluetooth API. Apparently Safari, Opera, and Edge do but I don't use any of those so who knows.</p>
  </>
  )
}

function About({ Back }) {
  return (<fieldset>
    <legend>About</legend>
    <p>
      Hi, I made this after I learned about the Bluetooth API and was bored riding around Watopia during quarantine
    </p>
    <p>I'm looking for a neat job</p>
    <p>You can check out the project on <a target="_blank" rel="noopener noreferrer" href="https://github.com/grantrules/cat6">GitHub</a></p>
    {Back}
  </fieldset>)
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
              <Details Next={(<>
                <NextBtn onClick={() => setGameState("lobby")} />
                <Button txt="About" onClick={() => setGameState("about")} />
              </>)} />

            }

            {isGameState('lobby') &&
              <Lobby Back={(<BackBtn onClick={() => setGameState('details')} />)} />
            }

            {isGameState('about') &&
              <About Back={(<BackBtn onClick={() => setGameState('details')} />)} />
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
