// имитация API авторизации
export async function login(email, password) {
    // здесь можно заменить на запрос к Laravel API
    if (email === "admin@example.com" && password === "password") {
        return "fake-jwt-token"; // возвращаем токен
    }
    throw new Error("Неверные данные");
}
