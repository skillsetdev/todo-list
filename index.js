let projects = [];
class Project {
  name = "Unknown";
  todosList = [];
  opened = true;
  constructor(name, todosList) {
    this.name = name;
    this.todosList = todosList;
  }
}
class ToDo {
  title = "Title Unknown";
  description = "";
  priority = false;
  isComplete = false;
  opened = true;
  constructor(title, description, priority) {
    this.title = title;
    this.description = description;
    this.priority = priority;
  }
}

////////////////Functionality////////////////
function createProject(name) {
  let newProject = new Project(name, []);
  projects.push(newProject);
  showProjects();
}
function createToDo(parentProject, title, description) {
  let newToDo = new ToDo(title, description, true);
  parentProject.todosList.push(newToDo);
}

////////////////DOM Manipulations////////////////
function requestName() {
  const newName = prompt("Give your project a name!", "New Project");
  return newName;
}
const main = document.querySelector("#main");
function showProjects() {
  main.innerHTML = "";
  projects.forEach((project) => {
    let display = document.createElement("div");
    display.className = "project";
    display.textContent = project.name;
    main.appendChild(display);
  });
}
const btn = document.querySelector("#create-project");
btn.addEventListener("click", addProject);

////////////////Combination////////////////
function addProject() {
  const projectName = requestName();
  createProject(projectName);
}

createProject("Default");
