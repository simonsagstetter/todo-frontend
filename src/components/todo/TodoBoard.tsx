import { ItemGroup } from "@/components/ui/item";
import { TodoStatus } from "@/types/todo.types";
import useTodo from "@/hooks/useTodo";
import React from "react";
import TodoBoardItem from "@/components/todo/TodoBoardItem";
import { todoStatusMap } from "@/constants/todos";
import TodoCreateForm from "@/components/todo/TodoCreateForm";

type TodoBoardProps = {
    status: TodoStatus,
}

const TodoBoard: React.FC<TodoBoardProps> = ( { status } ) => {
    const { getTodoByStatus } = useTodo();
    const todos = getTodoByStatus( status );

    return <ItemGroup key={ status } className="basis-1/3 px-4 space-y-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{ todoStatusMap.get( status ) || status }</h3>
        { status === TodoStatus.OPEN ? <TodoCreateForm/> : null }
        { todos && todos.length !== 0 ? todos.map( todo => <TodoBoardItem key={ todo.id } status={ status }
                                                                          todo={ todo }/> ) : null }

    </ItemGroup>
}

export default TodoBoard;