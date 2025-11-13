"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import TodoProvider from "@/store/todoStore";
import Navigation from "@/components/navigation/Navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import ModalProvider from "@/store/modalStore";
import Modal from "@/components/modal/Modal";

export default function ClientRoot( { children }: { children: React.ReactNode } ) {
    return (
        <QueryClientProvider client={ queryClient }>
            <ModalProvider>
                <TodoProvider>
                    <Modal/>
                    <div className="min-h-screen w-full bg-white relative text-gray-800">
                        <div
                            className="absolute inset-0 z-0 pointer-events-none"
                            style={ {
                                backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
                repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
                radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px),
                radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)
                `,
                                backgroundSize: '40px 40px, 40px 40px, 40px 40px, 40px 40px',
                            } }
                        />
                        <SidebarProvider>
                            <Navigation/>
                            <main className="w-full">
                                <SidebarTrigger variant="ghost" className="m-4 p-4 cursor-pointer" size="icon-lg"/>
                                <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance pb-8">Super
                                    Kanban</h1>
                                { children }
                            </main>
                        </SidebarProvider>
                    </div>
                    <Toaster position="bottom-center"/>
                </TodoProvider>
            </ModalProvider>
        </QueryClientProvider>
    )
}