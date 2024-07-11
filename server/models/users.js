import connection from "../config/database.js";

export const getAllUsers = () => {
    const query = "SELECT id, email, username, createdAt FROM users";
    return connection.execute(query);
};

export const getUserByUsername = (username) => {
    const query =
        "SELECT id, email, username, createdAt FROM users WHERE username = ?";
    return connection.execute(query, [username]);
};

export const getUserByEmail = (email) => {
    const query =
        "SELECT id, email, username, createdAt FROM users WHERE email = ?";
    return connection.execute(query, [email]);
};

export const getUserById = (id) => {
    const query =
        "SELECT id, email, username, createdAt FROM users WHERE id = ?";
    return connection.execute(query, [id]);
};

export const createNewUser = (data) => {
    const query =
        "INSERT INTO users (email, username, password, refresh_token) VALUES (?, ?, ?, ?)";
    return connection.execute(query, [
        data.email,
        data.username,
        data.password,
        data.refresh_token,
    ]);
};

export const deleteUserById = (id) => {
    const query = "DELETE FROM users WHERE id = ?";
    return connection.execute(query, [id]);
};
