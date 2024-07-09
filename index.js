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
}
function createToDo(parentProject, title, description) {
  let newToDo = new ToDo(title, description, false);
  parentProject.todosList.push(newToDo);
}

////////////////DOM Manipulations////////////////
function requestProjectName() {
  const newName = prompt("Give your project a name!", "New Project");
  return newName;
}
function requestToDoTitle() {
  const newTitle = prompt("Give your to-do a title!", "Nothing Yet To Do");
  return newTitle;
}
function requestToDoDescription() {
  const newDescription = prompt("Description:", "");
  return newDescription;
}
const main = document.querySelector("#main");
function showProjects() {
  main.innerHTML = "";
  projects.forEach((project) => {
    let projectDisplay = document.createElement("div");
    projectDisplay.className = "project";
    projectDisplay.textContent = project.name;

    let projectToDos = document.createElement("div");
    projectToDos.className = "to-dos-list";
    project.todosList.forEach((toDo) => {
      let toDoDisplay = document.createElement("div");
      toDoDisplay.className = "to-do";
      let toDoTitle = document.createElement("h3");
      toDoTitle.textContent = toDo.title;
      let toDoDescription = document.createElement("p");
      toDoDescription.textContent = toDo.description;
      toDoDisplay.appendChild(toDoTitle);
      toDoDisplay.appendChild(toDoDescription);
      projectToDos.appendChild(toDoDisplay);
    });
    projectDisplay.appendChild(projectToDos);

    let addToDoBtn = document.createElement("button");
    addToDoBtn.textContent = "Add TO-DO";
    addToDoBtn.addEventListener("click", () => addToDo(project));
    projectDisplay.appendChild(addToDoBtn);

    main.appendChild(projectDisplay);
  });
}
const addProjectBtn = document.querySelector("#create-project");
addProjectBtn.addEventListener("click", addProject);

////////////////Combination////////////////
function addProject() {
  const projectName = requestProjectName();
  createProject(projectName);
  showProjects();
}
function addToDo(parentProject) {
  const toDoTitle = requestToDoTitle();
  const toDoDescription = requestToDoDescription();
  createToDo(parentProject, toDoTitle, toDoDescription);
  showProjects();
}
function initializeEmptyProject() {
  createProject("Default");
  showProjects();
}

initializeEmptyProject();
