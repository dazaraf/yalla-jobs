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

      {/* Three Blocks Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Create a Profile */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Create a Profile</h3>
              <p className="text-zinc-400">
                Sign up with your wallet and showcase your skills
              </p>
            </div>

            {/* Endorse a Friend */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Endorse a Friend</h3>
              <p className="text-zinc-400">
                Vouch for people you've worked with
              </p>
            </div>

            {/* Browse Candidates */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Browse Candidates</h3>
              <p className="text-zinc-400">
                Find vetted crypto-native talent
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor a Party Section */}
      <section className="py-20 border-t border-zinc-800/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-white text-center mb-6">
              Hired Someone From Our List? Sponsor A Yalla Bitcoin Party in TLV
            </h2>

            <p className="text-zinc-400 text-center mb-12 max-w-3xl mx-auto leading-relaxed">
              Yalla Bitcoin started in TLV as a community of Bitcoiners and crypto enthusiasts finding a safe space in each other to geek out over coins and have a good time. Our community is 600-strong and includes a mix of execs, operators and regular degens. Since 2021, we have hosted 1,000 people across a dozen events. Previous sponsors include Starkware, ZenGo, INX (acquired by Republic) and more.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative aspect-square overflow-hidden rounded-xl group">
                <Image
                  src="/party-1.jpg"
                  alt="Yalla Bitcoin Party"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-xl group">
                <Image
                  src="/party-2.jpg"
                  alt="Yalla Bitcoin Party"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-xl group">
                <Image
                  src="/party-3.jpg"
                  alt="Yalla Bitcoin Party"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-xl group">
                <Image
                  src="/party-4.jpg"
                  alt="Yalla Bitcoin Party"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
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
