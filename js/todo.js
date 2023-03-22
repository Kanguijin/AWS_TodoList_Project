class TodoEvent {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new TodoEvent();
        }
        return this.#instance;
    }

    addEventAddTodoClick() {
        const addTodoBtn = document.querySelector(".add-todo-btn");
        addTodoBtn.onclick = () => {
            TodoService.getInstance().addTodo();
            const todoInput = document.querySelector(".todo-input");
            todoInput.value = "";
        }
    }

    addEventAddTodoKeyUp() {
        const todoInput = document.querySelector(".todo-input");
        todoInput.onkeyup = () => {
            if(window.event.keyCode == 13) {
                const addTodoButton = document.querySelector(".add-todo-btn");
                addTodoButton.click();
            }
        }
    }


    addEventCheckboxClick() {
        const checkboxes = document.querySelectorAll(".checkbox");
        checkboxes.forEach((checkbox, index) => {
            checkbox.onchange = () => {
                if(checkbox.checked) {
                    TodoService.getInstance().completeTodoCheckbox(index);                   
                } else {
                    TodoService.getInstance().uncompleteTodoCheckbox(index);
                }   
            }
        });
    }

    addEventAllCheckboxClick() {
        const selectAll = document.querySelector(".select-all");
        selectAll.onclick = () => {
           TodoService.getInstance().todoList.forEach(todoObj => {
                todoObj.todoChecked = selectAll.checked;
           })
           TodoService.getInstance().updateLocalStorage();
        }
    }

    addEventRemoveBtnClick() {
        const removeBtns = document.querySelectorAll(".remove-btn");
        removeBtns.forEach((removeBtn, index) => {
            removeBtn.onclick = () => {
                TodoService.getInstance().todoList.splice(index, 1);
                TodoService.getInstance().updateLocalStorage();
            }
        })
    }

}

class TodoService {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new TodoService();
        }
        return this.#instance;
    }

    todoList = null;
    

    constructor() {
        if(localStorage.getItem("todoList") == null) {
            this.todoList = new Array();
           
        } else {
            this.todoList = JSON.parse(localStorage.getItem("todoList"));
        }
        this.loadTodoList();
    }

    updateLocalStorage() {
        localStorage.setItem("todoList", JSON.stringify(this.todoList));
        this.loadTodoList();
    }
    
    addTodo() {
        const todoInput = document.querySelector(".todo-input");
         
        if(todoInput.value == "" ) {
            Swal.fire('please Enter todo.')
            return;
        }

        const todoObj = {
            todoContent : todoInput.value,
            todoChecked : false
        }
        this.todoList.push(todoObj);
        this.updateLocalStorage();
       
    }

    loadTodoList() {
        
        const todoContentList = document.querySelector(".todo-content-list");
        todoContentList.innerHTML = ``;
        
        this.todoList.forEach(todoObj => {          
                todoContentList.innerHTML += `
                <li class="content-container">
                    <div class="todo-content">
                        <input type="checkbox" class="checkbox" ${todoObj.todoChecked ? "checked" : ""}>
                        <div class="todo-value">${todoObj.todoContent}</div>
                        <button class="remove-btn">⨉</button>
                    </div>
                </li>
                `;
        });

        TodoEvent.getInstance().addEventCheckboxClick();    
        TodoEvent.getInstance().addEventAllCheckboxClick();    
        TodoEvent.getInstance().addEventRemoveBtnClick();
        this.getCompleteAndUnCompleteCount();
        this.getCheckAllStatus();
    }

    getCheckAllStatus() {
        const selectAll = document.querySelector(".select-all");
        for(let todoObj of this.todoList) {
            if(!todoObj.todoChecked) {
                selectAll.checked = false;
                return;
            } else if(todoObj.todoChecked) {
                selectAll.checked = true;
            }
        }
        if(this.todoList.length==0) {
            selectAll.checked = false;
        }
          
    }

    getCompleteAndUnCompleteCount() {
        let completeCount = 0;
        let unCompleteCount = 0;

        for(let todoObj of this.todoList) {
            if(todoObj.todoChecked) {
                completeCount++;
            }else {
                unCompleteCount++;
            }
        }

        const navContainer = document.querySelector(".nav-container");
        navContainer.innerHTML = `
            <li class="nav nav01">All : ${this.todoList.length}</li>
            <li class="nav nav02">Progressing : ${unCompleteCount}</li>
            <li class="nav nav03">Completed : ${completeCount}</li>
        `;
    }


    completeTodoCheckbox(index) {
        const checkboxs = document.querySelectorAll(".checkbox");
        this.todoList[index].todoChecked = checkboxs[index].checked;
        this.updateLocalStorage();
    }

    uncompleteTodoCheckbox(index) {
        const checkboxs = document.querySelectorAll(".checkbox");
        this.todoList[index].todoChecked = checkboxs[index].checked;
        this.updateLocalStorage();
    }

    



}