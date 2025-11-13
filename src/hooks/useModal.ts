import { use } from "react";
import { ModalContext } from "@/store/modalStore";
import { ERROR_MESSAGES } from "@/constants/messages";

export default function useModal() {
    const ctx = use( ModalContext );
    if ( !ctx ) throw new Error( ERROR_MESSAGES.MODAL_CONTEXT )

    return ctx;
}