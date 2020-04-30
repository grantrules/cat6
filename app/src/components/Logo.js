import React from 'react';
import './Logo.css';

function Cat6Logo() {
  return (<Logo className="logo color-text-flow" text="cat6"/>)
}

function Logo({ text, className }) {
  return (<h1 className={className}>{[...text].map((x,i)=>(<span key={i}>{x}</span>))}</h1>)
}


export default Cat6Logo;