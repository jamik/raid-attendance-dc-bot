class Raid {

  constructor(name, date){
    this.name = name;
    this.date = date;
    this.raidersList = [];
  }

  contains(name){
    for (var i=0;i<this.raidersList.length;i++){
      if (this.raidersList[i].name == name)
        return true
    }
    return false;
  }

  addMember(member){
    this.raidersList.push(member)
  }

  removeMember(name){
    idx = null;
    for(var i=0;i<this.raidersList.length;i++){
      if(this.raidersList[i].name == name){
        idx = i;
        break;
      }
    }
    if (!idx){
      console.log("Raid::removeMember(): Member \"" + name + "\" was not found.");
      msg.reply("You are not subscribed to the raid " + this.name + "(" + this.date + ")");
      return
    }
    this.raidersList.splice(idx, 1);
  }

  toString(){
    return  this.name + ' is scheduled on ' + this.date;
  }

  getRaidSetup(){
    var raiderSummary = this.name + "(" + this.date + "):";

    var tanks = "";
    var healers = "";
    var melees = "";
    var rangeds = "";

    console.log("Raid size: " + this.raidersList.length);
    for(var i=0;i<this.raidersList.length;i++){

      console.log(this.raidersList[i].name + " -> " + this.raidersList[i].role);

      if (this.raidersList[i].role == "t")
        tanks += "\n  " + this.raidersList[i].name;
      else if (this.raidersList[i].role == "h")
        healers += "\n  " + this.raidersList[i].name;
      else if (this.raidersList[i].role == "m")
        melees += "\n  " + this.raidersList[i].name;
      else if (this.raidersList[i].role == "r")
        rangeds += "\n  " + this.raidersList[i].name;
    }

    raiderSummary += "\ntanks:" + tanks;
    raiderSummary += "\nhealers:" + healers;
    raiderSummary += "\nmelees:" + melees;
    raiderSummary += "\nrangeds:" + rangeds;

    return raiderSummary;
  }

};

module.exports = Raid;
