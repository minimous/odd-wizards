import { Footer } from './layout/footer';

export function MobileComingSoon() {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-[100] h-full w-full bg-black md:!hidden">
      <div className="relative mt-20 grid w-full gap-y-6">
        <img src="/images/mobile/logo.gif" className="mx-auto w-[200px]" />
        <img
          src="/images/mobile/goblin.png"
          className="absolute right-0 mx-auto w-[200px]"
        />
        <img
          src="/images/text-coming-soon.png"
          className="mx-auto mt-8 w-[200px]"
        />
      </div>
      <Footer />
    </div>
  );
}
