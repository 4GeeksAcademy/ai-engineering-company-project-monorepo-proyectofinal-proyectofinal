import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { trackerApi } = require("../.test-build/lib/tracker-api.js");
process.env.NEXT_PUBLIC_TRACKER_API_URL = "https://tracker.test/api/v1";

function mockFetch(handler) {
	const originalFetch = globalThis.fetch;
	globalThis.fetch = handler;
	return () => {
		globalThis.fetch = originalFetch;
	};
}

function jsonResponse(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

test("lista candidaturas serializando búsqueda, filtros y paginación", async () => {
	let requestedUrl;
	const restoreFetch = mockFetch(async (input) => {
		requestedUrl = new URL(String(input));
		return jsonResponse({ data: [], page: 2, limit: 20, total: 25 });
	});
	try {
		const result = await trackerApi.listRecords({
			page: 2,
			limit: 20,
			search: "Ana García",
			status: "in_progress",
			stage: "personal_interview",
		});
		assert.equal(requestedUrl.pathname, "/api/v1/records");
		assert.equal(requestedUrl.searchParams.get("search"), "Ana García");
		assert.equal(requestedUrl.searchParams.get("status"), "in_progress");
		assert.equal(requestedUrl.searchParams.get("stage"), "personal_interview");
		assert.equal(requestedUrl.searchParams.get("page"), "2");
		assert.equal(result.total, 25);
	} finally {
		restoreFetch();
	}
});

test("crea y actualiza candidaturas con método y JSON del contrato", async () => {
	const calls = [];
	const restoreFetch = mockFetch(async (input, init) => {
		calls.push({ url: String(input), method: init?.method, body: JSON.parse(String(init?.body)) });
		return jsonResponse({ id: "candidate-1" });
	});
	const createInput = {
		full_name: "Ana García",
		email: "ana@example.com",
		phone: "+34 600 000 000",
		position: "Asistente de Dirección",
		experience_years: 5,
		linkedin_url: null,
		cv_url: null,
	};
	try {
		await trackerApi.createRecord(createInput);
		await trackerApi.replaceRecord("candidate/1", createInput);
		await trackerApi.patchRecord("candidate/1", { status: "selected", stage: "offer_presented" });
		assert.equal(calls[0].method, "POST");
		assert.deepEqual(calls[0].body, createInput);
		assert.equal(calls[1].method, "PUT");
		assert.ok(calls[1].url.endsWith("/records/candidate%2F1"));
		assert.equal(calls[2].method, "PATCH");
		assert.deepEqual(calls[2].body, { status: "selected", stage: "offer_presented" });
	} finally {
		restoreFetch();
	}
});

test("crea notas privadas y trata las respuestas 204 como vacías", async () => {
	const calls = [];
	const restoreFetch = mockFetch(async (input, init) => {
		calls.push({ url: String(input), method: init?.method, body: init?.body });
		return new Response(null, { status: 204 });
	});
	try {
		await trackerApi.addNote("candidate-1", "Entrevista completada");
		const result = await trackerApi.deleteNote("candidate-1", "note/1");
		assert.equal(result, undefined);
		assert.equal(calls[0].method, "POST");
		assert.equal(calls[0].body, JSON.stringify({ content: "Entrevista completada" }));
		assert.ok(calls[1].url.endsWith("/records/candidate-1/notes/note%2F1"));
		assert.equal(calls[1].method, "DELETE");
	} finally {
		restoreFetch();
	}
});

test("convierte errores de validación de la API en mensajes legibles", async () => {
	const restoreFetch = mockFetch(async () => jsonResponse({
		detail: [{ loc: ["body", "email"], msg: "Email inválido" }],
	}, 422));
	try {
		await assert.rejects(
			trackerApi.getRecord("candidate-1"),
			/body → email: Email inválido/,
		);
	} finally {
		restoreFetch();
	}
});

test("traduce fallos de red sin filtrar detalles internos", async () => {
	const restoreFetch = mockFetch(async () => {
		throw new TypeError("network secret detail");
	});
	try {
		await assert.rejects(
			trackerApi.getRecord("candidate-1"),
			/No se pudo conectar con el servicio de candidaturas/,
		);
	} finally {
		restoreFetch();
	}
});