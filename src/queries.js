import { 
  TOKEN 
} from './config.js';

//#region BlockCypher API Calls
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

async function getAddressData(address) {
  let response = await callBlockCypherApi('https://api.blockcypher.com/v1/eth/main/addrs/' + address);
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

async function getCurrentBlockHeight() {
  let response = await callBlockCypherApi('https://api.blockcypher.com/v1/eth/main');
  return response['height'];
}

async function getTxsFromAddress(address) {
  let response = await callBlockCypherApi('https://api.blockcypher.com/v1/eth/main/addrs/' + address);
  return response;
}
//#endregion

export {
  getAddressData,
  getAddressesFromTxs,
  getCurrentBlockHeight,
  getTxsFromAddress,
}