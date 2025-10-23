import React, { useEffect } from "react";
import Chart from "chart.js/auto";

const Analytics = () => {
    useEffect(() => {
        // Line Chart (Трафик по дням)
        const trafficCtx = document.getElementById("analyticsTrafficChart");
        if (trafficCtx) {
            new Chart(trafficCtx, {
                type: "line",
                data: {
                    labels: ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],
                    datasets: [
                        { label: "Посетители", data: [120,200,150,300,400,500,250], borderColor: "#007bff", backgroundColor: "rgba(0,123,255,.2)", tension: .35, fill: true },
                        { label: "Заказы", data: [30,50,40,70,90,120,60], borderColor: "#28a745", backgroundColor: "rgba(40,167,69,.2)", tension: .35, fill: true },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { intersect: false, mode: "index" },
                    plugins: { legend: { position: "bottom" } },
                    scales: {
                        y: { beginAtZero: true, grid: { drawBorder: false } },
                        x: { grid: { display: false } },
                    },
                },
            });
        }

        // Doughnut Chart (Каналы трафика)
        const channelsCtx = document.getElementById("analyticsChannelsChart");
        if (channelsCtx) {
            new Chart(channelsCtx, {
                type: "doughnut",
                data: {
                    labels: ["Google","Facebook","Instagram","Direct"],
                    datasets: [
                        { data: [45,25,20,10], backgroundColor: ["#4285F4","#3b5998","#E1306C","#34A853"] },
                    ],
                },
                options: { plugins: { legend: { position: "bottom" } }, cutout: "60%" },
            });
        }

        // Bar Chart (Выручка по категориям)
        const revenueCtx = document.getElementById("analyticsRevenueChart");
        if (revenueCtx) {
            new Chart(revenueCtx, {
                type: "bar",
                data: {
                    labels: ["Аренда","Коммунальные","Зарплаты","Маркетинг","Прочее"],
                    datasets: [
                        { label: "€", data: [120,550,2000,4500,300], backgroundColor: "#ffc107" },
                    ],
                },
                options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
            });
        }
    }, []);

    return (
        <div className="container-fluid py-4">
            <h2>📊 Аналитика</h2>
            <p className="text-muted mb-4">Общая статистика по трафику, каналам и выручке.</p>

            <div className="row g-4">
                {/* Линейный график */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">Трафик и заказы</h5>
                        </div>
                        <div className="card-body" style={{ height: "300px" }}>
                            <canvas id="analyticsTrafficChart"></canvas>
                        </div>
                    </div>
                </div>

                {/* Круговая диаграмма */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">Каналы трафика</h5>
                        </div>
                        <div className="card-body" style={{ height: "300px" }}>
                            <canvas id="analyticsChannelsChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mt-4">
                {/* Гистограмма */}
                <div className="col-12">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">Выручка по категориям</h5>
                        </div>
                        <div className="card-body" style={{ height: "300px" }}>
                            <canvas id="analyticsRevenueChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
