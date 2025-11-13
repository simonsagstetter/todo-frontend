import React from "react";

export function generateStaticParams() {
    return [
        { status: "todo" },
        { status: "doing" },
        { status: "done" }
    ]
}

export default function BoardLayout( { children }: { children: React.ReactNode } ) {
    return children;
}