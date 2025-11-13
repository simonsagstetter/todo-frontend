import React from "react";
import { BicepsFlexedIcon, HouseIcon, LayoutListIcon, ListChecksIcon } from "lucide-react";

const ROUTES = [
    {
        key: "home",
        title: "Home",
        href: "/",
        Icon: <HouseIcon/>
    },
    {
        key: "todo",
        title: "Open",
        href: "/board/todo",
        Icon: <LayoutListIcon/>
    },
    {
        key: "doing",
        title: "In Progress",
        href: "/board/doing",
        Icon: <BicepsFlexedIcon/>
    },
    {
        key: "done",
        title: "Done",
        href: "/board/done",
        Icon: <ListChecksIcon/>
    }
] as const;

export {
    ROUTES
}