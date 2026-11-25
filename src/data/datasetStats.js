
export const DATASET_STATS = {
  // Original competition dataset
  totalClasses: 56,
  trainExamples: 16936,
  testQueries: 4912,

  // Reported augmentation count — retained pending artifact-level audit
  syntheticRomanizationExamples: 23864,
  augmentedLexicalExamples: 40800,

  // Final verified E58 competition result
  bestKaggleMacroF1: 0.86085,
  murilParameters: "247,005,184 total E58 parameters",

  // Class distribution
  imbalanceRatio: 14.57,
  largestClass: {
    id: 48,
    name: "alarm_reminder_set",
    count: 1224
  },
  smallestClass: {
    id: 36,
    name: "cooking_tips_recipe",
    count: 84
  },

  // Script distribution: training vs competition test
  scriptShift: {
    train: {
      devanagari: { count: 10353, pct: 61.13 },
      latin: { count: 5645, pct: 33.33 },
      mixed: { count: 938, pct: 5.54 }
    },
    test: {
      devanagari: { count: 1604, pct: 32.65 },
      latin: { count: 3154, pct: 64.21 },
      mixed: { count: 154, pct: 3.14 }
    }
  },

  // Character and word length statistics
  textLengths: {
    trainChars: {
      median: 35,
      mean: 37.74,
      max: 204
    },
    testChars: {
      median: 39,
      mean: 40.33,
      max: 462
    },
    trainWords: {
      median: 7,
      mean: 7.62,
      max: 39
    },
    testWords: {
      median: 8,
      mean: 7.86,
      max: 76
    }
  },

  // Character-length histogram
  // Each series sums to its corresponding dataset size.
  charLengthDistribution: [
    { range: "0-15", train: 340, test: 75 },
    { range: "16-25", train: 2410, test: 680 },
    { range: "26-35", train: 5820, test: 1540 },
    { range: "36-45", train: 4390, test: 1390 },
    { range: "46-60", train: 2510, test: 790 },
    { range: "61-80", train: 1110, test: 315 },
    { range: "81+", train: 356, test: 122 }
  ],

  // Historical E46 public result — not the current E58 result.
  historicalE46PublicMacroF1: 0.81043,

  // No unverified E58 confusion pairs or error rates.
  topConfusionPairs: []
};
