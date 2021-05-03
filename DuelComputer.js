//Card Search Bar
var maxChar = 300;

function updateFontDefault(){
  descFontSize = window.getComputedStyle(document.getElementById('Effect'), null).getPropertyValue('font-size').replace('px','');
  descLineHeight = window.getComputedStyle(document.getElementById('Effect'), null).getPropertyValue('line-height').replace('px', '');
  console.log("Fontsize reset: " + descFontSize);
}

//Card analysis
const api_url = "https://db.ygoprodeck.com/api/v7/cardinfo.php?format=tcg"; 
let data;//json data

async function getUser() { 
    //let descFontSize = document.getElementById("Effect").style.fontSize;
    // Making an API call (request) 
    // and getting the response back 
    const response = await fetch(api_url); 
  
    // Parsing it to JSON format 
    data = await response.json(); 
    
    console.log(data.data);
    var cardnames = [];
    for(var i = 0; i < data.data.length; i++){
      cardnames[i] = data.data[i].name;
    }
  
  slashcheck();
  //getCardData();
  document.getElementById("rndBtn").addEventListener("click", function () {
    getCardData();
  });
  //Predictive Text
  const searchbar = document.getElementById("search");
  const suggestion = document.getElementById("suggestion-container");
  let suggestedWord = "";
  let suggestedWordArray = [];
  let currentWordIndex = 0;
  let insertText = false;
  searchbar.addEventListener("input", e => {
    if(e.data != " "){
      insertText = true;
    }
    if(insertText == false){
      searchbar.value = "";
    }

    let inputValue = e.target.value;
    suggestedWordArray = filterArray(cardnames, inputValue);
    suggestedWord = suggestedWordArray[0];

    if(suggestedWord != undefined){
      var HTMLSetup = "";
      for(i = 0; i < suggestedWordArray.length; i++){
        HTMLSetup += "<li><span>" + suggestedWordArray[i] + "</span></li>";
      }
      suggestion.innerHTML = HTMLSetup;
    }

    if(inputValue.length == 0 || suggestedWordArray.length == 0){
      suggestion.innerHTML = "";
    }
  });


  document.getElementById("subBtn").addEventListener("click", function(){
    //document.getElementById("cardImg").remove();
    //document.getElementById("blankImg").remove();
    getCardData(cardNameSearch(document.getElementById("search").value));
  });
}

function slashcheck() {
  for (i = 0; i < data.data.length; i++){
    if (data.data[i].desc.includes(" / ")) {
      console.log(data.data[i].name);
    }
  }
}

function cardNameSearch(cardName) {
  for (i = 0; i < data.data.length; i++){
    if (data.data[i].name.includes(cardName)) {
      return i;
    }
  }
}

function getCardData(cardData = -1){
  // Retreiving data from JSON 
  var user;
  if(cardData > -1){
    user = data.data[cardData];
  }
  else{
    user = data.data[getRandomInt(data.data.length)];
  }

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
  if(desc.includes("\" / \"")){
  }
  else{
    desc = desc.replace(" / ", "<br>");
  }
  
  //console.log(desc);
  //desc = desc.replace(/(\r\n|\n|\r|\n\r)/g, "<br>");
  //desc = desc.replace(" / ", "<br>");
  
  //images
  let image = user.card_images[0].image_url; 
  let image_icon = user.card_images[0].image_url_small;
  
  document.title = name;

  
  if (type.includes("Monster")) {
    document.getElementById("Desc").style.top = 470 + "px";
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
    document.getElementById("Desc").style.top = 470 + "px";
  }
  
  if (type.includes("Monster")){
    document.getElementById("Attribute").src = "/Templates/Attributes/" + attribute + ".png";
  }
  else {
    document.getElementById("Attribute").src = "/Templates/Attributes/" + type + ".png";
  }
  
  if (type != "Normal Tuner Monster" && type != "Normal Monster" && type != "Token") {
    document.getElementById("Effect").style.fontFamily = "Matrix";
    document.getElementById("Effect").innerHTML = analyseDesc(desc, type);
    
  }
  else{
    document.getElementById("Effect").innerHTML = desc;
    document.getElementById("Effect").style.fontFamily = "Matrix Flavour";
  }


  //font size alteration
  console.log(tempFontSize);
  document.getElementById('Effect').style.fontSize= descFontSize + 'px';
  document.getElementById('Effect').style.lineHeight = descLineHeight + 'px';
  var tempFontSize = window.getComputedStyle(document.getElementById('Effect'), null).getPropertyValue('font-size').replace('px','');
  var tempLineHeight = window.getComputedStyle(document.getElementById('Effect'), null).getPropertyValue('line-height').replace('px','');

  if(type.includes('Spell') || type.includes('Trap')){
    tempMaxChar = maxChar + 40;
  }
  else{
    tempMaxChar = maxChar;
  }

  if(desc.length > tempMaxChar){
    document.getElementById('Effect').style.fontSize = (tempFontSize *( tempMaxChar / desc.length)) + "px";
    document.getElementById('Effect').style.lineHeight = tempLineHeight * (tempMaxChar / desc.length) + "px";
  }
  ////font debugging
  console.log("DefaultJSFontSize: " + descFontSize);
  console.log("Current Font Size: " + window.getComputedStyle(document.getElementById('Effect'), null).getPropertyValue('font-size'));
  console.log("Desc length: " + desc.length);
  console.log("Percentage Difference: " + (tempMaxChar / desc.length));
  console.log("Font Size: " + (tempFontSize * (tempMaxChar/desc.length)));
  console.log((tempFontSize *( tempMaxChar / desc.length)) + "px");

  //Title Font colour change
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


function filterArray(array, item, reverse = false) {
	if (reverse) {
		return array
			.filter(word => compareTwoStrings(word, item))
			.sort((a, b) => a.length - b.length);
	} else {
		return array
			.filter(word => compareTwoStrings(word, item))
			.sort((a, b) => b.length - a.length);
	}
}

function compareTwoStrings(string, subString) {
	let temp = "";
  if(string.includes(subString)){
    temp = string;
    return subString;
  } 
}

// Calling the function 
getUser();