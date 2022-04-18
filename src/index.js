import fetch from 'node-fetch';


async function callApi(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function parseChildren(address) {
  let childrenAddresses = [];
  let data = [];

  let response = await callApi('https://api.blockcypher.com/v1/eth/main/addrs/' + address);
  
  response['txref'].forEach(txref => {
    childrenAddresses.push(txref.address);
  });

  childrenAddresses.forEach(address => {
    let response = await callApi('https://api.blockcypher.com/v1/eth/main/addrs/' + address);
    let childData = parseAddress(response);
    data.push(childData);
  })

  return data;
}

function parseAddress(inputData) {
  let data = {
    address: inputData['address'],
    totalReceived: inputData['total_received'],
    totalSent: inputData['total_sent'],
    txs: inputData['n_tx']
  }

  return data;
}

async function main() {  
  let childrenTxs = parseChildren('0x1EAEaAEfFf5526B796EB3eB116cAbCd2805f7ea2');
  console.log(childrenTxs);
}

main();