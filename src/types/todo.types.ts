enum TodoStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}

type Todo = {
    id: string;
    description: string;
    status: TodoStatus;
    currentVersion: number;
}

type TodoByStatus = Partial<Record<TodoStatus, Todo[]>>;

type TodoDTO = Omit<Todo, "id" | "currentVersion">;

type TodoCreateDTO = TodoDTO & {
    checkGrammar: boolean;
}

export {
    type Todo,
    type TodoByStatus,
    type TodoDTO,
    type TodoCreateDTO,
    TodoStatus
};
