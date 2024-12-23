import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { cn } from "@/lib/utils";
import { Token } from "@/types";
import ImageGalleryProfile from "./ImageGalleryProfile";

export interface Gallery1Props {
    address: string
    tokens: Token[]
    allTokens: Token[]
}

export default function Gallery1({ address, tokens, allTokens }: Gallery1Props) {
    // Get first token for the main large image
    const mainToken = tokens[0];

    // Get remaining tokens for the grid (up to 6 tokens)
    const gridTokens = tokens.slice(1, 4);

    return (
        <div className="grid grid-cols-1 gap-2 md:gap-3 col-span-2">
            {/* Main large image */}
            <ImageGalleryProfile allToken={allTokens} address={address} token={mainToken} size="md" />
            {/* Grid of smaller images */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
                {gridTokens.map((token, index) => (
                    <ImageGalleryProfile allToken={allTokens} address={address} key={token?.id || index} token={token} size="sm" />
                ))}
            </div>
        </div>
    )
}