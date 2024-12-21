import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { Token } from "@/types";

export interface Gallery1Props {
    tokens: Token[]
}

export default function Gallery1({ tokens }: Gallery1Props) {
    // Function to get image URL from token, fallback to default if not available
    const getImageUrl = (token: Token) => {
        return token?.media.url || DEFAULT_IMAGE_PROFILE;
    }

    // Get first token for the main large image
    const mainToken = tokens[0];

    // Get remaining tokens for the grid (up to 6 tokens)
    const gridTokens = tokens.slice(1, 7);

    return (
        <div className="grid grid-cols-1 gap-2 md:gap-3 col-span-2">
            {/* Main large image */}
            <div className="aspect-square">
                <img
                    src={getImageUrl(mainToken)}
                    alt={`Token ${mainToken?.name || 'Character'} #1`}
                    className="rounded-lg object-cover w-full h-full"
                />
            </div>
            {/* Grid of smaller images */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
                {gridTokens.map((token, index) => (
                    <div key={token.id || index} className="aspect-square">
                        <img
                            src={getImageUrl(token)}
                            alt={`Token ${token?.name || 'Character'} #${index + 2}`}
                            className="rounded-lg object-cover w-full h-full"
                        />
                    </div>
                ))}
                {/* Fill remaining slots with default images if less than 6 tokens */}
                {/* {[...Array(Math.max(0, 6 - gridTokens.length))].map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square">
                        <img
                            src={DEFAULT_IMAGE_PROFILE}
                            alt={`Default Character #${gridTokens.length + index + 2}`}
                            className="rounded-lg object-cover w-full h-full"
                        />
                    </div>
                ))} */}
            </div>
        </div>
    )
}