"use client";
import { Todo, TodoStatus } from "@/types/todo.types";
import React, { createContext, useCallback, useReducer } from "react";
import { isBefore } from "date-fns";

type TodoState = {
    todos: Todo[],
    open: Todo[],
    inProgress: Todo[],
    done: Todo[],
}

const INITIAL_STATE: TodoState = {
    todos: [],
    open: [],
    inProgress: [],
    done: [],
}

interface TodoContext extends TodoState {
    setTodos: ( todos: Todo[] ) => void;
    addTodo: ( newTodo: Todo ) => void;
    updateTodo: ( updatedTodo: Todo ) => void;
    getTodoByStatus: ( status: TodoStatus ) => Todo[] | undefined;
    deleteTodo: ( todoId: string ) => void;
}

const TodoContext = createContext<TodoContext>( {
    ...INITIAL_STATE,
    setTodos: () => {
    },
    addTodo: () => {
    },
    updateTodo: () => {
    },
    getTodoByStatus: () => undefined,
    deleteTodo: () => {
    }
} )

enum TodoStoreActionKind {
    SET_TODOS,
    ADD_TODO,
    UPDATE_TODO,
    DELETE_TODO
}

type TodoStoreAction = |
    { type: TodoStoreActionKind.SET_TODOS, payload: { todos: Todo[] } } |
    { type: TodoStoreActionKind.ADD_TODO, payload: { newTodo: Todo } } |
    { type: TodoStoreActionKind.UPDATE_TODO, payload: { updatedTodo: Todo } } |
    { type: TodoStoreActionKind.DELETE_TODO, payload: { todoId: string } }


const group = ( array: Todo[] ) => {
    return Object.groupBy( array.sort( ( a, b ) => {
        if ( isBefore( a.lastModified, b.lastModified ) ) return 1;
        return -1;
    } ), ( { status } ) => TodoStatus[ status as unknown as keyof typeof TodoStatus ] );
}

const todoStateReducer = ( state: TodoState, action: TodoStoreAction ) => {
    if ( action.type === TodoStoreActionKind.SET_TODOS ) {
        const groupedTodos = group( action.payload.todos );
        return {
            ...state,
            todos: action.payload.todos,
            open: groupedTodos[ TodoStatus.OPEN ] || [],
            inProgress: groupedTodos[ TodoStatus.IN_PROGRESS ] || [],
            done: groupedTodos[ TodoStatus.DONE ] || [],
        }
    } else if ( action.type === TodoStoreActionKind.ADD_TODO ) {
        const updatedTodoArray = [ action.payload.newTodo, ...state.todos ];
        const groupedTodos = group( updatedTodoArray );
        return {
            ...state,
            todos: updatedTodoArray,
            open: groupedTodos[ TodoStatus.OPEN ] || [],
            inProgress: groupedTodos[ TodoStatus.IN_PROGRESS ] || [],
            done: groupedTodos[ TodoStatus.DONE ] || [],
        }
    } else if ( action.type === TodoStoreActionKind.UPDATE_TODO ) {
        let currentTodos = [ ...state.todos ];
        const todoIndex = currentTodos.findIndex( todo => todo.id === action.payload.updatedTodo.id );
        if ( todoIndex !== -1 ) {
            currentTodos.splice( todoIndex, 1 );
            currentTodos = [ action.payload.updatedTodo, ...currentTodos ];
        }
        const groupedTodos = group( currentTodos );
        return {
            ...state,
            todos: currentTodos,
            open: groupedTodos[ TodoStatus.OPEN ] || [],
            inProgress: groupedTodos[ TodoStatus.IN_PROGRESS ] || [],
            done: groupedTodos[ TodoStatus.DONE ] || [],
        }

    } else if ( action.type === TodoStoreActionKind.DELETE_TODO ) {
        const updatedTodoArray = [ ...state.todos ].filter( todo => todo.id !== action.payload.todoId );
        const groupedTodos = group( updatedTodoArray );
        return {
            ...state,
            todos: updatedTodoArray,
            open: groupedTodos[ TodoStatus.OPEN ] || [],
            inProgress: groupedTodos[ TodoStatus.IN_PROGRESS ] || [],
            done: groupedTodos[ TodoStatus.DONE ] || [],
        }
    }

    return state;
}

export default function TodoProvider( { children }: { children: React.ReactNode } ) {
    const [ state, dispatch ] = useReducer( todoStateReducer, INITIAL_STATE );

    const setTodos = useCallback( ( todos: Todo[] ) => dispatch( {
        type: TodoStoreActionKind.SET_TODOS,
        payload: { todos }
    } ), [] )

    const addTodo = useCallback( ( newTodo: Todo ) => dispatch( {
        type: TodoStoreActionKind.ADD_TODO,
        payload: { newTodo }
    } ), [] );

    const updateTodo = useCallback( ( updatedTodo: Todo ) => dispatch( {
        type: TodoStoreActionKind.UPDATE_TODO,
        payload: { updatedTodo }
    } ), [] )

    const getTodoByStatus = useCallback( ( status: TodoStatus ) => {
        if ( status === TodoStatus.OPEN ) return state.open;
        else if ( status === TodoStatus.IN_PROGRESS ) return state.inProgress;
        else return state.done
    }, [ state.open, state.inProgress, state.done ] )

    const deleteTodo = useCallback( ( todoId: string ) => dispatch( {
        type: TodoStoreActionKind.DELETE_TODO,
        payload: { todoId }
    } ), [] );

    const ctx: TodoContext = {
        ...state,
        setTodos,
        addTodo,
        updateTodo,
        getTodoByStatus,
        deleteTodo
    }

    return <TodoContext.Provider value={ ctx }>{ children }</TodoContext.Provider>
}

export { TodoContext }