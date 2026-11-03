"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ModalShell } from "@/components/ModalShell";
import { trackerApi } from "@/lib/tracker-api";
import {
	candidateStages,
	candidateStatuses,
	type CandidateNote,
	type CandidateRecord,
	type CandidateStage,
	type CandidateStatus,
} from "@/types/api";

interface CandidateDetailDialogProps {
	recordId: string;
	onClose: () => void;
	onEdit: (record: CandidateRecord) => void;
	onUpdated: () => void;
}

function formatDate(value: string | null | undefined): string {
	if (!value) return "No disponible";
	const date = new Date(value);
	if (!Number.isFinite(date.getTime())) return "No disponible";
	return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function safeExternalUrl(value: string | null): string | null {
	if (!value) return null;
	try {
		const url = new URL(value);
		return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
	} catch {
		return null;
	}
}

export function CandidateDetailDialog({ recordId, onClose, onEdit, onUpdated }: CandidateDetailDialogProps) {
	const [record, setRecord] = useState<CandidateRecord | null>(null);
	const [notes, setNotes] = useState<CandidateNote[]>([]);
	const [status, setStatus] = useState<CandidateStatus>("received");
	const [stage, setStage] = useState<CandidateStage>("pending");
	const [noteText, setNoteText] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [feedback, setFeedback] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		const controller = new AbortController();
		setIsLoading(true);
		setError("");
		setFeedback("");
		Promise.all([
			trackerApi.getRecord(recordId, controller.signal),
			trackerApi.getNotes(recordId, controller.signal),
		])
			.then(([loadedRecord, noteResult]) => {
				setRecord(loadedRecord);
				setStatus(loadedRecord.status);
				setStage(loadedRecord.stage);
				setNotes(Array.isArray(noteResult.data) ? noteResult.data : []);
			})
			.catch((loadError: unknown) => {
				if (controller.signal.aborted) return;
				setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el detalle.");
			})
			.finally(() => {
				if (!controller.signal.aborted) setIsLoading(false);
			});

		return () => controller.abort();
	}, [recordId]);

	async function saveStatusAndStage(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!record) return;
		const changes: { status?: CandidateStatus; stage?: CandidateStage } = {};
		if (status !== record.status) changes.status = status;
		if (stage !== record.stage) changes.stage = stage;
		if (Object.keys(changes).length === 0) {
			setFeedback("No hay cambios que guardar.");
			return;
		}

		setIsSaving(true);
		setError("");
		try {
			const updatedRecord = await trackerApi.patchRecord(record.id, changes);
			setRecord(updatedRecord);
			setStatus(updatedRecord.status);
			setStage(updatedRecord.stage);
			setFeedback("Estado y etapa actualizados.");
			onUpdated();
		} catch (saveError: unknown) {
			setError(saveError instanceof Error ? saveError.message : "No se pudieron guardar los cambios.");
		} finally {
			setIsSaving(false);
		}
	}

	async function addNote(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const content = noteText.trim();
		if (!record || !content) return;
		setIsSaving(true);
		setError("");
		try {
			await trackerApi.addNote(record.id, content);
			const result = await trackerApi.getNotes(record.id);
			setNotes(Array.isArray(result.data) ? result.data : []);
			setNoteText("");
			setFeedback("Nota interna guardada.");
			onUpdated();
		} catch (saveError: unknown) {
			setError(saveError instanceof Error ? saveError.message : "No se pudo guardar la nota.");
		} finally {
			setIsSaving(false);
		}
	}

	async function deleteNote(noteId: string) {
		if (!record || !window.confirm("¿Eliminar esta nota interna? Esta acción no se puede deshacer.")) return;
		setIsSaving(true);
		setError("");
		try {
			await trackerApi.deleteNote(record.id, noteId);
			setNotes((currentNotes) => currentNotes.filter((note) => note.id !== noteId));
			setFeedback("Nota eliminada.");
			onUpdated();
		} catch (deleteError: unknown) {
			setError(deleteError instanceof Error ? deleteError.message : "No se pudo eliminar la nota.");
		} finally {
			setIsSaving(false);
		}
	}

	const linkedInUrl = safeExternalUrl(record?.linkedin_url ?? null);
	const cvUrl = safeExternalUrl(record?.cv_url ?? null);

	return (
		<ModalShell labelledBy="candidate-detail-title" onClose={onClose}>
				<div className="modal-header">
					<div>
						<p className="eyebrow">FICHA DE CANDIDATURA</p>
						<h2 id="candidate-detail-title">{record?.full_name ?? "Detalle"}</h2>
					</div>
					<button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar detalle">×</button>
				</div>
				<div className="modal-content">
					{feedback && <p className="feedback" role="status">{feedback}</p>}
					{error && <p className="feedback feedback-error" role="alert">{error}</p>}
					{isLoading ? <p className="muted" role="status">Cargando detalle…</p> : record ? (
						<>
							<div className="detail-summary">
								<span className={`badge badge-status status-${record.status}`}>{candidateStatuses[record.status]}</span>
								<span className="badge badge-stage">{candidateStages[record.stage]}</span>
							</div>
							<dl className="detail-grid">
								<div className="detail-field"><dt>Email</dt><dd>{record.email}</dd></div>
								<div className="detail-field"><dt>Teléfono</dt><dd>{record.phone}</dd></div>
								<div className="detail-field"><dt>Puesto</dt><dd>{record.position}</dd></div>
								<div className="detail-field"><dt>Años de experiencia</dt><dd>{record.experience_years}</dd></div>
								<div className="detail-field"><dt>Candidatura recibida</dt><dd>{formatDate(record.applied_at)}</dd></div>
								<div className="detail-field"><dt>Última actualización</dt><dd>{formatDate(record.updated_at)}</dd></div>
								<div className="detail-field"><dt>LinkedIn</dt><dd>{linkedInUrl ? <a className="detail-link" href={linkedInUrl} target="_blank" rel="noopener noreferrer">Abrir perfil</a> : "No disponible"}</dd></div>
								<div className="detail-field"><dt>CV</dt><dd>{cvUrl ? <a className="detail-link" href={cvUrl} target="_blank" rel="noopener noreferrer">Abrir CV</a> : "No disponible"}</dd></div>
							</dl>

							<section className="status-editor" aria-labelledby="candidate-status-heading">
								<h3 id="candidate-status-heading">Estado del proceso</h3>
								<form className="status-form" onSubmit={saveStatusAndStage}>
									<label className="filter-field">
										<span>Estado</span>
										<select value={status} onChange={(event) => setStatus(event.currentTarget.value as CandidateStatus)}>
											{Object.entries(candidateStatuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
										</select>
									</label>
									<label className="filter-field">
										<span>Etapa</span>
										<select value={stage} onChange={(event) => setStage(event.currentTarget.value as CandidateStage)}>
											{Object.entries(candidateStages).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
										</select>
									</label>
									<button className="button button-primary" type="submit" disabled={isSaving}>Guardar cambios</button>
								</form>
								<button className="button button-secondary" type="button" onClick={() => onEdit(record)}>Editar datos</button>
							</section>

							<section className="notes-section" aria-labelledby="candidate-notes-heading">
								<div className="section-heading">
									<h3 id="candidate-notes-heading">Notas internas</h3>
									<span className="muted">{notes.length} notas</span>
								</div>
								<ul className="notes-list">
									{notes.length === 0 ? <li className="notes-empty">Aún no hay notas para esta candidatura.</li> : notes.map((note: CandidateNote) => (
										<li className="note-item" key={note.id}>
											<div className="note-header">
												<time className="note-date" dateTime={note.created_at}>{formatDate(note.created_at)}</time>
												<button className="text-button text-button-danger" type="button" disabled={isSaving} onClick={() => void deleteNote(note.id)}>Eliminar</button>
											</div>
											<p className="note-content">{note.content}</p>
										</li>
									))}
								</ul>
								<form className="note-form" onSubmit={addNote}>
									<label className="form-field">
										<span>Añadir nota privada</span>
										<textarea rows={3} value={noteText} onChange={(event) => setNoteText(event.currentTarget.value)} required minLength={1} />
									</label>
									<div className="note-actions">
										<button className="button button-primary" type="submit" disabled={isSaving || !noteText.trim()}>{isSaving ? "Guardando…" : "Guardar nota"}</button>
									</div>
								</form>
							</section>
						</>
					) : !error ? <p className="muted">No se encontró la candidatura.</p> : null}
				</div>
		</ModalShell>
	);
}