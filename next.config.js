/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'ludus.id',
      'wallpapers.com',
      'wallpapercave.com',
      'encrypted-tbn0.gstatic.com',
      'image-cdn.hypb.st',
      's9oawqeuub.ufs.sh'
    ]
  },
  webpack: (config, { isServer }) => {
    // Abaikan parsing untuk modul chrome-aws-lambda
    config.externals = config.externals || [];
    config.externals.push({
      'chrome-aws-lambda': 'commonjs chrome-aws-lambda'
    });

    // Fix untuk node-hid dan dependensi hardware wallet lainnya di Vercel
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'node-hid': false,
        usb: false,
        serialport: false
      };
    }

    // Ignore node-hid dan dependensi hardware wallet untuk client-side
    config.externals.push({
      'node-hid': 'commonjs node-hid',
      usb: 'commonjs usb',
      '@ledgerhq/hw-transport-node-hid':
        'commonjs @ledgerhq/hw-transport-node-hid',
      '@ledgerhq/hw-transport-node-hid-noevents':
        'commonjs @ledgerhq/hw-transport-node-hid-noevents'
    });

    config.optimization.minimize = false;

    return config;
  }
};

module.exports = nextConfig;
