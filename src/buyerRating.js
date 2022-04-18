function parseData(accountData) {
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

  return {
    totalReceived: totalReceived,
    totalSent: totalSent,
    balance: balance,
    numberOfTxs: numberOfTxs,
    confirmedNumberOfTxs: confirmedNumberOfTxs,
    txs: txs,
    txBlockHeights: txBlockHeights,
    txValues: txValues,
    tradingAddresses: tradingAddresses,
  }
}

function rateAccount(accountData) {
  
  let rating = 0;

  // Analyse Data
  // ...
  let data = parseData(accountData);
  let accountAge = (getCurrentBlockHeight - Math.min(...data.txBlockHeights));
  let numberOfTradingAccounts = length(new Set(data.tradingAddresses));

  // Impact Rating

  // Account only ever traded once for this NFT? 
  if (numberOfTradingAccounts == 1) {
    return rating;
  }

  return rating;
}

export { rateAccount };