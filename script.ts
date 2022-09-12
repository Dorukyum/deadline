const listElement = document.getElementById("list");
const clearButton = document.getElementById("clear");
const now = Date.now();

interface Task {
    title: string,
    deadline: number,
}

let tasks: Array<Task> = [];

const form = document.createElement("li");
{
    const formElement = document.createElement("form");
    formElement.className = "task";
    formElement.id = "task-form";

    const title = document.createElement("h2");
    title.innerHTML = "New Task";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.name = "title";
    titleInput.placeholder = "Task title";
    titleInput.required = true;

    const deadlineInput = document.createElement("input");
    deadlineInput.type = "datetime-local";
    deadlineInput.name = "deadline";
    deadlineInput.required = true;

    const submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Submit";

    formElement.addEventListener("submit", (event): void => {
        event.preventDefault();

        if (!deadlineInput.value) return;
        const task: Task = {
            title: titleInput.value,
            deadline: Number(new Date(deadlineInput.value)),
        };
        save(task);
    });
    formElement.append(title, titleInput, deadlineInput, submit);
    form.appendChild(formElement);
}

function s(number: number): string {
    return number == 1 ? "" : "s";
}

function humanize(seconds: number): string {
    if (seconds < 60) return `in ${seconds} second${s(seconds)}`;
    const minutes = (seconds / 60 >> 0)
    if (minutes < 60) return `in ${minutes} minute${s(minutes)}`;
    const hours = (minutes / 60 >> 0)
    if (hours < 24) return `in ${hours} hour${s(hours)}${minutes > 0 ? ` and ${minutes % 60} minute${s(minutes)}` : ""}`;
    const days = (hours / 24 >> 0)
    return `in ${days} day${s(days)}${hours > 0 ? ` and ${hours % 24} hour${s(hours)}` : ""}`;
}

function createTask(data: Task): HTMLLIElement {
    const newTask = document.createElement("li");
    newTask.id = "" + data.deadline;
    newTask.className = "task";

    const diff = (data.deadline - now) / 1000;
    if (diff < 0) newTask.classList.add("missed");
    else if (diff < 24 * 60 * 60 * 1.5) newTask.classList.add("priority-high");
    else if (diff < 24 * 60 * 60 * 3) newTask.classList.add("priority-mid");

    const title = document.createElement("h2");
    title.innerText = data.title;

    const deadline = document.createElement("h3");
    deadline.innerText = new Date(data.deadline).toLocaleString();

    const remaining = document.createElement("h3");
    remaining.innerHTML = diff > 0 ? humanize(diff) : "Missed";

    function onMouseMove(event: MouseEvent): void {
        newTask.style.left = event.pageX - newTask.clientWidth / 2 + "px";
        newTask.style.transform = (window.innerWidth / 5 * 2 > event.pageX)
            ? "rotate(22.5deg)"
            : (window.innerWidth / 5 * 3 < event.pageX)
                ? "rotate(-22.5deg)"
                : "";
    }
    function onMouseUp(): void {
        document.removeEventListener("mousemove", onMouseMove);
        newTask.remove();
        render();
        document.removeEventListener("mouseup", onMouseUp);
    }
    newTask.addEventListener("mousedown", () => {
        newTask.style.position = "absolute";
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    newTask.append(title, deadline, remaining);
    return newTask;
}

function save(task: Task): void {
    try {
        localStorage.setItem("" + new Date(task.deadline).getTime(), task.title);
    } catch (QuotaExceededError) {
        return alert(`An error has occured when saving task "${task.title}".`);
    }
    tasks.push(task);
    render();
}

function load(): void {
    tasks = [];
    for (let i = 0; i < localStorage.length; i++) {
        let deadline = localStorage.key(i);
        if (!isNaN(parseInt(deadline))) tasks.push({ title: localStorage.getItem(deadline), deadline: parseInt(deadline) });
    }
    render();
}

function render(): void {
    while (listElement.lastChild) listElement.removeChild(listElement.lastChild);
    tasks.sort((a, b) => a.deadline - b.deadline).forEach(task => listElement.appendChild(createTask(task)));
    listElement.appendChild(form);
    if (tasks.length > 0) {
        if (!document.body.contains(clearButton)) document.body.insertBefore(clearButton, listElement);
    } else clearButton.remove();
}

clearButton.addEventListener("click", () => {
    for (let task of tasks) {
        localStorage.removeItem("" + task.deadline);
    }
    tasks = [];
    render();
});
window.addEventListener("load", load);
