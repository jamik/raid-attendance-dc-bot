/*
  @Author: Jamnyk
  @Desc: Discrd bot with a functionality of WoW raid subscribtion
*/



const Raid = require('./raid.js')
const Raider = require('./raider.js')

require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()


const EVT_RDY = 'ready';
const EVT_MSG = 'message';

const CMD_SUB = '!sub';
const CMD_UNSUB = '!unsub';
const CMD_ADD = '!add';
const CMD_REMOVE = '!remove';
const CMD_LIST = '!list';
const CMD_SHOW = '!show';

const ROLE_TANK = 'Tank';
const ROLE_HEALER = 'Healer';
const ROLE_RANGED = 'Ranged';
const ROLE_MELEE = 'Melee';

var raidList = [];

client.on(EVT_MSG, () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.login(process.env.BOT_TOKEN)

// handle commands
client.on(EVT_MSG, msg => {
  if(msg.content.startsWith(CMD_SUB)){
    handleSubscribe(msg);
  }
  else if(msg.content.startsWith(CMD_UNSUB)){
    handleUnsubscribe(msg);
  }
  else if(msg.content.startsWith(CMD_ADD)){
    handleAddRaid(msg);
  }
  else if(msg.content.startsWith(CMD_REMOVE)){
    handleRemoveRaid(msg);
  }
  else if(msg.content.startsWith(CMD_LIST)){
    handleListRaids(msg);
  }
  else if(msg.content.startsWith(CMD_SHOW)){
    handleShowRaidAttendance(msg);
  }
})


function help(){
  return "Commands: \
         \n !sub [number] -r [role] \
         \n     where [number] is numeric identifier of the raid and [role] is one of t (tank), h (healer), m (melee), r (ranged) \
         \n !unsub [number] \
         \n     where [number] is numeric identifier of the raid"

}

// checks whether given roles collection contains Officer, Guild Master or Raid Leader
function checkPermission(roles){
  role = '';
  var rolesList = [...roles.values()];
  for (var i=0;i<rolesList.length;i++){
    role = rolesList[i].name;
    if (role == 'Officer' || role == 'Guild Master' || role == 'Raid Leader')
      return true;
  }

  return false;
}

// get raid related role of the member
function getRole(member){
  console.log(member.user.username);
  var rolesList = [...member.roles.values()];
  for (var i=0;i<rolesList.length;i++){
    role = rolesList[i].name;
    console.log(role);

    if (role == ROLE_TANK || role == ROLE_HEALER || role == ROLE_RANGED ||  role == ROLE_MELEE)
      return role
  }

  return null
}

function resolveRoleAbbrev(roleAbbrev){
  roleAbbrev = roleAbbrev.toLowerCase();
  if (roleAbbrev == 't')
    return ROLE_TANK;
  else if (roleAbbrev == 'h')
    return ROLE_HEALER;
  else if (roleAbbrev == 'r')
    return ROLE_RANGED;
  else if (roleAbbrev == 'm')
    return ROLE_MELEE;

  return null;
}

// handling of subscribtion to raid
function handleSubscribe(msg) {
  var pattern = /!sub (\d+)( -r ([TRMHtrmh]))?/g;
  var res = pattern.exec(msg.content);
  if (!res) {
    console.log("handleSubscribe(): failed, msg= " + msg.content);
    msg.reply(help())
    return;
  }
  if (res[1] < 0 || res[1] >= raidList.length) {
    console.log("handleSubscribe(): idx=" + res[1] + " out of bounds.");
    msg.reply("Identifier " + res[1] + " out of bounds");
    return
  }

  var raid = raidList[res[1]];
  if (raid.contains(msg.author.username)){
    msg.reply("You are already subscribed for the raid");
    return
  }

  // user overrided his default discord role (for ex. logs on the raid as healer insted of a dps)
  if (res[3])
    role = resolveRoleAbbrev(res[3]);
  else
    role = getRole(msg.member);

  if (!role){
    console.log('You dont have your role properly set up and neither have you entered role manually.');
    msg.reply('You dont have your role properly set up and neither have you entered role manually.');
    return
  }

  raider = new Raider(msg.author.username, role);
  var raid = raidList[res[1]];
  raid.addMember(raider);

  msg.reply('You have been subscribed!!');
}

// handling of unsubscribtion from the raid
function handleUnsubscribe(msg){
  var pattern = /!unsub (\d+)/g;
  var res = pattern.exec(msg.content);
  if (!res) {
    console.log("handleUnsubscribe(): failed, msg= " + msg.content);
    msg.reply(help())
    return;
  }
  // check list bounds
  if (res[1] < 0 || res[1] >= raidList.length) {
    console.log("handleUnsubscribe(): idx=" + res[1] + " out of bounds.");
    msg.reply("Identifier" + res[1] + "out of bounds");
    return
  }

  if(!raidList[res[1]].removeMember(msg.author.username)){
    msg.reply("You are not subscribed to the raid " + raidList[res[1]].name + "(" + raidList[res[1]].date + ")");
    return;
  }

  msg.reply('You have been unsubscribed from the raid')
}

function handleAddRaid(msg){
  var pattern = /!add -d (\d\d\.\d\d\.) \"(.*)\"/g;
  var res = pattern.exec(msg.content);
  if (!res) {
    console.log("handleAddRaid(): failed, msg= " + msg.content);
    msg.reply(help())
    return;
  }
  // add check for existence
  var raid = new Raid(res[2], res[1]);
  raidList.push(raid);
}

// handling of raid removal
function handleRemoveRaid(msg){
  // check permissions
  if (!checkPermission(msg.member.roles)){
    console.log("You don't have sufficient permissions to remove a raid.");
    msg.reply("You don't have sufficient permissions to remove a raid.");
    return;
  }

  var pattern = /!remove (\d+)/g
  var res = pattern.exec(msg.content);
  if (!res) {
    console.log("handleRemoveRaid(): failed, msg= " + msg.content);
    msg.reply(help())
    return;
  }
  if (res[1] < 0 || res[1] >= raidList.length) {
    console.log("handleRemoveRaid(): idx=" + res[1] + " out of bounds.");
    msg.reply("Identifier " + res[1] + " out of bounds");
    return
  }
  console.log("Deleting raid [" + res[1] + "] " + raidList[res[1]].name);
  raidList.splice(res[1], 1);
  msg.reply("Raid removed!");
}

// handling of raid listing
function handleListRaids(msg){
  raidsSummary = "Upcoming raids:"
  for(var i=0; i<raidList.length;i++){
    console.log(raidList[i].toString());
    raidsSummary += "\n--> [" + i + "] " + raidList[i].toString();
  }
  msg.reply(raidsSummary);
}

// handling of listing raid's composition
function handleShowRaidAttendance(msg){
  pattern = /!show (\d)/g
  res = pattern.exec(msg.content);
  if (!res){
    console.log("handleShowRaidAttendance(): failed, msg= " + msg.content);
    return
  }
  if (res[1] < 0 || res[1] >= raidList.length){
    console.log("handleRemoveRaid(): idx=" + res[1] + " out of bounds.");
    msg.reply("Identifier " + res[1] + " out of bounds");
    return;
  }
  msg.reply(raidList[res[1]].getRaidSetup());
}
