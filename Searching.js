var relevantList = [];
var races = ["Aqua","Beast","Beast-Warrior","Cyberse","Dinosaur","Divine-Beast","Dragon","Fairy","Fiend","Fish","Insect","Machine","Plant","Psychic","Pyro","Reptile","Rock","Sea Serpent","Spellcaster","Thunder","Warrior","Winged Beast","Wyrm","Zombie",];
var type = ["Effect","Flip","Tuner","Gemini","Normal","Pendulum","Ritual","Spirit","Toon","Union","Fusion","Link","Synchro","Xyz"];

function searchEffects(){
    relevantList = [];
    data.data.forEach(findQuoted);
    if(relevantList)console.log(relevantList);
}

function findQuoted(item, index){//TBA: Validity checks for Card Name references
    if(!item.desc.includes("\""))return;
    
    var content = item.desc.split("\"");
    var count = 0;
    for(i = 0; i < content.length; i++){
        if(content[i].length<2)continue;
        if(content[i] == ", ")continue;
        count += user.name.includes(content[i])?1:0;
    }

    if(count>0)relevantList.push(item);
}

function searchAttributeEffect(){
    relevantList = [];
    data.data.forEach(attributeEffectCount);
    if(relevantList)console.log(relevantList);
}

function attributeEffectCount(item){
    var count = 0;
    item.desc.split(".").forEach(function(desc) {if(findAttributeQuoted(desc))count++});
    if(count>0)relevantList.push(item);
}

function findAttributeQuoted(item){//TBA: Go through race and type wordings after attribute in desc
    if(item.length == 0)return false;
    if(!item.includes(user.attribute))return false;
    if(item.split(user.attribute).length-1 == 1){
        if(item.includes("/"+user.attribute))return false;
        if(item.includes("non-"+user.attribute))return false;
    }

    if(item.includes("becomes " + user.attribute) || item.includes("treated as " + user.attribute))return false;

    var count = 0;

    for(i = 0; i < races.length; i++){
        if(races[i] == user.race)continue;
        if(item.includes(user.attribute + " " + races[i]))count++;
    }

    if(count>0)return false;

    count = 0;

    for(i = 0; i < type.length; i++){
        if(user.type.includes(type[i]))continue;
        if(item.includes(user.attribute + " " + type[i]))count++;
    }

    if(count>0)return false;

    if(item.includes("\"")){
        var content = item.split("\"");
        count = 0;
        for(i = 0; i < content.length; i++){
            if(content[i].length<2)continue;
            count += user.name.includes(content[i])?1:0;
        }

        if(count==0)return false;
    }

    return true;
}