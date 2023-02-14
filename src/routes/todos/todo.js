import { writable } from "svelte/store";

export function createTodo(init) {
    let uid = 1;
    
    const todos = init.map(({ done, text }) => {
        return { id: uid++, done, text };
    });

    const { subscribe, update } = writable(todos);

    return {
        subscribe,
        add: text => {
            const todo = {
                id: uid++,
                done: false,
                text
            };

            update($todos => [...$todos, todo])
        },
        remove: todo => {
            update($todos => $todos.filter((t) => t !== todo));
        },
        mark: (todo, done) => {
            update($todos => [...$todos.filter((t) => t !== todo), {...todo, done}
            ]);
        }
    }
}
