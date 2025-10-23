import React from "react";

const Footer = () => {
    return (
        <footer className="text-center py-3 mt-auto bg-white border-top">
            <div className="container">
                <small className="text-muted">
                    © {new Date().getFullYear()} Jit Restaurants CRM · Все права защищены
                </small>
            </div>
        </footer>
    );
};

export default Footer;
