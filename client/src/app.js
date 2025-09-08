//! zumleeren -> im console localStorage.clear()

import { API_BASE_URL } from "./config.js"; 
const API_BASE_URL = "http://localhost:5500/api/tasks"; // URL der API, später anpassen 


// endpoint mapping -> hier werden die Endpunkte der API definiert
const API={
    listTasks: () => `${API_BASE_URL}/tasks`, // GET alle Tasks
    createTask: () => `${API_BASE_URL}/task`, // POST neues Task
    updateTask: (id) => `${API_BASE_URL}/task/${id}`, // PUT Task aktualisieren
    deleteTask: (id) => `${API_BASE_URL}/task/${id}` // DELETE Task löschen
    //?healthCheck: () => `${API_BASE_URL}/health` // GET Gesundheitscheck (optional)
};

// Daten in JSON umwandeln
function jsonMaker(data) {
    return JSON.stringify(data);
}



// //hier laden oder leer array
// let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// // beispieldaten
// if (tasks.length === 0) {
//   tasks = [
//     { id: 1, title: "Testaufgabe1", description: "nur zum testen1", dueDate: "2025-09-01", priority: "low", status: false },
//     { id: 2, title: "Testaufgabe2", description: "nur zum testen2", dueDate: "2026-09-01", priority: "medium", status: false }
//   ];
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
// }



let addButton = document.querySelector(".addButton");

let taskForm = document.getElementById("taskForm"); // Formular Anzeige

let titleInput = document.getElementById("titleInput");
let descriptionInput = document.getElementById("descriptionInput");
let dueDateInput = document.getElementById("dueDateInput");
let prioritySelect = document.getElementById("prioritySelect");
let submitButton = document.getElementById("submitButton");
let cancelButton = document.getElementById("cancelButton");

let deleteButton = document.querySelectorAll(".deleteButton");
let editButton = document.querySelectorAll(".editButton");
let statusCheckbox = document.querySelectorAll(".statusCheckbox");
let taskTableBody = document.getElementById("taskTableBody");




//--------------------------Hinzufügen--------------------------------------
// Formular hinzufügen (button)
addButton.addEventListener("click", () => {
//! Handle click event
        taskForm.style.display = "block"; // Formular anzeigen
});

// Formular speichern (button)
submitButton.addEventListener("click", (e) => {
    e.preventDefault(); // Verhindert das automatische Neuladen der Seite

    // Formular absenden und neues Task erstellen
    const newTask = {
        title: titleInput.value,
        description: descriptionInput.value,
        dueDate: dueDateInput.value,
        priority: prioritySelect.value,
        status: false
    };
    console.log("Erhaltene Daten", newTask);  // Debugging: Überprüfen der erhaltenen Daten

    const newData = jsonMaker(newTask); // Daten in JSON umwandeln
    console.log("In JSON umgewandelt", newData); // Debugging: Überprüfen der JSON-Daten


    //----------------- Hier API POST Anfrage -----------------
        // Nur POST-Anfrage senden
        (async () => {
            try {
                const response = await fetch(API.createTask(), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json" // umwandeln für JSON-Daten
                    },
                    body: jsonMaker(newTask)
                });
                if (!response.ok) throw new Error("Fehler beim Speichern der Aufgabe!");
                alert("Task erfolgreich gespeichert!");
                taskForm.reset();
                taskForm.style.display = "none";
            } catch (error) {
                console.error("Fehler beim Senden der Daten an die API:", error);
                alert(error.message || "Fehler beim Speichern der Aufgabe. Bitte versuchen Sie es erneut.");
            }
        })();

    // //! es wird värandert
    // tasks.push(newTask);
    // localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); //! Daten speichern im localStorage
    //                                                         //! Nachher muss es mit DB verbunden werden
    // rendertasks();
    // taskForm.reset();
    // taskForm.style.display = "none";
});

// Formular abbrechen (button) 
cancelButton.addEventListener("click", (e) => {
    e.preventDefault();  // Warten auf Klick
    taskForm.reset();     // Formular leeren
    taskForm.style.display = "none"; // Formular ausblenden
});
//--------------------------Hinzufügen--------------------------------------



// Löschen Button
deleteButton.forEach(element => {
    element.addEventListener("click", () => {
        //! Handle click event
    });
});


// Bearbeiten Button
editButton.forEach(element => {
    element.addEventListener("click", () => {
        //! Handle click event
    });
});


// Status Checkbox
statusCheckbox.forEach(element => {
    element.addEventListener("change", () => {
        //! Handle change event
    });
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
function rendertasks() {
    taskTableBody.innerHTML = "";
    tasks.forEach((task, index) => {
        const title = task.title ?? "";              //hier leer wenn es undefiniert
        const description = task.description ?? "";  
        const dueDate = task.dueDate ?? "";          
        const priority = task.priority ?? "";        
        const daysLeft = calculateRemainingDays(task.dueDate); 


        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${title}</td>
            <td>${description}</td>
            <td>${dueDate}</td>
            <td>${daysLeft}</td>  
            <td>${priority}</td>
            <td>
            <input type="checkbox" class="statusCheckbox" ${task.status ? "checked" : ""}>
            </td>
            <td>
            <button type="button" class="deleteButton">Löschen</button>
            <button type="button" class="editButton">Bearbeiten</button>
            </td>
        `;
        taskTableBody.appendChild(row);
    });
}

rendertasks();

