const { getTxData } = require("./fetch-assets");
const address = "bc1pjj4uzw3svyhezxqq7cvqdxzf48kfhklxuahyx8v8u69uqfmt0udqlhwhwz";
const FIRST_TXID = "0852ccac9e96667fe238fe399ca010cfb1036a2270fee5c521498539d1a8604d";

// (async () => {
//     let PAGE_NO = 1;
//     const fetchAllTxs = async (page) => {
//         const txs = await getTxData(address, page);
//         if (txs.length === 10) {
//             PAGE_NO += 1;
//             return txs.concat(await fetchAllTxs(PAGE_NO));
//         } else {
//             return txs;
//         }
//     }

//     const result = await fetchAllTxs(PAGE_NO);
//     console.log("Result", result);
// })()

(async () => {
    let PAGE_NO = 1;
    const fetchTxs = async (page, tx_id) => {
        const txs = await getTxData(address, page);

        if (tx_id) {
            const Index_Of_Tx = txs.findIndex((tx) => tx.txid === tx_id);
            if (Index_Of_Tx === -1) {
                PAGE_NO += 1;
                return txs.concat(await fetchTxs(PAGE_NO, tx_id));
            } else {
                return txs.splice(0, Index_Of_Tx);
            }
        } else {
            if (txs.length === 10) {
                PAGE_NO += 1;
                return txs.concat(await fetchTxs(PAGE_NO));
            } else {
                return txs;
            }
        }
    }

    const result = await fetchTxs(PAGE_NO, FIRST_TXID);
    console.log("Result", result, result.length);
})()