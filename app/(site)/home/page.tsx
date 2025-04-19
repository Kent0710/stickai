import { Suspense } from "react";

import Spaces from "./spaces";
import PageContainer from "@/components/page-container";
import SpacesLoader from "./spaces.loader";

export default async function HomePage() {
    return (
        <PageContainer
            title="Spaces"
            description="This is where your spaces live."
        >
            <Suspense fallback={<SpacesLoader count={4} />}>
                <Spaces />
            </Suspense>
        </PageContainer>
    );
}
