"use client";

import Surface from "./Surface";
import Button from "./controls/Button";
import Heading from "./typography/Heading";
import Text from "./typography/Text";
import { PlantType } from "../types/seed";
import { PLANT_PRICES, POT_PRICE, ROCKET_TICKET_PRICE } from "../utils/prices";
import clsx from "clsx";

interface ShopProps {
  /** Current balance */
  balance: number;
  /** Callback when purchasing a pot */
  onBuyPot?: () => void;
  /** Callback when purchasing a rocket ticket */
  onBuyRocketTicket?: () => void;
  /** Whether the player already has a rocket ticket */
  hasRocketTicket?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Shop component - displays a shop interface with a plant catalog
 * and a section to buy items (pots).
 */
export default function Shop({
  balance,
  onBuyPot,
  onBuyRocketTicket,
  hasRocketTicket = false,
  className,
}: ShopProps) {
  const canAffordPot = balance >= POT_PRICE;
  const canAffordTicket = balance >= ROCKET_TICKET_PRICE && !hasRocketTicket;

  return (
    <Surface shadow="lg" className={clsx("p-4 space-y-6", className)}>
      {/* Plant Catalog Section */}
      <div>
        <Heading as="h5">Seller's Catalog</Heading>
        <div className="mt-2 space-y-2">
          {PLANT_PRICES.map((item) => (
            <div key={item.plantType} className="space-y-1">
              {/* Main plant type */}
              <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                <Text className="font-semibold">{item.name}</Text>
                <Text className="text-sm text-gray-600 text-right">
                  {item.basePrice} credits
                </Text>
              </div>
              {/* Variants */}
              {item.variants && item.variants.length > 0 && (
                <div className="ml-4 space-y-1">
                  {item.variants.map((variant) => (
                    <div
                      key={variant.variantId}
                      className="grid grid-cols-[1fr_auto] items-center gap-4"
                    >
                      <Text className="text-sm font-medium text-gray-700">
                        {variant.name}
                      </Text>
                      <Text className="text-sm text-gray-600 text-right">
                        {variant.price} credits
                      </Text>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Buy Section */}
      <div>
        <Heading as="h5">Buy Items</Heading>
        <div className="mt-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Text className="font-semibold">Specimen pot</Text>
              <Text className="text-sm text-gray-600">{POT_PRICE} credits</Text>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={onBuyPot}
              disabled={!canAffordPot}
              className="px-4"
            >
              Buy
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Text className="font-semibold">Ticket off this rock</Text>
              <Text className="text-sm text-gray-600">
                {ROCKET_TICKET_PRICE} credits
              </Text>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={onBuyRocketTicket}
              disabled={!canAffordTicket || hasRocketTicket}
              className="px-4"
            >
              Buy
            </Button>
          </div>
        </div>
      </div>

      {/* Balance Display */}
      <div>
        <Text className="text-center font-bold text-lg">
          Balance: {balance} credits
        </Text>
      </div>
    </Surface>
  );
}
