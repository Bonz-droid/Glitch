import test from 'node:test';
import assert from 'node:assert/strict';
import {assertArgs,assertDevnet,RPC,GENESIS,SUPPLY} from '../scripts/safety.ts';
test('accetta solo endpoint e genesis devnet corrispondenti',()=>{assert.doesNotThrow(()=>assertDevnet(RPC,GENESIS));for(const endpoint of ['https://api.mainnet-beta.solana.com','https://api.testnet.solana.com',RPC+'/',RPC+'.evil.test'])assert.throws(()=>assertDevnet(endpoint,GENESIS));assert.throws(()=>assertDevnet(RPC,'mainnet-genesis'));});
test('rifiuta override di wallet, RPC e opzioni ambigue',()=>{for(const args of [[],['--execute','--rpc','mainnet'],['--wallet','key.json'],['--execute','--plan'],['--mainnet']])assert.throws(()=>assertArgs(args));assert.equal(assertArgs(['--plan']),'--plan');assert.equal(assertArgs(['--execute']),'--execute');});
test('supply in unità intere senza perdita di precisione',()=>assert.equal(SUPPLY,1_000_000_000_000_000n));
