const { idlFactory } = require('./idl');
const HttpAgent = require("@dfinity/agent").HttpAgent;
const Actor = require("@dfinity/agent").Actor;

const ordinalsCanisterId = process.env.ROOTSTOCK_CANISTER_ID;

const ordinalsAgent = new HttpAgent({
    host: process.env.HTTP_AGENT_ACTOR_HOST,
})

const ordinals_API = Actor.createActor(idlFactory, {
    agent: ordinalsAgent,
    canisterId: ordinalsCanisterId
});

module.exports = { ordinals_API };
