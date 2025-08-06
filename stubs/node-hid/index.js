// Stub implementation for hardware wallet packages to avoid build issues on serverless platforms
// This provides a minimal compatible interface for both node-hid and ledger packages

console.log(
  'Using stub implementation for hardware wallet - hardware wallets not supported in serverless environment'
);

class HID {
  constructor() {
    throw new Error(
      'Hardware USB access not supported in serverless environment'
    );
  }
}

class Transport {
  constructor() {
    throw new Error(
      'Hardware wallet transport not supported in serverless environment'
    );
  }

  static async create() {
    throw new Error(
      'Hardware wallet transport not available in serverless environment'
    );
  }

  static isSupported() {
    return false;
  }

  static list() {
    return Promise.resolve([]);
  }
}

// node-hid interface
module.exports = {
  HID,
  devices: () => [],
  getDevices: () => [],
  setDriverType: () => {}
};

// Ledger transport interface (for compatibility)
module.exports.Transport = Transport;
module.exports.TransportNodeHid = Transport;
module.exports.default = Transport;
