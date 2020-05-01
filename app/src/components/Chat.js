import React, { useContext, useState, useEffect } from 'react';
import { joinedRoom } from '../utils/game';
import Ctx from '../Ctx';

function ChatBuffer() {
  const store = useContext(Ctx);
  const chat = store.use(() => store.get("gameChat"));

  useEffect(() => {
    if (joinedRoom) joinedRoom.onMessage('chat', (message) => store.set('gameChat', [...chat,message]));
  }, [store,chat]);

  return (<>
    {chat.map(({ from, message }, i) => (<li key={i}>{from}: {message}</li>))}
  </>)

}

function ChatButton({ onClick }) {
  return (<button onClick={onClick}>Send</button>)

}

function ChatTextInput({ value, onChange }) {
  return (<input type="text" value={value} onChange={onChange} />)
}

function ChatInput() {
  const [message, setMessage] = useState('');

  const send = () => {
    if (joinedRoom) {
      joinedRoom.send('chat', message);
      setMessage('');
    }
  }

  return (<>
    <ChatTextInput value={message} onChange={(e) => setMessage(e.target.value)} />
    <ChatButton onClick={send} />
  </>)
}

function ChatRoom() {
  return (<>
    <ChatBuffer />
    <ChatInput />
  </>);
}

export { ChatRoom }