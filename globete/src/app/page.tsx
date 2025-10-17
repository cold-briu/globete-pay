import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Globete Pay - Instant Crypto Payments in Colombia | cCOP & Mento Stablecoins",
  description: "Pay instantly in Colombia using crypto. Accept cCOP and Mento stablecoins with instant settlement via Bre-B infrastructure. No bank account required, low fees.",
  keywords: ["crypto payments", "Colombia", "cCOP", "Mento", "Bre-B", "stablecoins", "instant payments", "Celo"],
  openGraph: {
    title: "Globete Pay - Instant Crypto Payments in Colombia",
    description: "Seamless payment app for instant crypto transactions in Colombia using Bre-B infrastructure",
    type: "website",
  },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Globete Pay 🎈
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                How It Works
              </a>
              <a href="#benefits" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Benefits
              </a>
            </div>
            <Link
              href="/main"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium">
              🚀 Powered by Celo, Bre-B & Mento Protocol
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Pay Instantly in Colombia
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">with Crypto</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              A seamless payment app that lets you pay or transfer value using <strong>cCOP</strong> and <strong>Mento stablecoins</strong>,
              while settling transactions instantly over Colombia's <strong>Bre-B infrastructure</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/main"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Get Started Free
              </Link>
              <a
                href="#how-it-works"
                className="inline-block bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-lg px-10 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-200 border-2 border-gray-200 dark:border-gray-700"
              >
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">
                  &lt;1s
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Settlement Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400">
                  0%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Bank Fees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-pink-600 dark:text-pink-400">
                  24/7
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Availability</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                  100%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Decentralized</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Globete Pay?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience the future of payments with cutting-edge blockchain technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 dark:border-gray-700">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Instant Payments</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Settle transactions in under a second via Bre-B infrastructure. No waiting, no delays.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100 dark:border-gray-700">
              <div className="text-5xl mb-4">🌐</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">No Bank Required</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Pay without a bank account or complex off-ramp processes. True financial freedom.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-pink-100 dark:border-gray-700">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Ultra-Low Costs</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Avoid expensive off-ramp and international transfer fees. Keep more of your money.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100 dark:border-gray-700">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Secure & Private</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Built on Celo blockchain with enterprise-grade security. Your funds, your control.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-indigo-100 dark:border-gray-700">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Mobile-First</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Beautiful, intuitive interface designed for seamless mobile and desktop experience.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-yellow-100 dark:border-gray-700">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Cross-Border Ready</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Send and receive payments globally with stablecoins. No borders, no limits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Connect Wallet</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Connect your Celo-compatible wallet in seconds. No signup or KYC required.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Choose Payment</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Select cCOP or other Mento stablecoins. Enter amount and recipient details.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Instant Settlement</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Confirm and your payment settles instantly via Bre-B infrastructure. Done!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Built for the Future of Finance
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Globete Pay leverages the best of blockchain technology to provide a payment experience
                that's faster, cheaper, and more accessible than traditional banking.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-2xl mr-4">✅</span>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">Real-Time Settlement</h4>
                    <p className="text-gray-600 dark:text-gray-400">Transactions complete in under a second</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-4">✅</span>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">Stablecoin Powered</h4>
                    <p className="text-gray-600 dark:text-gray-400">No crypto volatility with cCOP and Mento tokens</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-4">✅</span>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">Financial Inclusion</h4>
                    <p className="text-gray-600 dark:text-gray-400">Banking for the unbanked and underbanked</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-4">✅</span>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">Open Source</h4>
                    <p className="text-gray-600 dark:text-gray-400">Transparent, auditable, and community-driven</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-12 shadow-2xl">
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Traditional Transfer</span>
                    <span className="text-red-600 font-bold">$15 fee</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">⏱️ 1-3 business days</div>
                </div>
                <div className="text-center text-3xl">⚡</div>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 shadow-lg text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span>Globete Pay</span>
                    <span className="font-bold">$0.01 fee</span>
                  </div>
                  <div className="text-blue-100 text-sm">⚡ Instant settlement</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Payments?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join the future of finance today. Start making instant, low-cost crypto payments in Colombia.
          </p>
          <Link
            href="/main"
            className="inline-block bg-white text-blue-600 font-bold text-lg px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
          >
            Launch Globete Pay Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Globete Pay 🎈
              </h3>
              <p className="text-gray-400 text-sm">
                Instant crypto payments for Colombia, powered by Celo and Bre-B.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#benefits" className="hover:text-white transition-colors">Benefits</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Technology</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="https://celo.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Celo</a></li>
                <li><a href="https://www.mento.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Mento Protocol</a></li>
                <li><span className="hover:text-white transition-colors">Bre-B</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="https://github.com/cold-briu/globete-pay" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 sm:mb-0">
              © 2025 Globete Pay. Powered by Celo • Bre-B • Mento Protocol
            </p>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
