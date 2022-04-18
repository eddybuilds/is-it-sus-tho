import { 
  getAddressData,
  getAddressesFromTxs,
  getCurrentBlockHeight,
  getTxsFromAddress
 } from './queries.js';

import {
  rateAccount
} from './buyerRating.js';

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

async function main() {  
  let nftCollectionTxs = await getTxsFromAddress('0x1EAEaAEfFf5526B796EB3eB116cAbCd2805f7ea2');
  let nftCollectionAddresses = await getAddressesFromTxs(nftCollectionTxs);

  buyerAccounts = []

  nftCollectionAddresses.forEach(async address => {
    let response = await getAddressData(address);
    buyers.push(response);
  })

  buyerAccounts.forEach(async buyer => {
    await rateAccount(buyer);
  })
}

await main();