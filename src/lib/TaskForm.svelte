<script lang="ts">
    import { tasks } from "./stores.js";

    function createTask(event: SubmitEvent): void {
        event.preventDefault();
        const data = new FormData(event.target as HTMLFormElement);
        const task: TaskData = {
            title: data.get("title").toString(),
            deadline: Number(new Date(data.get("deadline").toString())),
        };

        try {
            localStorage.setItem(
                "" + new Date(task.deadline).getTime(),
                task.title
            );
        } catch (QuotaExceededError) {
            return alert(
                `An error has occured when saving task "${task.title}".`
            );
        }
        $tasks.push(task);
        $tasks = $tasks; // refresh
    }
</script>

<li>
    <form class="task" id="task-form" on:submit={createTask}>
        <h2>New Task</h2>
        <input type="text" name="title" placeholder="Task title" required />
        <input type="datetime-local" name="deadline" required />
        <input type="submit" value="Submit" />
    </form>
</li>
