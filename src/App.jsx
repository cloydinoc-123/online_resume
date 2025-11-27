import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import About from "./components/About"
import Projects from "./components/Projects"
import Skills from "./components/Skills"
import Contact from "./components/Contact"
import CPUScheduling from "./components/CPUScheduling"
import "./App.css"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<About />} />
        <Route path="projects" element={<Projects />} />
        <Route path="skills" element={<Skills />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cpu-scheduling" element={<CPUScheduling />} />
      </Route>
    </Routes>
  )
}