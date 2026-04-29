import equipmentData from "../data/equipment.json";
import laborData from "../data/labor_rates.json";
import customers from "../data/customers.json";

export type Customer = typeof customers[number];
export type LineItem = { description: string; cost: number };
export type Estimate = { label: string; total: number; items: LineItem[] };

type EquipmentItem = typeof equipmentData[number];
type LaborRate = typeof laborData[number];

function getEquipmentCost(item: EquipmentItem): number {
  if ("baseCost" in item) return (item as { baseCost: number }).baseCost;
  if ("base_cost" in item) return (item as { base_cost: number }).base_cost;
  return 0;
}

function getLaborRate(jobType: string, level: string): LaborRate | undefined {
  return laborData.find((r) => r.jobType === jobType && r.level === level);
}

function laborCost(rate: LaborRate): number {
  const hours = (rate.estimatedHours.min + rate.estimatedHours.max) / 2;
  return Math.round(rate.hourlyRate * hours);
}

function getAgeTierPart(systemAge: number, systemType: string): EquipmentItem {
  const hasFurnace = systemType.toLowerCase().includes("furnace");
  let id: string;

  if (systemAge <= 7) {
    id = hasFurnace ? "EQ023" : "EQ018";
  } else if (systemAge <= 15) {
    id = hasFurnace ? "EQ022" : "EQ012";
  } else {
    id = "EQ011";
  }

  return equipmentData.find((e) => e.id === id)!;
}

type ParsedSystem = {
  equipmentIds: string[];
  multiplier: number;
  hasMiniSplit: boolean;
  hasRooftop: boolean;
};

function parseSystemType(systemType: string): ParsedSystem {
  const lower = systemType.toLowerCase();
  const multiplierMatch = systemType.match(/\(x(\d+)\)/);
  const multiplier = multiplierMatch ? parseInt(multiplierMatch[1], 10) : 1;

  const equipmentIds: string[] = [];
  const hasMiniSplit = lower.includes("mini-split");
  const hasRooftop = lower.includes("rooftop");

  if (lower.includes("central ac")) equipmentIds.push("EQ001");
  if (lower.includes("furnace")) equipmentIds.push("EQ003");
  if (lower.includes("heat pump")) equipmentIds.push("EQ002");
  if (hasRooftop) equipmentIds.push("EQ007");
  if (lower.includes("package")) equipmentIds.push("EQ008");
  if (hasMiniSplit) {
    // (x2) or higher with no other systems → multi-zone unit; otherwise single
    const useMultiZone = !lower.includes("dual zone") && multiplier > 1;
    equipmentIds.push(useMultiZone ? "EQ006" : "EQ005");
  }

  return { equipmentIds, multiplier, hasMiniSplit, hasRooftop };
}

export function getQuickEstimate(customer: Customer): Estimate {
  const age = customer.systemAge ?? 0;
  const systemType = customer.systemType ?? "";

  const diagRate = getLaborRate("diagnostic", "standard")!;
  const repairRate = getLaborRate("repair", "minor")!;
  const part = getAgeTierPart(age, systemType);

  const diagCost = laborCost(diagRate);
  const repairCost = laborCost(repairRate);
  const partCost = getEquipmentCost(part);

  const items: LineItem[] = [
    {
      description: `Diagnostic labor (${diagRate.estimatedHours.min}–${diagRate.estimatedHours.max} hrs @ $${diagRate.hourlyRate}/hr)`,
      cost: diagCost,
    },
    {
      description: `Repair labor (${repairRate.estimatedHours.min}–${repairRate.estimatedHours.max} hrs @ $${repairRate.hourlyRate}/hr)`,
      cost: repairCost,
    },
    { description: part.name, cost: partCost },
  ];

  return {
    label: "Quick & Simple",
    total: items.reduce((sum, i) => sum + i.cost, 0),
    items,
  };
}

export function getFullSystemEstimate(customer: Customer): Estimate {
  const systemType = customer.systemType ?? "";
  const propertyType =
    ("propertyType" in customer ? customer.propertyType : null) ??
    ("property_type" in customer ? (customer as { property_type?: string }).property_type : null) ??
    "residential";

  const parsed = parseSystemType(systemType);
  const thermostat = equipmentData.find((e) => e.id === "EQ016")!;

  const items: LineItem[] = [];

  for (const eqId of parsed.equipmentIds) {
    const eq = equipmentData.find((e) => e.id === eqId)!;
    const unitCost = getEquipmentCost(eq);
    const qty = parsed.hasRooftop && eqId === "EQ007" ? parsed.multiplier : 1;
    const label = qty > 1 ? `${eq.name} ×${qty}` : eq.name;
    items.push({ description: label, cost: unitCost * qty });
  }

  items.push({ description: thermostat.name, cost: getEquipmentCost(thermostat) });

  let installRate: LaborRate | undefined;
  if (parsed.hasMiniSplit && parsed.equipmentIds.length === 1) {
    installRate = getLaborRate("install", "mini-split");
  } else if (propertyType === "commercial") {
    installRate = getLaborRate("install", "commercial");
  } else {
    installRate = getLaborRate("install", "residential");
  }

  const install = installRate ?? getLaborRate("install", "residential")!;
  items.push({
    description: `Installation labor (${install.estimatedHours.min}–${install.estimatedHours.max} hrs @ $${install.hourlyRate}/hr)`,
    cost: laborCost(install),
  });

  return {
    label: "Full System Replacement",
    total: items.reduce((sum, i) => sum + i.cost, 0),
    items,
  };
}
