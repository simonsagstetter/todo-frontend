enum TodoStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}

type Todo = {
    id: string;
    description: string;
    status: TodoStatus;
    isGrammarChecked: boolean;
    currentVersion: number;
    created: string;
    lastModified: string;
}

type TodoDTO = Omit<Todo, "id" | "currentVersion" | "created" | "lastModified" | "isGrammarChecked">;

type TodoCreateDTO = TodoDTO & {
    shouldGrammarCheck: boolean;
}

export {
    type Todo,
    type TodoDTO,
    type TodoCreateDTO,
    TodoStatus
};
