import React from "react";

const Settings = () => {
    return (
        <div className="container py-5">
            <h2 className="mb-4">
                <i className="fas fa-cogs me-2"></i> Настройки
            </h2>

            <div className="row">
                {/* Google Analytics API */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-3">
                        <div className="card-header bg-primary text-white">
                            <i className="fas fa-chart-line me-2"></i> Google Analytics
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="form-outline mb-3">
                                    <input
                                        type="text"
                                        id="gaKey"
                                        className="form-control"
                                        defaultValue="AIzaSyXXXXXXX-EXAMPLE-KEY"
                                    />
                                    <label className="form-label" htmlFor="gaKey">
                                        API Key
                                    </label>
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-save me-2"></i> Сохранить
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* API интеграция */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-3">
                        <div className="card-header bg-success text-white">
                            <i className="fas fa-plug me-2"></i> Интеграция API
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="form-outline mb-3">
                                    <input
                                        type="email"
                                        id="apiLogin"
                                        className="form-control"
                                        defaultValue="sushi7.ee@gmail.com"
                                    />
                                    <label className="form-label" htmlFor="apiLogin">
                                        Логин
                                    </label>
                                </div>
                                <div className="form-outline mb-3">
                                    <input
                                        type="password"
                                        id="apiPassword"
                                        className="form-control"
                                        defaultValue="123456"
                                    />
                                    <label className="form-label" htmlFor="apiPassword">
                                        Пароль
                                    </label>
                                </div>
                                <button type="submit" className="btn btn-success">
                                    <i className="fas fa-save me-2"></i> Сохранить
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
