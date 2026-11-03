import type {
	Carrier,
	Country,
	Product,
	ProductCategory,
	ProductStatus,
	Shipment,
	ShipmentPriority,
	ShipmentStatus,
	ValidationResult,
	WarehouseLocation,
} from "../types/models";

const productCategories: readonly ProductCategory[] = [
	"Fashion",
	"Electronics",
	"Cosmetics",
	"Home",
	"Other",
];
const warehouseLocations: readonly WarehouseLocation[] = ["Los Angeles", "Zaragoza"];
const productStatuses: readonly ProductStatus[] = [
	"Active",
	"Low stock",
	"Out of stock",
	"Discontinued",
];
const countries: readonly Country[] = ["United States", "Spain"];
const shipmentPriorities: readonly ShipmentPriority[] = ["Standard", "Express", "Same-day"];
const shipmentStatuses: readonly ShipmentStatus[] = [
	"Pending",
	"Assigned",
	"In transit",
	"Delivered",
	"Failed",
];

function isFiniteNumber(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

function resultFromErrors(errors: string[]): ValidationResult {
	return { valid: errors.length === 0, errors };
}

export function validateProduct(product: Product): ValidationResult {
	const errors: string[] = [];
	if (!product || typeof product !== "object") {
		return { valid: false, errors: ["El producto debe ser un objeto válido."] };
	}

	if (typeof product.sku !== "string" || product.sku.trim().length === 0) {
		errors.push("El SKU no debe estar vacío.");
	}
	if (!productCategories.includes(product.category)) errors.push("La categoría del producto no es válida.");
	if (!warehouseLocations.includes(product.warehouse)) errors.push("La ubicación del almacén no es válida.");
	if (!productStatuses.includes(product.status)) errors.push("El estado del producto no es válido.");

	if (!isFiniteNumber(product.weightKg) || product.weightKg <= 0 || product.weightKg > 100) {
		errors.push("El peso debe ser mayor que 0 y no superar 100 kg.");
	}

	if (!product.dimensions || typeof product.dimensions !== "object") {
		errors.push("Las dimensiones del producto son obligatorias.");
	} else {
		const dimensions = [
			{ name: "largo", value: product.dimensions.lengthCm },
			{ name: "ancho", value: product.dimensions.widthCm },
			{ name: "alto", value: product.dimensions.heightCm },
		];
		dimensions.forEach(({ name, value }) => {
			if (!isFiniteNumber(value) || value <= 0 || value > 200) {
				errors.push(`La dimensión ${name} debe ser mayor que 0 y no superar 200 cm.`);
			}
		});
	}

	if (!isFiniteNumber(product.stockQuantity) || product.stockQuantity < 0) {
		errors.push("La cantidad de stock debe ser mayor o igual a 0.");
	}
	if (!isFiniteNumber(product.minStockThreshold) || product.minStockThreshold < 0) {
		errors.push("El umbral mínimo de stock debe ser mayor o igual a 0.");
	}
	if (!isFiniteNumber(product.unitCostUSD) || product.unitCostUSD <= 0) {
		errors.push("El costo unitario debe ser mayor que 0 USD.");
	}

	return resultFromErrors(errors);
}

export function validateShipment(shipment: Shipment): ValidationResult {
	const errors: string[] = [];
	if (!shipment || typeof shipment !== "object") {
		return { valid: false, errors: ["El envío debe ser un objeto válido."] };
	}

	if (!isFiniteNumber(shipment.quantity) || shipment.quantity <= 0) {
		errors.push("La cantidad del envío debe ser mayor que 0.");
	}
	if (!isFiniteNumber(shipment.declaredValueUSD) || shipment.declaredValueUSD <= 0) {
		errors.push("El valor declarado debe ser mayor que 0 USD.");
	}
	if (!shipment.destination || typeof shipment.destination !== "object") {
		errors.push("El destino del envío es obligatorio.");
	} else {
		if (!isFiniteNumber(shipment.destination.distanceKm) || shipment.destination.distanceKm < 0) {
			errors.push("La distancia debe ser mayor o igual a 0 km.");
		}
		if (!countries.includes(shipment.destination.country)) {
			errors.push("El país de destino no es válido.");
		}
	}
	if (!warehouseLocations.includes(shipment.origin)) errors.push("El almacén de origen no es válido.");
	if (!shipmentPriorities.includes(shipment.priority)) errors.push("La prioridad del envío no es válida.");
	if (!shipmentStatuses.includes(shipment.status)) errors.push("El estado del envío no es válido.");
	if (!(shipment.createdAt instanceof Date) || !Number.isFinite(shipment.createdAt.getTime())) {
		errors.push("La fecha de creación del envío no es válida.");
	}

	return resultFromErrors(errors);
}

export function validateCarrier(carrier: Carrier): ValidationResult {
	const errors: string[] = [];
	if (!carrier || typeof carrier !== "object") {
		return { valid: false, errors: ["El transportista debe ser un objeto válido."] };
	}

	const rates = [
		{ name: "base", value: carrier.baseRateUSD },
		{ name: "por kilogramo", value: carrier.ratePerKgUSD },
		{ name: "por kilómetro", value: carrier.ratePerKmUSD },
	];
	rates.forEach(({ name, value }) => {
		if (!isFiniteNumber(value) || value < 0) {
			errors.push(`La tarifa ${name} debe ser mayor o igual a 0 USD.`);
		}
	});

	if (!isFiniteNumber(carrier.avgDeliveryDays) || carrier.avgDeliveryDays <= 0) {
		errors.push("El tiempo promedio de entrega debe ser mayor que 0 días.");
	}
	if (!isFiniteNumber(carrier.onTimeRate) || carrier.onTimeRate < 0 || carrier.onTimeRate > 100) {
		errors.push("La tasa de entregas a tiempo debe estar entre 0 y 100.");
	}
	if (!isFiniteNumber(carrier.maxWeightKg) || carrier.maxWeightKg <= 0) {
		errors.push("El peso máximo aceptado debe ser mayor que 0 kg.");
	}
	if (!Array.isArray(carrier.operatesIn) || carrier.operatesIn.length === 0) {
		errors.push("El transportista debe operar en al menos un país.");
	} else if (carrier.operatesIn.some((country) => !countries.includes(country))) {
		errors.push("La lista de países del transportista contiene un país no válido.");
	}
	if (!Array.isArray(carrier.acceptsPriority) || carrier.acceptsPriority.some((priority) => !shipmentPriorities.includes(priority))) {
		errors.push("La lista de prioridades aceptadas no es válida.");
	}

	return resultFromErrors(errors);
}
