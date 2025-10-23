import React, { useState } from "react";

const Orders = () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [date, setDate] = useState("");

    const orders = [
        { id: 965800, location: "Онлайн", cashier: "Sushi 7 kohvik", opened: "01.10.25 17:03", user: "Rustam Kalinin", client: "Алиса П.", delivery: "Доставка", status: "Завершено", total: "8,77 €" },
        { id: 965781, location: "Онлайн", cashier: "Sushi 7 kohvik", opened: "01.10.25 16:47", user: "Rustam Kalinin", client: "Angela L.", delivery: "Доставка", status: "Завершено", total: "24,08 €" },
        { id: 965778, location: "Онлайн", cashier: "Sushi 7 kohvik", opened: "01.10.25 16:45", user: "Rustam Kalinin", client: "Русланка", delivery: "Заберу с собой", status: "Завершено", total: "10,90 €" },
        { id: 965757, location: "Онлайн", cashier: "Sushi 7 kohvik", opened: "01.10.25 16:29", user: "Rustam Kalinin", client: "Alla", delivery: "Заберу с собой", status: "Завершено", total: "21,00 €" },
        { id: 965649, location: "Онлайн", cashier: "Sushi 7 kohvik", opened: "01.10.25 14:13", user: "Rustam Kalinin", client: "Taras", delivery: "Заберу с собой", status: "Завершено", total: "34,00 €" },
        { id: 965611, location: "Онлайн", cashier: "Sushi 7 kohvik", opened: "01.10.25 13:34", user: "Rustam Kalinin", client: "Karina Z.", delivery: "Заберу с собой", status: "Завершено", total: "21,77 €" },
        { id: 965568, location: "Онлайн", cashier: "Sushi 7 kohvik", opened: "01.10.25 13:09", user: "Rustam Kalinin", client: "Reelika Ting", delivery: "Заберу с собой", status: "Завершено", total: "43,27 €" },
        { id: 965514, location: "Онлайн", cashier: "Sushi 7 kohvik", opened: "01.10.25 12:35", user: "Rustam Kalinin", client: "Kristina L.", delivery: "Доставка", status: "Завершено", total: "55,16 €" },
        { id: 965349, location: "Онлайн", cashier: "Sushi 7 kohvik", opened: "01.10.25 09:47", user: "Rustam Kalinin", client: "Anniki", delivery: "Заберу с собой", status: "Завершено", total: "15,77 €" },
    ];

    // Фильтрация
    const filteredOrders = orders.filter((o) => {
        return (
            o.client.toLowerCase().includes(search.toLowerCase()) &&
            (status ? o.status === status : true) &&
            (date ? o.opened.includes(date) : true)
        );
    });

    return (
        <div className="container-fluid py-4">
            <h2>🛒 Заказы</h2>

            {/* Фильтры */}
            <div className="card mb-4">
                <div className="card-body row g-3">
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Поиск по клиенту"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="date"
                            className="form-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Все статусы</option>
                            <option value="Завершено">Завершено</option>
                            <option value="Готовится">Готовится</option>
                            <option value="Отменено">Отменено</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button
                            className="btn btn-outline-secondary w-100"
                            onClick={() => { setSearch(""); setDate(""); setStatus(""); }}
                        >
                            Сбросить
                        </button>
                    </div>
                </div>
            </div>

            {/* Таблица */}
            <div className="card">
                <div className="card-header bg-white fw-semibold">Список заказов</div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                        <tr>
                            <th>№</th>
                            <th>Локация</th>
                            <th>Касса</th>
                            <th>Открыта</th>
                            <th>Клиент</th>
                            <th>Способ доставки</th>
                            <th>Статус</th>
                            <th>Всего</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredOrders.map((o) => (
                            <tr key={o.id}>
                                <td>{o.id}</td>
                                <td>{o.location}</td>
                                <td>{o.cashier}</td>
                                <td>{o.opened}</td>
                                <td>{o.client}</td>
                                <td>
                                    <span className="badge bg-light text-dark">{o.delivery}</span>
                                </td>
                                <td>
                                    <span className="badge bg-success">{o.status}</span>
                                </td>
                                <td>{o.total}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;
