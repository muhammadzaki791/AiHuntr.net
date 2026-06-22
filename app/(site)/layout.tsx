import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/navigation/footer";

/**
 * Site chrome layout. Wraps every public route (homepage, tools, blog,
 * categories, search, legal pages) with the Header and Footer. The embedded
 * Studio at /studio lives outside this group and renders without chrome.
 *
 * The Footer links to the /category hub rather than enumerating every category,
 * so no per-request category fetch is needed here.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
