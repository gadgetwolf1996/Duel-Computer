const api_url = "https://db.ygoprodeck.com/api/v7/cardinfo.php?format=tcg"; 
let data;//json data


async function getUser() { 
    
    // Making an API call (request) 
    // and getting the response back 
    const response = await fetch(api_url); 
  
    // Parsing it to JSON format 
    data = await response.json(); 
    
    console.log(data.data); 
  
  getCardData();
  document.getElementById("rndBtn").addEventListener("click", function () {
    document.getElementById("cardImg").remove();
    getCardData();
  });
}



function getCardData(){
  // Retreiving data from JSON 
    const user = data.data[getRandomInt(10513)];
    let id = user.id;
    let name = user.name;
    let type = user.type;
    let desc = user.desc;
    let race = user.race;
    let attribute = user.attribute;
    
    console.log(desc);


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
    
    if(type != "Normal Monster" && type != "Token"){
        document.getElementById("Desc").innerHTML = analyseDesc(desc);
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
function analyseDesc(desc){
    var htmlConversion = "";
    cardText = desc;
    var condition = "";
    var edSummonCon = "";
    //Extra Deck summon condition
    var edcheck = cardText.includes("\r\n");
    if(edcheck){
        edSummonCon = cardText.split("\r\n");
        cardText= edSummonCon[1];
        edSummonCon = "<p>" + edSummonCon[0] + "</p>";
        htmlConversion += edSummonCon;
    }

    cardText = cardText.split(".");
    var multicheck = Array.isArray(cardText);
    if(multicheck){
      cardText.forEach(effect => {
        if (effect != "") {
          effectSegment = effect;
          htmlConversion += ActivationConditions();
          htmlConversion += CostTargetting();
          htmlConversion += "<span style=color:blue>" + effectSegment + "." + "\r\n" + "</span>";
        }
          });
    }
    else{
          effectSegment = cardText;
          htmlConversion += ActivationConditions();
          htmlConversion += CostTargetting();
          htmlConversion += "<span style=color:blue>" + effectSegment + "</span>";
    }
    
    return htmlConversion;
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
// Calling the function 
getUser();