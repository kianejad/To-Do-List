const url = "https://61893abfd0821900178d7893.mockapi.io/todo";
const BASE_URL = "https://61893abfd0821900178d7893.mockapi.io/todo?";
const homePage = "./home.html";
const formWrapper = document.forms[0];
const items = document.querySelectorAll("#listItems")[0];
const spinnerContainer = document.querySelector(".spinner-container");
const paginationContainer = document.querySelector(".pagination");
const fristActive = document.querySelector(".pagination").firstChild;

let a = 1;
let customPage = `page=${a}&limit=10`;
let pageURL = BASE_URL + customPage;

// pagination
window.onload = createButton();
async function createButton() {
  let baseURL = await fetch(BASE_URL);
  let dataBase = await baseURL.json();
  let dataBaseLength = dataBase.length;
  let m = dataBaseLength % 10;
  let n = dataBaseLength / 10;
  if (dataBaseLength > 10) {
    if (m !== 0) n += 1;
    for (let i = 1; i <= n; i++) {
      paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" onclick="pageButton(event)">${i}</a></li>`;
    }
  }
}

function pageButton(event) {
  a = event.target.innerHTML;
  event.target.classList.add("active");
  customPage = `page=${a}&limit=10`;
  pageURL = BASE_URL + customPage;
  serverGetData();
  window.scrollTo(0, 0);
}
// End of pagination

//Server Get function
async function serverGetData() {
  let spinner = document.createElement("div");
  spinner.innerHTML = `<div class="loader"></div>`;

  spinnerContainer.append(spinner);
  let listData = await fetch(pageURL);
  let data = await listData.json();
  data.reverse();
  spinnerContainer.remove();
  console.log(data.length);

  let todoItem = "";
  console.log("Yes");
  data.map((item, index) => {
    todoItem += `<div class="card my-4" id="${item.id}">
          <div class="title-main card-header d-flex justify-content-between px-4">
              <div class="chetitle d-flex align-items-center">
                  <input class="me-xxl-4 d-inline" type="checkbox" name="${
                    item.id
                  }" id="${item.id}"
                  onclick='isChecked(${index})'
                      value="${item.Title}" ${
      data[index].Checkbox ? "checked" : ""
    }>
                  <label for="${
                    item.id
                  }" class='fs-4 fw-bold' onclick='isChecked(${index})'>${
      item.Title
    }</label>
              </div>
              <div class="todo-btn d-flex align-items-center">
                  <a href="#" id="editBtn" onclick='editFunction(${
                    item.id
                  })'><span class="iconify fs-1" data-icon="ei:pencil"></span>
                      </a>
                  <a href="#" id="binBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop${index}"><span class="iconify fs-3 text-danger" data-icon="ri:delete-bin-line")></a>
              </div>
          </div>
          <div class="card-body px-4">
              <h5 class="card-title">${item.Description}</h5>
              <p class="card-text mt-3">
              Due Date : ${item.Duedate}
              </p>
          </div>
          <div class="modal fade" id="staticBackdrop${index}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel${index}" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel${index}">Are you sure to delete this item?</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                ${item.Title}
                <br>
                <p>Due date : ${item.Duedate}</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" onclick='delFunc(${
                  item.id
                })' data-bs-dismiss='modal' class="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  });
  // }
  if (todoItem === "") {
    todoItem = `<span class='text-danger fw-600 text-4'>There is no any todo do To show!<span/>`;
  }

  items.innerHTML = todoItem;
}
serverGetData();

// server Delete Function
async function delFunc(index) {
  let listData = await fetch(url);
  let data = await listData.json();
  data.reverse();
  let newUrl = url + "/" + `${index}`;
  await fetch(newUrl, {
    method: "DELETE",
  });
  serverGetData();
}

//Check function    COMPLETED
async function isChecked(index) {
  let listData = await fetch(url);
  let data = await listData.json();
  data.reverse();
  let newUrl = url + "/" + `${data[index].id}`;
  let x;
  if (data[index].Checkbox) {
    x = false;
  } else {
    x = true;
  }
  await fetch(newUrl, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      UpdatedAt: Date.now(),
      Checkbox: x,
    }),
  });

  serverGetData();
}

// Edit function
async function editFunction(index) {
  let listData = await fetch(url);
  let data = await listData.json();
  data.reverse();
  let paramsString = homePage + "?id=" + index;
  location.assign(paramsString);
}