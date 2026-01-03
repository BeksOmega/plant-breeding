"use client";

import { useEffect, useState } from "react";
import { Plant, Selectable } from "./Plant";
import { PlantGenetics } from "../../types/genetics";
import { PlantType } from "../../types/seed";
import { calculateGrowthTime } from "../../utils/plants";
import ProgressBar from "../controls/ProgressBar";

interface UmbelProps extends Plant, Selectable {}

interface ParsedGenetics {
  flowerColor: string;
  growthTimeMs: number;
}

/**
 * Parses plant genetics and returns the phenotypic values.
 */
function parseGenetics(genetics: PlantGenetics): ParsedGenetics {
  // Check if both chromosomes have true at index 0 (recessive trait)
  const hasRecessiveFlowerColor =
    genetics.chromosome1[0] === true && genetics.chromosome2[0] === true;
  const flowerColor = hasRecessiveFlowerColor ? "#C281E8" : "#C9F3E8";

  // Calculate growth time based on genetics
  const growthTimeMs = calculateGrowthTime(
    PlantType.Umbel,
    genetics
  );

  return {
    flowerColor,
    growthTimeMs,
  };
}

/**
 * Umbel component - displays an umbel plant.
 * Implements the Plant interface with inlined optimized SVG.
 */
export default function Umbel({
  genetics,
  showGenotype,
  startGrowingAt,
  onFullyGrown,
  isSelected,
  onSelect,
}: UmbelProps) {
  const parsedGenetics = parseGenetics(genetics);
  const [isFullyGrown, setIsFullyGrown] = useState(!startGrowingAt);
  const [growthProgress, setGrowthProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  // Track growth progress and completion
  useEffect(() => {
    if (!startGrowingAt) {
      setGrowthProgress(0);
      setRemainingTime(0);
      return;
    }

    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - startGrowingAt;
      const growthTime = parsedGenetics.growthTimeMs;
      const progress = Math.min(100, (elapsed / growthTime) * 100);
      const remaining = Math.max(0, (growthTime - elapsed) / 1000);

      setGrowthProgress(progress);
      setRemainingTime(remaining);

      if (elapsed >= growthTime && !isFullyGrown) {
        setIsFullyGrown(true);
        onFullyGrown?.();
      }
    };

    // Update immediately
    updateProgress();

    // Update every 100ms for smooth animation
    const interval = setInterval(updateProgress, 100);

    return () => clearInterval(interval);
  }, [startGrowingAt, onFullyGrown, isFullyGrown, parsedGenetics.growthTimeMs]);

  const isGrowing = startGrowingAt !== undefined && !isFullyGrown;

  return (
    <div
      className="relative w-full h-full"
      onClick={() => onSelect?.(!isSelected)}
      style={
        {
          cursor: onSelect ? "pointer" : "default",
          "--umbel-flower": parsedGenetics.flowerColor,
          "--umbel-stem": "#26AD89",
          "--umbel-stroke": "var(--umbel-stem)",
          "--umbel-stem-highlight":
            "oklch(from var(--umbel-stem) calc(l + 0.1) c h)",
          "--umbel-stem-base": "#26AD89",
          "--umbel-big-flower":
            "oklch(from var(--umbel-flower) calc(l + 0.2) c h)",
          "--umbel-big-flower-accent":
            "oklch(from var(--umbel-flower) calc(l - 0.1) c h)",
          "--umbel-small-flower": "var(--umbel-flower)",
          "--umbel-xsmall-flower":
            "oklch(from var(--umbel-flower) calc(l - 0.2) c h)",
        } as React.CSSProperties
      }
    >
      {isFullyGrown && (
        <svg
        width="400"
        height="400"
        viewBox="0 0 105.83333 105.83333"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        className="absolute top-0 w-full h-auto aspect-square"
        aria-label="Umbel plant"
      >
        <g
          className="plant"
          transform="matrix(0.83959605,0,0,0.79295107,-17.436809,17.398633)"
        >
          <g className="sepal" transform="translate(45.588581,-0.90533924)">
            <path
              style={{
                fill: "none",
                fillOpacity: 1,
                stroke: "var(--umbel-stroke)",
                strokeWidth: 1.5,
                strokeDasharray: "none",
                strokeOpacity: 1,
              }}
              d="M 39.72,40.55 16.75,17.31"
            />
            <path
              style={{
                display: "inline",
                fill: "none",
                fillOpacity: 1,
                stroke: "var(--umbel-stroke)",
                strokeWidth: 1.5,
                strokeDasharray: "none",
                strokeOpacity: 1,
              }}
              d="M 105.7,15.73 85.05,39.25"
              transform="translate(-45.588582,0.90533925)"
            />
            <path
              style={{
                display: "inline",
                fill: "none",
                fillOpacity: 1,
                stroke: "var(--umbel-stroke)",
                strokeWidth: 1.5,
                strokeDasharray: "none",
                strokeOpacity: 1,
              }}
              d="m 84.52,40.13 v 0 l 0.94,-27.43"
              transform="translate(-45.588582,0.90533925)"
            />
          </g>
          <g
            id="layer2"
            className="head"
            transform="translate(45.568743,-7.5444937)"
          >
            <g className="stems">
              <path
                style={{
                  fill: "none",
                  fillOpacity: 1,
                  stroke: "var(--umbel-stroke)",
                  strokeWidth: 1.5,
                  strokeDasharray: "none",
                  strokeOpacity: 1,
                }}
                d="m 26.59,11.91 13.35,8.3 13.55,-8.43"
              />
            </g>
            <g className="flowers">
              <g className="big">
                <path
                  style={{
                    fill: "var(--umbel-big-flower)",
                    fillOpacity: 1,
                  }}
                  d="m 23.65,12.06 9.67,1.83 H 46.67 L 56.12,12.12 48.22,7.45 39.93,6.08 32.54,7.42 Z"
                />
                <path
                  style={{
                    fill: "var(--umbel-big-flower-accent)",
                    fillOpacity: 1,
                  }}
                  d="M 30.93,8.66 38.12,6.92 35.2,10.94 Z"
                />
                <path
                  style={{
                    fill: "var(--umbel-big-flower-accent)",
                    fillOpacity: 1,
                  }}
                  d="M 41.03,9.16 43.97,6.7 38.62,6.67 Z"
                />
              </g>
              <g className="small">
                <path
                  style={{
                    fill: "var(--umbel-small-flower)",
                    fillOpacity: 1,
                  }}
                  d="m 26.97,9.99 2.96,4.29 -5.88,0.03 z"
                />
                <path
                  style={{
                    fill: "var(--umbel-small-flower)",
                    fillOpacity: 1,
                  }}
                  d="M 28.68,7.7 29.06,9.96 26.41,9.66 Z"
                />
                <path
                  style={{
                    fill: "var(--umbel-small-flower)",
                    fillOpacity: 1,
                  }}
                  d="m 28.12,12.08 2.27,-3.36 2.44,3.31 z"
                />
                <path
                  style={{
                    fill: "var(--umbel-small-flower)",
                    fillOpacity: 1,
                  }}
                  d="m 30.03,14.86 v 0 l 2.86,-4.16 2.91,4.16 z"
                />
                <path
                  style={{
                    fill: "var(--umbel-small-flower)",
                    fillOpacity: 1,
                  }}
                  d="m 33,11.49 2.06,-3 2.18,2.94 z"
                />
                <path
                  style={{
                    fill: "var(--umbel-small-flower)",
                    fillOpacity: 1,
                  }}
                  d="m 34.93,13.19 2.81,-4.19 3.15,4.18 z"
                />
                <path
                  style={{
                    fill: "var(--umbel-small-flower)",
                    fillOpacity: 1,
                  }}
                  d="m 38.11,14.67 v 0 l 2.89,-4.29 2.91,4.21 z"
                />
                <path
                  style={{
                    fill: "var(--umbel-small-flower)",
                    fillOpacity: 1,
                  }}
                  d="m 41.69,11.15 2.12,-2.88 2.17,2.89 c 0,0 -8.58,-0.03 -4.29,-0.02 z"
                />
                <path
                  style={{
                    fill: "var(--umbel-small-flower)",
                    fillOpacity: 1,
                  }}
                  d="m 43.52,15.25 v 0 l 2.88,-4.21 2.96,4.26 c 0,0 -11.66,-0.1 -5.83,-0.05 z"
                />
                <path
                  style={{
                    fill: "var(--umbel-small-flower)",
                    fillOpacity: 1,
                  }}
                  d="m 47.52,12.29 2.27,-3.23 2.3,3.13 c 0,0 -9.13,0.19 -4.56,0.1 z"
                />
                <path
                  style={{
                    fill: "var(--umbel-small-flower)",
                    fillOpacity: 1,
                  }}
                  d="M 49.95,13.93 52.86,9.59 55.76,13.82 Z"
                />
                <path
                  style={{
                    fill: "var(--umbel-small-flower)",
                    fillOpacity: 1,
                  }}
                  d="m 49.51,9.3 v 0 l 0.18,-2.41 2.75,2.78 z"
                />
                <path
                  style={{
                    fill: "var(--umbel-small-flower)",
                    fillOpacity: 1,
                  }}
                  d="m 45.63,9.62 1.78,-2.35 1.9,2.28 z"
                />
                <path
                  style={{
                    fill: "var(--umbel-small-flower)",
                    fillOpacity: 1,
                  }}
                  d="m 30.25,7.7 v 0 l 3,1.19 1.69,-2.83 z"
                />
                <path
                  style={{
                    fill: "var(--umbel-small-flower)",
                    fillOpacity: 1,
                  }}
                  d="m 35.52,5.82 2.18,1.98 2.17,-2.02 z"
                />
                <path
                  style={{
                    fill: "var(--umbel-small-flower)",
                    fillOpacity: 1,
                  }}
                  d="M 41.9,5.62 42.96,8.26 46.41,6.91 Z"
                />
              </g>
              <g className="xsmall">
                <path
                  style={{
                    fill: "var(--umbel-xsmall-flower)",
                    fillOpacity: 1,
                  }}
                  d="m 38.86,9.48 1.32,1.77 -2.72,0.05 z"
                />
                <path
                  style={{
                    fill: "var(--umbel-xsmall-flower)",
                    fillOpacity: 1,
                  }}
                  d="m 38.75,8.35 v 0 l 1.43,1.72 1.45,-1.75 z"
                />
                <path
                  style={{
                    fill: "var(--umbel-xsmall-flower)",
                    fillOpacity: 1,
                  }}
                  d="m 40.98,10.2 1.37,-1.85 1.62,1.74 z"
                />
              </g>
            </g>
          </g>
          <g
            className="stem"
            style={{
              display: "inline",
              fill: "var(--umbel-stem-highlight)",
            }}
          >
            <path
              style={{
                fill: "var(--umbel-stem-base)",
                fillOpacity: 1,
              }}
              d="m 77.02,95.44 h 16.33 l 1.16,15.87 h -20.04 z"
            />
            <path
              style={{
                fill: "var(--umbel-stem-base)",
                fillOpacity: 1,
              }}
              d="M 76.67,93.82 H 94.51 L 91.96,78.64 H 77.83 Z"
            />
            <path
              style={{
                fill: "var(--umbel-stem-base)",
                fillOpacity: 1,
              }}
              d="M 77.37,77.25 79.57,63.24 90.69,62.78 92.54,77.14 Z"
            />
            <path
              style={{
                fill: "var(--umbel-stem-base)",
                fillOpacity: 1,
              }}
              d="M 78.76,61.73 91.38,61.97 88.95,50.96 80.5,50.5 Z"
            />
            <path
              style={{
                fill: "var(--umbel-stem-base)",
                fillOpacity: 1,
              }}
              d="M 79.92,49.92 89.3,49.69 88.14,37.53 81.66,37.87 Z"
            />
            <path
              style={{
                fill: "var(--umbel-stem-highlight)",
                fillOpacity: 1,
              }}
              d="M 94.55,111.53 77.95,99.84 70.3,89.18 l 1.39,12.28 2.78,9.96 z"
            />
            <path
              style={{
                fill: "var(--umbel-stem-highlight)",
                fillOpacity: 1,
              }}
              d="m 76.62,93.87 14.65,-10.94 7.64,-11.23 -0.93,12.74 -3.37,9.35 z"
            />
            <path
              style={{
                fill: "var(--umbel-stem-highlight)",
                fillOpacity: 1,
              }}
              d="m 92.82,77.22 -13.48,-9.35 -6.37,-8.69 1.04,10.31 2.55,7.88 z"
            />
            <path
              style={{
                fill: "var(--umbel-stem-highlight)",
                fillOpacity: 1,
              }}
              d="m 78.73,61.72 10.8,-9.02 4.63,-7.53 -0.23,9.61 -2.17,7.19 z"
            />
            <path
              style={{
                fill: "var(--umbel-stem-highlight)",
                fillOpacity: 1,
              }}
              d="m 89.46,49.69 -8.27,-5.21 -3.24,-4.98 0.35,6.14 1.85,4.52 z"
            />
          </g>
          <use
            x="0"
            y="0"
            xlinkHref="#layer2"
            transform="translate(-23.23704,3.9231366)"
            style={{ display: "inline" }}
          />
          <use
            x="0"
            y="0"
            xlinkHref="#layer2"
            transform="translate(19.917463,3.3195773)"
            style={{ display: "inline" }}
          />
        </g>
        {showGenotype && (
          <text
            x="50%"
            y="95%"
            textAnchor="middle"
            className="text-xs fill-current"
            style={{ fontSize: "2px" }}
          >
            {JSON.stringify(genetics)}
          </text>
        )}
      </svg>
      )}
      {isGrowing && (
        <div className="absolute bottom-2 left-2 right-2 z-20 space-y-1">
          <div className="font-rajdhani text-xs text-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {remainingTime.toFixed(1)}s
          </div>
          <ProgressBar value={growthProgress} size="sm" />
        </div>
      )}
    </div>
  );
}
