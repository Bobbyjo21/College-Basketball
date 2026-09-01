import fs from 'node:fs/promises';
import {normalizeBasketball} from './normalize.mjs';

const API='https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball';
const now=new Date(),defaultSeason=now.getUTCMonth()<6?now.getUTCFullYear():now.getUTCFullYear()+1;
const season=Number(process.env.CBB_SEASON||defaultSeason),warnings=[];
async function request(path){const r=await fetch(API+path,{headers:{'User-Agent':'College-Hoops-Lab/1.0'}});if(!r.ok)throw Error(`${r.status} ${path}`);return r.json()}
async function optional(label,path){try{return await request(path)}catch(e){warnings.push(`${label}: ${e.message}`);return null}}

console.log(`Updating ${season} Division I men's basketball data…`);
const teamPayload=await request('/teams?limit=500&groups=50');
const rawTeams=teamPayload?.sports?.[0]?.leagues?.[0]?.teams??[];
const teams=rawTeams.map((x,id)=>{const t=x.team??x;return{id:t.id??id,espnId:t.id,name:t.displayName||t.name,abbr:t.abbreviation,conference:t.groups?.name||t.group?.name||'Division I',color:t.color}}).filter(t=>t.name);
const board=await request(`/scoreboard?dates=${season}&groups=50&limit=10000`),events=board.events??[],games=[];
for(const event of events){const c=event.competitions?.[0],home=c?.competitors?.find(x=>x.homeAway==='home'),away=c?.competitors?.find(x=>x.homeAway==='away');if(!home||!away)continue;games.push({id:event.id,week:event.week?.number??'',startDate:event.date,completed:event.status?.type?.completed===true,neutralSite:c.neutralSite===true,venueId:c.venue?.id??event.id,venue:c.venue?.fullName,homeTeam:home.team?.displayName,awayTeam:away.team?.displayName,homePoints:Number(home.score),awayPoints:Number(away.score)})}
const completed=games.filter(g=>g.completed),summaries=[];
for(let i=0;i<completed.length;i+=20){const batch=await Promise.all(completed.slice(i,i+20).map(g=>optional(`Game ${g.id}`,`/summary?event=${g.id}`)));summaries.push(...batch.filter(Boolean))}
const output=normalizeBasketball({season,teams,games,summaries,warnings});
await fs.writeFile('live-data.json',JSON.stringify(output,null,2)+'\n');
console.log(`Saved ${teams.length} teams, ${games.length} games and ${summaries.length} box scores.`);
