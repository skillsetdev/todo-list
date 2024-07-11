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

/////////////add Project////////////////////
const projectDialog = document.querySelector("#project-dialog");
const projectDialogForm = document.querySelector("#project-dialog-form");
const projectCloseButton = document.querySelector("#project-close-button");
const addProjectBtn = document.querySelector("#create-project");
function handleProjectSubmit(event) {
  event.preventDefault(); // Prevent the dialog from closing immediately
  const formData = new FormData(projectDialogForm);
  const projectName = formData.get("name");
  createProject(projectName);
  showProjects();
  projectDialog.close();
}
function handleProjectClose(event) {
  event.preventDefault();
  projectDialog.close();
}
addProjectBtn.addEventListener("click", () => {
  projectDialogForm.removeEventListener("submit", handleProjectSubmit);
  projectCloseButton.removeEventListener("click", handleProjectClose);

  projectDialogForm.addEventListener("submit", handleProjectSubmit);
  projectCloseButton.addEventListener("click", handleProjectClose);

  projectDialog.showModal();
});

////////////////add to do////////////////
const toDoDialog = document.querySelector("#to-do-dialog");
const toDoDialogForm = document.querySelector("#to-do-dialog-form");
const toDoCloseButton = document.querySelector("#to-do-close-button");
function handleToDoSubmit(event, project) {
  event.preventDefault(); // Prevent the dialog from closing immediately
  const formData = new FormData(toDoDialogForm);
  const toDoTitle = formData.get("title");
  const toDoDescription = formData.get("description");
  createToDo(project, toDoTitle, toDoDescription);
  showProjects();
  toDoDialog.close();
}
function handleToDoClose(event) {
  event.preventDefault();
  toDoDialog.close();
}
let submitHandler = null;
function addToDo(project) {
  if (submitHandler !== null) {
    toDoDialogForm.removeEventListener("submit", submitHandler); // Remove event listeners to avoid duplicates
  }
  submitHandler = (event) => {
    handleToDoSubmit(event, project);
    /* special treatment for handleToDoSubmit since:
    "In JavaScript, when you use an anonymous function (like the arrow function in the removeEventListener call), it's considered a different reference from any other function, including itself when recreated. This means that the function provided to removeEventListener must be the exact same instance (reference) as the one provided to addEventListener for it to be removed."*/
  };
  toDoCloseButton.removeEventListener("click", handleToDoClose);

  toDoDialogForm.addEventListener("submit", submitHandler);
  toDoCloseButton.addEventListener("click", handleToDoClose);

  toDoDialog.showModal();
}

//empty project
function initializeEmptyProject() {
  createProject("Default Project");
  showProjects();
}

initializeEmptyProject();
