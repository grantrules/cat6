import React from 'react';
import Ctx from '../Ctx';


export default function DeviceData({ type }) {

  const stateField = `${type}Data`;

  const store = React.useContext(Ctx);
  const data = store.use(() => store.get(stateField)) || []; 
  const last = data.length > 0 ? data[data.length-1] : "NA";

  return (<>{last}</>)  
}