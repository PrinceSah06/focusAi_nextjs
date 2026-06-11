import NavBar from "@/components/layout/Nav";
import SideBar from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <main className="flex flex-1 flex-col">
        <NavBar />
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
