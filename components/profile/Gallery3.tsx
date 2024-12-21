import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { Token } from "@/types";

export interface Gallery3Props {
    tokens: Token[]
}

export default function Gallery3({ tokens }: Gallery3Props) {
    // Function to get image URL from token, fallback to default if not available
    const getImageUrl = (token: Token) => {
        return token?.media.url || DEFAULT_IMAGE_PROFILE;
    }

    // Get first 6 tokens for the grid
    const gridTokens = tokens.slice(0, 6);
    // Get the last token for the bottom large image
    const bottomToken = tokens[6];

    return (
        <div className="grid grid-cols-1 gap-2 md:gap-3 col-span-2">
            {/* Grid of smaller images */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
                {gridTokens.map((token, index) => (
                    <div key={token.id || index} className="aspect-square">
                        <img
                            src={getImageUrl(token)}
                            alt={`Token ${token?.name || 'Character'} #${index + 1}`}
                            className="rounded-lg object-cover w-full h-full"
                        />
                    </div>
                ))}
                {/* Fill remaining slots with default images if less than 6 tokens */}
                {/* {[...Array(Math.max(0, 6 - gridTokens.length))].map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square">
                        <img
                            src={DEFAULT_IMAGE_PROFILE}
                            alt={`Default Character #${gridTokens.length + index + 1}`}
                            className="rounded-lg object-cover w-full h-full"
                        />
                    </div>
                ))} */}
            </div>
            {/* Bottom large image */}
            {
                gridTokens.length == 6 && <div className="aspect-square">
                    <img
                        src={getImageUrl(bottomToken)}
                        alt={`Token ${bottomToken?.name || 'Character'} #7`}
                        className="rounded-lg object-cover w-full h-full"
                    />
                </div>
            }
        </div>
    )
}