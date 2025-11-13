import { Skeleton } from "@/components/ui/skeleton";

const TodoSkeletonGroup = ( { variant }: { variant: "ALL" | "SINGLE" } ) => {
    return <div className="flex flex-row w-full gap-16 px-4">
        { variant === "ALL" ?
            <>
                <TodoSkeleton amount={ 3 }/>
                <TodoSkeleton amount={ 2 }/>
                <TodoSkeleton amount={ 4 }/>
            </>
            :
            <TodoSkeleton amount={ 5 } cssOverwrite="basis-12/12!"/>
        }
    </div>
}

const TodoSkeleton = ( { amount, cssOverwrite }: { amount: number, cssOverwrite?: string } ) => {
    const fragments = Array.from( { length: amount } ).map( ( _, i ) => (
        <div key={ i } className="space-y-2 w-full">
            <Skeleton className="h-4 w-full"/>
            <Skeleton className="h-4 w-full"/>
        </div>
    ) )

    return <div className={ `basis-1/3 justify-items-center space-y-10 ${ cssOverwrite }` }>
        <Skeleton className="h-5 w-[200px] justify-self-start"/>
        { fragments }
    </div>
}
export { TodoSkeletonGroup }