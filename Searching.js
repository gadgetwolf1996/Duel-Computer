var relevantList = [];

function searchEffects(){
    relevantList = [];
    data.data.forEach(findQuoted);
    if(relevantList)console.log(relevantList);
}

function findQuoted(item, index){
    if(!item.desc.includes("\""))return;
    
    var content = item.desc.split("\"");
    var count = 0;
    for(i = 0; i < content.length; i++){
        if(content[i].length<2)continue;
        count += user.name.includes(content[i])?1:0;
    }

    if(count>0)relevantList.push(item);
}

function searchAttributeEffect(){
    relevantList = [];
    data.data.forEach(findAttributeQuoted);
    if(relevantList)console.log(relevantList);
}

function findAttributeQuoted(item, index){
    if(!item.desc.includes(user.attribute))return;
    relevantList.push(item);
}