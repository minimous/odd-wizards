const CHAIN_JSON = [
  {
    chain_id: 'interwoven-1',
    chain_name: 'initia',
    pretty_name: 'Initia',
    description: 'Initia Mainnet',
    website: 'https://initia.xyz',
    fees: {
      fee_tokens: [
        {
          denom: 'uinit',
          fixed_min_gas_price: 0.015,
          low_gas_price: 0.015,
          average_gas_price: 0.015,
          high_gas_price: 0.04
        },
        {
          denom:
            'ibc/6490A7EAB61059BFC1CDDEB05917DD70BDF3A611654162A1A47DB930D40D8AF4'
        }
      ]
    },
    apis: {
      rpc: [
        {
          address: 'https://rpc.initia.xyz',
          provider: 'Initia Labs'
        },
        {
          address: 'https://rpc-skip.initia.xyz',
          provider: 'Initia Labs',
          authorizedUser: 'skip'
        },
        {
          address: 'https://initia-rpc.cosmosspaces.zone',
          provider: 'CosmosSpaces'
        },
        {
          address: 'https://initia-archive.cosmosspaces.zone',
          provider: 'CosmosSpaces'
        }
      ],
      rest: [
        {
          address: 'https://rest.initia.xyz',
          provider: 'Initia Labs'
        },
        {
          address: 'https://rest-skip.initia.xyz',
          provider: 'Initia Labs',
          authorizedUser: 'skip'
        },
        {
          address: 'https://initia-rest.cosmosspaces.zone',
          provider: 'CosmosSpaces'
        }
      ],
      api: [
        {
          address: 'https://api.initia.xyz',
          provider: 'Initia Labs'
        }
      ],
      grpc: [
        {
          address: 'grpc.initia.xyz:443',
          provider: 'Initia Labs'
        },
        {
          address: 'grpc-skip.initia.xyz:443',
          provider: 'Initia Labs',
          authorizedUser: 'skip'
        },
        {
          address: 'https://initia-grpc.cosmosspaces.zone',
          provider: 'CosmosSpaces'
        }
      ]
    },
    explorers: [
      {
        kind: 'initia scan',
        url: 'https://scan.initia.xyz/interwoven-1',
        tx_page: 'https://scan.initia.xyz/interwoven-1/txs/${txHash}',
        account_page:
          'https://scan.initia.xyz/interwoven-1/accounts/${accountAddress}'
      }
    ],
    metadata: {
      is_l1: true,
      assetlist: 'https://registry.initia.xyz/chains/initia/assetlist.json',
      ibc_channels: [
        {
          chain_id: 'osmosis-1',
          port_id: 'transfer',
          channel_id: 'channel-71',
          version: 'ics20-1'
        },
        {
          chain_id: 'noble-1',
          port_id: 'transfer',
          channel_id: 'channel-3',
          version: 'ics20-1'
        },
        {
          chain_id: 'echelon-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-36',
          version: 'ics721-1'
        },
        {
          chain_id: 'echelon-1',
          port_id: 'transfer',
          channel_id: 'channel-35',
          version: 'ics20-1'
        },
        {
          chain_id: 'neutron-1',
          port_id: 'transfer',
          channel_id: 'channel-37',
          version: 'ics20-1'
        },
        {
          chain_id: 'yominet-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-26',
          version: 'ics721-1'
        },
        {
          chain_id: 'yominet-1',
          port_id: 'transfer',
          channel_id: 'channel-25',
          version: 'ics20-1'
        },
        {
          chain_id: 'civitia-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-28',
          version: 'ics721-1'
        },
        {
          chain_id: 'civitia-1',
          port_id: 'transfer',
          channel_id: 'channel-27',
          version: 'ics20-1'
        },
        {
          chain_id: 'intergaze-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-67',
          version: 'ics721-1'
        },
        {
          chain_id: 'intergaze-1',
          port_id: 'transfer',
          channel_id: 'channel-66',
          version: 'ics20-1'
        },
        {
          chain_id: 'inertia-2',
          port_id:
            'wasm.init1wug8sewp6cedgkmrmvhl3lf3tulagm9hnvy8p0rppz9yjw0g4wtq7947m6',
          channel_id: 'channel-70',
          version: '{"fee_version":"ics29-1","app_version":"ics721-1"}'
        },
        {
          chain_id: 'inertia-2',
          port_id: 'transfer',
          channel_id: 'channel-69',
          version: '{"fee_version":"ics29-1","app_version":"ics20-1"}'
        },
        {
          chain_id: 'zaar-mainnet-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-34',
          version: 'ics721-1'
        },
        {
          chain_id: 'zaar-mainnet-1',
          port_id: 'transfer',
          channel_id: 'channel-33',
          version: 'ics20-1'
        },
        {
          chain_id: 'ingnetwork-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-59',
          version: 'ics721-1'
        },
        {
          chain_id: 'ingnetwork-1',
          port_id: 'transfer',
          channel_id: 'channel-58',
          version: 'ics20-1'
        },
        {
          chain_id: 'rave-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-39',
          version: 'ics721-1'
        },
        {
          chain_id: 'rave-1',
          port_id: 'transfer',
          channel_id: 'channel-38',
          version: 'ics20-1'
        },
        {
          chain_id: 'bfb-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-61',
          version: 'ics721-1'
        },
        {
          chain_id: 'bfb-1',
          port_id: 'transfer',
          channel_id: 'channel-60',
          version: 'ics20-1'
        },
        {
          chain_id: 'embrmainnet-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-63',
          version: 'ics721-1'
        },
        {
          chain_id: 'embrmainnet-1',
          port_id: 'transfer',
          channel_id: 'channel-62',
          version: 'ics20-1'
        },
        {
          chain_id: 'rena-nuwa-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-65',
          version: 'ics721-1'
        },
        {
          chain_id: 'rena-nuwa-1',
          port_id: 'transfer',
          channel_id: 'channel-64',
          version: 'ics20-1'
        },
        {
          chain_id: 'milkyway',
          port_id: 'transfer',
          channel_id: 'channel-80',
          version: 'ics20-1'
        },
        {
          chain_id: 'moo-1',
          port_id: 'transfer',
          channel_id: 'channel-29',
          version: 'ics20-1'
        },
        {
          chain_id: 'moo-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-30',
          version: 'ics721-1'
        }
      ]
    },
    logo_URIs: {
      png: 'https://registry.initia.xyz/images/INIT.png'
    },
    slip44: 60,
    bech32_prefix: 'init',
    network_type: 'mainnet'
  },
  {
    chain_id: 'bfb-1',
    chain_name: 'bfb',
    pretty_name: 'Battle for Blockchain',
    description:
      'Fully onchain battle world, where value gets redistributed based on players performance.',
    website: 'https://battleforblockchain.com',
    fees: {
      fee_tokens: [
        {
          denom: 'evm/6ed1637781269560b204c27Cd42d95e057C4BE44',
          fixed_min_gas_price: 3000000000
        }
      ]
    },
    apis: {
      rpc: [
        {
          address: 'https://rpc-bfb-1.anvil.europe-west.initia.xyz'
        }
      ],
      rest: [
        {
          address: 'https://rest-bfb-1.anvil.europe-west.initia.xyz'
        }
      ],
      grpc: [
        {
          address: 'grpc-bfb-1.anvil.europe-west.initia.xyz:443'
        }
      ],
      'json-rpc': [
        {
          address: 'https://jsonrpc-bfb-1.anvil.europe-west.initia.xyz'
        }
      ],
      'json-rpc-websocket': [
        {
          address: 'wss://jsonrpc-ws-bfb-1.anvil.europe-west.initia.xyz'
        }
      ]
    },
    explorers: [
      {
        kind: 'initia scan',
        url: 'https://scan.initia.xyz/bfb-1',
        tx_page: 'https://scan.initia.xyz/bfb-1/txs/${txHash}',
        account_page: 'https://scan.initia.xyz/bfb-1/accounts/${accountAddress}'
      }
    ],
    metadata: {
      op_bridge_id: '28',
      op_denoms: ['uinit'],
      executor_uri: 'https://opinit-api-bfb-1.anvil.europe-west.initia.xyz',
      ibc_channels: [
        {
          chain_id: 'interwoven-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-1',
          version: 'ics721-1'
        },
        {
          chain_id: 'interwoven-1',
          port_id: 'transfer',
          channel_id: 'channel-0',
          version: 'ics20-1'
        }
      ],
      assetlist: 'https://registry.initia.xyz/chains/bfb/assetlist.json',
      minitia: {
        type: 'minievm',
        version: 'v1.0.5'
      }
    },
    logo_URIs: {
      png: 'https://registry.initia.xyz/images/BFB.png'
    },
    slip44: 60,
    bech32_prefix: 'init',
    network_type: 'mainnet',
    evm_chain_id: 3920262608331171
  },
  {
    chain_id: 'civitia-1',
    chain_name: 'civitia',
    pretty_name: 'Civitia',
    description:
      'Mint cities, collect yield, and collaborate within communities to acquire control of the planet.',
    website: 'https://www.civitia.org',
    fees: {
      fee_tokens: [
        {
          denom:
            'l2/2b2d36f666e98b9eecf70d6ec24b882b79f2c8e2af73f54f97b8b670dbb87605',
          fixed_min_gas_price: 0.015
        }
      ]
    },
    apis: {
      rpc: [
        {
          address: 'https://rpc-civitia-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      rest: [
        {
          address: 'https://rest-civitia-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      grpc: [
        {
          address: 'grpc-civitia-1.anvil.asia-southeast.initia.xyz:443'
        }
      ]
    },
    explorers: [
      {
        kind: 'initia scan',
        url: 'https://scan.initia.xyz/civitia-1',
        tx_page: 'https://scan.initia.xyz/civitia-1/txs/${txHash}',
        account_page:
          'https://scan.initia.xyz/civitia-1/accounts/${accountAddress}'
      }
    ],
    metadata: {
      op_bridge_id: '12',
      op_denoms: ['uinit'],
      executor_uri:
        'https://opinit-api-civitia-1.anvil.asia-southeast.initia.xyz',
      ibc_channels: [
        {
          chain_id: 'interwoven-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-1',
          version: 'ics721-1'
        },
        {
          chain_id: 'interwoven-1',
          port_id: 'transfer',
          channel_id: 'channel-0',
          version: 'ics20-1'
        }
      ],
      assetlist: 'https://registry.initia.xyz/chains/civitia/assetlist.json',
      minitia: {
        type: 'minimove',
        version: 'v1.0.2'
      }
    },
    logo_URIs: {
      png: 'https://registry.initia.xyz/images/civitia.png'
    },
    slip44: 60,
    bech32_prefix: 'init',
    network_type: 'mainnet'
  },
  {
    chain_id: 'echelon-1',
    chain_name: 'echelon',
    pretty_name: 'Echelon',
    description:
      'A highly efficient money market connecting liquidity and supercharging yields with LST, RWA, and stablecoin backed lending strategies.',
    website: 'https://echelon.market',
    fees: {
      fee_tokens: [
        {
          denom:
            'l2/23c8396041db74441f4268d0c7e0533177dc3e028a47a8e584318f2d0c46fbe9',
          fixed_min_gas_price: 0.015
        }
      ]
    },
    apis: {
      rpc: [
        {
          address: 'https://rpc-echelon-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      rest: [
        {
          address: 'https://rest-echelon-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      grpc: [
        {
          address: 'grpc-echelon-1.anvil.asia-southeast.initia.xyz:443'
        }
      ]
    },
    explorers: [
      {
        kind: 'initia scan',
        url: 'https://scan.initia.xyz/echelon-1',
        tx_page: 'https://scan.initia.xyz/echelon-1/txs/${txHash}',
        account_page:
          'https://scan.initia.xyz/echelon-1/accounts/${accountAddress}'
      }
    ],
    metadata: {
      op_bridge_id: '16',
      op_denoms: ['uinit'],
      executor_uri:
        'https://opinit-api-echelon-1.anvil.asia-southeast.initia.xyz',
      ibc_channels: [
        {
          chain_id: 'interwoven-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-1',
          version: 'ics721-1'
        },
        {
          chain_id: 'interwoven-1',
          port_id: 'transfer',
          channel_id: 'channel-0',
          version: 'ics20-1'
        }
      ],
      assetlist: 'https://registry.initia.xyz/chains/echelon/assetlist.json',
      minitia: {
        type: 'minimove',
        version: 'v1.0.0-beta.14'
      }
    },
    logo_URIs: {
      png: 'https://registry.initia.xyz/images/echelon.png'
    },
    slip44: 60,
    bech32_prefix: 'init',
    network_type: 'mainnet'
  },
  {
    chain_id: 'embrmainnet-1',
    chain_name: 'embr',
    pretty_name: 'Embr.fun',
    description:
      'A novel launchpad where users can win big by focusing liquidity into the best memes.',
    website: 'https://embr.fun',
    fees: {
      fee_tokens: [
        {
          denom: 'evm/4f7566f67941283a30cf65de7b9c6fdf2c04FCA1',
          fixed_min_gas_price: 10000000000
        }
      ]
    },
    apis: {
      rpc: [
        {
          address: 'https://rpc-embrmainnet-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      rest: [
        {
          address: 'https://rest-embrmainnet-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      grpc: [
        {
          address: 'grpc-embrmainnet-1.anvil.asia-southeast.initia.xyz:443'
        }
      ],
      'json-rpc': [
        {
          address:
            'https://jsonrpc-embrmainnet-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      'json-rpc-websocket': [
        {
          address:
            'wss://jsonrpc-ws-embrmainnet-1.anvil.asia-southeast.initia.xyz'
        }
      ]
    },
    explorers: [
      {
        kind: 'initia scan',
        url: 'https://scan.initia.xyz/embrmainnet-1',
        tx_page: 'https://scan.initia.xyz/embrmainnet-1/txs/${txHash}',
        account_page:
          'https://scan.initia.xyz/embrmainnet-1/accounts/${accountAddress}'
      }
    ],
    metadata: {
      op_bridge_id: '29',
      op_denoms: ['uinit'],
      executor_uri:
        'https://opinit-api-embrmainnet-1.anvil.asia-southeast.initia.xyz',
      ibc_channels: [
        {
          chain_id: 'interwoven-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-1',
          version: 'ics721-1'
        },
        {
          chain_id: 'interwoven-1',
          port_id: 'transfer',
          channel_id: 'channel-0',
          version: 'ics20-1'
        }
      ],
      assetlist: 'https://registry.initia.xyz/chains/embr/assetlist.json',
      minitia: {
        type: 'minievm',
        version: 'v1.0.3'
      }
    },
    logo_URIs: {
      png: 'https://registry.initia.xyz/images/embr.png'
    },
    slip44: 60,
    bech32_prefix: 'init',
    network_type: 'mainnet',
    evm_chain_id: 2598901095158506
  },
  {
    chain_id: 'ingnetwork-1',
    chain_name: 'ingnetwork',
    pretty_name: 'ING Network',
    description: 'Enabling everyone to create interactive entertainment.',
    website: 'https://www.infinityg.ai',
    fees: {
      fee_tokens: [
        {
          denom: 'evm/6ed1637781269560b204c27Cd42d95e057C4BE44',
          fixed_min_gas_price: 15000000000
        }
      ]
    },
    apis: {
      rpc: [
        {
          address: 'https://rpc-ingnetwork-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      rest: [
        {
          address: 'https://rest-ingnetwork-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      grpc: [
        {
          address: 'grpc-ingnetwork-1.anvil.asia-southeast.initia.xyz:443'
        }
      ],
      'json-rpc': [
        {
          address:
            'https://jsonrpc-ingnetwork-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      'json-rpc-websocket': [
        {
          address:
            'wss://jsonrpc-ws-ingnetwork-1.anvil.asia-southeast.initia.xyz'
        }
      ]
    },
    explorers: [
      {
        kind: 'initia scan',
        url: 'https://scan.initia.xyz/ingnetwork-1',
        tx_page: 'https://scan.initia.xyz/ingnetwork-1/txs/${txHash}',
        account_page:
          'https://scan.initia.xyz/ingnetwork-1/accounts/${accountAddress}'
      }
    ],
    metadata: {
      op_bridge_id: '27',
      op_denoms: ['uinit'],
      executor_uri:
        'https://opinit-api-ingnetwork-1.anvil.asia-southeast.initia.xyz',
      ibc_channels: [
        {
          chain_id: 'interwoven-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-1',
          version: 'ics721-1'
        },
        {
          chain_id: 'interwoven-1',
          port_id: 'transfer',
          channel_id: 'channel-0',
          version: 'ics20-1'
        }
      ],
      assetlist: 'https://registry.initia.xyz/chains/ingnetwork/assetlist.json',
      minitia: {
        type: 'minievm',
        version: 'v1.0.3'
      }
    },
    logo_URIs: {
      png: 'https://registry.initia.xyz/images/infinityg.png'
    },
    slip44: 60,
    bech32_prefix: 'init',
    network_type: 'mainnet',
    evm_chain_id: 2780922216980457
  },
  {
    chain_id: 'inertia-2',
    chain_name: 'inertia',
    pretty_name: 'Inertia',
    description: 'The interwoven lending protocol for the modular ecosystem.',
    website: 'https://app.inrt.fi',
    fees: {
      fee_tokens: [
        {
          denom:
            'l2/c88b68df2060ba982a80d3001afcb2d354031f6901df2391acb4f0e2f545c770',
          fixed_min_gas_price: 0.015
        }
      ]
    },
    apis: {
      rpc: [
        {
          address: 'https://rpc.inrt.fi',
          provider: 'Inertia'
        }
      ],
      rest: [
        {
          address: 'https://rest.inrt.fi',
          provider: 'Inertia'
        }
      ],
      grpc: [
        {
          address: 'grpc.inrt.fi:443',
          provider: 'Inertia'
        }
      ]
    },
    explorers: [
      {
        kind: 'initia scan',
        url: 'https://scan.initia.xyz/inertia-2',
        tx_page: 'https://scan.initia.xyz/inertia-2/txs/${txHash}',
        account_page:
          'https://scan.initia.xyz/inertia-2/accounts/${accountAddress}'
      }
    ],
    metadata: {
      op_bridge_id: '32',
      op_denoms: [
        'uinit',
        'ibc/DA9AC2708B4DAA46D24E73241373CDCC850BC6446E8E0906A4062152B649DDD3',
        'ibc/6490A7EAB61059BFC1CDDEB05917DD70BDF3A611654162A1A47DB930D40D8AF4',
        'move/d08cf4d36d8a70cc6efe8791dc5b3d4f928df4fe41468bc138439d55ed132c3e',
        'move/b4fd0119fa43bb5a208256e92977d6552fef31191fe24299fe45f6e64dd5c6f3'
      ],
      executor_uri: 'https://op-executor.inrt.fi',
      ibc_channels: [
        {
          chain_id: 'interwoven-1',
          port_id: 'transfer',
          channel_id: 'channel-0',
          version: '{"fee_version":"ics29-1","app_version":"ics20-1"}'
        },
        {
          chain_id: 'interwoven-1',
          port_id:
            'wasm.init1wug8sewp6cedgkmrmvhl3lf3tulagm9hnvy8p0rppz9yjw0g4wtq7947m6',
          channel_id: 'channel-1',
          version: '{"fee_version":"ics29-1","app_version":"ics721-1"}'
        }
      ],
      assetlist: 'https://registry.initia.xyz/chains/inertia/assetlist.json',
      minitia: {
        type: 'miniwasm',
        version: 'v1.0.2'
      }
    },
    logo_URIs: {
      png: 'https://registry.initia.xyz/images/inertia.png'
    },
    slip44: 60,
    bech32_prefix: 'init',
    network_type: 'mainnet'
  },
  {
    chain_id: 'intergaze-1',
    chain_name: 'intergaze',
    pretty_name: 'Intergaze',
    description: 'The Launchpad and Marketplace for Interwoven NFTs',
    website: 'https://intergaze.xyz',
    fees: {
      fee_tokens: [
        {
          denom:
            'l2/fb936ffef4eb4019d82941992cc09ae2788ce7197fcb08cb00c4fe6f5e79184e',
          fixed_min_gas_price: 0.03
        }
      ]
    },
    apis: {
      rpc: [
        {
          address: 'https://rpc.intergaze-apis.com'
        }
      ],
      rest: [
        {
          address: 'https://rest.intergaze-apis.com'
        }
      ],
      grpc: [
        {
          address: 'grpc.intergaze-apis.com:443'
        }
      ]
    },
    explorers: [
      {
        kind: 'initia scan',
        url: 'https://scan.initia.xyz/intergaze-1',
        tx_page: 'https://scan.initia.xyz/intergaze-1/txs/${txHash}',
        account_page:
          'https://scan.initia.xyz/intergaze-1/accounts/${accountAddress}'
      }
    ],
    metadata: {
      op_bridge_id: '31',
      op_denoms: [
        'uinit',
        'ibc/6490A7EAB61059BFC1CDDEB05917DD70BDF3A611654162A1A47DB930D40D8AF4'
      ],
      executor_uri: 'https://executor.intergaze-apis.com',
      ibc_channels: [
        {
          chain_id: 'interwoven-1',
          port_id:
            'wasm.init1wug8sewp6cedgkmrmvhl3lf3tulagm9hnvy8p0rppz9yjw0g4wtq7947m6',
          channel_id: 'channel-1',
          version: 'ics721-1'
        },
        {
          chain_id: 'interwoven-1',
          port_id: 'transfer',
          channel_id: 'channel-0',
          version: 'ics20-1'
        }
      ],
      assetlist: 'https://registry.initia.xyz/chains/intergaze/assetlist.json',
      minitia: {
        type: 'miniwasm',
        version: 'v1.0.2'
      }
    },
    logo_URIs: {
      png: 'https://registry.initia.xyz/images/intergaze.png'
    },
    slip44: 60,
    bech32_prefix: 'init',
    network_type: 'mainnet'
  },
  {
    chain_id: 'moo-1',
    chain_name: 'moo',
    pretty_name: 'MilkyWay',
    description: 'The Modular Staking Portal',
    website: 'https://www.milkyway.zone',
    fees: {
      fee_tokens: [
        {
          denom:
            'ibc/37A3FB4FED4CA04ED6D9E5DA36C6D27248645F0E22F585576A1488B8A89C5A50',
          fixed_min_gas_price: 0.015
        }
      ]
    },
    apis: {
      rpc: [
        {
          address: 'https://rpc-moo-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      rest: [
        {
          address: 'https://rest-moo-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      grpc: [
        {
          address: 'grpc-moo-1.anvil.asia-southeast.initia.xyz:443'
        }
      ]
    },
    explorers: [
      {
        kind: 'initia scan',
        url: 'https://scan.initia.xyz/moo-1',
        tx_page: 'https://scan.initia.xyz/moo-1/txs/${txHash}',
        account_page: 'https://scan.initia.xyz/moo-1/accounts/${accountAddress}'
      }
    ],
    metadata: {
      op_bridge_id: '13',
      op_denoms: [],
      executor_uri: 'https://opinit-api-moo-1.anvil.asia-southeast.initia.xyz',
      ibc_channels: [
        {
          chain_id: 'interwoven-1',
          port_id: 'transfer',
          channel_id: 'channel-0',
          version: 'ics20-1'
        },
        {
          chain_id: 'interwoven-1',
          port_id:
            'wasm.init1wug8sewp6cedgkmrmvhl3lf3tulagm9hnvy8p0rppz9yjw0g4wtq7947m6',
          channel_id: 'channel-1',
          version: 'ics721-1'
        }
      ],
      assetlist: 'https://registry.initia.xyz/chains/moo/assetlist.json',
      minitia: {
        type: 'miniwasm',
        version: 'v1.0.2'
      }
    },
    logo_URIs: {
      png: 'https://registry.initia.xyz/images/milkyway.png'
    },
    slip44: 60,
    bech32_prefix: 'init',
    network_type: 'mainnet'
  },
  {
    chain_id: 'rave-1',
    chain_name: 'rave',
    pretty_name: 'Rave',
    description:
      'The pioneer quanto perpetuals protocol: trade anything with everything.',
    website: 'https://www.rave.trade',
    fees: {
      fee_tokens: [
        {
          denom: 'evm/4f7566f67941283a30cf65de7b9c6fdf2c04FCA1',
          fixed_min_gas_price: 15000000000
        }
      ]
    },
    apis: {
      rpc: [
        {
          address: 'https://rpc-rave-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      rest: [
        {
          address: 'https://rest-rave-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      grpc: [
        {
          address: 'grpc-rave-1.anvil.asia-southeast.initia.xyz:443'
        }
      ],
      'json-rpc': [
        {
          address: 'https://jsonrpc-rave-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      'json-rpc-websocket': [
        {
          address: 'wss://jsonrpc-ws-rave-1.anvil.asia-southeast.initia.xyz'
        }
      ]
    },
    explorers: [
      {
        kind: 'initia scan',
        url: 'https://scan.initia.xyz/rave-1',
        tx_page: 'https://scan.initia.xyz/rave-1/txs/${txHash}',
        account_page:
          'https://scan.initia.xyz/rave-1/accounts/${accountAddress}'
      }
    ],
    metadata: {
      op_bridge_id: '17',
      op_denoms: [
        'uinit',
        'move/d08cf4d36d8a70cc6efe8791dc5b3d4f928df4fe41468bc138439d55ed132c3e',
        'ibc/6490A7EAB61059BFC1CDDEB05917DD70BDF3A611654162A1A47DB930D40D8AF4'
      ],
      executor_uri: 'https://opinit-api-rave-1.anvil.asia-southeast.initia.xyz',
      ibc_channels: [
        {
          chain_id: 'interwoven-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-1',
          version: 'ics721-1'
        },
        {
          chain_id: 'interwoven-1',
          port_id: 'transfer',
          channel_id: 'channel-0',
          version: 'ics20-1'
        }
      ],
      assetlist: 'https://registry.initia.xyz/chains/rave/assetlist.json',
      minitia: {
        type: 'minievm',
        version: 'v1.0.4'
      }
    },
    logo_URIs: {
      png: 'https://registry.initia.xyz/images/rave.png'
    },
    slip44: 60,
    bech32_prefix: 'init',
    network_type: 'mainnet',
    evm_chain_id: 555110192329996
  },
  {
    chain_id: 'rena-nuwa-1',
    chain_name: 'rena',
    pretty_name: 'Rena',
    description:
      'Building the first Trusted Execution Environment (TEE) abstraction middleware to supercharge verifiable on-chain AI use cases.',
    website: 'https://renalabs.xyz',
    fees: {
      fee_tokens: [
        {
          denom:
            'l2/9d3d65bf3329e45ad659f9cbee7d6dc7b6246b001e32131a9b465215eab90562',
          fixed_min_gas_price: 0.015
        }
      ]
    },
    apis: {
      rpc: [
        {
          address: 'https://rpc-rena-nuwa-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      rest: [
        {
          address: 'https://rest-rena-nuwa-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      grpc: [
        {
          address: 'grpc-rena-nuwa-1.anvil.asia-southeast.initia.xyz:443'
        }
      ]
    },
    explorers: [
      {
        kind: 'initia scan',
        url: 'https://scan.initia.xyz/rena-nuwa-1',
        tx_page: 'https://scan.initia.xyz/rena-nuwa-1/txs/${txHash}',
        account_page:
          'https://scan.initia.xyz/rena-nuwa-1/accounts/${accountAddress}'
      }
    ],
    metadata: {
      op_bridge_id: '30',
      op_denoms: ['uinit'],
      executor_uri:
        'https://opinit-api-rena-nuwa-1.anvil.asia-southeast.initia.xyz',
      ibc_channels: [
        {
          chain_id: 'interwoven-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-1',
          version: 'ics721-1'
        },
        {
          chain_id: 'interwoven-1',
          port_id: 'transfer',
          channel_id: 'channel-0',
          version: 'ics20-1'
        }
      ],
      assetlist: 'https://registry.initia.xyz/chains/rena/assetlist.json',
      minitia: {
        type: 'minimove',
        version: 'v1.0.2'
      }
    },
    logo_URIs: {
      png: 'https://registry.initia.xyz/images/rena.png'
    },
    slip44: 60,
    bech32_prefix: 'init',
    network_type: 'mainnet'
  },
  {
    chain_id: 'yominet-1',
    chain_name: 'yominet',
    pretty_name: 'Yominet',
    description:
      'The first economically independent virtual world living onchain. Home to the Kamigotchi.',
    website: 'https://kamigotchi.io',
    fees: {
      fee_tokens: [
        {
          denom: 'evm/E1Ff7038eAAAF027031688E1535a055B2Bac2546',
          fixed_min_gas_price: 5000000
        }
      ]
    },
    apis: {
      rpc: [
        {
          address: 'https://rpc-yominet-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      rest: [
        {
          address: 'https://rest-yominet-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      grpc: [
        {
          address: 'grpc-yominet-1.anvil.asia-southeast.initia.xyz:443'
        }
      ],
      'json-rpc': [
        {
          address: 'https://jsonrpc-yominet-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      'json-rpc-websocket': [
        {
          address: 'wss://jsonrpc-ws-yominet-1.anvil.asia-southeast.initia.xyz'
        }
      ]
    },
    explorers: [
      {
        kind: 'initia scan',
        url: 'https://scan.initia.xyz/yominet-1',
        tx_page: 'https://scan.initia.xyz/yominet-1/txs/${txHash}',
        account_page:
          'https://scan.initia.xyz/yominet-1/accounts/${accountAddress}'
      }
    ],
    metadata: {
      op_bridge_id: '11',
      op_denoms: ['uinit'],
      executor_uri:
        'https://opinit-api-yominet-1.anvil.asia-southeast.initia.xyz',
      ibc_channels: [
        {
          chain_id: 'interwoven-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-1',
          version: 'ics721-1'
        },
        {
          chain_id: 'interwoven-1',
          port_id: 'transfer',
          channel_id: 'channel-0',
          version: 'ics20-1'
        }
      ],
      assetlist: 'https://registry.initia.xyz/chains/yominet/assetlist.json',
      minitia: {
        type: 'minievm',
        version: 'v1.0.0-rc.0-kami.1'
      }
    },
    logo_URIs: {
      png: 'https://registry.initia.xyz/images/yominet.png'
    },
    slip44: 60,
    bech32_prefix: 'init',
    network_type: 'mainnet',
    evm_chain_id: 428962654539583
  },
  {
    chain_id: 'zaar-mainnet-1',
    chain_name: 'zaar',
    pretty_name: 'Zaar',
    description: 'The Fun Network, where Degeneracy comes to play.',
    website: 'https://flip.zaar.gg/',
    fees: {
      fee_tokens: [
        {
          denom: 'evm/7Fb2A94A13186E3C338f0DA9728B4835D86b1a7B',
          fixed_min_gas_price: 15000000000
        }
      ]
    },
    apis: {
      rpc: [
        {
          address: 'https://rpc-zaar-mainnet-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      rest: [
        {
          address: 'https://rest-zaar-mainnet-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      grpc: [
        {
          address: 'grpc-zaar-mainnet-1.anvil.asia-southeast.initia.xyz:443'
        }
      ],
      'json-rpc': [
        {
          address:
            'https://jsonrpc-zaar-mainnet-1.anvil.asia-southeast.initia.xyz'
        }
      ],
      'json-rpc-websocket': [
        {
          address:
            'wss://jsonrpc-ws-zaar-mainnet-1.anvil.asia-southeast.initia.xyz'
        }
      ]
    },
    explorers: [
      {
        kind: 'initia scan',
        url: 'https://scan.initia.xyz/zaar-mainnet-1',
        tx_page: 'https://scan.initia.xyz/zaar-mainnet-1/txs/${txHash}',
        account_page:
          'https://scan.initia.xyz/zaar-mainnet-1/accounts/${accountAddress}'
      }
    ],
    metadata: {
      op_bridge_id: '15',
      op_denoms: ['uinit'],
      executor_uri:
        'https://opinit-api-zaar-mainnet-1.anvil.asia-southeast.initia.xyz',
      ibc_channels: [
        {
          chain_id: 'interwoven-1',
          port_id: 'nft-transfer',
          channel_id: 'channel-1',
          version: 'ics721-1'
        },
        {
          chain_id: 'interwoven-1',
          port_id: 'transfer',
          channel_id: 'channel-0',
          version: 'ics20-1'
        }
      ],
      assetlist: 'https://registry.initia.xyz/chains/zaar/assetlist.json',
      minitia: {
        type: 'minievm',
        version: 'v1.0.3'
      }
    },
    logo_URIs: {
      png: 'https://registry.initia.xyz/images/ZAAR.png'
    },
    slip44: 60,
    bech32_prefix: 'init',
    network_type: 'mainnet',
    evm_chain_id: 1335097526422335
  }
];

export default CHAIN_JSON;

export class INITIA_CONSTANTS {
  static BECH32_PREFIX = 'init';

  static DEFAULT_MULTIPLIER = 1.4;

  static DEFAULT_API_URL = 'https://api.initia.xyz';

  static DEFAULT_DEX_API_URL = 'https://dex-api.initia.xyz';

  static DEFAULT_EXPLORER_URL = 'https://scan.initia.xyz';

  static DEFAULT_REGISTRY_URL = 'https://registry.initia.xyz';

  static DEFAULT_SWAPLIST_URL = 'https://list.initia.xyz/swaplist.json';

  static DEFAULT_ERRORS_URL = 'https://list.initia.xyz/errors';

  static DEFAULT_MODULES = {
    usernames:
      '0x72ed9b26ecdcd6a21d304df50f19abfdbe31d2c02f60c84627844620a45940ef',
    dex_utils:
      '0xb845fba0d0072c282f6284465933c4b32b1a0d4071604935a7a8d999c85d01fb',
    swap_transfer:
      '0xb845fba0d0072c282f6284465933c4b32b1a0d4071604935a7a8d999c85d01fb'
  };

  static SIGN_MESSAGE = 'Sign this message to identify your initia address.';

  static LOCAL_STORAGE_PREFIX = 'initia-wallet-widget';

  static STORAGE_KEYS = {
    LAST_CONNECTED_WALLET: `${INITIA_CONSTANTS.LOCAL_STORAGE_PREFIX}:last-connected-wallet`,
    ETHEREUM_PUBLIC_KEYS: `${INITIA_CONSTANTS.LOCAL_STORAGE_PREFIX}:ethereum-public-keys`,
    CHAIN_IDS: `${INITIA_CONSTANTS.LOCAL_STORAGE_PREFIX}:chain-ids`,
    FEE_DENOMS: `${INITIA_CONSTANTS.LOCAL_STORAGE_PREFIX}:fee-denoms`,
    OPENED_LAYERS_ASSETS: `${INITIA_CONSTANTS.LOCAL_STORAGE_PREFIX}:opened-layers-assets`,
    OPENED_LAYERS_NFT: `${INITIA_CONSTANTS.LOCAL_STORAGE_PREFIX}:opened-layers-nft`
  };

  static INITIA_DOMAIN = 'initia.xyz';
}

// Contoh penggunaan:
// console.log(INITIA_CONSTANTS.BECH32_PREFIX); // "init"
// console.log(INITIA_CONSTANTS.DEFAULT_API_URL); // "https://api.initia.xyz"
// console.log(INITIA_CONSTANTS.STORAGE_KEYS.LAST_CONNECTED_WALLET); // "initia-wallet-widget:last-connected-wallet"
