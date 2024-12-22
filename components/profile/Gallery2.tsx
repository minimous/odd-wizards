import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { cn } from "@/lib/utils";
import { Token } from "@/types";
import ImageGalleryProfile from "./ImageGalleryProfile";

export interface Gallery2Props {
    tokens: Token[]
}

export default function Gallery2({ tokens }: Gallery2Props) {

    // Get first token for the main large image, fallback to default if no tokens
    const mainToken = tokens[0];

    return (
        <div className="grid grid-cols-1 gap-2 md:gap-3 col-span-3">
            {/* Main large image */}
            <ImageGalleryProfile token={mainToken} size="lg" />
        </div>
    )
}