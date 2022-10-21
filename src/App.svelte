<script lang="ts">
    import ClearButton from "./lib/ClearButton.svelte";
    import Task from "./lib/Task.svelte";
    import TaskForm from "./lib/TaskForm.svelte";

    import { tasks as taskStore } from "./lib/stores.js";
    let tasks: Array<TaskData>;
    taskStore.subscribe((taskList) => {
        tasks = taskList;
    });
</script>

<main>
    <h1>Deadline</h1>
    {#if tasks.length > 0}
        <ClearButton />
    {/if}
    <ul id="list">
        <TaskForm />
        {#each tasks.sort((a, b) => a.deadline - b.deadline) as task}
            <Task data={task} />
        {/each}
    </ul>
</main>
