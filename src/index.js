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

async function analyseBuyer(buyer) {
  // do stuff...

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
    await analyseBuyer(buyer);
  })
}

await main();