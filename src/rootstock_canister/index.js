export const rootstockApiFactory = ({ IDL }) => {
    const AddressPair = IDL.Record({
        'bitcoinAddress': IDL.Text,
        'ethereumAddress': IDL.Text,
    });
    return IDL.Service({
        'addUserSupply': IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
        'getUserSupply': IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
        'resetSupply': IDL.Func([], [IDL.Bool], []),
        'retrieve': IDL.Func([IDL.Text], [IDL.Opt(IDL.Nat)], ['query']),
        'retrieveByBitcoinAddress': IDL.Func(
            [IDL.Text],
            [IDL.Opt(IDL.Text)],
            ['query'],
        ),
        'retrieveByEthereumAddress': IDL.Func(
            [IDL.Text],
            [IDL.Opt(IDL.Text)],
            ['query'],
        ),
        'retrieveById': IDL.Func([IDL.Nat], [IDL.Opt(AddressPair)], ['query']),
        'storeAddress': IDL.Func([AddressPair], [IDL.Nat], []),
    });
};