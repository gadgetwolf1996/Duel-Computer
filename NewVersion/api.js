const api_url = "https://db.ygoprodeck.com/api/v7/cardinfo.php?format=tcg";
let data; //json data

async function getUser() {
  const response = await fetch(api_url);
  data = await response.json();
}

getUser();
