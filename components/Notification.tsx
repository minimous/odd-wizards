import { cn } from "@/lib/utils";
import moment from "moment";
import Link from "next/link";

export interface Item {
    name: string;
    description: string;
    img: string;
    wallet: string;
    reward: string;
}

export const Notification = ({ name, description, img, wallet, reward}: Item) => {

    // const timeAgo = moment(time).fromNow();

    return (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full w-[350px] md:!w-[550px] cursor-pointer overflow-hidden rounded-2xl p-4",
                // animation styles
                "transition-all duration-200 ease-in-out hover:scale-[103%]",
                // light styles
                "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
                // dark styles
                "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <div
                    className="flex size-10 items-center justify-center rounded-2xl shrink-0"
                    style={{
                        // backgroundColor: color,
                        // backgroundImage: `url('${img}')`
                    }}
                >
                    {/* <span className="text-lg">{img}</span> */}
                    <img src={img} className="w-full h-full rounded-2xl hover:scale-105" />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white truncate">
                        <span className="text-sm sm:text-lg">{name}</span>
                        <span className="mx-1 sm:text-lg">-</span>
                        { reward && <span className="text-sm sm:text-lg truncate">{reward}</span> }
                    </figcaption>
                    <p className="text-xs md:!text-sm font-normal dark:text-white/60">
                        <Link href={`https://www.stargaze.zone/p/${wallet}`} className="text-[#DB2877] mr-1">
                            {wallet}
                        </Link> 
                        {description}
                    </p>
                </div>
            </div>
        </figure>
    );
};