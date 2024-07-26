const { idlFactory } = require('./ordinals.did');
const HttpAgent = require("@dfinity/agent").HttpAgent;
const Actor = require("@dfinity/agent").Actor;

const canisterId = process.env.ROOTSTOCK_CANISTER_ID;

const agent = new HttpAgent({
    host: process.env.HTTP_AGENT_ACTOR_HOST,
})

const ordinals_API = Actor.createActor(idlFactory, {
    agent,
    canisterId: canisterId
});

module.exports = { ordinals_API };