const devices = new Map([
  ['power', {
    device: 'cycling_power',
    name: 'Power Meter',
    characteristic: 'cycling_power_measurement',
    connected: 'powerConnected',
    getValue: (value) => value.getInt16(1),
  }],
  ['cadence', {
    device: 'cadence',
    name: 'Cadence Sensor',
    characteristic: 'cadence',
    connected: 'cadenceConnected',
    getValue: (value) => value.getInt8(1),
  }],
  ['heart', {
    device: 'heart_rate',
    name: 'Heart Rate Sensor',
    characteristic: 'heart_rate_measurement',
    connected: 'heartConnected',
    getValue: (value) => value.getInt8(1),
  }],
]);

const findDevice = async (type) => navigator["bluetooth"].requestDevice({
  filters: [{ services: [type] }]
});

const connectDevice = async (device) => device.gatt.connect();

const connect = async (type, setConnected, setData) => {
  const { device: deviceType, characteristic: characteristicName, getValue } = devices.get(type);

  const device = await findDevice(deviceType);

  const server = await connectDevice(device);

  const service = await server.getPrimaryService(deviceType);



  const characteristic = await service.getCharacteristic(
    characteristicName
  );

  async function startNotifications() {
    const notifications = await characteristic.startNotifications();
    return notifications;
  }

  startNotifications().then(() => {
    console.log('connected');
    setConnected(true);
  }).catch(err => { console.log(err); throw new Error(err.message); });

  await characteristic.addEventListener(
    "characteristicvaluechanged",(event) => {
      const value = getValue(event.target.value);
      console.log(`${type} sensor read `, value);
      setData(value);
    }
  );

}


const add = (max) => (data, val) => {
  const newData = [...data, val];
  if (data.length === max) {
    const [, ...remaining] = newData;
    return remaining;
  }
  return newData;
}

const addToArray = add(10);


const reducer = {
  heart: (data) => {
    const { sum, num, times } = data.reduce((acc, cur) => {
      const { data, time } = cur;
      const { sum, num, times } = acc;
      return { sum: sum + data, num: num + 1, times: [...times, time] };
    }, { sum: 0, num: 0, times: [] })

    const timeDiff = (Math.max(times)-Math.min(times))/1000;
    const avg = sum / num;

  }
}

export { connect, devices, addToArray, reducer };