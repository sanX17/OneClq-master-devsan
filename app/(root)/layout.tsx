import Header from "@/components/header";
import Footer from "@/components/footer";
import BottomBar from "@/components/bottom-bar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="flex-1">
        <Header />
        <main>{children}</main>
        <BottomBar />
        <Footer />
      </div>
      {/* <div className="fixed bottom-6 right-6 z-50">
        <DownloadQR />
      </div> */}
    </div>
  );
}
