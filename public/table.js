// API Call
const url = window.location.origin + "/json";
const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
  body: JSON.stringify({
    key: "key",
    value: "value",
  }),
};

fetch(url)
  .then((response) => response.json())
  .then((responseBody) => {
    generateTable(responseBody);
  });

function generateTable(data) {
  let table = document.querySelector("table");
  table.innerHTML = "";

  let thead = table.createTHead();
  let tbody = table.createTBody();
  tbody.classList = "flex-1 sm:flex-none";

  for (i in data) {
    let row_head = thead.insertRow();
    row_head.classList =
      "text-red-400 bg-gray-800 flex flex-col flex-no wrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0";

    let row_body = tbody.insertRow();
    row_body.classList =
      "hover:bg-gray-700 flex flex-col flex-no wrap sm:table-row mb-2 sm:mb-0";
    if (i % 2 === 1) row_body.classList.add("bg-gray-800");

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
