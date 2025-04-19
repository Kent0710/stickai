import React from "react";

interface PageContainerProps {
    children : React.ReactNode;
    title : string;
    description? : string;
}

const PageContainer : React.FC<PageContainerProps> = ({
    children,
    title,
    description
}) => {
    return (
        <div className="pl-10 pt-2 flex flex-col gap-2">
            <header>
                <h1 className="text-2xl font-bold"> {title} </h1>
                <p className="text-sm text-neutral-600"> {description} </p>
            </header>
            {children}
        </div>
    )
};

export default PageContainer;