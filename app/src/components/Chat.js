import React, { useContext, useState, useEffect } from 'react';
import Ctx from '../Ctx';

function ChatBuffer() {
  const store = useContext(Ctx);
  const gameRoom = store.use(() => store.get("gameRoom"));

  const chat = store.use(() => store.get("gameChat"));

  useEffect(() => {
    if (gameRoom) {
      gameRoom.onMessage('chat',
        (message) => store.set('gameChat', [...chat, message])
      );
    }
    return () => store.set('gameChat', []);
  }, [store, chat]);


  return (<>
    {chat.map(
      ({ from, message }, i) => (<li key={i}>{from}: {message}</li>)
    )}
  </>)

}

function ChatButton() {
  return (<button type="submit">Send</button>)

}

function ChatTextInput({ value, onChange }) {
  return (<input type="text" value={value} onChange={onChange} />)
}

function ChatInput() {
  const [message, setMessage] = useState('');
  
  const store = useContext(Ctx);
  const gameRoom = store.use(() => store.get("gameRoom"));

  const send = () => {
    if (gameRoom && message) {
      gameRoom.send('chat', message);
      setMessage('');
    }
  }

  const onSubmit = (e) => {
    e.preventDefault();
    send();
  }

  return (<>
    <form onSubmit={onSubmit}>
      <ChatTextInput value={message} onChange={(e) => setMessage(e.target.value)} />
      <ChatButton />
    </form>
  </>)
}

function ChatRoom() {
  return (<>
    <ChatBuffer />
    <ChatInput />
  </>);
}

export { ChatRoom }