"use client";
import React from "react";
import useModal from "@/hooks/useModal";
import TodoEditForm from "@/components/todo/TodoEditForm";

const Modal: React.FC = () => {
    const { isOpen } = useModal();
    return <>
        { isOpen ? <TodoEditForm></TodoEditForm> : null }
    </>
}

export default Modal;