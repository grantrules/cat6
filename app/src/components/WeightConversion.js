import React from 'react';

function WeightConversion({ name, weightObj: { weight, isKg }, update }) {

  const kgToLbs = (n) => n * 1 / 0.453592;
  const lbsToKg = (n) => n * 0.453592;
  const radioChange = ({ weight, isKg }) => update({ weight, isKg });

  const onChange = ({ target: { value } }) => {
    const weight = isKg ? value : (Math.round(lbsToKg(value) * 10) / 10);
    update({ weight, isKg });
  }

  return (<>
    {/*}
    <ul>
      <li>weight: {weight}</li>
      <li>kg: {weight}</li>
      <li>lbs: {kgToLbs(weight)}</li>
      <li>isKg: {isKg ? 'y' : 'n'}</li>
    </ul>
  */}

    <div className="weightconversion">
      <input type="number" name={name} value={isKg ? weight : Math.round(kgToLbs(weight))} onChange={onChange} />
      <div>
        <label>
          <input type="radio" checked={isKg} onChange={() => radioChange({ isKg: true, weight: Math.round(kgToLbs(weight)) })} />
          <span>kg</span>
        </label>
        <label>
          <input type="radio" checked={!isKg} onChange={() => radioChange({ isKg: false, weight: Math.round(lbsToKg(weight) * 10) / 10 })} />
          <span>lbs</span>
        </label>
      </div>
    </div>
  </>)


}

export default WeightConversion;