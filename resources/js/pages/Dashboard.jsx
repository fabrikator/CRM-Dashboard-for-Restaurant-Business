import React, { useState } from "react";

import DateFilter from "../components/DateFilter";
import DeliveryChart from "../components/DeliveryChart";
import PaymentChart from "../components/PaymentChart";
import TopProductsTable from "../components/TopProductsTable";
import KpiTabsCards from "../components/KpiTabsCards.jsx";

const Dashboard = () => {

    const [filter, setFilter] = useState({ type: "yesterday" });

    return (
        <div className="container-fluid py-4">

            <div className="row mb-3">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-semibold">Панель аналитики</h5>
                            <DateFilter onChange={setFilter} />
                        </div>
                    </div>
                </div>
            </div>

            <KpiTabsCards filter={filter} />

            <div className="row g-3 mt-1">

                <div className="col-12 col-xl-8">
                    <div className="row g-0">
                        <PaymentChart filter={filter}/>
                        <DeliveryChart filter={filter}/>
                    </div>
                </div>

                <div className="col-12 col-xl-4">
                    <TopProductsTable filter={filter} />
                </div>

            </div>

        </div>
    );
};

export default Dashboard;
