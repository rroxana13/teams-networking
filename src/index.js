import "./style.css";
let editId;
let allTeams = [];

function $(selector) {
  return document.querySelector(selector);
}

function getTeamAsHtml(team) {
  return `<tr>
    <td>${team.promotion}</td>
    <td>${team.members}</td>
    <td>${team.name}</td>
    <td>${team.url}</td>
    <td>
      <a data-id=${team.id} class="remove-btn" >✖</a>
      <a data-id=${team.id} class="edit-btn"> &#9998; </a>
    </td>
    </tr>`;
}

function displayTeams(teams) {
  const teamsHTML = teams.map(getTeamAsHtml);

  $("#teamsTable tbody").innerHTML = teamsHTML.join("");
}

function loadTeams() {
  fetch("http://localhost:3000/teams-json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(r => r.json())

    .then(teams => {
      allTeams = teams;
      displayTeams(teams);
    });
}

function deleteTeamRequest(id) {
  return fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: id })
  }).then(r => r.json());
}

function updateTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  }).then(r => r.json());
}

function createTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  }).then(r => r.json());
}

function startEdit(id) {
  editId = id;
  const team = allTeams.find(team => team.id == id);
  console.info("start edit", team);

  $("#promotion").value = team.promotion;
  $("#members").value = team.members;
  $("input[name=name]").value = team.name;
  $("input[name=url]").value = team.url;
}

function onSubmit(e) {
  e.preventDefault();
  const promotion = $("#promotion").value;
  const members = $("#members").value;
  const name = $("input[name=name]").value;
  const url = $("input[name=url]").value;
  const team = {
    promotion,
    members,
    name: name,
    url: url
  };
  if (editId) {
    team.id = editId;
    updateTeamRequest(team).then(status => {
      if (status.success) {
        // v.1
        window.location.reload();
      }
    });
  } else {
    createTeamRequest(team).then(status => {
      if (status.success) {
        // v.1
        window.location.reload();
      }
    });
  }
}

function searchTeams(e) {
  let searchText = e.target.value;
  console.warn(searchText);
  console.warn(allTeams);
}

function initEvents() {
  $("#searchTeams").addEventListener("input", searchTeams);

  $("#teamsTable tbody").addEventListener("click", e => {
    if (e.target.matches("a.remove-btn")) {
      const id = e.target.dataset.id;
      //console.warn("remove %o", id);
      deleteTeamRequest(id).then(status => {
        if (status.success) {
          //console.warn("delete done", status);
          loadTeams();
        }
      });
    } else if (e.target.matches("a.edit-btn")) {
      const id = e.target.dataset.id;
      startEdit(id);
    }
  });
  $("#teamsForm").addEventListener("submit", onSubmit);
  $("#teamsForm").addEventListener("reset", () => {
    editId = undefined;
  });
}

loadTeams();
initEvents();
