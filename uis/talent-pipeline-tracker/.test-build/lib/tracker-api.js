"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackerApi = void 0;
const defaultApiBaseUrl = "https://playground.4geeks.com/tracker/api/v1";
function getApiBaseUrl() {
    return (process.env.NEXT_PUBLIC_TRACKER_API_URL || defaultApiBaseUrl).replace(/\/+$/, "");
}
function formatApiError(payload, status) {
    if (typeof payload === "object" && payload !== null && "detail" in payload) {
        const detail = payload.detail;
        if (typeof detail === "string")
            return detail;
        if (Array.isArray(detail)) {
            const messages = detail
                .filter((issue) => typeof issue === "object" && issue !== null)
                .map((issue) => {
                const fieldPath = Array.isArray(issue.loc) ? issue.loc.join(" → ") : "";
                const message = typeof issue.msg === "string" ? issue.msg : "Dato inválido";
                return fieldPath ? `${fieldPath}: ${message}` : message;
            });
            if (messages.length > 0)
                return messages.join(" ");
        }
    }
    return `La API respondió con un error (${status}).`;
}
async function request(path, options = {}) {
    let response;
    try {
        response = await fetch(`${getApiBaseUrl()}${path}`, {
            ...options,
            headers: {
                Accept: "application/json",
                ...(options.body ? { "Content-Type": "application/json" } : {}),
                ...options.headers,
            },
        });
    }
    catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
            throw error;
        throw new Error("No se pudo conectar con el servicio de candidaturas.");
    }
    if (response.status === 204)
        return undefined;
    let payload = null;
    try {
        payload = await response.json();
    }
    catch {
        payload = null;
    }
    if (!response.ok)
        throw new Error(formatApiError(payload, response.status));
    return payload;
}
function recordPath(recordId) {
    return `/records/${encodeURIComponent(recordId)}`;
}
exports.trackerApi = {
    listRecords(query, signal) {
        const searchParams = new URLSearchParams({
            page: String(query.page),
            limit: String(query.limit),
        });
        if (query.search)
            searchParams.set("search", query.search);
        if (query.status)
            searchParams.set("status", query.status);
        if (query.stage)
            searchParams.set("stage", query.stage);
        return request(`/records?${searchParams.toString()}`, { signal });
    },
    getRecord(recordId, signal) {
        return request(recordPath(recordId), { signal });
    },
    createRecord(input) {
        return request("/records", { method: "POST", body: JSON.stringify(input) });
    },
    replaceRecord(recordId, input) {
        return request(recordPath(recordId), { method: "PUT", body: JSON.stringify(input) });
    },
    patchRecord(recordId, input) {
        return request(recordPath(recordId), { method: "PATCH", body: JSON.stringify(input) });
    },
    getNotes(recordId, signal) {
        return request(`${recordPath(recordId)}/notes`, { signal });
    },
    addNote(recordId, content) {
        return request(`${recordPath(recordId)}/notes`, {
            method: "POST",
            body: JSON.stringify({ content }),
        });
    },
    deleteNote(recordId, noteId) {
        return request(`${recordPath(recordId)}/notes/${encodeURIComponent(noteId)}`, {
            method: "DELETE",
        });
    },
};
