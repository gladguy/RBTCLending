require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ordinals_API } = require('./IDL/agent');
const { storeInscription } = require('./command');
const app = express();

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

let isProcessing = false;

const getInscriptions = async () => {
    try {
        const result = await ordinals_API.getAllowInscriptions()
        const data = result?.length ? result[0] : [];
        if (data.length) {
            isProcessing = true;
            const revealedPromises = [];
            let lastTimestamp = Date.now();  // Initialize with the current time before the loop starts

            let token_count = 1;

            for (const token of data[1]) {
                console.log(`Adding ${token_count} of ${data[1].length} Inscription ${token}`);  // Adding 1 of 10 Inscription ID 299403
                token_count++;
                const startTimestamp = Date.now();  // Capture time at the start of processing this token
                const result = await storeInscription(data[0], Number(token));
                const endTimestamp = Date.now();  // Capture time after processing this token

                console.log("result", result);
                revealedPromises.push(JSON.parse(result));

                // Calculate and log the time difference in seconds
                const timeDiff = (endTimestamp - startTimestamp) / 1000;
                console.log(`Time taken for ${token}: ${timeDiff} seconds`);

                // Update lastTimestamp to the current token's end timestamp for the next iteration
                lastTimestamp = endTimestamp;
            }
            console.log("revealedPromises", revealedPromises);


            for (const item of revealedPromises) {
                console.log("Processing transaction for", item);
                console.log(JSON.stringify(item));
                const result = await ordinals_API.addTransaction(item.inscriptionNumber, JSON.stringify(item));

            }

            const removeResult = await ordinals_API.removeAllowInscriptions(data[0]);
            if (removeResult) {
                isProcessing = false;
                console.log("Removed allowed inscription details!");
            } else {
                console.log("Error when Removed allowed inscription details!");
            }
        }
    } catch (error) {
        console.error("Error in getInscriptions:", error);
    }
}

setInterval(() => {
    if (!isProcessing) {
        getInscriptions();
    }
}, 10000);

// Error handler
app.use((req, res, next) => {
    const err = new Error('not found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        success: false,
        status: err.status || 500,
        message: err.message
    });
});

app.listen(process.env.APP_PORT, () => {
    console.log(`Running on PORT ${process.env.APP_PORT}`);
});

