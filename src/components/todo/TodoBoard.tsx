import { ItemGroup } from "@/components/ui/item";
import { TodoStatus } from "@/types/todo.types";
import useTodo from "@/hooks/useTodo";
import React from "react";
import TodoBoardItem from "@/components/todo/TodoBoardItem";
import { todoStatusMap } from "@/constants/todos";
import TodoCreateForm from "@/components/todo/TodoCreateForm";
import { Badge } from "@/components/ui/badge";

type TodoBoardProps = {
    status: TodoStatus,
}

const variants = {
    OPEN: "bg-zinc-900",
    IN_PROGRESS: "bg-blue-600",
    DONE: "bg-green-600"
}

const TodoBoard: React.FC<TodoBoardProps> = ( { status } ) => {
    const { getTodoByStatus } = useTodo();
    const todos = getTodoByStatus( status );

    return <ItemGroup key={ status } className="basis-1/3 px-4 space-y-4">
        <Badge className={ `self-center text-sm px-6 ${ variants[ status ] }` }>
            { todoStatusMap.get( status ) || status }
        </Badge>
        { status === TodoStatus.OPEN ? <TodoCreateForm/> : null }
        { todos && todos.length !== 0 ? todos.map( todo => <TodoBoardItem key={ todo.id } status={ status }
                                                                          todo={ todo }/> ) : null }

    </ItemGroup>
}

export default TodoBoard;