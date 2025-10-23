import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Filler,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(
    LineController,
    LineElement,
    PointElement,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Filler,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
);

const CustomersAnalyticsChart = ({ filter }) => {
    const chartRef = useRef(null);
    const [chart, setChart] = useState(null);
    const [data, setData] = useState([]);
    const [chartType, setChartType] = useState("line");

    // --- Загрузка данных ---
    const fetchData = async () => {
        try {
            const params = {};
            if (filter?.type === "custom" && filter.from && filter.to) {
                params.from = filter.from.toISOString().split("T")[0];
                params.to = filter.to.toISOString().split("T")[0];
            } else {
                params.range = filter?.type || "today";
            }

            const res = await axios.get("/customers-analytics", { params });
            setData(res.data || []);
        } catch (err) {
            console.error("Ошибка загрузки данных клиентов:", err);
            setData([]);
        }
    };

    useEffect(() => {
        if (filter) fetchData();
    }, [filter]);

    // --- Построение графика ---
    useEffect(() => {
        if (!data.length || !chartRef.current) return;

        if (chart) chart.destroy();
        const ctx = chartRef.current.getContext("2d");

        // Определяем, если диапазон больше 1 дня
        const multipleDays =
            filter?.type === "7days" ||
            filter?.type === "month" ||
            (filter?.type === "custom" &&
                filter.from &&
                filter.to &&
                filter.from.toDateString() !== filter.to.toDateString());

        const labels = data.map((d) => {
            if (multipleDays) {
                const date = new Date(d.date);
                const monthName = date.toLocaleString("ru-RU", { month: "short" });
                return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${
                    date.getDate()
                    } ${d.hour}`;
            }
            return d.hour;
        });

        const dataset = {
            label: "Клиенты",
            data: data.map((d) => d.customers_count),
            fill: chartType === "area",
            backgroundColor:
                chartType === "bar" ? "#4BC0C0" : "rgba(75, 192, 192, 0.3)",
            borderColor: "#36A2EB",
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 2,
            pointHoverRadius: 5,
        };

        const chartInstance = new Chart(ctx, {
            type: chartType === "area" ? "line" : chartType,
            data: { labels, datasets: [dataset] },
            options: {
                responsive: true,
                interaction: { mode: "index", intersect: false },
                scales: {
                    x: {
                        title: {
                            display: true,
                            color: "#333",
                        },
                        grid: { color: "#eee" },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            autoSkip: true,
                            maxTicksLimit: 20,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            color: "#333",
                        },
                        ticks: {
                            stepSize: 1,
                            callback: (v) => v.toFixed(0),
                        },
                        grid: { color: "#eee" },
                    },
                },
                plugins: {
                    legend: { display: true },
                    tooltip: {
                        callbacks: {
                            label: (ctx) =>
                                `${ctx.dataset.label}: ${ctx.formattedValue}`,
                        },
                    },
                    zoom: {
                        pan: { enabled: true, mode: "x" },
                        zoom: {
                            wheel: { enabled: true },
                            pinch: { enabled: true },
                            mode: "x",
                        },
                    },
                },
            },
        });

        setChart(chartInstance);
    }, [data, chartType, filter]);

    return (
        <div className="card h-100">
            <div className="card-header d-flex flex-wrap justify-content-between align-items-center">
                <div className="fw-semibold">Клиенты по часам</div>

                <div className="d-flex gap-2">
                    <select
                        className="form-select form-select-sm"
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                    >
                        <option value="line">Линии</option>
                        <option value="area">Площадь</option>
                        <option value="bar">Колонки</option>
                    </select>
                </div>
            </div>

            <div className="card-body">
                {data.length === 0 ? (
                    <div className="text-muted text-center py-3">
                        Нет данных за выбранный период
                    </div>
                ) : (
                    <canvas ref={chartRef} height="120"></canvas>
                )}
            </div>
        </div>
    );
};

export default CustomersAnalyticsChart;
