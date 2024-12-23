import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { cn } from "@/lib/utils";
import { Token } from "@/types";
import ImageGalleryProfile from "./ImageGalleryProfile";

export interface Gallery4Props {
    address: string
    tokens: Token[]
    allTokens: Token[]
}

export default function Gallery4({ address, tokens, allTokens }: Gallery4Props) {
    // Get first token for the wide image
    const mainToken = tokens[0];
    // Get next 2 tokens for the vertical stack
    const stackTokens = tokens.slice(1, 3);
    const bottomTokens = tokens.slice(3, 6);

    return (
        <div className="grid grid-cols-1 gap-2 md:gap-3 col-span-3">
            <div className="grid grid-cols-1 col-span-3 gap-2 md:gap-3">
                <div className="w-full grid grid-cols-3 gap-2 md:gap-3">
                    <div className="grid col-span-2">
                        <ImageGalleryProfile allToken={allTokens} address={address} token={mainToken} size="md" />
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:gap-3">
                        {/* Stack tokens with empty slot validation */}
                        {stackTokens.map((token, index) => (
                            <ImageGalleryProfile allToken={allTokens} address={address} key={token?.id || index} token={token} size="sm" />
                        ))}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 col-span-3 gap-2 md:gap-3">
                {/* Bottom tokens with empty slot validation */}
                {bottomTokens.map((token, index) => (
                    <ImageGalleryProfile allToken={allTokens} address={address} key={token?.id || index} token={token} size="sm" />
                ))}
            </div>
        </div>
    )
}