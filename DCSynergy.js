var list = {};
var descGrab = "";
var penDescGrab = "";
function checkFirstWordDesc() {
    
    for (var i = 0; i < data.data.length; i++) {
        descGrab = "";
        penDescGrab = "";
        descGrab = data.data[i].desc;
        descGrab = descGrab.replace(/(\r\n|\n|\r|\n\r)/g, "<br>");
        //console.log(descGrab);
        if (!data.data[i].type.includes("Normal") || !data.data[i].type.includes("Token") || data.data[i].type.includes("Pendulum")) {
            if (data.data[i].type.includes("Pendulum")) {
                if (descGrab.includes("----------------------------------------")) {
                    descGrab = descGrab.replace('[ Pendulum Effect ]<br>', '').replace('[ Monster Effect ]<br>', '');
                    penDescGrab = descGrab.split('<br>----------------------------------------<br>')[0];
                    descGrab = descGrab.split('<br>----------------------------------------<br>')[1];
                    if (data.data[i].type.includes("Normal")) {
                        continue;
                    }
                    else {
                        descGrab = splitCheck(descGrab);
                    }
                    penDescGrab = splitCheck(penDescGrab);
                    addToList(penDescGrab);
                }
                else {
                    descGrab = splitCheck(descGrab);
                }
            }
            else {
                descGrab = splitCheck(descGrab);
            }
            
            if (data.data[i].type.includes("Fusion") || data.data[i].type.includes("Synchro") || data.data[i].type.includes("Link") || data.data[i].type.includes("XYZ")) {
                descGrab = descGrab.replace("<br>", "<br id=\"extradecksplit\">");
                descGrab = descGrab.split("<br id=\"extradecksplit\">")[1];
                addToList(descGrab);
            }
            else {
                addToList(descGrab);
            }
            
            
            
        }
        else {
            continue;
        }
    }
    
    console.log(JSON.stringify(list));
}

function splitCheck(passedVar) {
    var splitVar = "";
    if (passedVar.includes(":")) {
        var arraycheck = passedVar.split(".");
        for (let i = 0; i < arraycheck.length; i++) {
            if (arraycheck[i].includes(":")) {
                split
            }
            
        }
        splitVar = splitVar.split(" ")[0];
    }
    else {
        splitVar = "No Condition";
    }
    return splitVar;
}

function addToList(passedVar) {
    if (list[passedVar] == undefined) {
        list[passedVar] = 1;
    }
    else {
        list[passedVar] += 1;
    }
}

function printList() {
    console.log(JSON.stringify(list));
}

function ConditionWordCheck() {
    for (var i = 0; i < data.data.length; i++) {
        getCardData(i);
    }
    printList();
}