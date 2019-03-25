const Raid = require('./raid.js')
const Raider = require('./raider.js')

require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()

var raidList = [];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.login(process.env.BOT_TOKEN)

// handle commands
client.on('message', msg => {
  if(msg.content.startsWith('!sub')){
    handleSubscribe(msg);
  }

  if(msg.content.startsWith('!unsub')){
    handleUnsubscribe(msg);
  }

  if(msg.content.startsWith('!add')){
    handleAddRaid(msg);
  }

  if(msg.content.startsWith('!remove')){
    handleRemoveRaid(msg);
  }

  if(msg.content.startsWith('!list')){
    handleListRaids(msg);
  }

  if(msg.content.startsWith('!show')){
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

function handleSubscribe(msg) {
  var pattern = /!sub (\d+) -r ([TRMHtrmh])/g;
  var res = pattern.exec(msg.content);
  if (!res) {
    console.log("handleSubscribe(): failed, msg= " + msg.content);
    msg.reply(help())
    return;
  }
  raider = new Raider(msg.author.username, res[2]);
  var raid = raidList[res[1]];
  raid.addMember(raider);

  msg.reply('You have been subscribed!!');
}

function handleUnsubscribe(msg){
  var pattern = /!unsub (\d+)/g;
  var res = pattern.exec(msg.content);
  
  if (!res) {
    console.log("handleSubscribe(): failed, msg= " + msg.content);
    msg.reply(help())
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


function handleRemoveRaid(msg){
  var pattern = /!remove (\d+)/g
  var res = pattern.exec(msg.content);
  if (!res) {
    console.log("handleRemoveRaid(): failed, msg= " + msg.content);
    msg.reply(help())
    return;
  }
  if (res[1] >= raidList.length) {
    console.log("handleRemoveRaid(): idx=" + res[1] + " out of bounds.");
    msg.reply("Identifier" + res[1] + "out of bounds");
    return
  }
  console.log("Deleting raid [" + res[1] + "] " + raidList[res[1]].name)
  raidList.splice(res[1], 1);
  msg.reply("Raid removed!")
}


function handleListRaids(msg){
  raidsSummary = "Upcoming raids:"
  for(var i=0; i<raidList.length;i++){
    console.log(raidList[i].toString());
    raidsSummary += "\n--> [" + i + "] " + raidList[i].toString();
  }
  msg.reply(raidsSummary);
}


function handleShowRaidAttendance(msg){
  pattern = /!show (\d)/g
  res = pattern.exec(msg.content);
  msg.reply(raidList[res[1]].getRaidSetup());
}
