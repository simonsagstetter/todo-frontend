import React from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { todoStatusMap } from "@/constants/todos";
import { Todo } from "@/types/todo.types";
import useModal from "@/hooks/useModal";
import { format, setDefaultOptions } from "date-fns";
import { de } from "date-fns/locale";

setDefaultOptions( {
    locale: de
} );

type TodoEditFormProps = {
    children: React.ReactNode,
    todo: Todo;
}

const TodoDetail: React.FC<TodoEditFormProps> = ( { children, todo } ) => {
    const { openModal } = useModal();

    const handleOnClickEdit = () => {
        openModal( todo.id );
    }

    return <Sheet>
        <SheetTrigger asChild>
            { children }
        </SheetTrigger>
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Details</SheetTitle>
                <SheetDescription>
                    Make changes to your profile here. Click save when you&apos;re done.
                </SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
                <div className="grid gap-3">
                    <Label>Id</Label>
                    <p>{ todo.id }</p>
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="sheet-demo-name">Description</Label>
                    <p>{ todo.description }</p>
                </div>
                <div className="grid gap-3">
                    <Label>Status</Label>
                    <p>{ todoStatusMap.get( todo.status ) }</p>
                </div>
                <div className="grid gap-3">
                    <Label>Currently Grammar Checked?</Label>
                    <p>{ todo.isGrammarChecked ? "Yes" : "No" }</p>
                </div>
                <div className="grid gap-3">
                    <Label>Current Version</Label>
                    <p>{ todo.currentVersion }</p>
                </div>
                <div className="grid gap-3">
                    <Label>Created</Label>
                    <p>{ format( todo.created, "HH:mm - dd.MM.yyyy" ) }</p>
                </div>
                <div className="grid gap-3">
                    <Label>Last Modified</Label>
                    <p>{ format( todo.lastModified, "HH:mm - dd.MM.yyyy" ) }</p>
                </div>
            </div>
            <SheetFooter>
                <SheetClose asChild>
                    <Button className="cursor-pointer" onClick={ handleOnClickEdit }>Edit</Button>
                </SheetClose>
            </SheetFooter>
        </SheetContent>
    </Sheet>
}

export default TodoDetail