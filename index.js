let emptyProjectInitialized = false;
let projects = getProjects();
const today = new Date();
const todayFormattedToISO8601 =
  today.getFullYear() +
  "-" +
  ("0" + (today.getMonth() + 1)).slice(-2) +
  "-" +
  ("0" + today.getDate()).slice(-2);

class Project {
  name = "Unknown";
  todosList = [];
  dueDate = "";
  opened = true;
  constructor(name, todosList, dueDate) {
    this.name = name;
    this.todosList = todosList;
    this.dueDate = dueDate;
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

//display the UI
const main = document.querySelector("#main");
function compareISO8601dates(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  const diffInMilliseconds = d2 - d1;

  // Convert milliseconds to days (1 day = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

  return Math.round(diffInDays); // Return the difference in days, rounded to the nearest whole number
}
function showProjects() {
  main.innerHTML = "";
  projects.forEach((project) => {
    let projectDisplay = document.createElement("div");
    projectDisplay.className = "project";
    let projectHeader = document.createElement("div");
    projectHeader.className = "project-header";
    let projectTitle = document.createElement("h2");
    projectTitle.textContent = project.name;
    let daysLeft = compareISO8601dates(
      todayFormattedToISO8601,
      project.dueDate
    );
    let daysDisplay = document.createElement("div");
    daysDisplay.textContent = `Deadline in ${daysLeft} days`;
    projectHeader.appendChild(projectTitle);

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

    projectHeader.appendChild(projectTitle);
    projectHeader.appendChild(daysDisplay);
    projectDisplay.appendChild(projectHeader);
    projectDisplay.appendChild(projectToDos);

    let addToDoBtn = document.createElement("button");
    addToDoBtn.textContent = "Add TO-DO";
    addToDoBtn.addEventListener("click", () => addToDo(project));
    projectDisplay.appendChild(addToDoBtn);

    main.appendChild(projectDisplay);
  });
}

/////////Save Projects in local storage/////////

function storeProjects(projectsArray) {
  const projectsString = JSON.stringify(projectsArray);

  window.localStorage.setItem("projects", projectsString);
}
function getProjects() {
  const projectsString = window.localStorage.getItem("projects");

  if (projectsString && projectsString !== "undefined") {
    try {
      const projectsArray = JSON.parse(projectsString);
      emptyProjectInitialized = true;
      return projectsArray;
    } catch (e) {
      // If JSON.parse fails, return an empty array as a fallback
      console.error("Error parsing projects from localStorage:", e);
      return [];
    }
  } else {
    return [];
  }
}
////////////////Functionality////////////////
function createProject(name, dueDate) {
  let newProject = new Project(name, [], dueDate);
  projects.push(newProject);
  storeProjects(projects);
}
function createToDo(parentProject, title, description) {
  let newToDo = new ToDo(title, description, false);
  parentProject.todosList.push(newToDo);
  storeProjects(projects);
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
  const projectDueDate = formData.get("date").toString();
  createProject(projectName, projectDueDate); // add daysLeft!!!!!!!!!!!
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
    /* special treatment for handleToDoSubmit since it also requires a parent project as a parameter:
    "In JavaScript, when you use an anonymous function (like the arrow function in the removeEventListener call), it's considered a different reference from any other function, including itself when recreated. This means that the function provided to removeEventListener must be the exact same instance (reference) as the one provided to addEventListener for it to be removed."*/
  };
  toDoCloseButton.removeEventListener("click", handleToDoClose);

  toDoDialogForm.addEventListener("submit", submitHandler);
  toDoCloseButton.addEventListener("click", handleToDoClose);

  toDoDialog.showModal();
}

function initializeEmptyProject() {
  if (!emptyProjectInitialized) {
    createProject("Default Project", todayFormattedToISO8601);
  }
  showProjects();
}

initializeEmptyProject();
