import Link from "next/link";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="text-6xl sm:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Globete Pay 🎈
            </h1>
            <p className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Pay instantly in Colombia with crypto
            </p>
          </div>

          {/* Main Description */}
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            A seamless payment app that lets you pay or transfer value using cCOP or other Mento stablecoins,
            while settling transactions instantly over Colombia's Bre-B infrastructure.
          </p>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Instant Payments</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Settle transactions immediately via Bre-B
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">🌐</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">No Bank Required</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pay without a bank account or off-ramp
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Low Costs</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Avoid expensive off-ramp fees
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/main"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Launch App
          </Link>

          {/* Footer Info */}
          <div className="mt-12 text-sm text-gray-600 dark:text-gray-400">
            <p>Powered by Celo • Bre-B • Mento Protocol</p>
          </div>
        </div>
      </div>
    </div>
  );
}
