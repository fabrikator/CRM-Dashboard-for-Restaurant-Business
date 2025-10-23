import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("auth"); // чистим авторизацию
        navigate("/login"); // редирект на логин
    };

    return (
        <aside id="sidebar" className="app-sidebar bg-white">
            <div className="app-brand d-flex align-items-center">
                <div className="logo">JR</div>
                <div>
                    <div className="fw-bold">Jit Restaurants</div>
                    <div className="text-muted small">CRM админка</div>
                </div>
            </div>

            <div className="sidebar-heading">Меню</div>
            <div className="list-group list-group-flush mt-2">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        "list-group-item list-group-item-action d-flex align-items-center" +
                        (isActive ? " active" : "")
                    }
                >
                    <i className="bi bi-speedometer2"></i>
                    <span className="ms-2">Дашборд</span>
                </NavLink>

                <NavLink
                    to="/analytics"
                    className={({ isActive }) =>
                        "list-group-item list-group-item-action d-flex align-items-center" +
                        (isActive ? " active" : "")
                    }
                >
                    <i className="bi bi-graph-up"></i>
                    <span className="ms-2">Аналитика</span>
                </NavLink>

                <NavLink
                    to="/orders"
                    className={({ isActive }) =>
                        "list-group-item list-group-item-action d-flex align-items-center" +
                        (isActive ? " active" : "")
                    }
                >
                    <i className="bi bi-bag-check"></i>
                    <span className="ms-2">Заказы</span>
                </NavLink>

                <NavLink
                    to="/expenses"
                    className={({ isActive }) =>
                        "list-group-item list-group-item-action d-flex align-items-center" +
                        (isActive ? " active" : "")
                    }
                >
                    <i className="bi bi-cash-coin"></i>
                    <span className="ms-2">Затраты</span>
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        "list-group-item list-group-item-action d-flex align-items-center" +
                        (isActive ? " active" : "")
                    }
                >
                    <i className="bi bi-gear"></i>
                    <span className="ms-2">Настройки</span>
                </NavLink>
            </div>

            <div className="sidebar-heading mt-4">Проекты</div>
            <div className="list-group list-group-flush">
                <a href="#" className="list-group-item list-group-item-action d-flex align-items-center">
                    <i className="bi bi-shop"></i>
                    <span className="ms-2">La Pasta</span>
                </a>
                <a href="#" className="list-group-item list-group-item-action d-flex align-items-center">
                    <i className="bi bi-shop"></i>
                    <span className="ms-2">Tokyo Bar</span>
                </a>
                <a href="#" className="list-group-item list-group-item-action d-flex align-items-center">
                    <i className="bi bi-shop"></i>
                    <span className="ms-2">Burger & Co</span>
                </a>
            </div>

            {/* Выход */}
            <div className="list-group list-group-flush mt-4 mb-4">
                <button
                    onClick={handleLogout}
                    className="list-group-item list-group-item-action d-flex align-items-center text-danger"
                    style={{ cursor: "pointer" }}
                >
                    <i className="bi bi-box-arrow-right"></i>
                    <span className="ms-2">Выйти</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
