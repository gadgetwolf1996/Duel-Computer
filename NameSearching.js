var relevantList = [];

function searchEffects(){
    data.data.forEach(findQuoted);
    debugger;
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