const ERROR_MESSAGES = {
    UNKNOWN: "An unknown error occurred",
    MODAL_CONTEXT: "useModal can only be used inside <ModalProvider/> tags",
    TODO_CONTEXT: "useTodo can only be used inside <TodoProvider/> tags",
    GET: "Failed to fetch todo",
    HISTORY: "Failed to restore todo from history",
    CREATE: "Failed to create todo",
    UPDATE: "Failed to update todo",
    DELETE: "Failed to delete todo"
} as const;

const SUCCESS_MESSAGES = {
    CREATED: "Todo was created",
    HISTORY: "Todo was restored from history",
    UPDATED: "Todo has been updated",
    DELETED: "Todo has been deleted"
} as const;

export {
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
}