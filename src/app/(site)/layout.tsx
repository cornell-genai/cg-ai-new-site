import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SmoothScroll />
            <Nav />
            <main>{children}</main>
            <Footer />
        </>
    );
}
