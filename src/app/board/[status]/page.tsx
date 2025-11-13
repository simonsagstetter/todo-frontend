"use client";
import { useQuery } from "@tanstack/react-query";
import { getTodos } from "@/lib/todoApi";
import useTodo from "@/hooks/useTodo";
import { Todo, TodoStatus } from "@/types/todo.types";
import TodoEmpty from "@/components/todo/TodoEmpty";
import { TodoSkeletonGroup } from "@/components/todo/TodoSkeleton";
import TodoBoard from "@/components/todo/TodoBoard";
import { useParams } from "next/navigation";
import TodoCreateForm from "@/components/todo/TodoCreateForm";
import React from "react";

export default function Home() {
    const { status } = useParams();
    const { todos, setTodos } = useTodo();

    const { isPending, isError, error } = useQuery( {
        queryKey: [ "todo" ],
        queryFn: ( { signal } ) => getTodos( signal ),
        select: ( data: Todo[] ) => setTodos( data ),
        throwOnError: true,
        refetchOnWindowFocus: true
    } )

    if ( isPending ) {
        return <TodoSkeletonGroup variant="SINGLE"/>
    }

    if ( isError ) {
        return <p>Error: { error.message }</p>
    }
    return (
        <>
            { todos.length == 0 ? <div className="flex flex-col items-center justify-start">
                <TodoEmpty/>
                <TodoCreateForm/>
            </div> : <>
                { status === "todo" ? <TodoBoard status={ TodoStatus.OPEN }/> : null }
                { status === "doing" ? <TodoBoard status={ TodoStatus.IN_PROGRESS }/> : null }
                { status === "done" ? <TodoBoard status={ TodoStatus.DONE }/> : null }
            </> }
        </>
    );
}
