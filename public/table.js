// Grab interactable fields
const filterField = document.getElementById("filter-field");
const filterAsc = document.getElementById("filter-asc");
const filterPlayer = document.getElementById("filter-player");
const filterLimit = document.getElementById("filter-limit");
const downloadBtn = document.getElementById("download-csv");
const filterSubmitBtn = document.getElementById("filter-submit");

/**
 * Takes values provided by the filter section and generates URL safe parameters for the api call
 * @returns {String} URL Safe parameters
 */
function generateParams() {
  const fields = {
    filterField: filterField.value,
    filterAsc: filterAsc.value,
    filterPlayer: filterPlayer.value,
    filterLimit: filterLimit.value,
  };

  return Object.entries(fields)
    .map((e) => e.join("="))
    .join("&");
}

/**
 * Generates the URL for the CSV download and opens a new tab, initating the download
 */
function downloadCSV() {
  const urlParameters = generateParams();
  const url = window.location.origin + "/csv?" + urlParameters;

  window.open(url);
}

/**
 * Generates the URL for the database and results are returned in json
 * Calls generate table with the API response
 */
function queryDatabase() {
  const urlParameters = generateParams();
  const url = window.location.origin + "/json?" + urlParameters;

  fetch(url)
    .then((response) => response.json())
    .then((responseBody) => {
      generateTable(responseBody);
      // window.location.href = "#filter";
    });
}

/**
 *  Clears the current table and generates a new one based on the input object
 * @param {Array<Object>} data Object data to be turned into a table
 */
function generateTable(data) {
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
      td.innerHTML = data[i][key];
      row_body.appendChild(td);
    }
  }
}

// Assign functions to buttons
filterSubmitBtn.addEventListener("click", queryDatabase);
downloadBtn.addEventListener("click", downloadCSV);

queryDatabase();
