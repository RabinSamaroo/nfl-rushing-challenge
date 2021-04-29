// Grab interactable fields
const filterField = document.getElementById("filter-field");
const filterAsc = document.getElementById("filter-asc");
const filterPlayer = document.getElementById("filter-player");
const filterLimit = document.getElementById("filter-limit");
const downloadBtn = document.getElementById("download-csv");
const filterSubmitBtn = document.getElementById("filter-submit");
let lastQuery;

/**
 * Builds a set of parameters from the page inputs
 * @param page - page to be retrived
 * @returns {String} URL Safe parameters
 */
function generateParamsObj(page = 0) {
  output = {
    filterField: filterField.value,
    filterAsc: filterAsc.value,
    filterPlayer: filterPlayer.value,
    filterLimit: filterLimit.value,
    offset: page * filterLimit.value,
  };
  return output;
}

/**
 * Generates URL safe paremeters based on any object
 * @param {Object} obj any object
 * @returns {String} URL safe parameteres
 */
function generateUrlParams(obj) {
  return Object.entries(obj)
    .map((e) => e.join("="))
    .join("&");
}

/**
 * Generates the URL for the CSV download and opens a new tab, initating the download
 */
function downloadCSV() {
  const urlParameters = generateUrlParams(lastQuery);
  const url = window.location.origin + "/csv?" + urlParameters;

  window.open(url);
}

/**
 * Generates the URL to query the database, fetches URL and generates table
 */
function getPlayers() {
  let urlParameters = generateUrlParams(generateParamsObj());
  const url = window.location.origin + "/json?" + urlParameters;

  fetch(url)
    .then((response) => response.json())
    .then((responseBody) => {
      lastQuery = generateParamsObj();
      generateTable(responseBody);
      generatePageination(responseBody);
    });
}

/**
 * Generates the URL to query the database for pagination, fetches URL and generates table
 */
function getPagination() {
  lastQuery.offset = (this.innerHTML - 1) * lastQuery["filterLimit"];
  let urlParameters = generateUrlParams(lastQuery);
  const url = window.location.origin + "/json?" + urlParameters;

  fetch(url)
    .then((response) => response.json())
    .then((responseBody) => {
      generateTable(responseBody);
      generatePageination(responseBody);
    });
}

/**
 * Checks to see if the input is an integer and then formats it with , if required. Otherwise returns the input
 * @param {*} value value to be formatted
 * @returns formatted integer or the original value
 */
function thousandsFormatting(value) {
  if (Number.isInteger(value)) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return value;
  }
}

/**
 *  Clears the current table and generates a new one based on the input object
 * @param {Array<Object>} data Object data to be turned into a table
 */
function generateTable(response) {
  let data = response["data"];

  let table = document.querySelector("table");
  table.innerHTML = "";

  let thead = table.createTHead();
  let tbody = table.createTBody();
  tbody.classList = "flex-1 sm:flex-none";

  // A new row is added in HEAD to handle extra-small devices responsivly
  for (let i in data) {
    let row_head = thead.insertRow();
    row_head.classList =
      "text-red-400 bg-gray-800 flex flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0";

    let row_body = tbody.insertRow();
    row_body.classList =
      "hover:bg-gray-700 flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0";

    if (i % 2 === 1) row_body.classList.add("bg-gray-800"); // Handles odd row colouring

    for (let key in data[0]) {
      let th = document.createElement("th");
      th.classList = "p-3 text-left";
      th.innerHTML = key;
      row_head.appendChild(th);

      let td = document.createElement("td");
      td.classList = "p-3";
      td.innerHTML = thousandsFormatting(data[i][key]);
      row_body.appendChild(td);
    }
  }
}

/**
 * Generates a pagination section before the table
 * @param {Array<Object>} response server response with count and data
 */
function generatePageination(response) {
  let limit = response["limit"];
  let total = response["count"];
  let pages = Math.ceil(total / limit);
  let selected = Math.floor(response["offset"] / limit);

  let pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 0; i < pages; i++) {
    let page = document.createElement("a");
    page.classList =
      i == selected
        ? "border-red-400 text-red-400 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium" // selected style
        : "cursor-pointer border-transparent text-gray-500 hover:text-gray-200 hover:border-gray-400 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium";

    page.innerText = i + 1;
    page.addEventListener("click", getPagination);
    pagination.appendChild(page);
  }
}

// Assign functions to buttons
filterSubmitBtn.addEventListener("click", getPlayers);
downloadBtn.addEventListener("click", downloadCSV);

getPlayers();
