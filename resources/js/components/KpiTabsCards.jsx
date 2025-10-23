import React, { useEffect, useState } from "react";
import axios from "axios";
import SalesAnalyticsChart from "./SalesAnalyticsChart";
import IncomeAnalyticsChart from "./IncomeAnalyticsChart";
import CustomersAnalyticsChart from "./CustomersAnalyticsChart";
import AveragePaymentAnalyticsChart from "./AveragePaymentAnalyticsChart";

const KpiCardsTabs = ({ filter }) => {
    const [stats, setStats] = useState({
        sales: 0,
        income: 0,
        customers: 0,
        avg_payment: 0,
    });

    const [activeTab, setActiveTab] = useState("sales");

    const fetchStats = async () => {
        try {
            const params = {};
            if (filter?.type === "custom" && filter.from && filter.to) {
                params.from = filter.from.toISOString().split("T")[0];
                params.to = filter.to.toISOString().split("T")[0];
            } else {
                params.range = filter?.type || "today";
            }

            const res = await axios.get("/kpi-stats", { params });
            setStats(res.data);
        } catch (err) {
            console.error("Ошибка загрузки KPI:", err);
        }
    };

    useEffect(() => {
        if (filter) fetchStats();
    }, [filter]);

    const cards = [
        {
            key: "sales",
            label: "Продажи",
            value: `${stats.sales.toFixed(2)} €`,
            icon: "bi bi-currency-exchange",
            tag: "Sales",
        },
        {
            key: "income",
            label: "Прибыль",
            value: `${stats.income.toFixed(2)} €`,
            icon: "bi bi-graph-up-arrow",
            tag: "Profit",
        },
        {
            key: "customers",
            label: "Клиенты",
            value: stats.customers,
            icon: "bi bi-people",
            tag: "Clients",
        },
        {
            key: "avg_payment",
            label: "Средняя сумма оплаты",
            value: `${stats.avg_payment.toFixed(2)} €`,
            icon: "bi bi-wallet2",
            tag: "Avg",
        },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "sales":
                return (
                    <div className="row g-3 mt-1">
                        <div className="col-12 col-xl-12">
                            <SalesAnalyticsChart filter={filter} />
                        </div>
                    </div>
                );
            case "income":
                return (
                    <div className="row g-3 mt-1">
                        <div className="col-12 col-xl-12">
                            <IncomeAnalyticsChart filter={filter} />
                        </div>
                    </div>
                );
            case "customers":
                return (
                    <div className="row g-3 mt-1">
                        <div className="col-12 col-xl-12">
                            <CustomersAnalyticsChart filter={filter} />
                        </div>
                    </div>
                );
            case "avg_payment":
                return (
                    <div className="row g-3 mt-1">
                        <div className="col-12 col-xl-12">
                            <AveragePaymentAnalyticsChart filter={filter} />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="row g-3">
                {cards.map((card) => (
                    <div className="col-12 col-sm-6 col-xl-3" key={card.key}>
                        <div
                            className={`card kpi-card h-100 ${
                                activeTab === card.key ? "border-primary shadow-sm" : ""
                                }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => setActiveTab(card.key)}
                        >
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <div className="kpi-label">{card.label}</div>
                                        <div className="kpi-value">{card.value}</div>
                                    </div>
                                    <span className="badge rounded-pill bg-light text-dark">
                                        <i className={`${card.icon} me-1`}></i> {card.tag}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3">{renderContent()}</div>
        </>
    );
};

export default KpiCardsTabs;
