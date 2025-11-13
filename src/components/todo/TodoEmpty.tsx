import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { RefreshCcwIcon, SquareCheckBigIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TodoEmpty() {
    const router = useRouter();
    return <Empty>
        <EmptyHeader>
            <EmptyMedia variant="icon">
                <SquareCheckBigIcon/>
            </EmptyMedia>
            <EmptyTitle>No Todos Yet</EmptyTitle>
            <EmptyDescription>
                You haven&apos;t created any todos yet. Get started by creating
                your first todo.
            </EmptyDescription>
        </EmptyHeader>
        <Button
            variant="link"
            asChild
            className="text-muted-foreground"
            size="sm"
        >
            <button onClick={ () => router.refresh() }>
                Refresh <RefreshCcwIcon/>
            </button>
        </Button>
    </Empty>
}