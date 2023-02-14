<script>
    import { page } from '$app/stores';
    import { createTodo } from "./todo";
    import { supabase } from '$lib/supabaseClient'
    import TodoList from './todoList.svelte'
    import { onMount } from 'svelte';

    // console.log($page);
    // console.log($page.data);
    const { user } = $page.data.session;
    let todoText;
    
    let newTodos; 
    
    const todos = createTodo([
        {done: false, text: 'hi'}
    ])
    // console.log('new:',newTodos);

    onMount(() => {
        getList()
    })

    const getList = async () => {
        try {
            const { data, error, status }  = await supabase
                .from('todolists')
                .select(`text_id, description, done`)
                .eq('id', user.id)

            if (data) {
                newTodos = data;
            }
            if (error) console.log(error);
        } catch (err) {
            if (err instanceof Error) alert(err.message);
        }
    }

    const saveList = async () => {

        todos.add(todoText);

        try {

            const updates = {
                id: user.id,
                text_id : $todos.length + 1,
                description : todoText,
                done: false,
                created_at: new Date()
            }

            let { error } = await supabase
                .from('todolists')
                .upsert(updates)
                .select();

                newTodos = updates;
                // console.log('id:',user.id)
            if (error) console.log(error);

            todoText='';
        } catch (err) {
            if (err instanceof Error) alert(err.message);
        } finally {
            todoText='';
        }
    }
</script>

<div class="Todo-input">
    <input
        style="text-align:center"
        placeholder="write here!"
        bind:value={todoText}
    />
    <button style="width:100%" on:click={saveList}>추가</button>
</div>

<div class="todo-done">
    <div>
        <h1>Todo</h1>
        <TodoList todos={todos} filter={(t) => !t.done} />
    </div>
    <div style="border: 1px solid white;"></div>
    <div>
        <h1>Done</h1>
        <TodoList todos={todos} filter={(t) => t.done}/>
    </div>
</div>

<style>
    .todo-done{
        display: flex;
        justify-content: space-around;
        width:100%;
    }

</style>