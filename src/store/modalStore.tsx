"use client";
import React, { createContext, useCallback, useReducer } from "react";

type ModalState = {
    isOpen: boolean,
    currentId: string | null;
}

const INITIAL_STATE: ModalState = {
    isOpen: false,
    currentId: null
}

interface ModalContext extends ModalState {
    openModal: ( id: string ) => void;
    closeModal: () => void;
}

const INITIAL_CONTEXT: ModalContext = {
    ...INITIAL_STATE,
    openModal: () => {
    },
    closeModal: () => {
    }
}

const ModalContext = createContext<ModalContext>( INITIAL_CONTEXT );

enum ModalActionKind {
    OPEN,
    CLOSE
}

type ModelAction = | {
    type: ModalActionKind.OPEN,
    payload: { id: string }
} | { type: ModalActionKind.CLOSE }

const modelStateReducer = ( state: ModalState, action: ModelAction ) => {
    switch ( action.type ) {
        case ModalActionKind.OPEN:
            return {
                ...state,
                isOpen: true,
                currentId: action.payload.id
            }
        case ModalActionKind.CLOSE:
            return {
                ...state,
                isOpen: false,
                currentId: null
            }
        default:
            return state
    }
}

export default function ModalProvider( { children }: { children: React.ReactNode } ) {
    const [ state, dispatch ] = useReducer( modelStateReducer, INITIAL_STATE );

    const openModal = useCallback( ( id: string ) => dispatch( {
        type: ModalActionKind.OPEN,
        payload: { id }
    } ), [] );

    const closeModal = useCallback( () => dispatch( {
        type: ModalActionKind.CLOSE,
    } ), [] );

    const ctx: ModalContext = {
        ...state,
        openModal,
        closeModal
    }

    return <ModalContext.Provider value={ ctx }>{ children }</ModalContext.Provider>
}

export { ModalContext }