const API_URL = "http://localhost:8080";

export const registerUser = async (userData) => {

    const response = await fetch(
        `${API_URL}/api/users/register`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Registration failed"
        );
    }

    return data;
};


export const loginUser = async (userData) => {

    const response = await fetch(
        `${API_URL}/api/users/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Login failed"
        );
    }

    return data;
};

export const createMeeting = async (userId) => {

    const response = await fetch(
        `${API_URL}/api/meetings/create`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to create meeting"
        );
    }

    return data;
};