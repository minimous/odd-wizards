const FooterV2 = () => {
    return (
        <div className="relative w-full px-8 mt-4">
            <div className="absolute top-0 bottom-0 left-0 right-0 z-5 bg-gradient-to-b from-transparent via-black-75 to-black w-full h-full"></div>
            <div className="bg-[#0B0810] w-full h-[250px] rounded-[10px] p-4 px-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-cetner gap-8 text-[#A1A1AA]">
                        <a href="#">Apply as creator</a>
                        <a href="#">Contact</a>
                    </div>
                    <div className="flex flex-col justify-end">
                        <div className="flex items-center justify-end gap-4">
                            <a href="https://discord.com/invite/29FKPEpKX5" target="_blank">
                                <img src={"/images/discord.png"} className="h-[25px] md:h-[30px]" />
                            </a>
                            <a href="https://x.com/artnesh" target="_blank">
                                <img src={"/images/x.png"} className="h-[25px] md:h-[30px]" />
                            </a>
                        </div>
                        <div className="text-[#A1A1AA]">
                            <span>All rights reserved</span>
                        </div>
                    </div>
                </div>
                <div className="w-full mt-7 text-center">
                    <span className="font-instrument text-[8.5rem] text-[#57447D]">ODDS GARDEN</span>
                </div>
            </div>
        </div>
    )
}

export default FooterV2;