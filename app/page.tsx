import Plant from "./components/Plant";
import PlantCollection from "./components/PlantCollection";

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
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Plant Breeding
          </h1>

          {/* Plant Collection Demo */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12 mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Plant Collection
            </h2>
            <p className="text-gray-600 mb-6">
              Select up to 3 plants. When you select more, the first selected
              will be deselected.
            </p>
            <PlantCollection plants={samplePlants} maxSelected={3} />
          </div>
        </div>
      </div>
    </main>
  );
}
