import { Suspense } from "react";
import SpaceWrapper from "./space-wrapper";

export default async function SpacePage({
    params,
}: {
    params: { spaceId: string };
}) {
    const { spaceId } = params;

    return (
        <Suspense fallback={<>  Loading </>}>
            <SpaceWrapper spaceId={spaceId}  />;
        </Suspense>
    )
    
}
