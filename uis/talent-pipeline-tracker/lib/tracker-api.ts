import type {
	CandidateCreateInput,
	CandidateListQuery,
	CandidateListResponse,
	CandidateNote,
	CandidateNotesResponse,
	CandidatePatchInput,
	CandidateRecord,
} from "@/types/api";

const defaultApiBaseUrl = "https://playground.4geeks.com/tracker/api/v1";

function getApiBaseUrl(): string {
	return (process.env.NEXT_PUBLIC_TRACKER_API_URL || defaultApiBaseUrl).replace(/\/+$/, "");
}

interface ApiValidationIssue {
	loc?: Array<string | number>;
	msg?: string;
}

function formatApiError(payload: unknown, status: number): string {
	if (typeof payload === "object" && payload !== null && "detail" in payload) {
		const detail = payload.detail;
		if (typeof detail === "string") return detail;
		if (Array.isArray(detail)) {
			const messages = detail
				.filter((issue): issue is ApiValidationIssue => typeof issue === "object" && issue !== null)
				.map((issue) => {
					const fieldPath = Array.isArray(issue.loc) ? issue.loc.join(" → ") : "";
					const message = typeof issue.msg === "string" ? issue.msg : "Dato inválido";
					return fieldPath ? `${fieldPath}: ${message}` : message;
				});
			if (messages.length > 0) return messages.join(" ");
		}
	}
	return `La API respondió con un error (${status}).`;
}

async function request<T>(
	path: string,
	options: RequestInit = {},
): Promise<T> {
	let response: Response;
	try {
		response = await fetch(`${getApiBaseUrl()}${path}`, {
			...options,
			headers: {
				Accept: "application/json",
				...(options.body ? { "Content-Type": "application/json" } : {}),
				...options.headers,
			},
		});
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") throw error;
		throw new Error("No se pudo conectar con el servicio de candidaturas.");
	}

	if (response.status === 204) return undefined as T;

	let payload: unknown = null;
	try {
		payload = await response.json();
	} catch {
		payload = null;
	}

	if (!response.ok) throw new Error(formatApiError(payload, response.status));
	return payload as T;
}

function recordPath(recordId: string): string {
	return `/records/${encodeURIComponent(recordId)}`;
}

export const trackerApi = {
	listRecords(query: CandidateListQuery, signal?: AbortSignal): Promise<CandidateListResponse> {
		const searchParams = new URLSearchParams({
			page: String(query.page),
			limit: String(query.limit),
		});
		if (query.search) searchParams.set("search", query.search);
		if (query.status) searchParams.set("status", query.status);
		if (query.stage) searchParams.set("stage", query.stage);
		return request(`/records?${searchParams.toString()}`, { signal });
	},

	getRecord(recordId: string, signal?: AbortSignal): Promise<CandidateRecord> {
		return request(recordPath(recordId), { signal });
	},

	createRecord(input: CandidateCreateInput): Promise<CandidateRecord> {
		return request("/records", { method: "POST", body: JSON.stringify(input) });
	},

	replaceRecord(recordId: string, input: CandidateCreateInput): Promise<CandidateRecord> {
		return request(recordPath(recordId), { method: "PUT", body: JSON.stringify(input) });
	},

	patchRecord(recordId: string, input: CandidatePatchInput): Promise<CandidateRecord> {
		return request(recordPath(recordId), { method: "PATCH", body: JSON.stringify(input) });
	},

	getNotes(recordId: string, signal?: AbortSignal): Promise<CandidateNotesResponse> {
		return request(`${recordPath(recordId)}/notes`, { signal });
	},

	addNote(recordId: string, content: string): Promise<CandidateNote> {
		return request(`${recordPath(recordId)}/notes`, {
			method: "POST",
			body: JSON.stringify({ content }),
		});
	},

	deleteNote(recordId: string, noteId: string): Promise<void> {
		return request(`${recordPath(recordId)}/notes/${encodeURIComponent(noteId)}`, {
			method: "DELETE",
		});
	},
};