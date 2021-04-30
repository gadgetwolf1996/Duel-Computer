const api_url = "https://db.ygoprodeck.com/api/v7/cardinfo.php?format=tcg"; 
let data;//json data

async function getUser() { 
    
    // Making an API call (request) 
    // and getting the response back 
    const response = await fetch(api_url); 
  
    // Parsing it to JSON format 
    data = await response.json(); 
    
    console.log(data.data); 
  
  slashcheck();
  getCardData();
  document.getElementById("rndBtn").addEventListener("click", function () {
    getCardData();
  });
}

function slashcheck() {
  for (i = 0; i < data.data.length; i++){
    if (data.data[i].desc.includes(" / ")) {
      console.log(data.data[i].name);
    }
  }
}

function getCardData(){
  // Retreiving data from JSON 
  const user = data.data[getRandomInt(data.data.length)];

  //card information variables cleared
  var id = "";
  var name = "";
  var type = "";
  var desc = "";
  var race = "";
  var attribute = "";

  //set card information variables
  id = user.id;
  name = user.name;
  type = user.type.replace(' Card', '').replace('Flip ', '').replace('Tuner ', '').replace('Toon', 'Effect').replace('Spirit', 'Effect').replace('Union ', '').replace('Gemini', 'Effect');
  if (type.includes("Pendulum") || type.includes("Synchro") || type.includes("Normal") || type.includes("Effect")) {
    type = type.replace('Tuner ', '');
  }
  else {
    type = type.replace('Tuner', 'Effect');
  }
  desc = user.desc;
  race = user.race;
  attribute = user.attribute;
  
  console.log(desc);
  desc = desc.replace(/(\r\n|\n|\r|\n\r)/g, "<br>");
  desc = desc.replace(" / ", "<br>");
  
  //images
  let image = user.card_images[0].image_url; 
  let image_icon = user.card_images[0].image_url_small;
  
  document.title = name;

  
  if (type.includes("Monster")) {
    document.getElementById("Desc").style.top = 473 + "px";
    var temp = type;
    temp = temp.replace(' Monster', '');
    var templist = temp.split(' ');
    document.getElementById("Race").innerHTML = "[ " + race + " / ";
    for (let index = 0; index < templist.length; index++) {
      if (index == templist.length - 1) {
        document.getElementById("Race").innerHTML += templist[index] + " ]";
      }
      else {
        document.getElementById("Race").innerHTML += templist[index] + " / ";
      }
    }
  }
  else {
    document.getElementById("Race").innerHTML = "";
    document.getElementById("Desc").style.top = 459 + "px";
  }
  
  if (type.includes("Monster")){
    document.getElementById("Attribute").src = "/Templates/Attributes/" + attribute + ".png";
  }
  else {
    document.getElementById("Attribute").src = "/Templates/Attributes/" + type + ".png";
  }
  
  if (type != "Normal Tuner Monster" && type != "Normal Monster" && type != "Token") {
    document.getElementById("Effect").style.fontFamily = "Matrix Book";
    document.getElementById("Effect").innerHTML = analyseDesc(desc, type);
  }
  else{
    document.getElementById("Effect").innerHTML = desc;
    document.getElementById("Effect").style.fontFamily = "Matrix Flavour";
  }
  
  document.getElementById("Name").innerHTML = name;
  if (type.includes("XYZ") || type.includes("Trap") || type.includes("Link") || type.includes("Spell")) {
    document.getElementById("Name").style.color = 'white';
  }
  else {
    document.getElementById("Name").style.color = 'black';
  }
  document.getElementById("Id").innerHTML = id;
  document.getElementById("Type").innerHTML = type;
  /*
  // Accessing the div container and modify/add 
  // elements to the containers 
  document.getElementById("head").innerHTML = fullName; 
  document.getElementById("email").href = "mailto:" + email; 
  document.getElementById("email").innerHTML = email; 
  document.getElementById("phone").href = "tel:" + phone; 
  document.getElementById("phone").innerHTML = phone; 
  // accessing the span container 
  document.querySelector("#age").textContent = age; 
  document.querySelector("#gender").textContent = gender; 
  
  document.querySelector("#location").textContent  
        = city + ", " + state; 
      
    document.querySelector("#country").textContent = country; 
*/  
  // Creating a new element and appending it 
  // to previously created containers 
  let img = document.getElementById("cardImg");
  img.src = image;

  let blankImg = document.getElementById("blankImg");
  if (type == "Ritual Effect Monster") {
    blankImg.src = "/Templates/"+type.replace(' Effect', '')+".png";
  }
  else {
    blankImg.src = "/Templates/"+type+".png";
  }
  //const favicon = document.getElementById("favicon"); 
  //favicon.setAttribute("href", image_icon);
  fitty.fitAll();
}
  
let cardText;
let effectSegment;
function analyseDesc(desc, type){
    var htmlConversion = "";
    cardText = desc;
    var condition = "";
    var edSummonCon = "";
    //Extra Deck summon condition
    //var edcheck = cardText.includes("\n");
    var edmon;
    if (type == "Fusion Monster" || type == "Link Monster" || type == "Pendulum Effect Fusion Monster" || type == "Synchro Monster" || type == "Synchro Pendulum Effect Monster" || type == "Synchro Tuner Monster" || type == "XYZ Monster" || type == "XYZ Pendulum Effect Monster") {
      edmon = true;
      cardText = cardText.replace("<br>", "<br id=\"extradecksplit\">");
      console.log(cardText.split("<br id=\"extradecksplit\">")[0]);
      edSummonCon = cardText.split("<br id=\"extradecksplit\">")[0];
      cardText = cardText.split("<br id=\"extradecksplit\">")[1];
    }
    else {
      edmon = false;
    }
    /*if(type == "Synchro Monster" || type == "XYZ Monster" || type == "Fusion Monster" || type == "Link Monster"){
        if(cardText.)
        cardText= edSummonCon[1];
        edSummonCon = "<p>" + edSummonCon[0] + "<br>" + "</p>";
        htmlConversion += edSummonCon;
    }*/
    if (cardText != undefined) {
      cardText = cardText.split(".");
      var multicheck = Array.isArray(cardText);
      if (multicheck) {
        cardText.forEach(effect => {
          if (effect != "") {
            effectSegment = effect;
            htmlConversion += ActivationConditions();
            htmlConversion += CostTargetting();
            htmlConversion += "<span style=color:blue>" + effectSegment + "." + "</span>";
          }
        });
      }
      else {
        effectSegment = cardText;
        htmlConversion += ActivationConditions();
        htmlConversion += CostTargetting();
        htmlConversion += "<span style=color:blue>" + effectSegment + "</span>";
      }
    }
  
    if (edmon) {
      return "<font class=\"EdSummonCon\">" + edSummonCon + "</font>" + "<br><font class=\"Effect\">" + htmlConversion + "</font>";
    }
    else {
      return "<font class=\"Effect\">" + htmlConversion + "</font>";
    }
    
  }

function ActivationConditions(){
  var context = "";
  var concheck = effectSegment.includes(":");
  if (concheck){
      context = effectSegment.split(":");
      effectSegment = context[1];
      context = "<font style=color:green>" + context[0] + ": " + "</font>";
    }
    return context;
}

function CostTargetting(){
  var costext = "";
  var coscheck = effectSegment.includes(";");
  if(coscheck){
      costext = effectSegment.split(";");
      effectSegment = costext[1];
      costext = "<span style=color:red>" + costext[0] + "; " + "</span>";
  }
  return costext;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
// Calling the function 
getUser();