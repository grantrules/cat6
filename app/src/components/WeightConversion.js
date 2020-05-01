import React from 'react';

function WeightConversion({ name, weight, isKg, update }) {

  const kgToLbs = (n) => n * 1 / 0.453592;
  const lbsToKg = (n) => n * 0.453592;
  const radioChange = ({ weight, isKg }) => update({ weight, isKg });

  const onChange = ({ target: { value } }) => {
    const weight = Math.round(value * (isKg ? 1 : 1 / 0.45359237));
    update({ weight, isKg });
  }
  return (<>
    {/*<ul>
      <li>weight: {weight}</li>
      <li>kg: {weight}</li>
      <li>lbs: {kgToLbs(weight)}</li>
      <li>isKg: {isKg ? 'y' : 'n'}</li>
    </ul>*/}


    <input type="number" name={name} value={isKg ? weight : Math.round(kgToLbs(weight))} onChange={onChange} />
    <input type="radio" checked={isKg} onChange={() => radioChange({ isKg: true, weight: Math.round(kgToLbs(weight)) })} />kg
    <input type="radio" checked={!isKg} onChange={() => radioChange({ isKg: false, weight: Math.round(lbsToKg(weight)) })} />lbs
  </>)


}

export default WeightConversion;