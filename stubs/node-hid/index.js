// Stub implementation for node-hid to avoid build issues on serverless platforms
// This provides a minimal compatible interface but throws errors if actually used

class HID {
  constructor() {
    throw new Error(
      'Hardware USB access not supported in serverless environment'
    );
  }
}

module.exports = {
  HID,
  devices: () => [],
  getDevices: () => [],
  setDriverType: () => {}
};
