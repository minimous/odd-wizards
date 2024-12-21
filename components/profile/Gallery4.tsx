import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { Token } from "@/types";

export interface Gallery4Props {
    tokens: Token[]
}

export default function Gallery4({ tokens }: Gallery4Props) {
    // Function to get image URL from token, fallback to default if not available
    const getImageUrl = (token: Token) => {
        return token?.media.url || DEFAULT_IMAGE_PROFILE;
    }

    // Get first token for the wide image
    const wideToken = tokens[0];
    // Get next 2 tokens for the vertical stack
    const stackTokens = tokens.slice(1, 3);
    // Get last token for the bottom large image
    const bottomToken = tokens[3];

    return (
        <div className="grid grid-cols-1 gap-2 md:gap-3 col-span-3">
            <div className="grid grid-cols-3 gap-2 md:gap-3">
                {/* Wide image spanning 2 columns */}
                <div className="grid col-span-2 gap-2 md:gap-3">
                    <div className="aspect-square">
                        <img
                            src={getImageUrl(wideToken)}
                            alt={`Token ${wideToken?.name || 'Character'} #1`}
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
                                alt={`Token ${token?.name || 'Character'} #${index + 2}`}
                                className="rounded-lg object-cover w-full h-full"
                            />
                        </div>
                    ))}
                    {/* Fill remaining slots with default images if less than 2 tokens */}
                    {/* {[...Array(Math.max(0, 2 - stackTokens.length))].map((_, index) => (
                        <div key={`empty-${index}`} className="aspect-square">
                            <img
                                src={DEFAULT_IMAGE_PROFILE}
                                alt={`Default Character #${stackTokens.length + index + 2}`}
                                className="rounded-lg object-cover w-full h-full"
                            />
                        </div>
                    ))} */}
                </div>
            </div>
            {/* Bottom large image */}
            {
                tokens.length == 4 && <div className="aspect-square">
                    <img
                        src={getImageUrl(bottomToken)}
                        alt={`Token ${bottomToken?.name || 'Character'} #4`}
                        className="rounded-lg object-cover w-full h-full"
                    />
                </div>
            }
        </div>
    )
}