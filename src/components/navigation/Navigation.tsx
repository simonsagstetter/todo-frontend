import Link from "next/link";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem
} from "@/components/ui/sidebar";
import { ROUTES } from "@/constants/routes";

export default function Navigation( {} ) {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            { ROUTES.map( route => <SidebarMenuItem key={ route.key }>
                                <SidebarMenuButton asChild>
                                    <Link href={ route.href }>
                                        { route.Icon }
                                        <span>{ route.title }</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem> ) }

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}