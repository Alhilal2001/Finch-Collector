import sendRequest from "./sendRequest";

export function finchFeedings(finchId) {
    return sendRequest(`/finchs/${finchId}/feedings/`)
}

export function create(formData, finchId) {
    return sendRequest(`/finchs/${finchId}/feedings/`, "post", formData)
}

