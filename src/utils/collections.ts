import type {
	Carrier,
	Product,
	ProductCategory,
	ProductStatus,
	WarehouseLocation,
} from "../types/models";

export interface ProductFilterCriteria {
	warehouse?: WarehouseLocation;
	category?: ProductCategory;
	status?: ProductStatus;
	minStockQuantity?: number;
	maxStockQuantity?: number;
	minWeightKg?: number;
	maxWeightKg?: number;
}

export type ProductSortField =
	| "sku"
	| "name"
	| "category"
	| "status"
	| "weightKg"
	| "stockQuantity"
	| "unitCostUSD";

export interface ProductSortCriterion {
	field: ProductSortField;
	order: "asc" | "desc";
}

export function filterProductsByWarehouse(
	products: readonly Product[],
	warehouse: WarehouseLocation,
): Product[] {
	return products.filter((product) => product.warehouse === warehouse);
}

export function filterProductsByCategory(
	products: readonly Product[],
	category: ProductCategory,
): Product[] {
	return products.filter((product) => product.category === category);
}

export function filterLowStockProducts(products: readonly Product[]): Product[] {
	return products.filter(
		(product) => product.stockQuantity <= product.minStockThreshold,
	);
}

export function filterProducts(
	products: readonly Product[],
	criteria: ProductFilterCriteria,
): Product[] {
	return products.filter((product) => {
		if (criteria.warehouse !== undefined && product.warehouse !== criteria.warehouse) return false;
		if (criteria.category !== undefined && product.category !== criteria.category) return false;
		if (criteria.status !== undefined && product.status !== criteria.status) return false;
		if (criteria.minStockQuantity !== undefined && product.stockQuantity < criteria.minStockQuantity) return false;
		if (criteria.maxStockQuantity !== undefined && product.stockQuantity > criteria.maxStockQuantity) return false;
		if (criteria.minWeightKg !== undefined && product.weightKg < criteria.minWeightKg) return false;
		if (criteria.maxWeightKg !== undefined && product.weightKg > criteria.maxWeightKg) return false;
		return true;
	});
}

export function sortProductsByStock(
	products: readonly Product[],
	order: "asc" | "desc",
): Product[] {
	const direction = order === "asc" ? 1 : -1;
	return [...products].sort(
		(left, right) => (left.stockQuantity - right.stockQuantity) * direction,
	);
}

export function sortCarriersByReliability(
	carriers: readonly Carrier[],
	order: "asc" | "desc",
): Carrier[] {
	const direction = order === "asc" ? 1 : -1;
	return [...carriers].sort(
		(left, right) => (left.onTimeRate - right.onTimeRate) * direction,
	);
}

function compareProductsByField(
	left: Product,
	right: Product,
	field: ProductSortField,
): number {
	switch (field) {
		case "weightKg":
		case "stockQuantity":
		case "unitCostUSD":
			return left[field] - right[field];
		case "sku":
		case "name":
		case "category":
		case "status":
			return left[field].localeCompare(right[field]);
	}
}

export function sortProductsByFields(
	products: readonly Product[],
	criteria: readonly ProductSortCriterion[],
): Product[] {
	return [...products].sort((left, right) =>
		criteria.reduce((comparison, criterion) => {
			if (comparison !== 0) return comparison;
			const fieldComparison = compareProductsByField(left, right, criterion.field);
			return criterion.order === "asc" ? fieldComparison : -fieldComparison;
		}, 0),
	);
}
