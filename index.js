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
  notes = "";
  priority = false;
  isComplete = false;
  opened = true;
  constructor(title, description, priority, notes) {
    this.title = title;
    this.description = description;
    this.notes = notes;
    this.priority = priority;
  }
}

function createProject(name) {
  let newProject = new Project(name, []);
  projects.push(newProject);
}

createProject("Default");
