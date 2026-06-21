import ProtectedRoute from "@/components/auth/protected-route";
import BottomBar from "@/components/bottom-bar";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-1" suppressHydrationWarning>
      <Header />
      <ProtectedRoute>{children}</ProtectedRoute>
      <BottomBar />
      <Footer />
    </div>
  );
}
