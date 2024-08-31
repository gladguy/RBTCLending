require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { getAllAssets } = require('./fetch_collection');
const { RootstockAPI } = require('./IDL/agent');

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Home Router
app.get('/', (req, res, next) => {
    res.send(`<pre style="color:white; background-color:black">
      RootStock Floor Updator
    </pre>`);
})

const getNewAddress = async () => {
    try {
        const collections = await RootstockAPI.getApprovedCollections();
        const getAllAssetsResult = await getAllAssets(collections);
        const result = await RootstockAPI.set_collections(JSON.stringify(getAllAssetsResult));
        console.log(getAllAssetsResult);
        if (result) {
            console.log("Going Good !");
        } else {
            console.log("Check it!, Something wrong");
        }
    } catch (error) {
        console.log("Catch::Check it!, Something wrong", error);
    }
}

setInterval(() => {
    getNewAddress();
}, [process.env.COLLECTIONS_FETCH_INTERVAL])
getNewAddress();

// Error handler
app.use((req, res, next) => {
    const err = new Error('not found');
    err.status = 404;
    next(err)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        success: false,
        status: err.status || 500,
        message: err.message
    })
})

app.listen(process.env.APP_PORT, () => {
    console.log(`Running on PORT ${process.env.APP_PORT}`);
})