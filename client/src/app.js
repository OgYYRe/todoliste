const API_BASE_URL = (window.API_BASE_URL || "http://127.0.0.1:5000"); // URL der API, später anpassen 

// endpoint mapping -> hier werden die Endpunkte der API definiert
const API={
    getAllTasks: () => `${API_BASE_URL}/`, // GET alle Tasks
    getTaskById: (id) => `${API_BASE_URL}/task/${id}`, // GET Task nach ID
    createTask: () => `${API_BASE_URL}/task`, // POST neues Task
    updateTask: (id) => `${API_BASE_URL}/task/${id}`, // PUT Task aktualisieren
    deleteTask: (id) => `${API_BASE_URL}/task/${id}` // DELETE Task löschen
};

// Daten in JSON umwandeln
function jsonMaker(data) {
    return JSON.stringify(data);
}

// Priorität Label Funktion
function getPriorityLabel(priority) {
    switch (priority ?? "") {
        case "Low": return "Niedrig";
        case "Medium": return "Mittel";
        case "High": return "Hoch";
        default: return "Keine Priorität";
    }
}




//--------------------------Variablen--------------------------------------
let editTaskId = null; // Variable zum Speichern der ID der zu bearbeitenden Aufgabe
let addButton = document.querySelector(".addButton");
let taskForm = document.getElementById("taskForm"); // Formular Anzeige
let editTaskCompleted = false; 


//----Formular Inputs
let titleInput = document.getElementById("titleInput");
let descriptionInput = document.getElementById("descriptionInput");
let due_dateInput = document.getElementById("due_dateInput");
let priorityInput = document.getElementById("priorityInput");
let createButton = document.getElementById("createButton");
let updateButton = document.getElementById("updateButton");
let cancelButton = document.getElementById("cancelButton");

//----Buttons
let completedCheckbox = document.querySelectorAll(".completedCheckbox");
let taskTableBody = document.getElementById("taskTableBody");




//--------------------------HinzufügenButton--------------------------------------
    // Formular hinzufügen (button)
addButton.addEventListener("click", () => {
        taskForm.reset(); // Formular leeren
        taskForm.style.display = "block"; // Formular anzeigen
        createButton.style.display = "block"; // Hinzufügen-Button anzeigen
        updateButton.style.display = "none"; // Update-Button ausblenden
});

    // Neuen Task erstellen (button)
createButton.addEventListener("click", (e) => {
    e.preventDefault(); // Verhindert das automatische Neuladen der Seite

    // Formular absenden und neues Task erstellen
    const newTask = {
        //! ID muss von der Backend-API generiert werden
        title: titleInput.value,
        description: descriptionInput.value??"", //hier leer wenn es undefiniert
        due_date: due_dateInput.value === "" ? null : due_dateInput.value, 
        priority: priorityInput.value??"Low", // Default  "Low", wenn leer
        completed: false
    };
    console.log("Erhaltene Daten", newTask);  // Debugging: Überprüfen der erhaltenen Daten

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
                if (!response.ok) throw new Error("Fehler beim Speichern der Aufgabe!", newTask);
                alert("Task erfolgreich gespeichert!");
                taskForm.reset();
                taskForm.style.display = "none";
                renderTasks(); // Tabelle aktualisieren nach dem Hinzufügen
            } catch (error) {
                console.error("Fehler beim Senden der Daten an die API:", error, newTask);
                alert(error.message || "Fehler beim Speichern der Aufgabe. Bitte versuchen Sie es erneut.", newTask);
            }
        })();

});//-------------------------API POST endpoint---------------------------------

    // Task aktualisieren (button)
updateButton.addEventListener("click", (e) => {
    e.preventDefault();

    if (!editTaskId) return;

    const updatedTask = {
        title: titleInput.value,
        description: descriptionInput.value ?? "",
        due_date: due_dateInput.value ?? "",
        priority: priorityInput.value ?? "Low",
        completed: editTaskCompleted  
    };

    (async () => {
        try {
            const response = await fetch(API.updateTask(editTaskId), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: jsonMaker(updatedTask)
            });
            if (!response.ok) throw new Error("Fehler beim Aktualisieren der Aufgabe!");
            alert("Task erfolgreich aktualisiert!");
            taskForm.reset();
            taskForm.style.display = "none";
            createButton.style.display = "block";
            updateButton.style.display = "none";
            editTaskId = null;
            renderTasks();
        } catch (error) {
            alert(error.message || "Fehler beim Aktualisieren der Aufgabe. Bitte versuchen Sie es erneut.");
        }
    })();
});

// Formular abbrechen (button) 
cancelButton.addEventListener("click", (e) => {
    e.preventDefault();  // Warten auf Klick
    taskForm.reset();     // Formular leeren
    taskForm.style.display = "none"; // Formular ausblenden
});
//--------------------------Hinzufügen--------------------------------------

// Datum formatieren für Anzeige
function formatDateForDisplay(dateString) {
    if (!dateString) return "Kein Fälligkeitsdatum";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ungültiges Datum";
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Datum Berechnung
function calculateRemainingDays(due_dateInput) {
    if (!due_dateInput) return ""; //hier leer wenn kein datum
    const today = new Date();
    const due = new Date(due_dateInput);
    if (isNaN(due.getTime())) return ""; //hier leer wenn ungueltig
    const timeDiff = due - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    if (daysDiff > 0) return { text: `${daysDiff} Tage`, class: "" };
    if (daysDiff === 0) return { text: "Heute letzter Tag", class: "heute-letzter-tag" };
    return { text: "Frist abgelaufen", class: "frist-abgelaufen" };
}

// render funktion für Anzeige der Tabelle von DB
async function renderTasks() {
    try {
        //GET alle Tasks 
        const response = await fetch(API.getAllTasks());
        if (!response.ok) throw new Error("Fehler beim Laden der Aufgaben von der API");

        const data = await response.json();
        const tasks = Array.isArray(data) ? data : (data.tasks || []); //hier beide fälle
        console.log("Geladene Aufgaben:", tasks); // Debugging: Überprüfen der geladenen Aufgaben

        taskTableBody.innerHTML = ""; // Tabelle leeren
        tasks.sort((a, b) => a.id - b.id); // Sortieren nach ID aufsteigend


    // Tabelle füllen
    tasks.forEach((task, index) => {
        let row = document.createElement("tr");
        let priorityClass = (task.completed ? "" : (task.priority ?? "low").toLowerCase());
        let completedClass = task.completed ? "completed" : "";
        row.className = `${priorityClass} ${completedClass}`.trim();
        const { text: daysText, class: daysClass } = calculateRemainingDays(task.due_date);
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${task.title ?? "Kein Titel"}</td>
            <td>${task.description ?? "Keine Beschreibung"}</td>
            <td>${formatDateForDisplay(task.due_date)}</td>
            <td><span class="${daysClass}">${daysText}</span></td>
            
            <td>
            <span class="priority-badge ${(task.priority ?? "low").toLowerCase()}">${getPriorityLabel(task.priority)}</span>
            </td>
            
            <td>
            <input type="checkbox" class="completedCheckbox" ${task.completed ? "checked" : ""}>
            </td>
            <td>
            <button type="button" class="deleteButton" data-id="${task.id}">Löschen</button>
            <button type="button" class="updateButton" data-id="${task.id}">Bearbeiten</button>
            </td>
        `;

        taskTableBody.appendChild(row);
    });

    // Event-Listener für Löschen Button done
    document.querySelectorAll(".deleteButton").forEach(btn => {
        btn.addEventListener("click", async function() {
            const id = this.getAttribute("data-id");
            const confirmed = confirm("Sind Sie sicher, dass Sie diese Aufgabe löschen möchten?");  //Kontrollfrage
            console.log("id:", id);
            if (!confirmed) return;
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
    document.querySelectorAll(".updateButton").forEach(btn => {
        btn.addEventListener("click", async function() {
            const id = this.getAttribute("data-id");
            const response = await fetch(API.getTaskById(id));
            if (!response.ok) {
                alert("Fehler beim Laden der Aufgabe. Bitte versuchen Sie es erneut.");
                return;
            }

            const task = await response.json();
            // Formular mit den aktuellen Werten füllen
            editTaskId = id; // Speichern der ID der zu bearbeitenden Aufgabe
            console.log("Zu bearbeitende Aufgabe ID:", editTaskId); // Debugging: Überprüfen der ID
            //! ID 
            titleInput.value = task.title ?? "";
            descriptionInput.value = task.description ?? "";
            due_dateInput.value = (task.due_date ?? "").slice(0, 10); // Formatieren für input type date
            editTaskCompleted = task.completed; // Setzen completed-Status
            priorityInput.value = task.priority ?? "Low";
            taskForm.style.display = "block"; // Formular anzeigen
            createButton.style.display = "none"; // Hinzufügen-Button ausblenden
            updateButton.style.display = "block"; // Update-Button anzeigen
        });
    });

    // Event-Listener für die Checkbox "completed"
    document.querySelectorAll(".completedCheckbox").forEach(checkbox => {
        checkbox.addEventListener("change", async function() {
            const id = this.closest("tr").querySelector(".updateButton").getAttribute("data-id");
            const completed = this.checked;
            try {
                const response = await fetch(API.getTaskById(id));
                if (!response.ok) throw new Error("Fehler beim Aktualisieren der Aufgabe!");
                const task = await response.json();
                task.completed = completed; // Aktualisieren des completed-Status

                const updateResponse = await fetch(API.updateTask(id), {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: jsonMaker(task)
                });
                if (!updateResponse.ok) throw new Error("Fehler beim Aktualisieren der Aufgabe!");
                renderTasks(); // Tabelle aktualisieren nach dem Ändern des Status
            } catch (error) {
                alert(error.message || "Fehler beim Aktualisieren der Aufgabe. Bitte versuchen Sie es erneut.");
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

