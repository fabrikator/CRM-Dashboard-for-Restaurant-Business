import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({}); // ошибки по полям

    const handleSubmit = async (e) => {
        e.preventDefault();

        let errors = {};
        if (!email) errors.email = "Введите email";
        if (!password) errors.password = "Введите пароль";

        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        try {
            const token = await login(email, password);

            const authData = {
                token,
                expiresAt: Date.now() + 30 * 60 * 1000,
            };
            localStorage.setItem("auth", JSON.stringify(authData));

            navigate("/dashboard");
        } catch (err) {
            setError("Неверный логин или пароль");
            setFieldErrors({ email: " ", password: " " }); // подсветим оба поля
        }
    };

    return (
        <section
            className="vh-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#f6f7fb" }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow-3">
                            <div className="card-body p-4">
                                <h3 className="text-center mb-4">
                                    <div
                                        className="flex items-center gap-2 mb-2"
                                        style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
                                    >
                                        {/* Иконка */}
                                        <svg
                                            width="40"
                                            height="40"
                                            viewBox="0 0 96 96"
                                            xmlns="http://www.w3.org/2000/svg"
                                            role="img"
                                            aria-label="Jit Restaurants Logo"
                                        >
                                            <defs>
                                                <linearGradient id="jr-grad" x1="0" y1="0" x2="1" y2="1">
                                                    <stop offset="0%" stopColor="#7952b3" />
                                                    <stop offset="100%" stopColor="#4e8ef7" />
                                                </linearGradient>
                                            </defs>
                                            <rect x="4" y="4" width="88" height="88" rx="22" fill="url(#jr-grad)" />
                                            <g fill="#fff">
                                                {/* J */}
                                                <path d="M33 26h10v33c0 10-7 17-17 17h-3v-9h3c4 0 7-3 7-8V26z" />
                                                {/* R */}
                                                <path d="M50 26h14c9 0 15 6 15 14 0 7-4 12-10 13l10 17h-12l-9-16h-3v16H50V26zm14 19c4 0 7-3 7-6s-3-6-7-6h-4v12h4z" />
                                            </g>
                                        </svg>

                                        {/* Вордмарк */}
                                        <svg
                                            height="24"
                                            viewBox="0 0 520 96"
                                            xmlns="http://www.w3.org/2000/svg"
                                            role="img"
                                            aria-label="Jit Restaurants CRM Wordmark"
                                        >
                                            <g fill="currentColor">
                                                <text
                                                    x="0"
                                                    y="68"
                                                    fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, sans-serif"
                                                    fontWeight="700"
                                                    fontSize="64"
                                                    letterSpacing="0.5"
                                                >
                                                    Jit
                                                </text>
                                                <text
                                                    x="130"
                                                    y="68"
                                                    fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, sans-serif"
                                                    fontWeight="500"
                                                    fontSize="36"
                                                    opacity="0.85"
                                                    letterSpacing="0.3"
                                                >
                                                    Restaurants
                                                </text>
                                                <text
                                                    x="370"
                                                    y="68"
                                                    fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, sans-serif"
                                                    fontWeight="700"
                                                    fontSize="32"
                                                    opacity="0.9"
                                                    letterSpacing="3"
                                                >
                                                    CRM
                                                </text>
                                            </g>
                                        </svg>
                                    </div>
                                </h3>

                                {error && (
                                    <div className="alert alert-danger text-center">{error}</div>
                                )}

                                <form onSubmit={handleSubmit} noValidate>
                                    {/* Email */}
                                    <div className="form-outline mb-3">
                                        <input
                                            type="email"
                                            id="loginEmail"
                                            className={`form-control ${
                                                fieldErrors.email ? "is-invalid" : ""
                                                }`}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <label className="form-label" htmlFor="loginEmail">
                                            Email
                                        </label>
                                        {fieldErrors.email && (
                                            <div className="invalid-feedback">
                                                {fieldErrors.email}
                                            </div>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div className="form-outline mb-3">
                                        <input
                                            type="password"
                                            id="loginPassword"
                                            className={`form-control ${
                                                fieldErrors.password ? "is-invalid" : ""
                                                }`}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <label className="form-label" htmlFor="loginPassword">
                                            Пароль
                                        </label>
                                        {fieldErrors.password && (
                                            <div className="invalid-feedback">
                                                {fieldErrors.password}
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-block w-100 mb-3"
                                    >
                                        Войти
                                    </button>

                                </form>
                            </div>
                        </div>
                        <p className="text-center mt-3 text-muted">
                            © {new Date().getFullYear()} Jit Restaurants CRM
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;

