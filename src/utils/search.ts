import type { Product, Shipment } from "../types/models";

export function findProductBySKU(
	products: readonly Product[],
	sku: string,
): Product | null {
	const normalizedSku = sku.trim().toLowerCase();
	return products.find((product) => product.sku.trim().toLowerCase() === normalizedSku) ?? null;
}

export function findShipmentById(
	shipments: readonly Shipment[],
	id: string,
): Shipment | null {
	return shipments.find((shipment) => shipment.id === id) ?? null;
}

export function binarySearchProductByWeight(
	sortedProducts: readonly Product[],
	targetWeight: number,
): number {
	if (!Number.isFinite(targetWeight)) return -1;

	let low = 0;
	let high = sortedProducts.length - 1;

	while (low <= high) {
		const middle = low + Math.floor((high - low) / 2);
		const product = sortedProducts[middle];
		if (product === undefined) return -1;

		if (product.weightKg === targetWeight) return middle;
		if (product.weightKg < targetWeight) {
			low = middle + 1;
		} else {
			high = middle - 1;
		}
	}

	return -1;
}
