import React, { ChangeEvent, useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import useModal from "@/hooks/useModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteTodo, getTodo, updateTodo } from "@/lib/todoApi";
import { ApiError, isApiError, isValidationError } from "@/lib/exceptions";
import { toast } from "sonner";
import { Todo, TodoDTO, TodoStatus } from "@/types/todo.types";
import useTodo from "@/hooks/useTodo";
import { LoaderCircleIcon } from "lucide-react";
import { handleHistoryAction } from "@/components/todo/TodoBoardItem";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/messages";

type FormState = {
    description: string;
    status: TodoStatus;
}

const INITIAL_STATE: FormState = {
    description: "",
    status: TodoStatus.OPEN
}

const TodoEditForm: React.FC = () => {
    const [ todoInput, setTodoInput ] = useState<FormState>( INITIAL_STATE );
    const { deleteTodo: deleteTodoFromState, updateTodo: updateTodoFromState } = useTodo();
    const { closeModal, currentId, isOpen } = useModal();
    const { data, isFetched, isPending: isPendingQuery } = useQuery( {
        queryKey: [ "todo", currentId ],
        queryFn: async ( { signal } ) => {
            const data = await getTodo( signal, currentId! );
            setTodoInput( { description: data.description, status: data.status } );
            return data;
        },
        throwOnError: ( error: ApiError | Error ) => {
            toast.error( ERROR_MESSAGES.GET, {
                description: error.message
            } )
            closeModal();
            return false;
        },
        retry: false,
        enabled: !!currentId
    } );

    const { mutate, isPending, isError, error } = useMutation( {
        mutationFn: async ( newTodo: TodoDTO ) => await updateTodo( currentId!, newTodo ),
        onSuccess: async ( data: Todo ) => {
            updateTodoFromState( data );
            toast.success( SUCCESS_MESSAGES.UPDATED, {
                description: data.description,
                action: {
                    label: "Undo",
                    onClick: async () => await handleHistoryAction( data, updateTodoFromState, "Undo" )
                }
            } )
            closeModal();
        },
        onError: async () => {
            toast.error( ERROR_MESSAGES.UPDATE );
        },
        throwOnError: false
    } )

    const {
        mutate: mutateDelete,
        isPending: isPendingDelete,
        isError: isErrorDelete,
        error: errorDelete
    } = useMutation( {
        mutationFn: async ( todo: Todo ) => await deleteTodo( todo.id ),
        onSuccess: async ( data: Todo ) => {
            toast.success( SUCCESS_MESSAGES.DELETED, {
                description: data.description
            } )
            deleteTodoFromState( data.id );
            setTodoInput( INITIAL_STATE );
            closeModal();
        },
        onError: async ( error, variables ) => {
            setTodoInput( { description: variables.description, status: variables.status } );
            toast.error( ERROR_MESSAGES.DELETE );
        },
        throwOnError: false
    } )

    const handleOnSubmit = () => {
        mutate( todoInput )
    }

    const handleOnClickDelete = () => {
        if ( data ) {
            mutateDelete( data );
        }
    }
    const handleDescriptionChange = ( e: ChangeEvent<HTMLInputElement> ) => {
        const description = e.target.value;
        setTodoInput( prev => ( { ...prev, description } ) );
    }

    const handleStatusChange = ( value: string ) => {
        setTodoInput( prev => ( { ...prev, status: value as TodoStatus } ) );
    }

    return <Dialog open={ isOpen } onOpenChange={ ( open ) => !open ? closeModal() : null }>
        <DialogContent>
            <form action={ handleOnSubmit } className="space-y-8">
                <DialogHeader>
                    <DialogTitle>Edit Todo</DialogTitle>
                    <DialogDescription>
                        Make changes to your todo here. Click save when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>
                { isPendingQuery ?
                    <div className="flex flex-row justify-center items-center gap-2">
                        <p className="text-base">Loading Values</p>
                        <LoaderCircleIcon
                            className="animate-spin"/>
                    </div>
                    : null }
                { isFetched && data ?
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>
                                    Description
                                </FieldLabel>
                                <Input
                                    name="description"
                                    placeholder="Type in a description..."
                                    disabled={ isPending || isPendingDelete }
                                    value={ todoInput.description }
                                    onChange={ handleDescriptionChange }
                                    required
                                    autoFocus

                                />
                            </Field>

                            <Field>
                                <FieldLabel>
                                    Status
                                </FieldLabel>
                                <Select name="status"
                                        value={ todoInput.status }
                                        onValueChange={ handleStatusChange }
                                        disabled={ isPending || isPendingDelete }
                                        required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="OPEN">Open</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="DONE">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            { isError && isValidationError( error ) ?
                                <>
                                    { error.fieldErrors.map( fieldError => (
                                        <FieldError key={ fieldError.field }>{ fieldError.message }</FieldError>
                                    ) )
                                    }
                                </> : null }
                            { isError && isApiError( error ) && !isValidationError( error ) ?
                                <FieldError key={ error.message }>{ error.message }</FieldError>
                                : null }
                            { isError && !isApiError( error ) && !isValidationError( error ) ?
                                <FieldError>{ error.message }</FieldError> : null }

                            { isErrorDelete && isApiError( errorDelete ) ?
                                <FieldError key={ errorDelete.message }>{ errorDelete.message }</FieldError>
                                : null }
                            { isErrorDelete && !isApiError( errorDelete ) ?
                                <FieldError>{ errorDelete.message }</FieldError> : null }
                        </FieldGroup>
                    </FieldSet>
                    : null
                }
                <DialogFooter className="flex flex-row justify-between!">
                    <Button tabIndex={ 10 } className="cursor-pointer" type="button" variant="destructive"
                            disabled={ isPending || isPendingDelete || isPendingQuery }
                            onClick={ handleOnClickDelete }>Delete { isPendingDelete ?
                        <LoaderCircleIcon className="animate-spin"/> : null }</Button>
                    <div className="flex flex-row gap-2">
                        <DialogClose asChild>
                            <Button className="cursor-pointer" variant="outline"
                                    disabled={ isPending || isPendingDelete || isPendingQuery }
                                    onClick={ closeModal }>Cancel</Button>
                        </DialogClose>
                        <Button className="cursor-pointer" type="submit"
                                disabled={ isPending || isPendingDelete || isPendingQuery }>Save Change { isPending ?
                            <LoaderCircleIcon className="animate-spin"/> : null }
                        </Button>
                    </div>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
}

export default TodoEditForm;