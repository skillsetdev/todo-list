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
function requestToDoTitle() {
  const newTitle = prompt("Give your to-do a title!", "Nothing Yet To Do");
  return newTitle;
}
function requestToDoDescription() {
  const newDescription = prompt("Description:", "");
  return newDescription;
}

//display the UI
const main = document.querySelector("#main");
function showProjects() {
  main.innerHTML = "";
  projects.forEach((project) => {
    let projectDisplay = document.createElement("div");
    projectDisplay.className = "project";
    let projectTitle = document.createElement("h2");
    projectTitle.textContent = project.name;

    let projectToDos = document.createElement("div");
    projectToDos.className = "to-dos-list";
    project.todosList.forEach((toDo) => {
      let toDoDisplay = document.createElement("div");
      toDoDisplay.className = "to-do";
      let toDoTitle = document.createElement("h4");
      toDoTitle.textContent = toDo.title;
      let toDoDescription = document.createElement("p");
      toDoDescription.textContent = toDo.description;
      let toDoContent = document.createElement("div");
      toDoContent.appendChild(toDoTitle);
      toDoContent.appendChild(toDoDescription);
      let doneButton = document.createElement("button");
      doneButton.textContent = "Done";
      doneButton.addEventListener(
        "click",
        () => ((toDo.isComplete = !toDo.isComplete), showProjects())
      );
      if (!toDo.isComplete) {
        doneButton.style.backgroundColor = "#5f7865";
        doneButton.addEventListener(
          "mouseenter",
          () => (doneButton.style.backgroundColor = "#425346")
        );
        doneButton.addEventListener(
          "mouseleave",
          () => (doneButton.style.backgroundColor = "#5f7865")
        );
      }

      toDoDisplay.appendChild(toDoContent);
      toDoDisplay.appendChild(doneButton);
      projectToDos.appendChild(toDoDisplay);
    });

    projectDisplay.appendChild(projectTitle);
    projectDisplay.appendChild(projectToDos);

    let addToDoBtn = document.createElement("button");
    addToDoBtn.textContent = "Add TO-DO";
    addToDoBtn.addEventListener("click", () => addToDo(project));
    projectDisplay.appendChild(addToDoBtn);

    main.appendChild(projectDisplay);
  });
}

//add Project
const projectDialog = document.querySelector("#project-dialog");
const projectDialogForm = document.querySelector("#project-dialog-form");
const projectCloseButton = document.querySelector("#project-close-button");
const addProjectBtn = document.querySelector("#create-project");
projectDialogForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the dialog from closing immediately
  const formData = new FormData(projectDialogForm);
  const projectName = formData.get("name");

  createProject(projectName);
  showProjects();
  projectDialog.close();
});
projectCloseButton.addEventListener("click", (e) => {
  e.preventDefault();
  projectDialog.close();
});
addProjectBtn.addEventListener("click", () => {
  projectDialog.showModal();
});

////////////////Combination////////////////
function addToDo(parentProject) {
  const toDoTitle = requestToDoTitle();
  const toDoDescription = requestToDoDescription();
  createToDo(parentProject, toDoTitle, toDoDescription);
  showProjects();
}
function initializeEmptyProject() {
  createProject("Default Project");
  showProjects();
}

initializeEmptyProject();
