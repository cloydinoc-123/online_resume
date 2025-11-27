// src/components/Layout.jsx
import { Outlet, useLocation } from "react-router-dom"
import Header from "./Header"

export default function Layout() {
  const location = useLocation()

  // Add here any page you want to be FULL SCREEN (no navbar, no header)
  const fullScreenPages = ["/cpu-scheduling", "/contact"]

  const isFullScreen = fullScreenPages.includes(location.pathname)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* ONLY show the beautiful centered navigation on normal pages */}
      {!isFullScreen && (
        <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-xl z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex justify-center items-center gap-20 flex-wrap">
              {[
                { to: "/", label: "About" },
                { to: "/projects", label: "Projects" },
                { to: "/skills", label: "Skills" },
                { to: "/contact", label: "Contact" },
                { to: "/cpu-scheduling", label: "CPU Scheduling" }
              ].map((item) => (
                <a
                  key={item.to}
                  href={item.to}
                  className={`relative text-2xl font-semibold tracking-wide transition-all duration-500 group
                    ${location.pathname === item.to ? "text-blue-600 font-bold" : "text-gray-700 hover:text-gray-900"}
                  `}
                >
                  {item.label}
                  <span className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1 rounded-full transition-all duration-500
                    ${location.pathname === item.to 
                      ? "w-16 bg-gradient-to-r from-blue-500 to-cyan-500" 
                      : "w-0 group-hover:w-16 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-cyan-500"
                    }`}
                  />
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Header only on normal pages */}
      {!isFullScreen && (
        <div className="pt-40">
          <Header />
        </div>
      )}

      {/* Main content */}
      <main className={isFullScreen ? "" : "max-w-5xl mx-auto px-8 py-16"}>
        <Outlet />
      </main>

      {/* Back to top button only on normal pages */}
      {!isFullScreen && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-10 right-10 w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center text-3xl hover:scale-110 z-50"
        >
          Up
        </button>
      )}
    </div>
  )
}