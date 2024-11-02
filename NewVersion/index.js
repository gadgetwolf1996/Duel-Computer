// get search bar element
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const listDesplay = document.getElementById("results");

// listen for user events
searchButton.addEventListener("click", () => {
  listDesplay.innerHTML = "";
  const { value } = searchInput;

  // get user search input converted to lowercase
  const searchQuery = value.toLowerCase();

  for (const cardElement of data.data) {
    // store name text and convert to lowercase
    let name = cardElement.name.toLowerCase();
    let imgSrc = cardElement.card_images[0].image_url_cropped;

    // compare current name to search input
    if (name.includes(searchQuery)) {
      // found name matching search, display it
      listDesplay.innerHTML +=
        '<div class="name">' +
        '<img id="cardArt" src="' +
        imgSrc +
        '"/><div>' +
        name +
        "</div></div>";
    }
  }
});
