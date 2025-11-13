import { use } from "react";
import { TodoContext } from "@/store/todoStore";
import { ERROR_MESSAGES } from "@/constants/messages";

export default function useTodo() {
    const ctx = use( TodoContext );

    if ( !ctx ) throw new Error( ERROR_MESSAGES.TODO_CONTEXT )

    return ctx;
}