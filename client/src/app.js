const API_BASE_URL = (window.API_BASE_URL || "http://127.0.0.1:5000"); // URL der API, später anpassen 

// endpoint mapping -> hier werden die Endpunkte der API definiert
const API={
    getAllTasks: () => `${API_BASE_URL}/`, // GET alle Tasks
    getTaskById: (id) => `${API_BASE_URL}/task/${id}`, // GET Task nach ID
    createTask: () => `${API_BASE_URL}/task`, // POST neues Task
    updateTask: (id) => `${API_BASE_URL}/task/${id}`, // PUT Task aktualisieren
    deleteTask: (id) => `${API_BASE_URL}/task/${id}` // DELETE Task löschen
    //?healthCheck: () => `${API_BASE_URL}/health` // GET Gesundheitscheck (optional)
};

// Daten in JSON umwandeln
function jsonMaker(data) {
    return JSON.stringify(data);
}




//--------------------------Variablen--------------------------------------
let addButton = document.querySelector(".addButton");

let taskForm = document.getElementById("taskForm"); // Formular Anzeige

let titleInput = document.getElementById("titleInput");
let descriptionInput = document.getElementById("descriptionInput");
let dueDateInput = document.getElementById("dueDateInput");
let prioritySelect = document.getElementById("prioritySelect");
let submitButton = document.getElementById("submitButton");
let cancelButton = document.getElementById("cancelButton");

//----Buttons
let deleteButton = document.querySelectorAll(".deleteButton");
let editButton = document.querySelectorAll(".editButton");
let completedCheckbox = document.querySelectorAll(".completedCheckbox");
let taskTableBody = document.getElementById("taskTableBody");




//--------------------------HinzufügenButton--------------------------------------
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
        description: descriptionInput.value??"", //hier leer wenn es undefiniert
        dueDate: dueDateInput.value??"", 
        priority: prioritySelect.value??"low", // Default  "low", wenn leer
        completed: false
    };
    console.log("Erhaltene Daten", newTask);  // Debugging: Überprüfen der erhaltenen Daten

    const newData = jsonMaker(newTask); // Daten in JSON umwandeln
    console.log("In JSON umgewandelt und new Daten sind; ", newData); // Debugging: Überprüfen der JSON-Daten


    //-------------------------API POST Anfrage -----------------
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

});//-------------------------API POST---------------------------------

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
        async function deleteTaskById(id) {
            try {
                const response = await fetch(API.deleteTask(id), {
                    method: "DELETE"
                });
                if (!response.ok) throw new Error("Fehler beim Löschen der Aufgabe!");
                alert(`Aufgabe ${title} erfolgreich gelöscht!`);
            } catch (error) {
                console.error("Fehler beim Löschen der Aufgabe:", error);
                alert("Fehler beim Löschen der Aufgabe. Bitte versuchen Sie es erneut.");
            }
        }
    });
});


// Bearbeiten Button
editButton.forEach(element => {
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


// completed Checkbox
completedCheckbox.forEach(element => {
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

// render funktion für Anzeige der Tabelle von DB
async function renderTasks() {
    try {
        //GET alle Tasks 
        const response = await fetch(API.getAllTasks());
        if (!response.ok) throw new Error("Fehler beim Laden der Aufgaben von der API");

        const data = await response.json();
        const tasks = data.tasks || []; // Sicherstellen, dass tasks ein Array ist
        console.log("Geladene Aufgaben:", tasks); // Debugging: Überprüfen der geladenen Aufgaben

        taskTableBody.innerHTML = ""; // Tabelle leeren

    // Tabelle füllen
    tasks.forEach((task, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${task.title ?? "Kein Titel"}</td>
            <td>${task.description ?? "Keine Beschreibung"}</td>
            <td>${task.dueDate ?? "Kein Fälligkeitsdatum"}</td>
            <td>${task.daysLeft ?? "Keine verbleibenden Tage"}</td>
            <td>${task.priority ?? "Keine Priorität"}</td>
            <td>
            <input type="checkbox" class="completedCheckbox" ${task.completed ? "checked" : ""}>
            </td>
            <td>
            <button type="button" class="deleteButton" data-id="${task.id}">Löschen</button>
            <button type="button" class="editButton" data-id="${task.id}">Bearbeiten</button>
            </td>
        `;
        taskTableBody.appendChild(row);
    });

    // Event-Listener für Löschen Button
    document.querySelectorAll(".deleteButton").forEach(btn => {
        btn.addEventListener("click", async function() {
            const id = this.getAttribute("data-id");
            try {
                const response = await fetch(API.deleteTask(id), { method: "DELETE" });
                if (!response.ok) throw new Error("Fehler beim Löschen der Aufgabe!");
                alert("Aufgabe erfolgreich gelöscht!");
                renderTasks(); // Tabelle aktualisieren nach dem Löschen   
            } catch (error) {
                alert("Fehler beim Löschen der Aufgabe. Bitte versuchen Sie es erneut.");
                console.error("Fehler beim Löschen der Aufgabe:", error);
            }
        });
    });

    // Event-Listener für Bearbeiten Button
    document.querySelectorAll(".editButton").forEach(btn => {
        btn.addEventListener("click", async function() {
            const id = this.getAttribute("data-id");
            // Hier können Sie den Bearbeitungsprozess implementieren
        });
    });

    // Event-Listener für die Checkbox "completed"
    document.querySelectorAll(".completedCheckbox").forEach(checkbox => {
        checkbox.addEventListener("change", async function() {
            const id = this.closest("tr").querySelector(".editButton").getAttribute("data-id");
            const completed = this.checked;
            try {
                const response = await fetch(API.updateTask(id, { completed }), { method: "PUT" });
                if (!response.ok) throw new Error("Fehler beim Aktualisieren der Aufgabe!");
                renderTasks(); // Tabelle aktualisieren nach dem Ändern des Status
            } catch (error) {
                alert("Fehler beim Aktualisieren der Aufgabe. Bitte versuchen Sie es erneut.");
                console.error("Fehler beim Aktualisieren der Aufgabe:", error);
            }
        });
    });

} catch (error) {
    console.error("Fehler beim Laden der Aufgaben von der API:", error);
    alert("Fehler beim Laden der Aufgaben. Bitte versuchen Sie es erneut.");
}
}

renderTasks();

