import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { Token } from "@/types";

export interface Gallery2Props {
    tokens: Token[]
}

export default function Gallery2({ tokens }: Gallery2Props) {
    // Function to get image URL from token, fallback to default if not available
    const getImageUrl = (token: Token) => {
        return token?.media.url || DEFAULT_IMAGE_PROFILE;
    }

    // Get first token for the main large image
    const mainToken = tokens[0];
    // Get token for the wide image
    const wideToken = tokens[1];
    // Get remaining tokens for the vertical stack (up to 2 tokens)
    const stackTokens = tokens.slice(2, 4);

    return (
        <div className="grid grid-cols-1 gap-2 md:gap-3 col-span-3">
            {/* Main large image */}
            <div className="aspect-square">
                <img
                    src={getImageUrl(mainToken)}
                    alt={`Token ${mainToken?.name || 'Character'} #1`}
                    className="rounded-lg object-cover w-full h-full"
                />
            </div>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
                {/* Wide image spanning 2 columns */}
                <div className="grid col-span-2 gap-2 md:gap-3">
                    <div className="aspect-square">
                        <img
                            src={getImageUrl(wideToken)}
                            alt={`Token ${wideToken?.name || 'Character'} #2`}
                            className="rounded-lg object-cover w-full h-full"
                        />
                    </div>
                </div>
                {/* Vertical stack of images */}
                <div className="grid grid-cols-1 gap-2 md:gap-3">
                    {stackTokens.map((token, index) => (
                        <div key={token.id || index} className="aspect-square">
                            <img
                                src={getImageUrl(token)}
                                alt={`Token ${token?.name || 'Character'} #${index + 3}`}
                                className="rounded-lg object-cover w-full h-full"
                            />
                        </div>
                    ))}
                    {/* Fill remaining slots with default images if less than 2 tokens */}
                    {/* {[...Array(Math.max(0, 2 - stackTokens.length))].map((_, index) => (
                        <div key={`empty-${index}`} className="aspect-square">
                            <img
                                src={DEFAULT_IMAGE_PROFILE}
                                alt={`Default Character #${stackTokens.length + index + 3}`}
                                className="rounded-lg object-cover w-full h-full"
                            />
                        </div>
                    ))} */}
                </div>
            </div>
        </div>
    )
}