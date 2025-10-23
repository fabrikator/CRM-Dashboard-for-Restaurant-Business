import React, { useEffect, useState } from "react";
import axios from "axios";

const TopProductsTable = ({ filter }) => {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Формируем параметры фильтра
    const buildQuery = () => {
        if (filter.type === "custom" && filter.from && filter.to) {
            return {
                from: filter.from.toISOString().split("T")[0],
                to: filter.to.toISOString().split("T")[0],
            };
        }
        return { range: filter.type || "all" };
    };

    // Загружаем данные
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/top-products", { params: buildQuery() });
            setTopProducts(res.data || []);
        } catch (err) {
            console.error("Ошибка загрузки топ товаров:", err);
            setTopProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // При изменении фильтра — обновляем
    useEffect(() => {
        if (filter) fetchData();
    }, [filter]);

    return (
        <div className="card h-100">
            <div className="card-header d-flex flex-column">
                <div className="fw-semibold mb-2">ТОП товаров</div>
            </div>

            <div className="table-responsive">
                <table className="table align-middle mb-0">
                    <thead>
                    <tr>
                        <th>Товар</th>
                        <th>Продажи</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="2" className="text-center text-muted py-3">
                                Загружаем данные...
                            </td>
                        </tr>
                    ) : Array.isArray(topProducts) && topProducts.length > 0 ? (
                        topProducts.map((p, i) => (
                            <tr key={i}>
                                <td className="d-flex align-items-center">
                                    {p.small_photo_url && (
                                        <img
                                            src={p.small_photo_url}
                                            alt={p.name}
                                            width="36"
                                            height="36"
                                            className="rounded me-2 border"
                                        />
                                    )}
                                    <span>{p.name || "—"}</span>
                                </td>
                                <td className="fw-semibold">{p.sold}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="text-center text-muted py-3">
                                Нет данных за выбранный период
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default TopProductsTable;

