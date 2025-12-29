/**
 * Configuration file for all game timings and prices
 * Modify values here to adjust game balance
 */

export const CONFIG = {
  // Game goal
  targetMoney: 100,

  // Shop prices (purchase costs)
  prices: {
    extraPot: 10,
    mutagen: 1,
    autoBreeder: 25,
    autoPlanter: 20,
  },

  // Catalog prices (sell prices)
  sellPrices: {
    greenCabbage: 2,
    purpleCabbage: 10,
  },

  // Plant growth timings (in milliseconds)
  growthTimings: {
    slow: 10000, // 10 seconds - dominant trait (SS)
    fast: 3000, // 3 seconds - recessive trait (ss)
  },

  // Auto breeder timing (in milliseconds)
  autoBreeder: {
    breedingInterval: 2000, // 2 seconds between breeding cycles
  },

  // Animation update intervals (in milliseconds)
  animation: {
    growthUpdateInterval: 100, // Update growth progress every 100ms
    breedingUpdateInterval: 100, // Update breeding progress every 100ms
  },
} as const;
