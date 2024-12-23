import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { cn } from "@/lib/utils";
import { Token } from "@/types";
import ImageGalleryProfile from "./ImageGalleryProfile";

export interface Gallery3Props {
    address: string
    tokens: Token[]
    allTokens: Token[]
}

export default function Gallery3({ address, tokens, allTokens }: Gallery3Props) {

    // Get first 6 tokens for the grid
    const gridTokens = tokens.slice(0, 6);

    return (
        <div className="grid grid-cols-1 gap-2 md:gap-3 col-span-2">
            {/* Grid of smaller images */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
                {gridTokens.map((token, index) => (
                    <ImageGalleryProfile allToken={allTokens} address={address} key={token?.id || index} token={token} size="sm" />
                ))}
            </div>
        </div>
    )
}