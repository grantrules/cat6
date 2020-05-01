import React from 'react';
import Ctx from '../Ctx';

function Player({ player }) {
  return (<>{player.name}</>)
}

function Device({ type, playerId }) {
  const max = { heart: 'maxHeart', power: 'maxPower', cadence: 'maxCadence' };
  const unit = { heart: 'bpm', power: 'w', cadence: 'rpm' };

  const store = React.useContext(Ctx);
  const maxType = max[type];
  const value = store.use(() => store.get('gameState').playerData[playerId][type]);
  const maxValue = store.use(() => store.get('gameState').playerData[playerId][maxType]);
  return (<>{value}{unit[type]} / {maxValue}</>)
}

function PlayerData({ player }) {
  return (<ul>
    <li>HR: <Device type='heart' playerId={player.playerId} /></li>
    <li>Pow: <Device type='power' playerId={player.playerId} /></li>
    <li>Cad: <Device type='cadence' playerId={player.playerId} /></li>
  </ul>)
}

function Players() {
  const store = React.useContext(Ctx);
  const gamePlayers = store.use(() => store.get('gameState').players);

  let players = []
  for (let id in gamePlayers) {
    const player = gamePlayers[id];
    players.push(player)
  }

  return (<ul>
    {players.map(
      (player, n) => (<li key={n}><Player player={player} /> <PlayerData player={player} /> </li>)
    )}
  </ul>)

}

export { Players, PlayerData, Player }