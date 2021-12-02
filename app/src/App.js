import React from "react";
import Game from "./components/Game";
import Ctx from './Ctx';


function App() {
  const [store] = React.useState(() => {
    const s = new Store();

    // device context
    s.set("powerConnected", false);
    s.set("heartConnected", false);
    s.set("cadenceConnected", false);

    s.set("powerData", []);
    s.set("heartData", []);
    s.set("cadenceData", []);

    // player context
    const storedData = JSON.parse(localStorage.getItem('cat6') || "{}");
    s.set("playerName", storedData.name || "Vance Legstrong");
    s.set("playerWeight", { weight: 0, isKg: true, ...(storedData.weight || {}) });

    // game context
    s.set("gameClient", null);
    s.set("gameRoom", null);
    s.set("gameState", {});
    s.set("gameChat", []);
    s.set("connecting", false);
    s.set("connected", false);

    return s;
  });

  return (
    <main className="App">
      <Ctx.Provider value={store}>
        <Game />
      </Ctx.Provider>
    </main>
  );
}

/* eslint-disable react-hooks/rules-of-hooks */

/// A single-type event emitter (.on(handler) instead of .on(eventName, handler))
class EventType {
  listeners = new Set();

  emit(data) {
    this.listeners.forEach(listener => {
      listener(data);
    });
  }

  on(handler) {
    const listener = data => handler(data);

    this.listeners.add(listener);

    return () => this.listeners.delete(listener);
  }

  use(handler, deps = undefined) {
    //React.useEffect(() => this.on(handler), deps || [handler]);
    // eslint-disable-next-line
    React.useEffect(() => this.on(handler), [...deps, handler]);
  }
}

class Store {
  change = new EventType();
  data = new Map();

  /// Get a key from the store. Doesn't interact with subscriptions.
  get(key) {
    return this.data.get(key);
  }

  /// Update a value in the store. Triggers a change notification.
  set(key, value) {
    this.data.set(key, value);
    this.change.emit(this.data);
    return this;
  }

  /// Example usage inside a React component:
  ///     const foo = store.use(() => store.get('foo'));
  /// The calling component will update if the *return value* of selector has changed.
  use(selector, deps = undefined) {
    const [, forceUpdate] = React.useReducer(c => c + 1, 0);
    const ref = React.useRef(selector(this));
    this.change.use(() => {
      const next = selector(this);
      if (next !== ref.current) {
        ref.current = next;
        forceUpdate();
      }
    }, deps || [selector]);

    return selector(this);
  }
}

export default App;

