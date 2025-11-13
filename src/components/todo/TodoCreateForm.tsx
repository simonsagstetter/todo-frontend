import React, { ChangeEvent, useState } from "react";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { Todo, TodoCreateDTO, TodoStatus } from "@/types/todo.types";
import { LoaderCircleIcon, PlusIcon } from "lucide-react";
import { Field, FieldError, FieldLabel, } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { createTodo } from "@/lib/todoApi";
import { toast } from "sonner";
import { isApiError, isValidationError } from "@/lib/exceptions";
import { Checkbox } from "@/components/ui/checkbox";
import useTodo from "@/hooks/useTodo";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/messages";

type FormState = {
    description: string;
    shouldGrammarCheck: boolean;
}

const INITIAL_STATE: FormState = {
    description: "",
    shouldGrammarCheck: false
}

const TodoCreateForm: React.FC = () => {
    const { addTodo } = useTodo();
    const [ todoInput, setTodoInput ] = useState<FormState>( INITIAL_STATE );
    const { mutate, error, isPending, isError } = useMutation( {
        mutationFn: async ( newTodo: TodoCreateDTO ) => await createTodo( newTodo ),
        onSuccess: ( data: Todo ) => {
            addTodo( data );
            toast.success( SUCCESS_MESSAGES.CREATED, {
                description: data.description
            } )
            setTodoInput( INITIAL_STATE );
        },
        onError: ( error, variables ) => {
            setTodoInput( { description: variables.description, shouldGrammarCheck: variables.shouldGrammarCheck } );
            console.log( variables )
            toast.error( ERROR_MESSAGES.CREATE )
        },
        throwOnError: false
    } )

    const handleOnSubmit = async ( formData: FormData ) => {
        const newTodo: TodoCreateDTO = {
            description: formData.get( "todo" )?.toString() || "",
            status: TodoStatus.OPEN,
            shouldGrammarCheck: formData.get( "shouldGrammarCheck" ) != null || false
        };
        mutate( newTodo )
    }

    const handleDescriptionChange = ( e: ChangeEvent<HTMLInputElement> ) => {
        const description = e.target.value;
        setTodoInput( prev => ( { ...prev, description } ) );
    }

    const handleCheckGrammarChange = ( checked: boolean ) => {
        setTodoInput( prev => ( { ...prev, shouldGrammarCheck: checked } ) );
    }


    return (
        <form action={ handleOnSubmit }>
            <Item variant="outline"
                  className="backdrop-blur-xs bg-transparent shadow-md">
                <ItemContent>
                    <ItemTitle className="w-full">
                        <Field>
                            <Input id="todo"
                                   name="todo"
                                   type="text"
                                   className="border-none outline-0 shadow-none"
                                   placeholder={ isPending ? "Loading..." : "Create a new todo..." }
                                   required
                                   value={ todoInput.description }
                                   onChange={ handleDescriptionChange }
                                   disabled={ isPending }
                                   autoFocus/>
                            <Field orientation="horizontal">
                                <Checkbox id="shouldGrammarCheck"
                                          name="shouldGrammarCheck"
                                          disabled={ isPending }
                                          checked={ todoInput.shouldGrammarCheck }
                                          onCheckedChange={ handleCheckGrammarChange }
                                />
                                <FieldLabel
                                    htmlFor="shouldGrammarCheck"
                                    className="font-normal"
                                >
                                    Check spelling and grammar?
                                </FieldLabel>
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
                        </Field>
                    </ItemTitle>
                </ItemContent>
                <ItemActions>
                    <Button type="submit" variant="ghost" size="icon" className="cursor-pointer">
                        { isPending ? <LoaderCircleIcon className="animate-spin"/> :
                            <PlusIcon/> }
                    </Button>
                </ItemActions>
            </Item>
        </form>
    )
}

export default TodoCreateForm;