<script lang="ts">
    export let data: TaskData;
    const now = Date.now();

    const diff = (data.deadline - now) / 1000;
    let priorityClass: string = "";
    if (diff < 0) priorityClass = "missed";
    else if (diff < 24 * 60 * 60 * 1.5) priorityClass = "priority-high";
    else if (diff < 24 * 60 * 60 * 3) priorityClass = "priority-mid";

    function s(number: number): string {
        return number == 1 ? "" : "s";
    }

    function humanize(seconds: number): string {
        if (seconds < 60) return `in ${seconds} second${s(seconds)}`;
        const minutes = (seconds / 60) >> 0;
        if (minutes < 60) return `in ${minutes} minute${s(minutes)}`;
        const hours = (minutes / 60) >> 0;
        if (hours < 24)
            return `in ${hours} hour${s(hours)}${
                minutes > 0 ? ` and ${minutes % 60} minute${s(minutes)}` : ""
            }`;
        const days = (hours / 24) >> 0;
        return `in ${days} day${s(days)}${
            hours > 0 ? ` and ${hours % 24} hour${s(hours)}` : ""
        }`;
    }

    // dragging functionality
    //
    // function onMouseMove(event: MouseEvent): void {
    //     this.style.left = event.pageX - this.clientWidth / 2 + "px";
    //     this.style.transform =
    //         (window.innerWidth / 5) * 2 > event.pageX
    //             ? "rotate(22.5deg)"
    //             : (window.innerWidth / 5) * 3 < event.pageX
    //             ? "rotate(-22.5deg)"
    //             : "";
    // }
    //
    // function onMouseUp(): void {
    //     document.removeEventListener("mousemove", onMouseMove);
    //     this.remove();
    //     document.removeEventListener("mouseup", onMouseUp);
    // }
    //
    // function onMouseDown() {
    //     this.style.position = "absolute";
    //     document.addEventListener("mousemove", onMouseMove);
    //     document.addEventListener("mouseup", onMouseUp);
    // }
</script>

<li class={`task ${priorityClass}`} id={"" + data.deadline}>
    <h2>{data.title}</h2>
    <h3>{new Date(data.deadline).toLocaleString()}</h3>
    <h3>{diff > 0 ? humanize(diff) : "Missed"}</h3>
</li>
