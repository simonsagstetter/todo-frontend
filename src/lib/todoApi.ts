import { Todo, TodoCreateDTO, TodoDTO, TodoStatus } from "@/types/todo.types";
import { ApiError, ValidationError } from "@/lib/exceptions";
import { ERROR_MESSAGES } from "@/constants/messages";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const isValid = async ( response: Response ) => {
    if ( !response.ok ) {
        const data = await response.json();

        if ( "status" in data && "message" in data && "fieldErrors" in data ) {
            throw new ValidationError( data!.status, data!.message, data.fieldErrors );
        }

        if ( "status" in data && "message" in data ) {
            throw new ApiError( data.status, data.message )
        }

        throw new Error( ERROR_MESSAGES.UNKNOWN );
    }
    return Promise.resolve();
}

const getTodos = async ( signal: AbortSignal ) => {
    const response = await fetch( `${ BASE_URL }`, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        },
        cache: "no-cache",
        signal
    } );

    await isValid( response );

    const data = await response.json();

    return data as Todo[];
}

const getTodo = async ( signal: AbortSignal, id: string ) => {
    const response = await fetch( `${ BASE_URL }/${ id }`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        cache: "no-cache",
        signal
    } );

    await isValid( response );

    const data = await response.json();

    return data as Todo;
}

const createTodo = async ( todo: TodoCreateDTO ) => {
    const response = await fetch( `${ BASE_URL }`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify( todo ),
        cache: "no-cache"
    } );

    await isValid( response );

    const data = await response.json();

    return data as Todo;
}

const advanceTodo = async ( todo: Todo ) => {
    const todoDTO: TodoDTO = {
        description: todo.description,
        status: todo.status === TodoStatus.OPEN ? TodoStatus.IN_PROGRESS : TodoStatus.DONE
    };

    const response = await fetch( `${ BASE_URL }/${ todo.id }`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify( todoDTO ),
        cache: "no-cache"
    } );

    await isValid( response );

    const data = await response.json();

    return data as Todo;
}

const updateTodo = async ( todoId: string, todo: TodoDTO ) => {
    const response = await fetch( `${ BASE_URL }/${ todoId }`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify( todo ),
        cache: "no-cache"
    } );

    await isValid( response );

    const data = await response.json();

    return data as Todo;
}

const undo = async ( todoId: string ) => {
    const response = await fetch( `${ BASE_URL }/${ todoId }/undo`, {
        method: "POST",
        headers: {
            "Accept": "application/json"
        },
        cache: "no-cache"
    } );

    await isValid( response );

    const data = await response.json();

    return data as Todo;
}

const redo = async ( todoId: string ) => {
    const response = await fetch( `${ BASE_URL }/${ todoId }/redo`, {
        method: "POST",
        headers: {
            "Accept": "application/json"
        },
        cache: "no-cache"
    } );

    await isValid( response );

    const data = await response.json();

    return data as Todo;
}

const deleteTodo = async ( todoId: string ) => {
    const response = await fetch( `${ BASE_URL }/${ todoId }`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        cache: "no-cache"
    } );

    await isValid( response );

    const data = await response.json();

    return data as Todo;
}

export { getTodos, getTodo, createTodo, updateTodo, advanceTodo, undo, redo, deleteTodo }