const ROLE_TANK = 'Tank';
const ROLE_HEALER = 'Healer';
const ROLE_RANGED = 'Ranged';
const ROLE_MELEE = 'Melee';

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
    var idx = null;
    for(var i=0;i<this.raidersList.length;i++){
      if(this.raidersList[i].name == name){
        idx = i;
        break;
      }
    }

    if (idx == null){
      console.log("Raid::removeMember(): Member \"" + name + "\" was not found.");
      return false;
    }
    this.raidersList.splice(idx, 1);

    return true;
  }

  toString(){
    return  this.name + ' is scheduled for ' + this.date;
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

      if (this.raidersList[i].role == ROLE_TANK)
        tanks += "\n  " + this.raidersList[i].name;
      else if (this.raidersList[i].role == ROLE_HEALER)
        healers += "\n  " + this.raidersList[i].name;
      else if (this.raidersList[i].role == ROLE_MELEE)
        melees += "\n  " + this.raidersList[i].name;
      else if (this.raidersList[i].role == ROLE_RANGED)
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
