"use client";

import { useState } from "react";
import { CandidateDetailDialog } from "@/components/CandidateDetailDialog";
import { CandidateFormDialog } from "@/components/CandidateFormDialog";
import { CandidateTable } from "@/components/CandidateTable";
import { useCandidates } from "@/hooks/useCandidates";
import type { CandidateRecord } from "@/types/api";

export function CandidatePipeline() {
	const candidates = useCandidates();
	const [activeRecordId, setActiveRecordId] = useState<string | null>(null);
	const [formRecord, setFormRecord] = useState<CandidateRecord | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [feedback, setFeedback] = useState("");

	function openCreateForm() {
		setFormRecord(null);
		setIsFormOpen(true);
	}

	function openEditForm(record: CandidateRecord) {
		setActiveRecordId(null);
		setFormRecord(record);
		setIsFormOpen(true);
	}

	function handleFormClose() {
		setIsFormOpen(false);
		setFormRecord(null);
	}

	function handleSaved(record: CandidateRecord, wasEditing: boolean) {
		handleFormClose();
		candidates.refresh();
		setFeedback(wasEditing ? "Datos de candidatura actualizados." : "Candidatura registrada.");
		if (wasEditing) setActiveRecordId(record.id);
	}

	return (
		<>
			<header className="topbar">
				<a className="brand" href="#main-content" aria-label="TrackFlow People & Talent, inicio">
					<span className="brand-mark" aria-hidden="true">T</span>
					<span>TrackFlow <span className="brand-divider">/</span> People &amp; Talent</span>
				</a>
				<span className="workspace-label">OPERACIONES · ZARAGOZA</span>
			</header>

			<main id="main-content" className="page-shell">
				<section className="page-heading" aria-labelledby="page-title">
					<div>
						<p className="eyebrow">SELECCIÓN · ASISTENTE DE DIRECCIÓN</p>
						<h1 id="page-title">Candidaturas</h1>
						<p className="page-description">Proceso de selección para la sede de Zaragoza</p>
					</div>
					<button className="button button-primary" type="button" onClick={openCreateForm}>
						<span aria-hidden="true">+</span> Nueva candidatura
					</button>
				</section>

				{feedback && <p className="feedback" role="status">{feedback}</p>}

				<CandidateTable
					records={candidates.records}
					total={candidates.total}
					page={candidates.page}
					pageCount={candidates.pageCount}
					search={candidates.searchDraft}
					status={candidates.status}
					stage={candidates.stage}
					isLoading={candidates.isLoading}
					error={candidates.error}
					onSearchChange={candidates.setSearchDraft}
					onStatusChange={candidates.setStatus}
					onStageChange={candidates.setStage}
					onReset={() => {
						candidates.setSearchDraft("");
						candidates.setStatus("");
						candidates.setStage("");
					}}
					onPreviousPage={candidates.previousPage}
					onNextPage={candidates.nextPage}
					onRetry={candidates.refresh}
					onOpenRecord={(recordId) => setActiveRecordId(recordId)}
				/>
			</main>

			{activeRecordId && (
				<CandidateDetailDialog
					recordId={activeRecordId}
					onClose={() => setActiveRecordId(null)}
					onEdit={openEditForm}
					onUpdated={candidates.refresh}
				/>
			)}

			{isFormOpen && (
				<CandidateFormDialog
					key={formRecord?.id ?? "new"}
					record={formRecord}
					onClose={handleFormClose}
					onSaved={handleSaved}
				/>
			)}
		</>
	);
}