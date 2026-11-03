"use client";

import { useEffect, useState } from "react";
import { trackerApi } from "@/lib/tracker-api";
import type {
	CandidateListQuery,
	CandidateRecord,
	CandidateStage,
	CandidateStatus,
} from "@/types/api";

const pageSize = 20;

export function useCandidates() {
	const [records, setRecords] = useState<CandidateRecord[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [searchDraft, setSearchDraft] = useState("");
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<CandidateStatus | "">("");
	const [stage, setStage] = useState<CandidateStage | "">("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [refreshKey, setRefreshKey] = useState(0);

	useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			setSearch(searchDraft.trim());
			setPage(1);
		}, 300);
		return () => window.clearTimeout(timeoutId);
	}, [searchDraft]);

	useEffect(() => {
		const controller = new AbortController();
		const query: CandidateListQuery = { page, limit: pageSize, search, status, stage };
		setIsLoading(true);
		setError("");

		trackerApi.listRecords(query, controller.signal)
			.then((result) => {
				setRecords(result.data);
				setTotal(result.total);
				setPage(result.page);
			})
			.catch((requestError: unknown) => {
				if (controller.signal.aborted) return;
				setRecords([]);
				setTotal(0);
				setError(requestError instanceof Error ? requestError.message : "No se pudo cargar la lista.");
			})
			.finally(() => {
				if (!controller.signal.aborted) setIsLoading(false);
			});

		return () => controller.abort();
	}, [page, search, status, stage, refreshKey]);

	const pageCount = Math.max(1, Math.ceil(total / pageSize));

	return {
		records,
		total,
		page,
		pageCount,
		pageSize,
		searchDraft,
		status,
		stage,
		isLoading,
		error,
		setSearchDraft,
		setStatus: (value: CandidateStatus | "") => {
			setPage(1);
			setStatus(value);
		},
		setStage: (value: CandidateStage | "") => {
			setPage(1);
			setStage(value);
		},
		previousPage: () => setPage((currentPage) => Math.max(1, currentPage - 1)),
		nextPage: () => setPage((currentPage) => Math.min(pageCount, currentPage + 1)),
		refresh: () => setRefreshKey((currentKey) => currentKey + 1),
	};
}