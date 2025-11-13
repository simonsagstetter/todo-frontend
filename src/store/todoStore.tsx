"use client";
import { Todo, TodoByStatus, TodoStatus } from "@/types/todo.types";
import React, { createContext, useCallback, useReducer } from "react";

type TodoState = {
    todos: Todo[],
    todosByStatus: TodoByStatus,
}

const INITIAL_STATE: TodoState = {
    todos: [],
    todosByStatus: {},
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


const group = ( array: Todo[] ) => Object.groupBy( array, ( { status } ) => TodoStatus[ status as unknown as keyof typeof TodoStatus ] )

const todoStateReducer = ( state: TodoState, action: TodoStoreAction ) => {
    if ( action.type === TodoStoreActionKind.SET_TODOS ) {
        return {
            ...state,
            todos: action.payload.todos,
            todosByStatus: group( action.payload.todos )
        }
    } else if ( action.type === TodoStoreActionKind.ADD_TODO ) {
        const updatedTodoArray = [ ...state.todos, action.payload.newTodo ];
        return {
            ...state,
            todos: updatedTodoArray,
            todosByStatus: group( updatedTodoArray )
        }
    } else if ( action.type === TodoStoreActionKind.UPDATE_TODO ) {
        const currentTodos = [ ...state.todos ];
        const todoIndex = currentTodos.findIndex( todo => todo.id === action.payload.updatedTodo.id );
        if ( todoIndex !== -1 ) {
            currentTodos[ todoIndex ] = action.payload.updatedTodo;
        }
        return {
            ...state,
            todos: currentTodos,
            todosByStatus: group( currentTodos )
        }

    } else if ( action.type === TodoStoreActionKind.DELETE_TODO ) {
        const updatedTodoArray = [ ...state.todos ].filter( todo => todo.id !== action.payload.todoId );
        return {
            ...state,
            todos: [ ...state.todos ].filter( todo => todo.id !== action.payload.todoId ),
            todosByStatus: group( updatedTodoArray )
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
        return state.todosByStatus[ status ];
    }, [ state.todosByStatus ] )

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