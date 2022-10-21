import { writable } from "svelte/store";

let _tasks: Array<TaskData> = [];

for (let i = 0; i < localStorage.length; i++) {
    let deadline = localStorage.key(i);
    if (!isNaN(parseInt(deadline)))
        _tasks.push({
            title: localStorage.getItem(deadline),
            deadline: parseInt(deadline),
        });
}

export const tasks = writable<Array<TaskData>>(_tasks);
