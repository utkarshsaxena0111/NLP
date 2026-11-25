import taxonomyData from "./intentTaxonomy.json";

export const INTENT_TAXONOMY = taxonomyData;

export const INTENT_MAP = taxonomyData.reduce((acc, item) => {
  acc[item.id] = item;
  acc[item.name] = item;
  return acc;
}, {});

export const CATEGORIES = [
  "All",
  "Utilities",
  "Smart Home IoT",
  "Travel & Transport",
  "Media & Entertainment",
  "Communication & Social",
  "Food & Dining",
  "Finance",
  "Productivity & Lists",
  "Knowledge & Facts",
  "Chitchat",
  "Out of Scope"
];

export function getIntentById(id) {
  const numericId = Number(id);
  return INTENT_MAP[numericId] || {
    id: numericId,
    name: `intent_${numericId}`,
    displayName: `Intent Class ${numericId}`,
    category: "General",
    description: "Multi-class intent classification target",
    isOutOfScope: numericId === 55
  };
}

export function getIntentByName(name) {
  return INTENT_MAP[name] || null;
}
