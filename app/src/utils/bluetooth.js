const devices = new Map([
  ['power', {
    device: 'cycling_power',
    name: 'Power Meter',
    characteristic: 'cycling_power_measurement',
    connected: 'powerConnected',
    characteristicHandler: (setData) => (event) => {
      const value = event.target.value.getInt16(1);
      console.log(`power sensor read `, value);
      setData(value);
    }
  }],
  ['cadence', {
    device: 'cadence',
    name: 'Cadence Sensor',
    characteristic: 'cadence',
    connected: 'cadenceConnected',
    characteristicHandler: (setData) => (event) => {
      const value = event.target.value.getInt8(1);
      console.log(`cadence sensor read `, value);
      setData(value);
    }
  }],
  ['heart', {
    device: 'heart_rate',
    name: 'Heart Rate Sensor',
    characteristic: 'heart_rate_measurement',
    connected: 'heartConnected',
    characteristicHandler: (setData) => (event) => {
      const value = event.target.value.getInt8(1);
      console.log(`heart sensor read `, value);
      setData(value);
    }
  }],
]);

const findDevice = async (type) => navigator["bluetooth"].requestDevice({
  filters: [{ services: [type] }]
});

const connectDevice = async (device) => device.gatt.connect();

const connect = async (type, setConnected, setData) => {
  const { device: deviceType, characteristic: characteristicName, characteristicHandler } = devices.get(type);

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
    "characteristicvaluechanged",
    characteristicHandler(setData)
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