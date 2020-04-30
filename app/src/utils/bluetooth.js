const devices = new Map([
  ['power', {
    device: 'cycling_power',
    name: 'Power Meter',
    characteristic: 'cycling_power_measurement',
    connected: 'powerConnected',
  }],
  ['cadence', {
    device: 'cadence',
    name: 'Cadence Sensor',
    characteristic: 'cadence',
    connected: 'cadenceConnected',
  }],
  ['heart', {
    device: 'heart_rate',
    name: 'Heart Rate Sensor',
    characteristic: 'heart_rate_measurement',
    connected: 'heartConnected',
  }],
]);

const findDevice = async (type) => navigator["bluetooth"].requestDevice({
  filters: [{ services: [type] }]
});

const connectDevice = async (device) => device.gatt.connect();

const connect = async (type, setConnected, setData) => {
  const { device: deviceType, characteristic: characteristicName } = devices.get(type);

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
    event => {
      let value = event.target.value.getInt16(1);
      setData(value);
    }
  );
  
}

export { connect, devices };