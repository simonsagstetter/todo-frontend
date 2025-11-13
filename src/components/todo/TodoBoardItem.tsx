import React from "react";
import { Todo, TodoStatus } from "@/types/todo.types";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CheckIcon, LoaderCircleIcon, XIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { advanceTodo, deleteTodo, redo, undo } from "@/lib/todoApi";
import { todoVariants } from "@/constants/todos";
import { toast } from "sonner";
import { ApiError } from "@/lib/exceptions";
import TodoDetail from "@/components/todo/TodoDetail";
import useTodo from "@/hooks/useTodo";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/messages";

type TodoBoardItemProps = {
    status: TodoStatus;
    todo: Todo;
}

const handleHistoryAction = async ( todo: Todo, updateFn: ( updatedTodo: Todo ) => void, action: "Undo" | "Redo" ) => {
    try {
        const nextAction = action === "Undo" ? "Redo" : "Undo";
        let updatedTodo: Todo | undefined;
        if ( action === "Undo" ) {
            updatedTodo = await undo( todo.id );
        } else {
            updatedTodo = await redo( todo.id );
        }
        updateFn( updatedTodo );
        toast.success( SUCCESS_MESSAGES.HISTORY, {
            action: {
                label: nextAction,
                onClick: async () => await handleHistoryAction( updatedTodo, updateFn, nextAction )
            }
        } )
    } catch {
        toast.error( ERROR_MESSAGES.HISTORY )
    }
}

const TodoBoardItem: React.FC<TodoBoardItemProps> = ( { status, todo } ) => {
    const { updateTodo, deleteTodo: deleteTodoFromState } = useTodo();
    const { mutate, isPending } = useMutation( {
        mutationFn: async ( todo: Todo ) => {
            if ( todo.status === TodoStatus.DONE ) {
                return await deleteTodo( todo.id );
            } else {
                return await advanceTodo( todo )
            }
        },
        onSuccess: ( data: Todo ) => {
            const currentStatusDone = todo.status === TodoStatus.DONE;

            if ( currentStatusDone ) {
                deleteTodoFromState( todo.id );
            } else {
                updateTodo( data );
            }

            const title = currentStatusDone ? SUCCESS_MESSAGES.DELETED : SUCCESS_MESSAGES.UPDATED;

            toast.success( title, todo.status !== TodoStatus.DONE ? {
                action: {
                    label: "Undo",
                    onClick: async () => await handleHistoryAction( data, updateTodo, "Undo" )
                }
            } : {} )
        },
        onError: ( error: ApiError | Error, variables: Todo ) => {
            const title = variables.status !== TodoStatus.DONE ? ERROR_MESSAGES.UPDATE : ERROR_MESSAGES.DELETE;
            toast.error( title, {
                description: error.message
            } )
        },
    } )

    const handleOnClick = ( event: React.MouseEvent<HTMLButtonElement> ) => {
        event.stopPropagation();
        mutate( todo );
    }


    return (
        <TodoDetail key={ todo.id } todo={ todo }>
            <Item variant="outline"
                  className={ `backdrop-blur-xs bg-transparent cursor-pointer shadow-md ${ todoVariants[ status ] }` }>
                <ItemContent>
                    <ItemTitle>{ todo.description }</ItemTitle>
                </ItemContent>
                <ItemActions>
                    <Button variant="ghost" size="icon" className="cursor-pointer" onClick={ handleOnClick }
                            disabled={ isPending }>
                        { isPending ? <LoaderCircleIcon className="animate-spin"/> :
                            <>
                                { status === TodoStatus.OPEN ?
                                    <ArrowRightIcon className="text-blue-600"/> : null }
                                { status === TodoStatus.IN_PROGRESS ?
                                    <CheckIcon className="text-green-600"/> : null }
                                { status === TodoStatus.DONE ? <XIcon className="text-red-700"/> : null }</>
                        }
                    </Button>
                </ItemActions>
            </Item>
        </TodoDetail>
    )
}

export default TodoBoardItem;

export { handleHistoryAction }