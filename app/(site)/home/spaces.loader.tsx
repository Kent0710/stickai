import { Skeleton } from "@/components/ui/skeleton";

interface SpacesLoaderProps {
    count?: number;
}
const SpacesLoader: React.FC<SpacesLoaderProps> = ({ count = 1 }) => {
    return (
        <div className="flex gap-3 flex-wrap">
            {Array.from({ length: count }, (_, i) => (
                <Skeleton
                    key={i}
                    className="w-[17rem] h-[7rem] rounded-xl"
                />
            ))}
        </div>
    );
};

export default SpacesLoader;
