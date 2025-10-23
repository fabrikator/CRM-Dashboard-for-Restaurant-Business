import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
    return (
        <div className="app-wrapper">
            <Sidebar/>
            <main className="app-main">
                <Header />
                {children}
                <Footer/>
            </main>
        </div>
    );
};

export default MainLayout;