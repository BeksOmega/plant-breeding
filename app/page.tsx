"use client";

import Plant from "./components/Plant";
import PlantCollection from "./components/PlantCollection";
import Cabbage from "./components/Cabbage";
import { PlantGenetics } from "./types/genetics";

export default function Home() {
  const samplePlants = [
    { id: "1", color: "#4ade80" },
    { id: "2", color: "#60a5fa" },
    { id: "3", color: "#f472b6" },
    { id: "4", color: "#fbbf24" },
    { id: "5", color: "#a78bfa" },
    { id: "6", color: "#34d399" },
    { id: "7", color: "#f87171" },
    { id: "8", color: "#fb923c" },
    { id: "9", color: "#c084fc" },
    { id: "10", color: "#22d3ee" },
  ];

  const sampleCabbages = [
    { id: "c1", genetics: { allele1: false, allele2: false } }, // RR
    { id: "c2", genetics: { allele1: false, allele2: true } }, // Rr
    { id: "c3", genetics: { allele1: true, allele2: false } }, // rR
    { id: "c4", genetics: { allele1: true, allele2: true } }, // rr
    { id: "c5", genetics: { allele1: false, allele2: false } }, // RR
    { id: "c6", genetics: { allele1: false, allele2: true } }, // Rr
    { id: "c7", genetics: { allele1: true, allele2: true } }, // rr
    { id: "c8", genetics: { allele1: false, allele2: false } }, // RR
  ];
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Plant Breeding
          </h1>

          {/* Cabbage Genetics Demo */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12 mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Cabbage Genetics
            </h2>
            <p className="text-gray-600 mb-6">
              Mendelian genetics: Purple (recessive) only shows when both
              alleles are recessive (rr). Green (dominant) shows when at least
              one dominant allele is present (RR or Rr). Select up to 2
              cabbages.
            </p>
            <PlantCollection
              items={sampleCabbages}
              maxSelected={2}
              renderItem={(cabbage, isSelected, onSelect) => (
                <Cabbage
                  genetics={cabbage.genetics}
                  size={100}
                  isSelected={isSelected}
                  onSelect={onSelect}
                />
              )}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
