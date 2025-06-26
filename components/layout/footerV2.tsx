const FooterV2 = () => {
  return (
    <div className="relative mt-4 w-full px-8">
      <div className="z-5 via-black-75 absolute bottom-0 left-0 right-0 top-0 h-full w-full bg-gradient-to-b from-transparent to-black"></div>
      <div className="h-[250px] w-full rounded-[10px] bg-[#0B0810] p-4 px-6">
        <div className="flex items-center justify-between">
          <div className="items-cetner flex gap-8 text-[#A1A1AA]">
            <a className="text-muted">Apply as creator</a>
          </div>
          <div className="flex flex-col justify-end">
            <div className="flex items-center justify-end gap-4">
              <a href="https://discord.com/invite/29FKPEpKX5" target="_blank">
                <img
                  src={'/images/discord.png'}
                  className="h-[25px] md:h-[30px]"
                />
              </a>
              <a href="https://x.com/OddsGardenn" target="_blank">
                <img src={'/images/x.png'} className="h-[25px] md:h-[30px]" />
              </a>
            </div>
            <div className="text-[#A1A1AA]">
              <span>All rights reserved</span>
            </div>
          </div>
        </div>
        <div className="mt-7 w-full text-center">
          <span className="font-instrument text-[8.5rem] text-[#57447D]">
            ODDS GARDEN
          </span>
        </div>
      </div>
    </div>
  );
};

export default FooterV2;
