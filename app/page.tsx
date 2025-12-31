import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          {/* Network lines effect */}
          <div className="absolute bottom-0 left-0 right-0 h-96 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 1200 400" fill="none">
              <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f7931a" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f7931a" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* Network dots and lines */}
              {[...Array(20)].map((_, i) => (
                <circle
                  key={i}
                  cx={100 + (i * 60) % 1100}
                  cy={100 + (i * 40) % 300}
                  r="3"
                  fill="#f7931a"
                  opacity="0.5"
                />
              ))}
              {[...Array(15)].map((_, i) => (
                <line
                  key={`line-${i}`}
                  x1={100 + (i * 80) % 1000}
                  y1={50 + (i * 30) % 350}
                  x2={200 + (i * 70) % 1100}
                  y2={100 + (i * 50) % 300}
                  stroke="#f7931a"
                  strokeWidth="1"
                  opacity="0.2"
                />
              ))}
            </svg>
          </div>
          {/* Gradient orb */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-tight mb-6">
                Hire credible talent from your local{' '}
                <span className="text-zinc-400">crypto community</span>
              </h1>
              
              <p className="text-lg text-zinc-400 mb-8">
                A curated network of vetted crypto-native talent for serious teams.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/onboarding/seeker">
                  <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-orange-500/25">
                    Create profile
                  </button>
                </Link>
                <Link href="/seekers">
                  <button className="px-8 py-3 text-zinc-300 hover:text-white font-medium transition-colors flex items-center gap-2">
                    I'm hiring talent
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>

            {/* Right content - Featured image card */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Floating Bitcoin icons */}
                <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center animate-pulse">
                  <span className="text-2xl">₿</span>
                </div>
                <div className="absolute top-1/4 -left-12 w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <span className="text-xl text-orange-400">₿</span>
                </div>
                <div className="absolute bottom-1/4 -right-6 w-10 h-10 rounded-full bg-orange-500/15 flex items-center justify-center">
                  <span className="text-lg text-orange-300">₿</span>
                </div>
                
                {/* Main image */}
                <Image
                  src="/hero-image.png"
                  alt="Crypto talent"
                  width={320}
                  height={384}
                  className="rounded-2xl shadow-2xl"
                  priority
                />
                
                {/* Caption */}
                <p className="text-center mt-4 text-orange-400 text-4xl font-bold">You're hired</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center mb-6">
                <div className="relative">
                  <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-orange-500 flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Wallet-Based Identity</h3>
              <p className="text-zinc-400">
                Sign up with your wallet. No email required.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center mb-6">
                <div className="relative flex items-center">
                  <div className="w-8 h-6 rounded bg-zinc-700 flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Direct Contact</h3>
              <p className="text-zinc-400">
                Connect directly with talent. No recruiters. No middlemen.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Proof of Work</h3>
              <p className="text-zinc-400">
                See endorsements and on-chain history from other crypto builders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-t border-zinc-800/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-white text-center mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Create Your Profile</h3>
              <p className="text-zinc-400 text-sm">
                Connect your wallet and fill in your skills, experience, and contact info.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Get Endorsed</h3>
              <p className="text-zinc-400 text-sm">
                Ask colleagues and collaborators to vouch for your work.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Get Hired</h3>
              <p className="text-zinc-400 text-sm">
                Companies reach out directly via Telegram. No spam, no games.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Ready to join the network?
            </h2>
            <p className="text-zinc-400 mb-8">
              Whether you're looking for your next role or your next hire, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding/seeker">
                <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-orange-500/25">
                  Create profile
                </button>
              </Link>
              <Link href="/seekers">
                <button className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors border border-zinc-700">
                  Browse talent
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-800/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center">
                <span className="text-orange-400 font-bold">Y</span>
              </div>
              <span className="font-semibold text-white">Yalla Jobs</span>
            </div>
            <p className="text-sm text-zinc-500">
              Built for the crypto community • Powered by Yalla Bitcoin
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
