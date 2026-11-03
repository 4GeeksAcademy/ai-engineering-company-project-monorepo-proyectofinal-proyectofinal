"use client";

import { useState, type FormEvent } from "react";
import { ModalShell } from "@/components/ModalShell";
import { trackerApi } from "@/lib/tracker-api";
import type { CandidateCreateInput, CandidateRecord } from "@/types/api";

interface CandidateFormDialogProps {
	record: CandidateRecord | null;
	onClose: () => void;
	onSaved: (record: CandidateRecord, wasEditing: boolean) => void;
}

export function CandidateFormDialog({ record, onClose, onSaved }: CandidateFormDialogProps) {
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState("");
	const isEditing = record !== null;

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const input: CandidateCreateInput = {
			full_name: String(formData.get("full_name") ?? "").trim(),
			email: String(formData.get("email") ?? "").trim(),
			phone: String(formData.get("phone") ?? "").trim(),
			position: String(formData.get("position") ?? "").trim(),
			experience_years: Number(formData.get("experience_years")),
			linkedin_url: String(formData.get("linkedin_url") ?? "").trim() || null,
			cv_url: String(formData.get("cv_url") ?? "").trim() || null,
		};

		setIsSaving(true);
		setError("");
		try {
			const savedRecord = isEditing
				? await trackerApi.replaceRecord(record.id, input)
				: await trackerApi.createRecord(input);
			onSaved(savedRecord, isEditing);
		} catch (saveError: unknown) {
			setError(saveError instanceof Error ? saveError.message : "No se pudo guardar la candidatura.");
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<ModalShell labelledBy="candidate-form-title" onClose={onClose}>
				<div className="modal-header">
					<div>
						<p className="eyebrow">TRACKFLOW · ZARAGOZA</p>
						<h2 id="candidate-form-title">{isEditing ? "Editar candidatura" : "Nueva candidatura"}</h2>
					</div>
					<button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar formulario">×</button>
				</div>
				<form className="modal-form" onSubmit={handleSubmit}>
					{error && <p className="feedback feedback-error" role="alert">{error}</p>}
					<div className="form-grid">
						<label className="form-field">
							<span>Nombre completo <b aria-hidden="true">*</b></span>
							<input name="full_name" type="text" autoComplete="name" defaultValue={record?.full_name ?? ""} required />
						</label>
						<label className="form-field">
							<span>Email <b aria-hidden="true">*</b></span>
							<input name="email" type="email" autoComplete="email" defaultValue={record?.email ?? ""} required />
						</label>
						<label className="form-field">
							<span>Teléfono <b aria-hidden="true">*</b></span>
							<input name="phone" type="tel" autoComplete="tel" defaultValue={record?.phone ?? ""} required />
						</label>
						<label className="form-field">
							<span>Puesto <b aria-hidden="true">*</b></span>
							<input name="position" type="text" defaultValue={record?.position ?? "Asistente de Dirección"} required />
						</label>
						<label className="form-field">
							<span>Años de experiencia <b aria-hidden="true">*</b></span>
							<input name="experience_years" type="number" min="0" step="0.1" defaultValue={record?.experience_years ?? ""} required />
						</label>
						<label className="form-field">
							<span>Perfil de LinkedIn</span>
							<input name="linkedin_url" type="url" placeholder="https://…" defaultValue={record?.linkedin_url ?? ""} />
						</label>
						<label className="form-field form-field-wide">
							<span>Enlace al CV</span>
							<input name="cv_url" type="url" placeholder="https://…" defaultValue={record?.cv_url ?? ""} />
						</label>
					</div>
					<p className="form-hint"><b aria-hidden="true">*</b> Campos obligatorios</p>
					<div className="modal-actions">
						<button className="button button-secondary" type="button" onClick={onClose}>Cancelar</button>
						<button className="button button-primary" type="submit" disabled={isSaving}>
							{isSaving ? "Guardando…" : isEditing ? "Guardar edición" : "Registrar candidatura"}
						</button>
					</div>
				</form>
		</ModalShell>
	);
}