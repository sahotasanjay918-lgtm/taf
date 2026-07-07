/**
 * Contact.tsx — the Contact page.
 *
 * Sends messages via Formspree — a free service that takes a
 * form submission and emails it to you, without needing any
 * backend/server code of your own (agreed on earlier).
 *
 * ⚠️ SETUP NEEDED (covered in the non-technical setup guide too):
 * The FORMSPREE_ENDPOINT below is a placeholder. Before this can
 * actually send you emails, you'll need to:
 *   1. Create a free account at https://formspree.io
 *   2. Create a new form, pointing at your email address
 *   3. Copy the form's endpoint URL it gives you
 *   4. Paste it in place of the placeholder below
 * Until that's done, submitting this form will show an error
 * message rather than silently failing.
 */
import { useState } from "react";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import { trackEvent } from "../hooks/analytics";
import "./Contact.css";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID_HERE";
const DEFAULT_SUBJECT = "hnefetafl - feedback";

type SubmitState = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  async function handleSend() {
    if (!message.trim()) return;
    setSubmitState("sending");

    const finalSubject = subject.trim() || DEFAULT_SUBJECT;

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ subject: finalSubject, message }),
      });

      if (!response.ok) throw new Error("Formspree responded with an error");

      trackEvent("contact_form_submitted");
      setSubmitState("sent");
      setSubject("");
      setMessage("");
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <div className="taf-contact">
      <NavBar />

      <main className="taf-contact__content">
        <h1 className="taf-contact__title">Contact</h1>

        <label className="taf-contact__label" htmlFor="subject">
          Subject line:
        </label>
        <input
          id="subject"
          className="taf-contact__input"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={DEFAULT_SUBJECT}
        />

        <label className="taf-contact__label" htmlFor="message">
          Message:
        </label>
        <textarea
          id="message"
          className="taf-contact__textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
        />

        <Button
          variant="solid"
          onClick={handleSend}
          disabled={!message.trim() || submitState === "sending"}
        >
          {submitState === "sending" ? "Sending…" : "Send"}
        </Button>

        {submitState === "sent" && (
          <p className="taf-contact__status taf-contact__status--success">
            Thanks — your message has been sent!
          </p>
        )}
        {submitState === "error" && (
          <p className="taf-contact__status taf-contact__status--error">
            Something went wrong sending that. Please try again shortly.
          </p>
        )}
      </main>
    </div>
  );
}
