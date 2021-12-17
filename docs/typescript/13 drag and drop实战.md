---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /typescript/
---



::: tip

理解组件底层渲染与挂在的具体流程，通过面向对象的形式来进行实现

:one: 挂在节点

:two: 渲染节点

与页面的呈现很多都是在构造函数完成的

:::

## 挂载api

- **appendChild**
- **insertAdjacentElement**



## 拖拽设计

::: tip

1. 接口设计
2. html属性设置
3. 事件监听
4. 数据移动

:::

### 接口设计

```typescript
// Drag & Drop interfaces
interface Dragable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DropTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}
```

::: tip

实现 数据移动

:one: event.dataTransfer.setData

:two: event.dataTransfer.effectAllowed = "move"

:three: event.dataTransfer.getData

:::

```typescript {4-5,16,28}
  @AutoBind
  dragStartHandler(event: DragEvent): void {
    console.log("Drag start");
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  @AutoBind
  dragEndHandler(event: DragEvent): void {
    console.log("Drag End.");
  }
  
  @AutoBind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      console.log("dragOverhandler");
      const classList = this.element.querySelector("ul")!.classList;
      if (!classList.contains("droppable")) {
        classList.add("droppable");
      }
    }
  }
  
  @AutoBind
  dropHandler(event: DragEvent): void {
    console.log("drophandler");
    const prjId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      prjId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @AutoBind
  dragLeaveHandler(event: DragEvent): void {
    console.log("dragLeaveHandler");
    const classList = this.element.querySelector("ul")!.classList;
    if (classList.contains("droppable")) {
      classList.remove("droppable");
    }
  }
```

### html属性设计

```html
<!-- single project -->
<template id="single-project">
    <li draggable="true">
        <h2></h2>
        <h3></h3>
        <p></p>
    </li>
</template>
```

### 事件监听

::: tip

监听主要的事件

:one: **dragable**元素  1. **dragstart**  2. **dragend**

:two: **dragtaget**目标  1. **dragover** 2. **drop** 3. **dragleave**

:::

```typescript {2-3,7-9}
configure(): void {
    this.element.addEventListener("dragstart", this.dragStartHandler);
	this.element.addEventListener("dragend", this.dragEndHandler);
}

configure(): void {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("drop", this.dropHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);

    // add listen
    projectState.addListen((projects: Project[]) => {
      const relvantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });

      this.assignedProjects = relvantProjects;
      this.renderProjects();
    });
  }
```



## 代码

::: tip

:one: enum设计

:two: 组件泛型抽象继承

:three: 校验

:four: 状态设计

:five: decorator自动绑定this

:::



::: details

```typescript
// Drag & Drop interfaces
interface Dragable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DropTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

// Validatable
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

// function to validate
function validate(validatableInput: Validatable) {
  const value = validatableInput.value;
  let isValid = true;
  // required check
  if (validatableInput.required) {
    isValid = isValid && value.toString().trim().length !== 0;
  }

  // check minLength
  if (validatableInput.minLength != null && typeof value === "string") {
    isValid = isValid && value.length >= validatableInput.minLength;
  }

  // check maxLength
  if (validatableInput.maxLength != null && typeof value === "string") {
    isValid = isValid && value.length <= validatableInput.maxLength;
  }

  // check min
  if (validatableInput.min != null && typeof value === "number") {
    isValid = isValid && value >= validatableInput.min;
  }

  // check max
  if (validatableInput.max != null && typeof value === "number") {
    isValid = isValid && value <= validatableInput.max;
  }

  return isValid;
}

// autobind decorator
function AutoBind(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  console.log(methodName);
  console.log(descriptor.value);
  const originalMethod = descriptor.value;
  const newDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  return newDescriptor;
}

// enum ProjectStatus
enum ProjectStatus {
  Active,
  Finished,
}

// Project class
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// Listen type
type Listen<T> = (projects: T[]) => void;

abstract class State<T> {
  protected listeners: Listen<T>[] = [];
  constructor() {}
  addListen(fn: Listen<T>) {
    this.listeners.push(fn);
  }
}

// Project Statement Management
class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;
  private constructor() {
    super();
  }

  addProject(title: string, description: string, numPeople: number) {
    const project = new Project(
      Math.random().toString(),
      title,
      description,
      numPeople,
      ProjectStatus.Active
    );

    this.projects.push(project);
    this.updateListeners();
  }

  moveProject(prjId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === prjId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenFn of this.listeners) {
      listenFn(this.projects.slice());
    }
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }
}

// Global Project statement
const projectState = ProjectState.getInstance();

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostId: string,
    isBeforeEnd: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;

    this.hostElement = <T>document.getElementById(hostId)!;
    const importNode = document.importNode(this.templateElement.content, true);
    this.element = importNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(isBeforeEnd);
  }

  private attach(beforeEnd: boolean) {
    this.hostElement.insertAdjacentElement(
      beforeEnd ? "beforeend" : "afterbegin",
      this.element
    );
  }

  abstract renderContent(): void;
  abstract configure(): void;
}

// ProjectInput class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleElement: HTMLInputElement;
  descriptionElement: HTMLTextAreaElement;
  peopleElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", false, "user-input");

    this.titleElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionElement = this.element.querySelector(
      "#description"
    ) as HTMLTextAreaElement;
    this.peopleElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
  }

  configure() {
    // this.formElement.addEventListener("submit", this.submitHandler.bind(this));
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent(): void {}

  private gatherUserInputs(): [string, string, number] | void {
    const enteredTitle = this.titleElement.value;
    const enteredDescription = this.descriptionElement.value;
    const enterPeople = this.peopleElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
    };
    const peopleValidatable: Validatable = {
      value: +enterPeople,
      required: true,
      min: 1,
      max: 5,
    };

    // valid
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input.Please try again!");
      return;
    }
    return [enteredTitle, enteredDescription, +enterPeople];
  }

  private clearInputs() {
    this.titleElement.value = "";
    this.descriptionElement.value = "";
    this.peopleElement.value = "";
  }

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInputs = this.gatherUserInputs();
    if (Array.isArray(userInputs)) {
      const [title, description, people] = userInputs;
      console.log(title, description, people);
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }
}

// ProjectItem class
class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Dragable
{
  private project: Project;

  get persons() {
    return this.project.people === 1
      ? "1 person"
      : `${this.project.people} persons`;
  }
  constructor(hostId: string, project: Project) {
    super("single-project", hostId, true, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }

  configure(): void {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent(): void {
    this.element.querySelector("h2")!.textContent = this.project.title;
    // use getter
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }

  @AutoBind
  dragStartHandler(event: DragEvent): void {
    console.log("Drag start");
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  @AutoBind
  dragEndHandler(event: DragEvent): void {
    console.log("Drag End.");
  }
}

// Project List class
class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DropTarget
{
  assignedProjects: Project[];
  constructor(private type: "active" | "finished") {
    super("project-list", "app", true, type + "-projects");

    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @AutoBind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
       event.preventDefault();
      console.log("dragOverhandler");
      const classList = this.element.querySelector("ul")!.classList;
      if (!classList.contains("droppable")) {
        classList.add("droppable");
      }
    }
  }
  @AutoBind
  dropHandler(event: DragEvent): void {
    console.log("drophandler");
    const prjId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      prjId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @AutoBind
  dragLeaveHandler(event: DragEvent): void {
    console.log("dragLeaveHandler");
    const classList = this.element.querySelector("ul")!.classList;
    if (classList.contains("droppable")) {
      classList.remove("droppable");
    }
  }

  configure(): void {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("drop", this.dropHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);

    // add listen
    projectState.addListen((projects: Project[]) => {
      const relvantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });

      this.assignedProjects = relvantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;

    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + "-PROJECTS";
  }

  private renderProjects() {
    const listId = `${this.type}-projects-list`;
    const ulEl = document.getElementById(listId)! as HTMLUListElement;
    ulEl.innerHTML = "";
    for (const project of this.assignedProjects) {
      // 挂载并渲染
      new ProjectItem(ulEl.id, project);
    }
  }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
```

:::



## 问题

- 拖拽的元素颜色

## todo

[Tour of the App - Watch Us Build a Trello Clone | Vue Mastery](https://www.vuemastery.com/courses/watch-us-build-trello-clone/tour-of-the-app)

[Using the HTML5 Drag and Drop API (web.dev)](https://web.dev/drag-and-drop/)

[Linked Lists in jQuery Sortable Widget Demo | Kendo UI for jQuery (telerik.com)](https://demos.telerik.com/kendo-ui/sortable/linkedlists)

