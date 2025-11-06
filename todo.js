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

form.onsubmit = function(event) {
  event.preventDefault();
  if (input.value && input.value.length) {
    todos.push(new Todo(input.value, "active"));
    input.value = "";
    renderTodos();
  }
};

var buttons = [
  { action: "done", icon: "ok" },
  { action: "active", icon: "plus" },
  { action: "inactive", icon: "minus" },
  { action: "remove", icon: "trash" }
];
function renderTodos() {
  var todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";
  todos
    .filter(function(todo) {
      return todo.state === currentTab || currentTab === "all";
    })
    .forEach(function(todo) {
      var div1 = document.createElement("div");
      div1.className = "row";

      var div2 = document.createElement("div");
      div2.innerHTML =
        '<a class="list-group-item" href="#">' + todo.name + "</a>";
      div2.className = "col-xs-6 col-sm-9 col-md-10";

      var div3 = document.createElement("div");
      div3.className = "col-xs-6 col-sm-3 col-md-2 btn-group text-right";
      buttons.forEach(function(button) {
        var btn = document.createElement("button");
        btn.className = "btn btn-default btn-xs";
        btn.innerHTML =
          '<i class="glyphicon glyphicon-' + button.icon + '"></i>';
        div3.appendChild(btn);

        if (button.action === todo.state) {
          btn.disabled = true;
        }

        if (button.action === "remove") {
          btn.title = "Remove";
          btn.onclick = function() {
            if (
              confirm(
                "Are you sure you want to delete the item titled " + todo.name
              )
            ) {
              todos.splice(todos.indexOf(todo), 1);
              renderTodos();
            }
          };
        } else {
          btn.title = "Mark as " + button.action;
          btn.onclick = function() {
            todo.state = button.action;
            renderTodos();
          };
        }
      });

      div1.appendChild(div2);
      div1.appendChild(div3);

      todoList.appendChild(div1);
    });
}

renderTodos();

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
