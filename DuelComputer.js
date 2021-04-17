//Card Search Bar



//Card analysis
const api_url = "https://db.ygoprodeck.com/api/v7/cardinfo.php?format=tcg"; 
let data;//json data

async function getUser() { 
    
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
  getCardData();
  document.getElementById("rndBtn").addEventListener("click", function () {
    document.getElementById("cardImg").remove();
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
    document.getElementById("cardImg").remove();
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
    
    let id = user.id;
    let name = user.name;
    let type = user.type;
    var desc = user.desc;
    let race = user.race;
    let attribute = user.attribute;
    
    console.log(desc);
    desc = desc.replace(/(\r\n|\n|\r|\n\r)/g, "<br>");
    if(desc.includes("\" / \"")){
    }
    else{
      desc = desc.replace(" / ", "<br>");
    }
  
    //images
    let image = user.card_images[0].image_url; 
    let image_icon = user.card_images[0].image_url_small;
    
    document.title = name;

    document.getElementById("Name").innerHTML = name;
    document.getElementById("Id").innerHTML = id;
    document.getElementById("Type").innerHTML = type;
    document.getElementById("Race").innerHTML = race;
    
    if (type.includes("Monster")){
        document.getElementById("Attribute").innerHTML = attribute;
    }
    else{
        document.getElementById("Attribute").innerHTML = "";
    }
    
    if(type != "Normal Tuner Monster" && type != "Normal Monster" && type != "Token"){
      document.getElementById("Desc").innerHTML = analyseDesc(desc, type);
    }
    else{
        document.getElementById("Desc").innerHTML = desc;
    }
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
    let img = document.createElement("img");
    img.id = "cardImg";
    let img_div = document.getElementById("user-img"); 
    img.src = image; 
    img_div.append(img); 
  
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
      return "<div id=\"EdSummonCon\">" + edSummonCon + "</div>" + "<div id=\"Effect\">" + htmlConversion + "</div>";
    }
    else {
      return "<div id=\"Effect\">" + htmlConversion + "</div>";
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

// Calling the function 
getUser();