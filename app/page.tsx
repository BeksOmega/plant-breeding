export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Plant Breeding
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Welcome to your Next.js website deployed on GitHub Pages
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Getting Started
            </h2>
            <p className="text-gray-600 mb-6">
              This is a simple Next.js website configured for GitHub Pages deployment.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="p-6 bg-green-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  🚀 Fast
                </h3>
                <p className="text-gray-600">
                  Built with Next.js for optimal performance
                </p>
              </div>
              <div className="p-6 bg-emerald-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  📦 Static
                </h3>
                <p className="text-gray-600">
                  Fully static export for GitHub Pages
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

