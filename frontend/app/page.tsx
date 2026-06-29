import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import PaperList from "@/components/PaperFeed";
import PaperTabs from "@/components/PaperTabs";
import RightSidebar from "@/components/RightSidebar";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
      <Navbar />
      <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll flex flex-col items-center">
        
        {/* Hero Section Container */}
        <div className="w-full max-w-[1600px] px-2 sm:px-4 md:px-6 xl:px-10 pt-6">
          <HeroSection />
        </div>

        {/* 3-Column Layout */}
        <div className="w-full max-w-[1600px] px-4 md:px-6 xl:px-10 pt-4 pb-12 flex items-start gap-6 xl:gap-8">
          
          <div className="hidden lg:block w-[240px] shrink-0 sticky top-4">
            <Sidebar />
          </div>

          <main className="flex-1 min-w-0">
            <PaperTabs />
            <PaperList />
          </main>
          
          <div className="hidden xl:block w-[320px] shrink-0 sticky top-4">
            <RightSidebar />
          </div>

        </div>
      </div>
    </div>
  );
}
