import assert from 'node:assert/strict';
import fs from 'node:fs';
import {normalizeBasketball} from './normalize.mjs';
const teams=[{id:1,name:'Nebraska Cornhuskers',abbr:'NEB',conference:'Big Ten'},{id:2,name:'Creighton Bluejays',abbr:'CREI',conference:'Big East'}];
const games=[{id:'1',completed:true,neutralSite:false,homeTeam:'Nebraska Cornhuskers',awayTeam:'Creighton Bluejays',homePoints:78,awayPoints:72}];
const row=(name,fg,three,ft,reb,to)=>({team:{displayName:name},statistics:[{name:'fieldGoalsMade-fieldGoalsAttempted',displayValue:fg},{name:'threePointFieldGoalsMade-threePointFieldGoalsAttempted',displayValue:three},{name:'freeThrowsMade-freeThrowsAttempted',displayValue:ft},{name:'offensiveRebounds',displayValue:String(reb)},{name:'defensiveRebounds',displayValue:'22'},{name:'turnovers',displayValue:String(to)},{name:'assists',displayValue:'15'}]});
const data=normalizeBasketball({season:2027,teams,games,summaries:[{boxscore:{teams:[row('Nebraska Cornhuskers','28-60','8-22','14-18',10,11),row('Creighton Bluejays','26-58','9-25','11-14',8,13)]}}]});
assert.equal(Object.keys(data.teams).length,2);assert.equal(data.teams['Nebraska Cornhuskers'].model.ppg,78);assert.equal(data.teams['Nebraska Cornhuskers'].gamesPlayed,1);assert.ok(Number.isFinite(data.teams['Nebraska Cornhuskers'].power));
const livePath=new URL('./live-data.json',import.meta.url);if(fs.existsSync(livePath)){const live=JSON.parse(fs.readFileSync(livePath));assert.ok(live.teams&&live.games)}
console.log('Basketball normalizer tests passed.');
