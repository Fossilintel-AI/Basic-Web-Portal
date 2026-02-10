function Todo(name, state) {
  this.name = name;
  this.state = state;
}

var todos = [];
var states = ["active", "inactive", "done"];
var tabs = ["all"].concat(states);
var currentTab = "all";

var form = document.getElementById("new-todo-form");
var input = document.getElementById("new-todo-title");

form.onsubmit = function (event) {
  event.preventDefault();
  if (input.value && input.value.length) {
    todos.push(new Todo(input.value, "active"));
    input.value = "";
    renderTodos();
  }
};

// Added two buttons the up and down
var buttons = [
  { action: "done", icon: "ok" },
  { action: "active", icon: "plus" },
  { action: "inactive", icon: "minus" },
  { action: "up", icon: "chevron-up" },
  { action: "down", icon: "chevron-down" },
  { action: "remove", icon: "trash" }

];

function renderTodos() {
  var todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";

  // Filtered list based on current tab
  var filteredTodos = todos.filter(function (todo) {
    return todo.state === currentTab || currentTab === "all";
  });

  filteredTodos.forEach(function (todo, index) {
    var div1 = document.createElement("div");
    div1.className = "row";

    var div2 = document.createElement("div");
    div2.innerHTML = '<a class="list-group-item" href="#">' + todo.name + "</a>";
    div2.className = "col-xs-6 col-sm-9 col-md-10";

    var div3 = document.createElement("div");
    div3.className = "col-xs-6 col-sm-3 col-md-2 btn-group text-right";

    buttons.forEach(function (button) {
      var btn = document.createElement("button");
      btn.className = "btn btn-default btn-xs";
      btn.innerHTML = '<i class="glyphicon glyphicon-' + button.icon + '"></i>';
      div3.appendChild(btn);

      // Disable button if it's the same as todo state
      if (button.action === todo.state) {
        btn.disabled = true;
      }

      // Remove button
      if (button.action === "remove") {
        btn.title = "Remove";
        btn.onclick = function () {
          if (confirm("Are you sure you want to delete '" + todo.name + "'?")) {
            todos.splice(todos.indexOf(todo), 1);
            renderTodos();
          }
        };
      }

      // State change buttons
      else if (["done", "active", "inactive"].includes(button.action)) {
        btn.title = "Mark as " + button.action;
        btn.onclick = function () {
          todo.state = button.action;
          renderTodos();
        };
      }

      // Move Up button
      else if (button.action === "up") {
        btn.title = "Move up";
        btn.disabled = index === 0; // disable for first visible
        btn.onclick = function () {
          if (index > 0) {
            var visibleIndexes = todos
                .map((t, i) =>
                    t.state === currentTab || currentTab === "all" ? i : -1
                )
                .filter((i) => i !== -1);
            var currentIndex = visibleIndexes[index];
            var prevIndex = visibleIndexes[index - 1];
            [todos[currentIndex], todos[prevIndex]] = [
              todos[prevIndex],
              todos[currentIndex]
            ];
            renderTodos();
          }
        };
      }

      // Move Down button
      else if (button.action === "down") {
        btn.title = "Move down";
        btn.disabled = index === filteredTodos.length - 1; // disable for last visible
        btn.onclick = function () {
          if (index < filteredTodos.length - 1) {
            var visibleIndexes = todos
                .map((t, i) =>
                    t.state === currentTab || currentTab === "all" ? i : -1
                )
                .filter((i) => i !== -1);
            var currentIndex = visibleIndexes[index];
            var nextIndex = visibleIndexes[index + 1];
            [todos[currentIndex], todos[nextIndex]] = [
              todos[nextIndex],
              todos[currentIndex]
            ];
            renderTodos();
          }
        };
      }
    });

    div1.appendChild(div2);
    div1.appendChild(div3);
    todoList.appendChild(div1);
  });

  // Updating badges after rendering
  updateBadges();
  saveTodos(); // I need to  Save every time the list changes
}

loadTodos();
renderTodos();

// Function to update badge counts
function updateBadges() {
  var allCount = todos.length;
  var activeCount = todos.filter(function (t) { return t.state === "active"; }).length;
  var inactiveCount = todos.filter(function (t) { return t.state === "inactive"; }).length;
  var doneCount = todos.filter(function (t) { return t.state === "done"; }).length;

  document.getElementById("badge-all").textContent = allCount;
  document.getElementById("badge-active").textContent = activeCount;
  document.getElementById("badge-inactive").textContent = inactiveCount;
  document.getElementById("badge-done").textContent = doneCount;
}

// Function to select tab
function selectTab(element) {
  var tabName = element.attributes["data-tab-name"].value;
  currentTab = tabName;

  var todoTabs = document.getElementsByClassName("todo-tab");
  for (var i = 0; i < todoTabs.length; i++) {
    todoTabs[i].classList.remove("active");
  }
  element.classList.add("active");
  renderTodos();
}

// Save todos to localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Load todos from localStorage
function loadTodos() {
  var stored = localStorage.getItem("todos");
  if (stored) {
    todos = JSON.parse(stored);
  } else {
    todos = [];
  }
}

