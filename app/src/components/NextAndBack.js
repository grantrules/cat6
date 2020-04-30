import React from 'react';

export default ({ next, back, children }) => (
  <>
  {children}
  <button>onClick={back}>Back</button>  <button onClick={next}>Next</button>
  </>)