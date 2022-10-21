<script lang="ts">
    import { tasks } from "./stores.js";

    function clearTasks() {
        for (let task of $tasks) {
            localStorage.removeItem("" + task.deadline);
        }
        $tasks = [];
    }
</script>

<button id="clear" on:click={clearTasks}>
    Clear Tasks
</button>
