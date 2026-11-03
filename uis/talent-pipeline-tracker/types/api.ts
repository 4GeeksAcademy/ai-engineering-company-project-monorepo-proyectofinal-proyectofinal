export const candidateStatuses = {
	received: "Recibida",
	in_progress: "En proceso",
	selected: "Seleccionada",
	discarded: "Descartada",
} as const;

export const candidateStages = {
	pending: "Pendiente de revisión",
	review: "En revisión",
	personal_interview: "Entrevista personal",
	technical_interview: "Entrevista técnica",
	offer_presented: "Oferta presentada",
} as const;

export type CandidateStatus = keyof typeof candidateStatuses;
export type CandidateStage = keyof typeof candidateStages;

export interface CandidateRecord {
	id: string;
	full_name: string;
	email: string;
	phone: string;
	position: string;
	linkedin_url: string | null;
	cv_url: string | null;
	status: CandidateStatus;
	stage: CandidateStage;
	experience_years: number;
	notes_count: number;
	applied_at: string;
	updated_at: string;
}

export interface CandidateCreateInput {
	full_name: string;
	email: string;
	phone: string;
	position: string;
	experience_years: number;
	linkedin_url?: string | null;
	cv_url?: string | null;
}

export type CandidatePatchInput = Partial<
	Pick<CandidateRecord, "status" | "stage">
>;

export interface CandidateNote {
	id: string;
	content: string;
	created_at: string;
}

export interface CandidateListResponse {
	data: CandidateRecord[];
	page: number;
	limit: number;
	total: number;
}

export interface CandidateNotesResponse {
	data: CandidateNote[];
	meta?: Record<string, unknown>;
}

export interface CandidateListQuery {
	page: number;
	limit: number;
	search?: string;
	status?: CandidateStatus | "";
	stage?: CandidateStage | "";
}