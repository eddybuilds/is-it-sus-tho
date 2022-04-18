import fetch from 'node-fetch';

import { TOKEN } from './config.js';

/*
IS IT SUS THO? 
Check the probably genuinity of NFT buyers

1. Pass in the address of an NFT collection
2. Get all txs from the NFT collection
3. Get all addresses from those txs, to find the Buyers
4. Check those addresses for
  a. Age
  b. Funds I/O
  ....

API Docs: https://www.blockcypher.com/dev/ethereum/
*/

let memoizedApiCalls = new Map();

async function callBlockCypherApi(url) {
  if (memoizedApiCalls.has(url)) {
    return memoizedApiCalls.get(url)
  }

  const response = await fetch(url + '?token=' + TOKEN);
  const data = await response.json();

  memoizedApiCalls.set(url, data);
  return data;
}

async function getTxsFromAddress(address) {
  let response = await callBlockCypherApi('https://api.blockcypher.com/v1/eth/main/addrs/' + address);
  return response;
}

async function getNftCollectionTxs() {
  let response = await getTxsFromAddress('0x1EAEaAEfFf5526B796EB3eB116cAbCd2805f7ea2');
  return response;
}

async function getAddressesFromTxs(txs) {
  let addresses = [];

  txs.foreach(async tx => {
      let response = await callBlockCypherApi('https://api.blockcypher.com/v1/eth/main/txs/' + tx);
      addresses.push(response['addresses']);
  })

  return addresses;
}

async function getAddressData(address) {
  let response = await callBlockCypherApi('https://api.blockcypher.com/v1/eth/main/addrs/' + address);
  return response;
}

async function getCurrentBlockHeight() {
  let response = await callBlockCypherApi('https://api.blockcypher.com/v1/eth/main');
  return response['height'];
}

async function analyzeBuyer(buyer) {
  // do stuff...
  let totalReceived = buyer['total_received'];
  let totalSent = buyer['total_sent'];
  let balance = buyer['balance'];
  let numberOfTxs = buyer['n_tx'];
  let confirmedNumberOfTxs = buyer['final_n_tx'];

  let txs = buyer['txrefs'];
  let txBlockHeights = []
  let txValues = []
  let tradingAddresses = []

  txs.forEach(async tx => {
    txBlockHeights.push(tx['block_height']);
    txValues.push(tx['value']);
    let addresses = await getAddressesFromTxs(tx['tx_hash']);
    tradingAddresses.push(addresses);
  })

  let accountAge = (await getCurrentBlockHeight - Math.min(...txBlockHeights));
  let numberOfTradingAccounts = length(new Set(tradingAddresses));
}

async function main() {  
  let nftCollectionTxs = await getNftCollectionTxs('0x1EAEaAEfFf5526B796EB3eB116cAbCd2805f7ea2');
  let nftCollectionAddresses = await getAddressesFromTxs(nftCollectionTxs);

  buyers = []

  nftCollectionAddresses.forEach(async address => {
    let response = await getAddressData(address);
    buyers.push(response);
  })

  buyers.forEach(async buyer => {
    await analyzeBuyer(buyer);
  })
}

await main();