import { env } from 'process';
require('dotenv').config();

const config = (network: string) => {
  switch(network){
    case "testnet":
      return {
        collection_address: env.NEXT_PUBLIC_COLLECTION_ADDRESS || 'stars1n3hf6qf3azpx0ml9axn9pdgypr3sm07cgcmg0es7lq26vamhnmss742w7l',
        graphql_url: env.NEXT_PUBLIC_GRAPHQL_URL_TESTNET || 'https://galaxy-graphql-testnet.lab.stargaze-apis.com/graphql'
      }
    case "mainnet":
      return {
        collection_address: env.NEXT_PUBLIC_COLLECTION_ADDRESS || 'stars1j9rk6fte8j2qlwx6qewxh6ezu83r0a290j4wemn0h0hjw37fn3wqvzan3s',
        graphql_url: env.NEXT_PUBLIC_GRAPHQL_URL_MAINNET || 'https://graphql.mainnet.stargaze-apis.com/graphql'
      }
  }
}

const getConfig = () => {
  return config(env.NEXT_PUBLIC_NETWORK || 'mainnet');
};

export default getConfig;
