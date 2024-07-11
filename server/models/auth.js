import connection from "../config/database.js";

export const login = (username) => {
    const query = "SELECT * FROM users WHERE username = ?";
    return connection.execute(query, [username]);
};

export const register = (data, hashedPassword) => {
    const query =
        "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";
    return connection.execute(query, [
        data.email,
        data.username,
        hashedPassword,
    ]);
};

export const updateToken = (token, id) => {
    const query = "UPDATE users SET refresh_token = ? WHERE id = ?";
    return connection.execute(query, [token, id]);
};

export const findRefToken = (token) => {
    const query = "SELECT * FROM users WHERE refresh_token = ?";
    return connection.execute(query, [token]);
};

export const nullToken = (id) => {
    const query = "UPDATE users SET refresh_token = null WHERE id = ?";
    return connection.execute(query, [id]);
};
