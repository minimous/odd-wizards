import { env } from 'process';
require('dotenv').config();

const config = (network: string) => {
  switch(network){
    case "testnet":
      return {
        collection_address: env.NEXT_PUBLIC_COLLECTION_ADDRESS || 'stars1n3hf6qf3azpx0ml9axn9pdgypr3sm07cgcmg0es7lq26vamhnmss742w7l',
        graphql_url: env.NEXT_PUBLIC_GRAPHQL_URL_TESTNET || 'https://galaxy-graphql-testnet.lab.stargaze-apis.com/graphql',
        ranking_reward: env.NEXT_PUBLIC_RANKING_RWARD_TESTNET || 100
      }
    case "mainnet":
      return {
        collection_address: env.NEXT_PUBLIC_COLLECTION_ADDRESS || 'stars1vjxr6hlkjkh0z5u9cnktftdqe8trhu4agcc0p7my4pejfffdsl5sd442c7',
        graphql_url: env.NEXT_PUBLIC_GRAPHQL_URL_MAINNET || 'https://graphql.mainnet.stargaze-apis.com/graphql',
        ranking_reward: env.NEXT_PUBLIC_RANKING_RWARD_MAINNET || 100
      }
  }
}

const getConfig = () => {
  return config(env.NEXT_PUBLIC_NETWORK || 'mainnet');
};

export default getConfig;
