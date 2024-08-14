const idlFactory = ({ IDL }) => {
  const EthereumAddress = IDL.Text;
  const AddressPair = IDL.Record({
    'bitcoinAddress' : IDL.Text,
    'ethereumAddress' : IDL.Text,
  });
  return IDL.Service({
    'acceptCycles' : IDL.Func([], [], []),
    'addTransaction' : IDL.Func([IDL.Text, IDL.Text], [], ['oneway']),
    'addUserSupply' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'allowInscriptions' : IDL.Func([EthereumAddress, IDL.Text], [IDL.Bool], []),
    'availableCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'deleteAllowInscriptions' : IDL.Func(
        [EthereumAddress, IDL.Text],
        [IDL.Bool],
        [],
      ),
    'deleteTransactionByKey' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'getAllowInscriptions' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(EthereumAddress, IDL.Vec(IDL.Text)))],
        ['query'],
      ),
    'getTransactionByKey' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Text)],
        ['query'],
      ),
    'getUserSupply' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
    'resetSupply' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'retrieve' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Nat)], ['query']),
    'retrieveByBitcoinAddress' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Text)],
        ['query'],
      ),
    'retrieveByEthereumAddress' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Text)],
        ['query'],
      ),
    'retrieveById' : IDL.Func([IDL.Nat], [IDL.Opt(AddressPair)], ['query']),
    'storeAddress' : IDL.Func([AddressPair], [IDL.Nat], []),
    'wallet_receive' : IDL.Func(
        [],
        [IDL.Record({ 'accepted' : IDL.Nat64 })],
        [],
      ),
  });
};

module.exports = { idlFactory };
