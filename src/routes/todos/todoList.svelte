<script>
    export let todos;
    export let filter;

</script>



<div>
    {#each $todos.filter(filter) as todo (todo.id)}
    <div class="eachList">
        <label>
            <input
                type="checkbox"
                checked={todo.done}
                on:change={(e) => todos.mark(todo, e.currentTarget.checked)}
            />
        </label>
        <span>{todo.text}</span>
    </div>
    {/each}
</div>

<style>
    .eachList {
        display: flex;
        align-items: center;
        /* justify-content: flex-start; */
        justify-content: space-between;
        width:100%;
    }
</style>