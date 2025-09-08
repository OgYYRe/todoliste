//! zumleeren -> im console localStorage.clear()


// Todo Alle Buttons a

//let todos = [];

//hier schluessel setzen
const STORAGE_KEY = "todosData"; 

//hier laden oder leer array
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// beispieldaten
if (todos.length === 0) {
  todos = [
    { id: 1, title: "Testaufgabe", description: "nur zum testen", dueDate: "2025-09-01", priority: "low", status: false },
    { id: 1, title: "Testaufgabe", description: "nur zum testen", dueDate: "2026-09-01", priority: "low", status: false }
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}



let addButton = document.querySelector(".addButton");

let todoForm = document.getElementById("todoForm"); // Formular Anzeige

let titleInput = document.getElementById("titleInput");
let descriptionInput = document.getElementById("descriptionInput");
let dueDateInput = document.getElementById("dueDateInput");
let prioritySelect = document.getElementById("prioritySelect");
let submitButton = document.getElementById("submitButton");
let cancelButton = document.getElementById("cancelButton");

let deleteButton = document.querySelectorAll(".deleteButton");
let editButton = document.querySelectorAll(".editButton");
let statusCheckbox = document.querySelectorAll(".statusCheckbox");
let todoTableBody = document.getElementById("todoTableBody");

addButton.addEventListener("click", () => {
        //! Handle click event
        todoForm.style.display = "block"; // Formular anzeigen
});

deleteButton.forEach(element => {
    element.addEventListener("click", () => {
        //! Handle click event
    });
});

editButton.forEach(element => {
    element.addEventListener("click", () => {
        //! Handle click event
    });
});

statusCheckbox.forEach(element => {
    element.addEventListener("change", () => {
        //! Handle change event
    });
});

submitButton.addEventListener("click", (e) => {
    e.preventDefault(); // Verhindert das automatische Neuladen der Seite
    
    //! Formular absenden
    const newTodo = {
        title: titleInput.value,
        description: descriptionInput.value,
        dueDate: dueDateInput.value,
        priority: prioritySelect.value,
        status: false
    };
    todos.push(newTodo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    renderTodos();
    todoForm.reset();
    todoForm.style.display = "none";
});

cancelButton.addEventListener("click", (e) => {
    e.preventDefault();
    todoForm.reset();
    todoForm.style.display = "none";
});

// Datum Berechnung
function calculateRemainingDays(dueDate) {
    if (!dueDate) return ""; //hier leer wenn kein datum
    const today = new Date();
    const due = new Date(dueDate);
    if (isNaN(due.getTime())) return ""; //hier leer wenn ungueltig
    const timeDiff = due - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
     return daysDiff > 0 ? `${daysDiff} Tage` : "Frist abgelaufen";
}

// render funktion für Anzeige der Tabelle
function renderTodos() {
    todoTableBody.innerHTML = "";
    todos.forEach((todo, index) => {
        const title = todo.title ?? "";              //hier leer wenn es undefiniert
        const description = todo.description ?? "";  
        const dueDate = todo.dueDate ?? "";          
        const priority = todo.priority ?? "";        
        const daysLeft = calculateRemainingDays(todo.dueDate); 


        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${title}</td>
            <td>${description}</td>
            <td>${dueDate}</td>
            <td>${daysLeft}</td>  
            <td>${priority}</td>
            <td>
            <input type="checkbox" class="statusCheckbox" ${todo.status ? "checked" : ""}>
            </td>
            <td>
            <button type="button" class="deleteButton">Löschen</button>
            <button type="button" class="editButton">Bearbeiten</button>
            </td>
        `;
        todoTableBody.appendChild(row);
    });
}

renderTodos();

