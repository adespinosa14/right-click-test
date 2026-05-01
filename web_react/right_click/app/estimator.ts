import equipmentData from "../data/equipment.json";
import laborData from "../data/labor_rates.json";
import customers from "../data/customers.json";

export type Customer = typeof customers[number];
export type LineItem = { description: string; cost: number };
export type Estimate = { label: string; total: number; items: LineItem[] };

type EquipmentItem = (typeof equipmentData)[number];
type LaborRate = (typeof laborData)[number];

function getBaseCost(item: EquipmentItem): number {
  if ("baseCost" in item) return (item as { baseCost: number }).baseCost;
  if ("base_cost" in item) return (item as { base_cost: number }).base_cost;
  return 0;
}

function categoryParser(systemType: string): string[] {
  const tokens = systemType.replace(/ \+ /g, ",").replace(/ - /g, ",").split(",");
  const categories: string[] = [];

  for (const token of tokens) {
    if (token.includes("Air Conditioner") || token.includes("AC")) {
      categories.push("Air Conditioner");
    } else if (token.includes("Heat Pump")) {
      categories.push("Heat Pump");
    } else if (token.includes("Furnace")) {
      categories.push("Furnace");
    } else if (token.includes("Mini-Split")) {
      categories.push("Mini-Split");
    } else if (token.includes("Air Handler")) {
      categories.push("Air Handler");
    } else if (token.includes("Rooftop Unit") || token.includes("Rooftop")) {
      categories.push("Rooftop Unit");
    } else if (token.includes("Package Unit") || token.includes("Package")) {
      categories.push("Package Unit");
    } else if (token.includes("Compressor")) {
      categories.push("Compressor");
    } else if (token.includes("Motor")) {
      categories.push("Motor");
    } else if (token.includes("Coil")) {
      categories.push("Coil");
    } else if (token.includes("Thermostat")) {
      categories.push("Thermostat");
    } else if (token.includes("Capacitor")) {
      categories.push("Capacitor");
    } else if (token.includes("Gas Valve")) {
      categories.push("Gas Valve");
    } else if (token.includes("Control Board")) {
      categories.push("Control Board");
    } else if (token.includes("Ignitor")) {
      categories.push("Ignitor");
    } else if (token.includes("Humidifier")) {
      categories.push("Humidifier");
    } else if (token.includes("Air Cleaner")) {
      categories.push("Air Cleaner");
    } else if (token.includes("Air Purifier")) {
      categories.push("Air Purifier");
    }
  }

  return categories;
}

function getEquipmentBuckets(categories: string[]): Record<string, EquipmentItem[]> {
  const buckets: Record<string, EquipmentItem[]> = {};
  for (const cat of categories) {
    buckets[cat] = [];
  }
  for (const item of equipmentData) {
    if (item.category in buckets) {
      buckets[item.category].push(item as EquipmentItem);
    }
  }
  return buckets;
}

function getTier(bucket: EquipmentItem[]): [EquipmentItem, EquipmentItem, EquipmentItem] {
  const sorted = [...bucket].sort((a, b) => getBaseCost(a) - getBaseCost(b));
  const n = sorted.length;
  return [sorted[0], sorted[Math.floor(n / 2)], sorted[n - 1]];
}

function getLaborRate(jobType: string, level: string): LaborRate | undefined {
  return laborData.find((r) => r.jobType === jobType && r.level === level);
}

function laborCost(rate: LaborRate): number {
  const hours = (rate.estimatedHours.min + rate.estimatedHours.max) / 2;
  return Math.round(rate.hourlyRate * hours);
}

export function getEstimates(customer: Customer): [Estimate, Estimate, Estimate] {
  const systemType = customer.systemType ?? "";
  const propertyType =
    ("propertyType" in customer ? customer.propertyType : null) ??
    ("property_type" in customer ? (customer as { property_type?: string }).property_type : null) ??
    "residential";

  const categories = categoryParser(systemType);
  const buckets = getEquipmentBuckets(categories);

  // Pick labor rate based on property type and system
  let laborRate: LaborRate | undefined;
  if (categories.includes("Mini-Split") && propertyType !== "commercial") {
    laborRate = getLaborRate("install", "mini-split");
  } else if (propertyType === "commercial") {
    laborRate = getLaborRate("install", "commercial");
  } else {
    laborRate = getLaborRate("install", "residential");
  }

  const labor = laborRate ?? getLaborRate("install", "residential")!;
  const laborTotal = laborCost(labor);
  const laborLine: LineItem = {
    description: `Labor (${labor.jobType} / ${labor.level})`,
    cost: laborTotal,
  };

  // Build Budget / Mid / Premium tiers across all categories
  const tierItems: [LineItem[], LineItem[], LineItem[]] = [[], [], []];
  const tierTotals = [0, 0, 0];

  for (const cat of Object.keys(buckets)) {
    const bucket = buckets[cat];
    if (!bucket.length) continue;
    const [low, mid, high] = getTier(bucket);
    for (const [i, item] of ([low, mid, high] as EquipmentItem[]).entries()) {
      const cost = getBaseCost(item);
      tierItems[i].push({ description: `${item.category}: ${item.name}`, cost });
      tierTotals[i] += cost;
    }
  }

  const tierNames = ["Budget", "Mid", "Premium"] as const;

  return tierNames.map((label, i) => ({
    label,
    total: tierTotals[i] + laborTotal,
    items: [...tierItems[i], laborLine],
  })) as [Estimate, Estimate, Estimate];
}
