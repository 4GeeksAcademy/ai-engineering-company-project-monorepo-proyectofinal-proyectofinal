import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const collections = require("../dist/utils/collections.js");
const search = require("../dist/utils/search.js");
const transformations = require("../dist/utils/transformations.js");
const validations = require("../dist/utils/validations.js");

const productSamples = [
	{
		sku: "SHOE-BLK-42",
		name: "Zapatillas negras",
		category: "Fashion",
		weightKg: 0.8,
		dimensions: { lengthCm: 35, widthCm: 22, heightCm: 12 },
		warehouse: "Los Angeles",
		stockQuantity: 45,
		minStockThreshold: 20,
		unitCostUSD: 35,
		isFragile: false,
		status: "Active",
	},
	{
		sku: "LAPTOP-DELL-15",
		name: "Laptop Dell",
		category: "Electronics",
		weightKg: 2.3,
		dimensions: { lengthCm: 40, widthCm: 28, heightCm: 3 },
		warehouse: "Zaragoza",
		stockQuantity: 8,
		minStockThreshold: 10,
		unitCostUSD: 650,
		isFragile: true,
		status: "Low stock",
	},
	{
		sku: "PERFUME-COCO-50",
		name: "Perfume",
		category: "Cosmetics",
		weightKg: 0.3,
		dimensions: { lengthCm: 12, widthCm: 8, heightCm: 15 },
		warehouse: "Los Angeles",
		stockQuantity: 120,
		minStockThreshold: 30,
		unitCostUSD: 85,
		isFragile: true,
		status: "Active",
	},
];

const carrierSamples = [
	{
		id: "CAR-UPS",
		name: "UPS",
		operatesIn: ["United States"],
		baseRateUSD: 5,
		ratePerKgUSD: 1.2,
		ratePerKmUSD: 0.05,
		avgDeliveryDays: 3,
		onTimeRate: 88,
		maxWeightKg: 30,
		handlesFragile: true,
		acceptsPriority: ["Standard", "Express"],
	},
	{
		id: "CAR-SEUR",
		name: "SEUR",
		operatesIn: ["Spain"],
		baseRateUSD: 6.5,
		ratePerKgUSD: 1.5,
		ratePerKmUSD: 0.08,
		avgDeliveryDays: 2,
		onTimeRate: 92,
		maxWeightKg: 25,
		handlesFragile: true,
		acceptsPriority: ["Standard", "Express", "Same-day"],
	},
	{
		id: "CAR-DHL",
		name: "DHL Express",
		operatesIn: ["United States", "Spain"],
		baseRateUSD: 12,
		ratePerKgUSD: 2,
		ratePerKmUSD: 0.1,
		avgDeliveryDays: 1,
		onTimeRate: 95,
		maxWeightKg: 50,
		handlesFragile: true,
		acceptsPriority: ["Express", "Same-day"],
	},
];

const shipmentSample = {
	id: "SH-2024-8821",
	sku: "LAPTOP-DELL-15",
	quantity: 1,
	origin: "Zaragoza",
	destination: {
		city: "Madrid",
		country: "Spain",
		postalCode: "28001",
		distanceKm: 320,
	},
	priority: "Express",
	declaredValueUSD: 650,
	carrier: null,
	status: "Pending",
	createdAt: new Date("2024-03-15"),
};

test("filtra productos por ubicación, categoría, stock y criterios combinados", () => {
	assert.equal(collections.filterProductsByWarehouse(productSamples, "Los Angeles").length, 2);
	assert.equal(collections.filterProductsByCategory(productSamples, "Electronics")[0].sku, "LAPTOP-DELL-15");
	assert.deepEqual(collections.filterLowStockProducts(productSamples).map(({ sku }) => sku), ["LAPTOP-DELL-15"]);
	assert.equal(
		collections.filterProducts(productSamples, {
			warehouse: "Los Angeles",
			minStockQuantity: 40,
			maxWeightKg: 1,
		}).length,
		2,
	);
	assert.deepEqual(collections.filterProducts([], {}).length, 0);
});

test("ordena sin mutar y aplica criterios secundarios", () => {
	const originalSkus = productSamples.map(({ sku }) => sku);
	assert.deepEqual(collections.sortProductsByStock(productSamples, "asc").map(({ stockQuantity }) => stockQuantity), [8, 45, 120]);
	assert.deepEqual(collections.sortProductsByStock(productSamples, "desc").map(({ stockQuantity }) => stockQuantity), [120, 45, 8]);
	assert.deepEqual(productSamples.map(({ sku }) => sku), originalSkus);
	assert.deepEqual(collections.sortCarriersByReliability(carrierSamples, "asc").map(({ name }) => name), ["UPS", "SEUR", "DHL Express"]);
	assert.deepEqual(collections.sortCarriersByReliability(carrierSamples, "desc").map(({ name }) => name), ["DHL Express", "SEUR", "UPS"]);
	const productsWithSameCategory = [...productSamples, { ...productSamples[0], sku: "SHOE-BLK-41", stockQuantity: 10 }];
	assert.deepEqual(
		collections.sortProductsByFields(productsWithSameCategory, [
			{ field: "category", order: "asc" },
			{ field: "stockQuantity", order: "desc" },
		]).map(({ sku }) => sku),
		["PERFUME-COCO-50", "LAPTOP-DELL-15", "SHOE-BLK-42", "SHOE-BLK-41"],
	);
	assert.deepEqual(collections.sortProductsByFields([], []), []);
});

test("búsqueda lineal encuentra coincidencias y devuelve null si faltan", () => {
	assert.equal(search.findProductBySKU(productSamples, "laptop-dell-15"), productSamples[1]);
	assert.equal(search.findProductBySKU([], "missing"), null);
	assert.equal(search.findShipmentById([shipmentSample], shipmentSample.id), shipmentSample);
	assert.equal(search.findShipmentById([], "missing"), null);
});

test("búsqueda binaria devuelve índices correctos y -1 en casos límite", () => {
	const sortedProducts = [...productSamples].sort((left, right) => left.weightKg - right.weightKg);
	assert.equal(search.binarySearchProductByWeight(sortedProducts, 0.8), 1);
	assert.equal(search.binarySearchProductByWeight(sortedProducts, 99), -1);
	assert.equal(search.binarySearchProductByWeight([], 0.8), -1);
	assert.equal(search.binarySearchProductByWeight([productSamples[0]], 0.8), 0);
	assert.equal(search.binarySearchProductByWeight([productSamples[0]], 0.9), -1);
	assert.equal(search.binarySearchProductByWeight(sortedProducts, Number.NaN), -1);
});

test("calcula costos, puntuaciones y selecciona el transportista elegible más barato", () => {
	const laptop = productSamples[1];
	const seur = carrierSamples[1];
	assert.equal(transformations.calculateShippingCost(shipmentSample, laptop, seur), 46.22);
	assert.equal(transformations.scoreCarrierForShipment(seur, shipmentSample, laptop), 97.6);
	assert.equal(
		transformations.selectBestCarrier([seur, carrierSamples[2]], shipmentSample, laptop)?.carrier.name,
		"SEUR",
	);
	assert.equal(transformations.selectBestCarrier([], shipmentSample, laptop), null);
	const unsuitableCarrier = {
		...seur,
		maxWeightKg: 0.1,
		acceptsPriority: ["Standard"],
		handlesFragile: false,
		onTimeRate: 0,
	};
	assert.equal(transformations.selectBestCarrier([unsuitableCarrier], shipmentSample, laptop), null);
});

test("genera agregaciones y maneja colecciones vacías", () => {
	const secondShipment = {
		...shipmentSample,
		id: "SH-2",
		carrier: "SEUR",
		status: "Assigned",
		destination: { ...shipmentSample.destination, distanceKm: 100 },
	};
	const deliveredShipment = { ...secondShipment, id: "SH-3", status: "Delivered" };
	assert.deepEqual(transformations.countProductsByCategory(productSamples), {
		Fashion: 1,
		Electronics: 1,
		Cosmetics: 1,
		Home: 0,
		Other: 0,
	});
	assert.equal(transformations.calculateTotalInventoryValue(productSamples), 16975);
	assert.equal(transformations.calculateAverageShipmentDistance([shipmentSample, secondShipment]), 210);
	assert.equal(transformations.calculateAverageShipmentDistance([]), 0);
	assert.deepEqual(transformations.getShipmentDistanceRange([shipmentSample, secondShipment]), {
		minDistanceKm: 100,
		maxDistanceKm: 320,
	});
	assert.equal(transformations.getShipmentDistanceRange([]), null);
	assert.equal(transformations.groupShipmentsByStatus([shipmentSample, secondShipment, deliveredShipment]).Delivered.length, 1);
	assert.deepEqual(
		transformations.findTopCarriers([shipmentSample, secondShipment, deliveredShipment], 1),
		[{ carrier: "SEUR", count: 2 }],
	);
	assert.deepEqual(transformations.findTopCarriers([shipmentSample], 3), []);
	assert.deepEqual(transformations.findTopCarriers([secondShipment], 0), []);
});

test("validaciones aceptan datos válidos y rechazan límites incumplidos", () => {
	assert.equal(validations.validateProduct(productSamples[0]).valid, true);
	assert.equal(validations.validateProduct({ ...productSamples[0], weightKg: 0 }).valid, false);
	assert.equal(validations.validateProduct({ ...productSamples[0], weightKg: 100 }).valid, true);
	assert.equal(validations.validateProduct({ ...productSamples[0], weightKg: 100.01 }).valid, false);
	assert.equal(validations.validateProduct({ ...productSamples[0], stockQuantity: -1 }).valid, false);
	assert.equal(validations.validateProduct(null).valid, false);
	assert.equal(validations.validateShipment(shipmentSample).valid, true);
	assert.equal(validations.validateShipment({ ...shipmentSample, quantity: 0 }).valid, false);
	assert.equal(validations.validateShipment({ ...shipmentSample, destination: { ...shipmentSample.destination, distanceKm: -1 } }).valid, false);
	assert.equal(validations.validateShipment(null).valid, false);
	assert.equal(validations.validateCarrier(carrierSamples[0]).valid, true);
	assert.equal(validations.validateCarrier({ ...carrierSamples[0], onTimeRate: 101 }).valid, false);
	assert.equal(validations.validateCarrier({ ...carrierSamples[0], operatesIn: [] }).valid, false);
	assert.equal(validations.validateCarrier(null).valid, false);
});