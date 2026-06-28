import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import PaperList from "@/components/PaperFeed";
import PaperTabs from "@/components/PaperTabs";
import RightSidebar from "@/components/RightSidebar";

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex overflow-y-auto overflow-x-hidden hide-scroll">
          <main className="flex-1 px-10 pt-6 pb-12 min-w-0">
            <PaperTabs />
            <PaperList />
          </main>
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
