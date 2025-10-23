import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import ChartDataLabels from "chartjs-plugin-datalabels";

const DeliveryChart = ({ filter }) => {
    const chartRef = useRef(null);
    const [chart, setChart] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [platform, setPlatform] = useState("All");

    // --- Формирование параметров фильтра ---
    const buildQuery = () => {
        if (filter.type === "custom" && filter.from && filter.to) {
            return {
                from: filter.from.toISOString().split("T")[0],
                to: filter.to.toISOString().split("T")[0],
            };
        }
        return { range: filter.type || "all" };
    };

    // --- Загрузка данных ---
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/delivery-stats", { params: buildQuery() });
            setData(res.data || []);
        } catch (err) {
            console.error("Ошибка загрузки данных для графика способов доставки:", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (filter) fetchData();
    }, [filter]);

    useEffect(() => {
        if (!data.length || !chartRef.current) {
            if (chart) {
                chart.destroy();
                setChart(null);
            }
            return;
        }

        const ctx = chartRef.current.getContext("2d");
        if (chart) chart.destroy();

        const getNum = (v) => parseFloat(v ?? 0) || 0;

        // --- Основные типы заказов ---
        const orderTypes = ["PickUp", "Delivery", "DineIn"];
        const labelsMap = {
            PickUp: "Заберу собой",
            Delivery: "Доставка",
            DineIn: "В заведении",
        };

        // --- Платформы ---
        const platforms = ["Shop", "Wolt", "Pos", "Bolt"];
        const platformColors = {
            Shop: "#36A2EB",
            Wolt: "#4BC0C0",
            Pos: "#FFCE56",
            Bolt: "#FF9F40",
        };

        // --- Подготовка общей структуры ---
        const totals = {};
        orderTypes.forEach((t) => {
            totals[t] = {
                totalAmount: 0,
                share: 0,
                platform_data: { Shop: 0, Wolt: 0, Pos: 0, Bolt: 0 },
            };
        });

        // --- Заполняем данными ---
        data.forEach((row) => {
            const type = row.order_type;
            if (!orderTypes.includes(type)) return;

            totals[type].totalAmount = getNum(row.amount);
            totals[type].share = getNum(row.share_percentage);

            if (row.platform_data && typeof row.platform_data === "object") {
                Object.entries(row.platform_data).forEach(([key, value]) => {
                    if (platforms.includes(key)) {
                        totals[type].platform_data[key] += getNum(value);
                    }
                });
            }
        });

        // --- Формируем datasets ---
        const datasets =
            platform === "All"
                ? platforms.map((key) => ({
                    label: key,
                    data: orderTypes.map(
                        (t) => totals[t].platform_data[key] || 0
                    ),
                    backgroundColor: platformColors[key],
                    borderRadius: 0,
                }))
                : [
                    {
                        label: platform,
                        data: orderTypes.map(
                            (t) => totals[t].platform_data[platform] || 0
                        ),
                        backgroundColor: platformColors[platform],
                        borderRadius: 0,
                    },
                ];

        // --- Построение графика ---
        const chartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: orderTypes.map((t) => labelsMap[t]),
                datasets,
            },
            options: {
                indexAxis: "y",
                responsive: true,
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            color: "#666",
                            callback: (v) => `${v} €`,
                        },
                        grid: { color: "#eee" },
                    },
                    y: {
                        ticks: {
                            color: "#333",
                            font: { size: 12, weight: "bold" },
                            callback: function (value, index) {
                                const type = orderTypes[index];
                                const amt = totals[type].totalAmount || 0;
                                const share = totals[type].share || 0;
                                return [
                                    labelsMap[type],
                                    `${amt.toFixed(2)} € (${share.toFixed(2)}%)`,
                                ];
                            },
                        },
                        grid: { display: false },
                    },
                },
                plugins: {
                    legend: { display: true, position: "bottom" },
                    tooltip: {
                        callbacks: {
                            label: (ctx) =>
                                `${ctx.dataset.label}: ${ctx.formattedValue} €`,
                        },
                    },
                    datalabels: {
                        color: "#333",
                        anchor: "center",
                        align: "center",
                        font: {
                            size: 12,
                            weight: "bold",
                        },
                        formatter: function (value, ctx) {
                            if (!value || value === 0) return "";
                            const label = ctx.dataset.label || "";
                            return `${label} ${value.toFixed(0)} €`;
                        },
                    },
                },
            },
            plugins: [ChartDataLabels],
        });

        setChart(chartInstance);
    }, [data, platform]);

    return (
        <div className="card h-100 mt-3">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <div className="fw-semibold">Способы доставки по платформам</div>
                <select
                    className="form-select form-select-sm w-auto"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                >
                    <option value="All">Все платформы</option>
                    <option value="Shop">Shop</option>
                    <option value="Wolt">Wolt</option>
                    <option value="Pos">Pos</option>
                    <option value="Bolt">Bolt</option>
                </select>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center">
                {loading ? (
                    <div className="text-muted small py-4">Загружаем данные...</div>
                ) : data.length === 0 ? (
                    <div className="text-muted small py-4">
                        Нет данных за выбранный период
                    </div>
                ) : (
                    <canvas ref={chartRef} height="120"></canvas>
                )}
            </div>
        </div>
    );
};

export default DeliveryChart;
