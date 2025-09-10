import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">HardMoney Pro</h1>
            <div className="space-x-4">
              <button className="text-gray-600 hover:text-blue-600">About</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Hard Money Lending
          <span className="text-blue-600"> Made Simple</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Fast, reliable funding for real estate investors. Get approved in 24 hours 
          and close in 7 days with competitive rates and flexible terms.
        </p>
        <div className="space-x-4">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-blue-700">
            Apply for Loan
          </button>
          <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg hover:bg-blue-50">
            Become Investor
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">$500M+</div>
              <div className="text-blue-200">Loans Funded</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2,500+</div>
              <div className="text-blue-200">Happy Borrowers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">7 Days</div>
              <div className="text-blue-200">Average Close</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">12%</div>
              <div className="text-blue-200">Starting Rates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-4">Fast Approval</h3>
            <p className="text-gray-600">Get approved in 24 hours with our streamlined process</p>
          </div>
          <div className="text-center p-8 bg-white rounded-xl shadow-lg">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-4">Competitive Rates</h3>
            <p className="text-gray-600">Starting at 12% with flexible terms and no prepayment penalties</p>
          </div>
          <div className="text-center p-8 bg-white rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-xl font-bold mb-4">All Property Types</h3>
            <p className="text-gray-600">Fix & flip, buy & hold, construction, and commercial properties</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-gray-300 mb-6">Contact us today for a free consultation</p>
          <div className="space-x-4">
            <span className="text-blue-400">📞 (555) 123-4567</span>
            <span className="text-blue-400">✉️ info@hardmoneypro.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}