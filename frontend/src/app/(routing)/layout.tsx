import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-[100vh] grid-rows-[auto_1fr_auto]">
      <Header />
      <div className="">{children}</div>
      <Footer />
    </div>
  );
}
