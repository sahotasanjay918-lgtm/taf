/**
 * About.tsx — the About page.
 *
 * The copy here is taken directly from your Figma design. If you
 * ever want to change the wording, it all lives right here in
 * one place — no need to touch any other file.
 */
import NavBar from "../components/NavBar";
import Board from "../components/Board";
import { createInitialBoard } from "../game/board";
import "./About.css";

export default function About() {
  return (
    <div className="taf-about">
      <NavBar />

      <main className="taf-about__content">
        <h1 className="taf-about__title">About TAF!</h1>

        <div className="taf-about__board">
          <Board board={createInitialBoard()} interactive={false} />
        </div>

        <div className="taf-about__body">
          <p>Hi!</p>
          <p>
            If you're here, welcome to TAF! This site is a place to play
            Hnefetafl, or 'viking chess' as it's been dubbed.
          </p>
          <p>
            The aim I had when doing this project was to bring Hnefetafl up
            to speed with more modern game design philosophies, whilst
            still maintaining the core essence of the game. And, of
            course, also trying to keep it fun to play!
          </p>
          <p>
            Feel free to give feedback if you get a second, using the
            'Contact' option on the site menu. It's totally optional, but
            it would help me if you put the subject line as 'feedback',
            thanks!
          </p>
          <p>
            If you want to learn more about Hnefetafl the game itself, here
            is a great website to do so, it's the one I used when getting
            to grips with the game itself:
          </p>
          <p>
            <a
              href="http://tafl.cyningstan.com/"
              target="_blank"
              rel="noreferrer"
            >
              http://tafl.cyningstan.com/
            </a>
          </p>
          <p>
            The plan is to expand on this section a bit later. Maybe get a
            bit more into about Hnefetafl itself. I dunno; let's see.
          </p>
          <p>Hope you have fun playing!</p>
          <p>Sanj</p>
        </div>
      </main>
    </div>
  );
}
