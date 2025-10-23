import React from "react";

const Header = () => {
    return (
        <nav className="topbar navbar navbar-expand-lg">
            <div className="container-fluid">
                {/* Кнопка бургер для мобилки */}
                <button
                    className="btn btn-light d-lg-none me-2"
                    onClick={() => window.toggleSidebar?.(true)} // используем глобальную функцию
                >
                    <i className="bi bi-list"></i>
                </button>

                <span className="navbar-brand mb-0 h1">Дашборд</span>

            </div>
        </nav>
    );
};

export default Header;
