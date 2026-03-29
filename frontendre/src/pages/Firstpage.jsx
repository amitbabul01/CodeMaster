import { NavLink } from "react-router";
function Firstpage(){
    

   return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-200">

      {/* NAVBAR */}
      <header className="backdrop-blur-lg bg-black/40 border-b border-white/10 sticky top-0 z-50">
        <nav className="flex items-center justify-between px-8 py-4">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            CodeMaster
          </h1>

          <div className="flex gap-6">
            <button className="hover:text-red-400 transition">Course</button>
            <button className="hover:text-red-400 transition">Leaderboard</button>

            <NavLink to="/signup">
              <button className="px-5 py-2 bg-red-600 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-900/30">
                Login
              </button>
            </NavLink>

          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="px-6 md:px-20 py-24 text-center">
        
        <h2 className="text-6xl font-bold leading-tight opacity-90 animate-fadeIn">
          Build Your  
          <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            {" "}Problem-Solving  
          </span>
          Superpowers.
        </h2>

        <p className="mt-6 text-lg text-gray-400 max-w-3xl mx-auto animate-slideUp opacity-80">
          A beautifully modern platform to practice DSA, improve logic,
          and become the best version of your coding-self — 
          designed for developers who love minimal, premium UI.
        </p>

        <NavLink to="/Homepage">
        <button className="btn mt-10 bg-gradient-to-r from-red-600 to-orange-500 border-none text-white px-10 py-3 rounded-xl hover:opacity-80 transition transform hover:scale-105 shadow-xl shadow-red-900/40">
          Start Solving
        </button>
        </NavLink>

        <div className="mt-16 flex justify-center">
          <img
            src="https://www.shutterstock.com/image-vector/friendly-robot-digital-charts-icons-260nw-2416321991.jpg"
            className="rounded-2xl w-full max-w-4xl shadow-[0_0_50px_rgba(255,0,0,0.15)] hover:scale-[1.02] transition"
          />
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="px-6 md:px-20 py-28">
        <h3 className="text-4xl font-bold text-center mb-16">
          Why developers love  
          <span className="text-red-500"> CodeMaster</span>
        </h3>

        <div className="grid md:grid-cols-3 gap-10">

          {/* Card 1 */}
          <div className="p-8 rounded-2xl bg-white/[0.05] backdrop-blur-lg border border-white/10
            hover:border-red-500/40 transition hover:-translate-y-2 duration-300">
            <h4 className="text-xl font-semibold mb-3">⚡ Beautiful UI</h4>
            <p className="text-gray-400">Designed like a modern SaaS product — smooth, elegant, distraction-free.</p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl bg-white/[0.05] backdrop-blur-lg border border-white/10
            hover:border-red-500/40 transition hover:-translate-y-2 duration-300">
            <h4 className="text-xl font-semibold mb-3">🧠 Smart Practice</h4>
            <p className="text-gray-400">Topic-wise patterns, difficulty levels, and intelligent progress tracking.</p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl bg-white/[0.05] backdrop-blur-lg border border-white/10
            hover:border-red-500/40 transition hover:-translate-y-2 duration-300">
            <h4 className="text-xl font-semibold mb-3">🚀 Real Growth</h4>
            <p className="text-gray-400">Build habits, solve daily, and watch your skill curve explode upward.</p>
          </div>

        </div>
      </section>

      {/* MODERN INFO SECTION */}
      <section className="px-6 md:px-20 py-20 flex flex-col md:flex-row gap-14 items-center">

        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/web-development-3455042-2918528.png"
          className="w-full md:w-1/2 rounded-2xl shadow-[0_0_50px_rgba(255,0,0,0.12)]"
        />

        <div className="md:w-1/2">
          <h3 className="text-4xl font-bold mb-4 leading-snug">
            A platform built for  
            <span className="text-red-500"> modern developers</span>
          </h3>

          <p className="text-gray-400 text-lg leading-relaxed">
            Everything here is built with love for design + performance.
            From animations to problem layouts, every pixel is crafted for clarity,
            focus, and premium feel.
          </p>

          <ul className="mt-6 space-y-3 text-gray-300">
            <li>✔ Minimal, modern animations</li>
            <li>✔ Clean coded experience</li>
            <li>✔ Progress you can feel</li>
            <li>✔ No clutter. Only growth.</li>
          </ul>
        </div>

      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center bg-gradient-to-r from-red-600 to-orange-500">
        <h3 className="text-5xl font-extrabold text-black">
          Level Up Your Coding Journey
        </h3>
        <p className="mt-4 text-black/80 text-lg">Join thousands of developers building a better future.</p>

        <NavLink to="/Homepage">
          <button className="btn mt-6 bg-black text-white px-10 py-3 rounded-xl hover:opacity-80 hover:scale-105 transition">
            Get Started Now
          </button>
        </NavLink>

      </section>

      {/* FOOTER */}
      <footer className="footer p-10 bg-black border-t border-white/10 mt-20 text-gray-400">
        <nav>
          <h6 className="footer-title text-white">Explore</h6>
          <a className="link link-hover">Problems</a>
          <a className="link link-hover">Roadmaps</a>
        </nav>

        <nav>
          <h6 className="footer-title text-white">Company</h6>
          <a className="link link-hover">About</a>
          <a className="link link-hover">Contact</a>
        </nav>
      </footer>

    </div>
  );


    
}
export default Firstpage;


  