import { TodoStatus } from "@/types/todo.types";

const todoStatusMap = new Map<string, string>(
    [
        [ "OPEN", "Open" ],
        [ "IN_PROGRESS", "In Progress" ],
        [ "DONE", "Done" ]
    ]
);

const todoVariants: Partial<Record<TodoStatus, string>> = {
    [ TodoStatus.IN_PROGRESS ]: "border-blue-300/50 shadow-blue-300/20 text-blue-600",
    [ TodoStatus.DONE ]: "border-green-400/50 shadow-green-400/20 text-green-600"
}

export { todoStatusMap, todoVariants }