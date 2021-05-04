//Card Search Bar
var maxChar = 300;

function updateFontDefault(){
  descFontSize = parseInt(window.getComputedStyle(document.getElementById('Effect'), null).getPropertyValue('font-size').replace('px',''));
  descLineHeight = parseInt(window.getComputedStyle(document.getElementById('Effect'), null).getPropertyValue('line-height').replace('px', ''));
  console.log("Fontsize reset: " + descFontSize);
  descTitleFontSize = parseInt(window.getComputedStyle(document.getElementById("Name"), null).getPropertyValue('font-size'));
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
  type = user.type;
  switch (type) {
    case 'Tuner Monster':
      type = type.replace('Tuner', 'Tuner Effect');
      break;
    case 'Toon Monster':
      type = type.replace('Toon', 'Toon Effect');
      break;
    case 'Spirit Monster':
      type = type.replace('Spirit', 'Spirit Effect');
      break;
    case 'Gemini Monster':
      type = type.replace('Gemini', 'Gemini Effect');
    default:
      break;
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
    document.getElementById("Desc").style.top = 475 + "px";
    document.getElementById("Desc").style.height = 73 + "px";
    var temp = type;
    temp = temp.replace(' Monster', '');
    var templist = temp.split(' ');
    document.getElementById("Race").innerHTML = "[" + race + "/";
    for (let index = 0; index < templist.length; index++) {
      if (index == templist.length - 1) {
        document.getElementById("Race").innerHTML += templist[index] + "]";
      }
      else {
        document.getElementById("Race").innerHTML += templist[index] + "/";
      }
    }
  }
  else {
    document.getElementById("Race").innerHTML = "";
    document.getElementById("Desc").style.top = 458 + "px";
    document.getElementById("Desc").style.height = 110 + "px";
  }
  
  if (type.includes("Monster")){
    document.getElementById("Attribute").src = "/Templates/Attributes/" + attribute + ".png";
  }
  else {
    document.getElementById("Attribute").src = "/Templates/Attributes/" + type + ".png";
  }
  var penDesc;
  if(type.includes("Pendulum")){
    penDesc = desc.split('<br>----------------------------------------<br>')[0].replace('[ Pendulum Effect ]<br>', '');
    if(type.includes("Normal")){
      desc = desc.split('<br>----------------------------------------<br>')[1].replace('[ Flavor Text ]<br>', '');
    }
    else{
      desc = desc.split('<br>----------------------------------------<br>')[1].replace('[ Monster Effect ]<br>', '');
    }
  }
  
  if (type.includes("Normal") || type.includes("Token")) {
    document.getElementById("Effect").innerHTML = desc;
    document.getElementById("Effect").style.fontFamily = "Matrix Flavour";
  }
  else{
    document.getElementById("Effect").style.fontFamily = "Matrix";
    document.getElementById("Effect").innerHTML = analyseDesc(desc, type);
    
  }


  //font size alteration
  var returnedVar;
  if(type.includes("Normal")){
    returnedVar = scaleFont(desc.length, 16);
  }
  else{
    returnedVar = scaleFont(desc.length, descFontSize);
  }
  document.getElementById('Effect').style.fontSize = returnedVar[0] +'px';
  document.getElementById('Effect').style.lineHeight = returnedVar[1]+'px';
  /*
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
  console.log((tempFontSize *( tempMaxChar / desc.length)) + "px");*/

  //Title Font colour change
  document.getElementById("Name").innerHTML = name;
  if (type.includes("XYZ") || type.includes("Trap") || type.includes("Link") || type.includes("Spell")) {
    document.getElementById("Name").style.color = 'white';
  }
  else {
    document.getElementById("Name").style.color = 'black';
  }
  document.getElementById("Name").style.fontSize = scaleTitleFont(name.length) + "px";
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
  
  if(type.includes('Pendulum')){
    if(type.includes('Effect')){
      if(type.includes('Fusion')){
        blankImg.src = '/Templates/Pendulum Effect Fusion Monster.png';
      }
      else{
        if(type.includes('Synchro')){
          blankImg.src = '/Templates/Synchro Pendulum Effect Monster.png';
        }
        else{
          if(type.includes('XYZ')){
            blankImg.src = '/Templates/Xyz Pendulum Effect Monster.png';
          }
          else{
            blankImg.src = '/Templates/Pendulum Effect Monster.png';
          }
        }
      }
    }
    else{
      blankImg.src = '/Templates/Pendulum Normal Monster.png';
    }
  }
  else{
    if(type.includes('Normal')){
      blankImg.src = '/Templates/Normal Monster.png';
    }
    else{
      if(type.includes('Fusion')){
        blankImg.src = '/Templates/Fusion Monster.png';
      }
      else{
        if(type.includes('Link')){
          blankImg.src = '/Templates/Link Monster.png';
        }
        else{
          if(type.includes('Ritual')){
            blankImg.src = '/Templates/Ritual Monster.png';
          }
          else{
            if(type.includes('Spell')){
              blankImg.src = '/Templates/Spell.png';
            }
            else{
              if(type.includes('Trap')){
                blankImg.src = '/Templates/Trap.png';
              }
              else{
                if(type.includes('Synchro')){
                  blankImg.src = '/Templates/Synchro Monster.png';
                }
                else{
                  if(type.includes('XYZ')){
                    blankImg.src = '/Templates/Xyz Monster.png';
                  }
                  else{
                    blankImg.src = '/Templates/Effect Monster.png';
                  }
                }
              }
            }
          }
        }
      }
    }
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
      return "<font class=\"EdSummonCon\"> <span>" + edSummonCon + "</span></font>" + "<br><font class=\"Effect\">" + htmlConversion + "</font>";
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
      context = "<span style=color:green>" + context[0] + ": " + "</span>";
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

function calcRowsUsed(fontSize, lineHeight, descLength, log = false){
  var width = parseInt(window.getComputedStyle(document.getElementById('Desc'), null).getPropertyValue('width'));
  var height = parseInt(window.getComputedStyle(document.getElementById('Desc'), null).getPropertyValue('height'));
  var charPerRow = width/(fontSize/2);
  var maxRows = height/lineHeight;
  var rowsUsed = descLength / charPerRow;
  var excess = maxRows - rowsUsed;
  
  if(log){
    console.log("Width: " + width);  
    console.log("Height: " + height);
    console.log("Total No. of Charcters: " + descLength);
    console.log("Characters per row: " + charPerRow);
    console.log("Max Rows: " + maxRows);
    console.log("Rows used: " + rowsUsed);
    console.log("Excess: " + excess);
  }

  return excess;
}

function calcNewTitleFont(fontSize, width, titleLength){
  var charPerRow = width/(fontSize/2);
  console.log("Title Length: " + titleLength);
  console.log("MaxChars: " + charPerRow);
  //var actualChars = titleLength/charPerRow;
  var excess = charPerRow - titleLength;
  
  console.log("Difference: " + excess);
  return excess;
}

function scaleTitleFont(titleLength){
  var scaledTitleFont = descTitleFontSize;
  var width = parseInt(window.getComputedStyle(document.getElementById('Desc'), null).getPropertyValue('width'));
  //var charCount = width / (scaledTitleFont/2);
  console.log("---Title Size Calc---");
  while(calcNewTitleFont(scaledTitleFont, width, titleLength) <=-4){
    scaledTitleFont = scaledTitleFont - 1;
    console.log("Updated Title Font: " + scaledTitleFont);
    console.log("---New Size Calc---");
  }

  console.log("New Title Font Size: " + scaledTitleFont);
  return scaledTitleFont;
}

function scaleFont(descLength, defaultFontSize){
  var currentValues= new Array(defaultFontSize, descLineHeight);
  console.log("---Font Scaling Start---");
  while(calcRowsUsed(currentValues[0], currentValues[1], descLength, true) <= -1.1){
    if(currentValues[1] % 1 == 0.5){
      currentValues[1] = currentValues[1] - 0.5;
    }
    else{
      currentValues[1] = currentValues[1] - 0.5;
      currentValues[0] = currentValues[0] - 1;
    }
    console.log("New Font Size: " + currentValues[0] + " | New Line Height: " + currentValues[1]);
    console.log("---Next Font Scaling---");
  }
  console.log("New Font Size: " + currentValues[0]);
  console.log("New Row Size: " + currentValues[1]);
  return currentValues;
}

// Calling the function 
getUser();