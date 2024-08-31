const { idlFactory } = require('./idlFactory');

const HttpAgent = require("@dfinity/agent").HttpAgent;
const Actor = require("@dfinity/agent").Actor;

const rootstockCanisterId = process.env.ROOTSTOCK_CANISTER_ID;

const Agent = new HttpAgent({
    host: process.env.HTTP_AGENT_ACTOR_HOST,
})

const RootstockAPI = Actor.createActor(idlFactory, {
    agent: Agent,
    canisterId: rootstockCanisterId
});

module.exports = { RootstockAPI };