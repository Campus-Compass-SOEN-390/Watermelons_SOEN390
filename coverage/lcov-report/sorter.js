/* eslint-disable */
let addSorting = (function () {
  "use strict";
  let cols,
    currentSort = {
      index: 0,
      desc: false,
    };

  // returns the summary table element
  function getTable() {
    return document.querySelector(".coverage-summary");
  }
  // returns the thead element of the summary table
  function getTableHeader() {
    return getTable().querySelector("thead tr");
  }
  // returns the tbody element of the summary table
  function getTableBody() {
    return getTable().querySelector("tbody");
  }
  // returns the th element for nth column
  function getNthColumn(n) {
    return getTableHeader().querySelectorAll("th")[n];
  }

  function onFilterInput() {
    const searchValue = document.getElementById("fileSearch").value;
    const rows = document.getElementsByTagName("tbody")[0].children;
    for (const row of rows) {
      if (row.textContent.toLowerCase().includes(searchValue.toLowerCase())) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
  }

  // loads the search box
  function addSearchBox() {
    let template = document.getElementById("filterTemplate");
    let templateClone = template.content.cloneNode(true);
    templateClone.getElementById("fileSearch").oninput = onFilterInput;
    template.parentElement.appendChild(templateClone);
  }

  // loads all columns
  function loadColumns() {
    let colNodes = getTableHeader().querySelectorAll("th"),
      colNode,
      cols = [],
      col,
      i;

    for (i = 0; i < colNodes.length; i += 1) {
      colNode = colNodes[i];
      col = {
        key: colNode.getAttribute("data-col"),
        sortable: !colNode.getAttribute("data-nosort"),
        type: colNode.getAttribute("data-type") || "string",
      };
      cols.push(col);
      if (col.sortable) {
        col.defaultDescSort = col.type === "number";
        colNode.innerHTML = colNode.innerHTML + '<span class="sorter"></span>';
      }
    }
    return cols;
  }
  // attaches a data attribute to every tr element with an object
  // of data values keyed by column name
  function loadRowData(tableRow) {
    let tableCols = tableRow.querySelectorAll("td"),
      colNode,
      col,
      data = {},
      i,
      val;
    for (i = 0; i < tableCols.length; i += 1) {
      colNode = tableCols[i];
      col = cols[i];
      val = colNode.getAttribute("data-value");
      if (col.type === "number") {
        val = Number(val);
      }
      data[col.key] = val;
    }
    return data;
  }
  // loads all row data
  function loadData() {
    let rows = getTableBody().querySelectorAll("tr"),
      i;

    for (i = 0; i < rows.length; i += 1) {
      rows[i].data = loadRowData(rows[i]);
    }
  }
  // sorts the table using the data for the ith column
  function sortByIndex(index, desc) {
    let key = cols[index].key,
      sorter = function (a, b) {
        a = a.data[key];
        b = b.data[key];
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        } else {
          return 0;
        }
      },
      finalSorter = sorter,
      tableBody = document.querySelector(".coverage-summary tbody"),
      rowNodes = tableBody.querySelectorAll("tr"),
      rows = [],
      i;

    if (desc) {
      finalSorter = function (a, b) {
        return -1 * sorter(a, b);
      };
    }

    for (i = 0; i < rowNodes.length; i += 1) {
      rows.push(rowNodes[i]);
      tableBody.removeChild(rowNodes[i]);
    }

    rows.sort(finalSorter);

    for (i = 0; i < rows.length; i += 1) {
      tableBody.appendChild(rows[i]);
    }
  }
  // removes sort indicators for current column being sorted
  function removeSortIndicators() {
    let col = getNthColumn(currentSort.index),
      cls = col.className;

    cls = cls.replace(/ sorted$/, "").replace(/ sorted-desc$/, "");
    col.className = cls;
  }
  // adds sort indicators for current column being sorted
  function addSortIndicators() {
    getNthColumn(currentSort.index).className += currentSort.desc
      ? " sorted-desc"
      : " sorted";
  }
  // adds event listeners for all sorter widgets
  function enableUI() {
    let i,
      el,
      ithSorter = function ithSorter(i) {
        var col = cols[i];

        return function () {
          var desc = col.defaultDescSort;

          if (currentSort.index === i) {
            desc = !currentSort.desc;
          }
          sortByIndex(i, desc);
          removeSortIndicators();
          currentSort.index = i;
          currentSort.desc = desc;
          addSortIndicators();
        };
      };
    for (i = 0; i < cols.length; i += 1) {
      if (cols[i].sortable) {
        // add the click event handler on the th so users
        // dont have to click on those tiny arrows
        el = getNthColumn(i).querySelector(".sorter").parentElement;
        if (el.addEventListener) {
          el.addEventListener("click", ithSorter(i));
        } else {
          el.attachEvent("onclick", ithSorter(i));
        }
      }
    }
  }
  // adds sorting functionality to the UI
  return function () {
    if (!getTable()) {
      return;
    }
    cols = loadColumns();
    loadData();
    addSearchBox();
    addSortIndicators();
    enableUI();
  };
})();

window.addEventListener("load", addSorting);
