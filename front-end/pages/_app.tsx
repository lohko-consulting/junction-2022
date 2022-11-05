// @ts-nocheck
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WagmiConfig, createClient, configureChains, Chain } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

const binanceChain: Chain = {
  id: 97,
  name: "Binance Smart Chain Mainnet",
  network: "binance-smart chain mainnet",
  nativeCurrency: {
    name: "Binance Chain Native Token",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://data-seed-prebsc-1-s1.binance.org:8545",
  },
  blockExplorers: {
    default: { name: "Bscscan", url: "https://bscscan.com" },
  },
  testnet: true,
};

const binanceTestChain: Chain = {
  id: 56,
  name: "Binance Smart Chain Testbet",
  network: "binance-smart chain testnet",
  nativeCurrency: {
    name: "Binance Chain Native Token",
    symbol: "TBNB",
    decimals: 18,
  },
  rpcUrls: {
    binance: "https://data-seed-prebsc-1-s1.binance.org:8545"
  },
  blockExplorers: {
    default: { name: "Bscscan", url: "https://explorer.binance.org/smart-testnet" },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [binanceChain],
  [publicProvider()],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== binanceChain.id) return null;
        return { http: chain.rpcUrls.default };
      },
    }),
  ]
);

const client = createClient({
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  autoConnect: true,
  chains,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return  <WagmiConfig client={client}><Component {...pageProps} /></WagmiConfig>
}

export default MyApp
