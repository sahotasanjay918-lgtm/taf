/**
 * App.tsx — the root of the application.
 *
 * This file's only job is "routing": deciding which page
 * component to show based on the URL. Think of it as a
 * signpost, not a page itself.
 *
 *   "/"          -> Home
 *   "/pick-side" -> PickASide
 *   "/game"      -> Game (the board itself)
 *   "/about"     -> About
 *   "/contact"   -> Contact
 *
 * Each page lives in its own file inside src/pages/, so you
 * (or I) can find and change one page without touching any
 * of the others.
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PickASide from "./pages/PickASide";
import Game from "./pages/Game";
import About from "./pages/About";
import Contact from "./pages/Contact";
import TutorialPopups from "./components/TutorialPopups";
import PageViewTracker from "./components/PageViewTracker";

export default function App() {
  return (
    <BrowserRouter>
      <PageViewTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pick-side" element={<PickASide />} />
        <Route path="/game" element={<Game />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      {/* Mounted once, outside the page routes, so the tutorial can
          be opened from Home, Game, or the site menu and always
          shows the same popup on top of whichever page you're on. */}
      <TutorialPopups />
    </BrowserRouter>
  );
}
