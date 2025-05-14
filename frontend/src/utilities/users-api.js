import sendRequest from "./sendRequest";
const url = "/users"

export async function signup(formData) {
    try {
        const response = await sendRequest(`${url}/signup/`, "POST", formData)
        localStorage.setItem('token', response.access);
        return response.user
    } catch(err) {
        localStorage.removeItem('token');
        return null;
    }
}

// updated login function!
export async function login(formData) {
    try {
        const response = await sendRequest(`${url}/login/`, "POST", formData)
        localStorage.setItem('token', response.access);
        return response.user
    } catch (err) {
        localStorage.removeItem('token');
        return null;
    }
}

export async function logout() {
    localStorage.removeItem('token');
}

export async function getUser() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const response = await sendRequest(`${url}/token/refresh/`)
            localStorage.setItem('token', response.access);
            return response.user
        }
        return null;
    } catch (err) {
        console.log(err);
        return null;
    }
}