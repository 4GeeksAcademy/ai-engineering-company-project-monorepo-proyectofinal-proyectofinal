import {
	candidateStages,
	candidateStatuses,
	type CandidateRecord,
	type CandidateStage,
	type CandidateStatus,
} from "@/types/api";

interface CandidateTableProps {
	records: CandidateRecord[];
	total: number;
	page: number;
	pageCount: number;
	search: string;
	status: CandidateStatus | "";
	stage: CandidateStage | "";
	isLoading: boolean;
	error: string;
	onSearchChange: (value: string) => void;
	onStatusChange: (value: CandidateStatus | "") => void;
	onStageChange: (value: CandidateStage | "") => void;
	onReset: () => void;
	onPreviousPage: () => void;
	onNextPage: () => void;
	onRetry: () => void;
	onOpenRecord: (recordId: string) => void;
}

function formatStatus(status: CandidateStatus): string {
	return candidateStatuses[status] ?? "Estado desconocido";
}

function formatStage(stage: CandidateStage): string {
	return candidateStages[stage] ?? "Etapa desconocida";
}

export function CandidateTable({
	records,
	total,
	page,
	pageCount,
	search,
	status,
	stage,
	isLoading,
	error,
	onSearchChange,
	onStatusChange,
	onStageChange,
	onReset,
	onPreviousPage,
	onNextPage,
	onRetry,
	onOpenRecord,
}: CandidateTableProps) {
	const hasFilters = Boolean(search || status || stage);

	return (
		<section className="list-panel" aria-labelledby="list-title">
			<div className="list-heading">
				<div>
					<h2 id="list-title">Todas las candidaturas</h2>
					<p className="muted" aria-live="polite">
						{isLoading ? "Cargando candidaturas…" : `${total.toLocaleString("es-ES")} candidaturas`}
					</p>
				</div>
			</div>

			<form className="filters" role="search" onSubmit={(event) => event.preventDefault()} onReset={onReset}>
				<label className="search-field">
					<span className="sr-only">Buscar por nombre o email</span>
					<span className="search-icon" aria-hidden="true">⌕</span>
					<input
						value={search}
						onChange={(event) => onSearchChange(event.currentTarget.value)}
						name="search"
						type="search"
						placeholder="Buscar por nombre o email"
						autoComplete="off"
					/>
				</label>
				<label className="filter-field">
					<span>Estado</span>
					<select value={status} onChange={(event) => onStatusChange(event.currentTarget.value as CandidateStatus | "")}>
						<option value="">Todos los estados</option>
						{Object.entries(candidateStatuses).map(([value, label]) => (
							<option key={value} value={value}>{label}</option>
						))}
					</select>
				</label>
				<label className="filter-field">
					<span>Etapa</span>
					<select value={stage} onChange={(event) => onStageChange(event.currentTarget.value as CandidateStage | "")}>
						<option value="">Todas las etapas</option>
						{Object.entries(candidateStages).map(([value, label]) => (
							<option key={value} value={value}>{label}</option>
						))}
					</select>
				</label>
				<button className="button button-secondary" type="reset">Limpiar</button>
			</form>

			<div className="table-scroll" aria-busy={isLoading}>
				<table>
					<caption className="sr-only">Candidaturas del proceso de selección</caption>
					<thead>
						<tr>
							<th scope="col">Candidato/a</th>
							<th scope="col">Puesto</th>
							<th scope="col">Estado</th>
							<th scope="col">Etapa</th>
							<th scope="col"><span className="sr-only">Acciones</span></th>
						</tr>
					</thead>
					<tbody>
						{error ? (
							<tr><td className="empty-cell" colSpan={5}>
								<div className="empty-state">
									<h3>No se pudieron cargar las candidaturas</h3>
									<p role="alert">{error}</p>
									<button className="button button-secondary" type="button" onClick={onRetry}>Reintentar</button>
								</div>
							</td></tr>
						) : !isLoading && records.length === 0 ? (
							<tr><td className="empty-cell" colSpan={5}>
								<div className="empty-state">
									<span className="empty-symbol" aria-hidden="true">—</span>
									<h3>{hasFilters ? "Sin resultados" : "No hay candidaturas"}</h3>
									<p>{hasFilters ? "Prueba a cambiar la búsqueda o los filtros." : "Todavía no hay candidaturas para este proceso."}</p>
								</div>
							</td></tr>
						) : records.map((record) => (
							<tr key={record.id}>
								<td>
									<button className="record-name" type="button" onClick={() => onOpenRecord(record.id)}>
										{record.full_name || "Sin nombre"}
									</button>
									<span className="record-email">{record.email}</span>
								</td>
								<td>{record.position}</td>
								<td><span className={`badge badge-status status-${record.status}`}>{formatStatus(record.status)}</span></td>
								<td><span className="badge badge-stage">{formatStage(record.stage)}</span></td>
								<td><button className="text-button" type="button" onClick={() => onOpenRecord(record.id)}>Ver detalle</button></td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<nav className="pagination" aria-label="Paginación de candidaturas">
				<span className="muted">Página {page} de {pageCount}</span>
				<div className="pagination-actions">
					<button className="button button-secondary" type="button" onClick={onPreviousPage} disabled={page <= 1 || isLoading}>Página anterior</button>
					<button className="button button-secondary" type="button" onClick={onNextPage} disabled={page >= pageCount || isLoading}>Página siguiente</button>
				</div>
			</nav>
		</section>
	);
}