import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "../../styles/MainLayout.css";

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function MainLayout({ children }) {
    return (
        <>
            <ScrollToTop />
            <Navbar />
            <main className="main-layout-content">
                {children}
            </main>
            <Footer />
        </>
    );
}

export default MainLayout;