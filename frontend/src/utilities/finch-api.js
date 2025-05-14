import sendRequest from "./sendRequest";
const url = "/finchs/"

export async function index() {
    return sendRequest(url)
}

export async function show(finchId) {
    return sendRequest(`${url}${finchId}/`)
}

export async function create(formData) {
    return sendRequest(url, "POST", formData)
}

export async function update(formData, finchId) {
    return sendRequest(`${url}${finchId}/`, "PUT", formData)
}

export async function deleteFinch(finchId) {
    return sendRequest(`${url}${finchId}/`, "DELETE")
}

export async function addToyToFinch(finchId, toyId) {
    return sendRequest(`${url}${finchId}/associate-toy/${toyId}/`, "POST")
}

export async function removeToyFromFinch(finchId, toyId) {
    return sendRequest(`${url}${finchId}/remove-toy/${toyId}/`, "POST")
}

export function addPhoto(finchId, formData) {
    return sendRequest(`${url}${finchId}/add-photo/`, "POST", formData)
}