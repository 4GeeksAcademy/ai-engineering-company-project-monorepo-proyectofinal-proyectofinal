import type {
	Carrier,
	Product,
	ProductCategory,
	Shipment,
	ShipmentPriority,
	ShipmentStatus,
} from "../types/models";

export interface CarrierSelection {
	carrier: Carrier;
	score: number;
	cost: number;
}

export interface ShipmentDistanceRange {
	minDistanceKm: number;
	maxDistanceKm: number;
}

function roundToTwoDecimals(value: number): number {
	return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateShippingCost(
	shipment: Shipment,
	product: Product,
	carrier: Carrier,
): number {
	const weightCost = product.weightKg * carrier.ratePerKgUSD * shipment.quantity;
	const distanceCost = shipment.destination.distanceKm * carrier.ratePerKmUSD;
	const subtotal = carrier.baseRateUSD + weightCost + distanceCost;
	const priorityMultiplier: Record<ShipmentPriority, number> = {
		Standard: 1,
		Express: 1.3,
		"Same-day": 1.6,
	};

	return roundToTwoDecimals(subtotal * priorityMultiplier[shipment.priority]);
}

export function scoreCarrierForShipment(
	carrier: Carrier,
	shipment: Shipment,
	product: Product,
): number {
	const countryScore: number = carrier.operatesIn.includes(shipment.destination.country) ? 20 : 0;
	const weightScore: number = product.weightKg * shipment.quantity <= carrier.maxWeightKg ? 20 : 0;
	const priorityScore: number = carrier.acceptsPriority.includes(shipment.priority) ? 15 : 0;
	const fragileScore: number = !product.isFragile || carrier.handlesFragile ? 15 : 0;
	const reliabilityScore = carrier.onTimeRate * 0.3;

	return roundToTwoDecimals(
		countryScore + weightScore + priorityScore + fragileScore + reliabilityScore,
	);
}

export function selectBestCarrier(
	carriers: readonly Carrier[],
	shipment: Shipment,
	product: Product,
): CarrierSelection | null {
	return carriers
		.map((carrier) => ({
			carrier,
			score: scoreCarrierForShipment(carrier, shipment, product),
			cost: calculateShippingCost(shipment, product, carrier),
		}))
		.filter((selection) => selection.score >= 50)
		.reduce<CarrierSelection | null>((best, selection) => {
			if (best === null || selection.cost < best.cost) return selection;
			if (selection.cost === best.cost && selection.score > best.score) return selection;
			return best;
		}, null);
}

export function countProductsByCategory(
	products: readonly Product[],
): Record<ProductCategory, number> {
	const initialCounts: Record<ProductCategory, number> = {
		Fashion: 0,
		Electronics: 0,
		Cosmetics: 0,
		Home: 0,
		Other: 0,
	};

	return products.reduce((counts, product) => {
		counts[product.category] += 1;
		return counts;
	}, initialCounts);
}

export function calculateTotalInventoryValue(products: readonly Product[]): number {
	const total = products.reduce(
		(sum, product) => sum + product.stockQuantity * product.unitCostUSD,
		0,
	);
	return roundToTwoDecimals(total);
}

export function calculateAverageShipmentDistance(shipments: readonly Shipment[]): number {
	if (shipments.length === 0) return 0;

	const totalDistance = shipments.reduce(
		(sum, shipment) => sum + shipment.destination.distanceKm,
		0,
	);
	return roundToTwoDecimals(totalDistance / shipments.length);
}

export function getShipmentDistanceRange(
	shipments: readonly Shipment[],
): ShipmentDistanceRange | null {
	return shipments.reduce<ShipmentDistanceRange | null>((range, shipment) => {
		const distance = shipment.destination.distanceKm;
		if (range === null) {
			return { minDistanceKm: distance, maxDistanceKm: distance };
		}

		return {
			minDistanceKm: Math.min(range.minDistanceKm, distance),
			maxDistanceKm: Math.max(range.maxDistanceKm, distance),
		};
	}, null);
}

export function groupShipmentsByStatus(
	shipments: readonly Shipment[],
): Record<ShipmentStatus, Shipment[]> {
	const initialGroups: Record<ShipmentStatus, Shipment[]> = {
		Pending: [],
		Assigned: [],
		"In transit": [],
		Delivered: [],
		Failed: [],
	};

	return shipments.reduce((groups, shipment) => {
		groups[shipment.status].push(shipment);
		return groups;
	}, initialGroups);
}

export function findTopCarriers(
	shipments: readonly Shipment[],
	topN: number,
): Array<{ carrier: string; count: number }> {
	if (!Number.isFinite(topN) || topN <= 0) return [];

	const counts = shipments.reduce((carrierCounts, shipment) => {
		if (shipment.carrier !== null) {
			carrierCounts.set(shipment.carrier, (carrierCounts.get(shipment.carrier) ?? 0) + 1);
		}
		return carrierCounts;
	}, new Map<string, number>());

	return Array.from(counts, ([carrier, count]) => ({ carrier, count }))
		.sort((left, right) => right.count - left.count || left.carrier.localeCompare(right.carrier))
		.slice(0, Math.floor(topN));
}
