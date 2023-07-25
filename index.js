class Todos {
    #todos = []
    #todosName = "completedTodos"
    constructor(todoName) {
        this.#todosName = todoName

        if (!localStorage.getItem(todoName)) {
            localStorage.setItem(this.#todosName, JSON.stringify(this.#todos))
        }
        else {
            this.#todos = JSON.parse(localStorage.getItem(this.#todosName))
        }
    }

    getTodos() {
        return this.#todos
    }
    removeTodo(id) {
        this.#todos= this.#todos.filter(i=>i.id != id)
        localStorage.setItem(this.#todosName, JSON.stringify(this.#todos))
        return 1


    }
    addTodo(todo, desc, deadline, isCompleted, completedAt = 0) {
        let id = 0
        if (this.#todos.length > 0) {
            id = this.#todos[this.#todos.length - 1].id + 1
        }
        if(isCompleted) 
        completedAt = new Date().toLocaleDateString()
        this.#todos.push(
            {
                id: id,
                todo: todo,
                deadline: deadline,
                todoDesc: desc,
                createdAt: new Date().toLocaleDateString(),
                completedAt: completedAt,
                isCompleted: isCompleted
            }
        )
        localStorage.setItem(this.#todosName, JSON.stringify(this.#todos))

    }
}
class CompletedTodos extends Todos {
    constructor(todoName = 'completedTodos') {
        super(todoName)
    }

}

class UncompletedTodos extends Todos {
    constructor(todoName = 'UnCompletedTodos') {
        super(todoName)
    }
}

const completedTasksTemplate = document.getElementById("completed-task-template")
const unCompletedTasksTemplate = document.getElementById("uncompleted-task-template")

const form = document.getElementById("task-form")
const todoTitle = document.getElementById("todo-title")
const todoDesc = document.getElementById("todo-desc")
const completionDate = document.getElementById("completion-date")
const taskStatus = document.getElementById("task-status")
const completedSection = document.getElementById("completed")
const unCompletedSection = document.getElementById("uncompleted")

const completedObject = new CompletedTodos()
const unCompletedObject = new UncompletedTodos()

// listen for submit
form.addEventListener('submit', e => {
    e.preventDefault()
    if (taskStatus.value == "completed") {
        completedObject.addTodo(todoTitle.value, todoDesc.value, completionDate.value, true)
        renderTask()
        console.log(completedObject.getTodos());
    }
    else if (taskStatus.value == "uncompleted") {
        unCompletedObject.addTodo(todoTitle.value, todoDesc.value, completionDate.value, false)
        renderTask()

    }
    else {
        console.log("invalid task status");
    }
    form.reset()


})

renderTask()
function renderTask() {
    // completed
    document.querySelectorAll(".task-item-completed").forEach(e => e.remove())
    completedObject.getTodos().forEach(i => {
        let completedTaskC = completedTasksTemplate.content.cloneNode(true)
        completedTaskC.querySelector(".task-title").textContent = i.todo
        completedTaskC.querySelector(".task-description").textContent = i.todoDesc
        completedTaskC.querySelector(".created-at").textContent = i.createdAt
        completedTaskC.querySelector(".completed").textContent = i.completedAt
        completedTaskC.querySelector(".deadline").textContent = i.deadline
        let days = Math.ceil((new Date(i.deadline).getTime() - new Date(i.completedAt).getTime()) / (1000 * 60 * 60 * 24))
        if (days > 0 && i.completedAt != '0')
            completedTaskC.querySelector(".days-ealier").textContent = Math.abs(days) + " days early"
        else
            completedTaskC.querySelector(".days-ealier").textContent = Math.abs(days) + " days late"
        completedSection.appendChild(completedTaskC)
    })

    // uncompleted

    document.querySelectorAll(".task-item-uncompleted").forEach(e => e.remove())
    unCompletedObject.getTodos().forEach(i => {
        let unCompletedTaskC = unCompletedTasksTemplate.content.cloneNode(true)
        unCompletedTaskC.querySelector(".task-title").textContent = i.todo
        unCompletedTaskC.querySelector(".task-description").textContent = i.todoDesc
        unCompletedTaskC.querySelector(".created-at").textContent = i.createdAt
        unCompletedTaskC.querySelector(".deadline").textContent = i.deadline
        let days = Math.ceil((new Date(i.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        if (days > 0)
            unCompletedTaskC.querySelector(".days-late").textContent = days + ' days remaining'
        else
            unCompletedTaskC.querySelector(".days-late").textContent = "late by " + days + " days"
        unCompletedSection.appendChild(unCompletedTaskC)
    })
    handleComplete()
    deleteTask()
}

function handleComplete() {
    document.querySelectorAll(".mark-task-complete").forEach((i, index) => {
        i.addEventListener("click", () => {
            // console.log(i, index);
            let markedItem = unCompletedObject.getTodos()[index]
            markedItem.isCompleted = true
            markedItem.completedAt = new Date().toLocaleDateString()
            completedObject.addTodo(markedItem.todo, markedItem.todoDesc, markedItem.deadline, markedItem.isCompleted, markedItem.completedAt)
            unCompletedObject.removeTodo(index)
            renderTask()
        })
    })
}

function deleteTask() {

    document.querySelectorAll(".delete-completed").forEach((i, index) => {
        i.addEventListener("click", () => {
            let task = completedObject.getTodos()[index]
            completedObject.removeTodo(task.id)
            renderTask()
        })
    })
    document.querySelectorAll(".delete-uncompleted").forEach((i, index) => {
        i.addEventListener("click", () => {
            let task = unCompletedObject.getTodos()[index]
            unCompletedObject.removeTodo(task.id)
            renderTask()
        })
    })
}