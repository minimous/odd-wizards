import StakeSection from "@/components/home/StakeSection";
import Header from "@/components/layout/header";
import Carousel from "@/components/Carausel";
import Leaderboard from "@/components/Leaderboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Footer } from "@/components/layout/footer";


export default function Profile() {
    return (
        <div className="relative w-full h-screen bg-[url('/images/Account.gif')] bg-cover bg-center p-8">
            <Header />
            <Footer className="my-6" />
        </div>
    );
}
