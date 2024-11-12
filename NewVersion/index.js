// get search bar element
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const listDesplay = document.getElementById("results");
const pageNumbers = document.getElementById("pagenumbers");
let currentPage = 0;
let maxResults = 10;
let results = [""];
// listen for user events
searchButton.addEventListener("click", () => {
  listDesplay.innerHTML = "";
  const { value } = searchInput;
  // get user search input converted to lowercase
  const searchQuery = value.toLowerCase();

  //count number of results
  let resultCount = 0;
  let pageCount = 1;

  for (const cardElement of data.data) {
    // store name text and convert to lowercase
    let name = cardElement.name.toLowerCase();
    let imgSrc = cardElement.card_images[0].image_url_cropped;

    // compare current name to search input
    if (name.includes(searchQuery)) {
      // found name matching search, display it
      results[resultCount] =
        '<div class="name">' +
        '<img id="cardArt" src="' +
        imgSrc +
        '"/><div>' +
        name +
        "</div></div>";
      //increase result count
      resultCount++;
    }
  }

  for (let i = 0; i < resultCount; i++) {
    if (i == maxResults) {
      pageCount++;
      i -= maxResults;
      resultCount -= maxResults;
    }
  }

  if (pageCount > 1) {
    pageNumbers.innerHTML +=
      '<a href="#" class="previous">&laquo; Previous</a>';
    for (let i = 0; i < pageCount; i++) {
      pageNumbers.innerHTML += '<a href="#" class="pageno">' + (i + 1) + "</a>";
    }
    pageNumbers.innerHTML += '<a href="#" class="next">Next &raquo;</a>';
  }

  for (let i = 0; i < maxResults; i++) {
    listDesplay.innerHTML += results[i];
  }
});
