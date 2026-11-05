import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../../../lib/firebase";
import { ADMIN_EMAIL } from "../../../lib/firebaseConfig";
import { pageContent } from "../../../data/portfolioData";

const reasons = ["Freelance work", "Job opportunity", "Feedback"];
const blurb = pageContent.find((c) => c.id === "content-006")?.description;

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", reason: reasons[0], message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!isFirebaseConfigured) {
      // No database yet: open the visitor's email app so the message still reaches me.
      const body = `${form.message}\n\nFrom: ${form.name} (${form.email})`;
      window.location.href = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(form.reason)}&body=${encodeURIComponent(body)}`;
      return;
    }
    setStatus("sending");
    try {
      await addDoc(collection(db, "messages"), { ...form, createdAt: serverTimestamp() });
      setStatus("sent");
      setForm({ name: "", email: "", reason: reasons[0], message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="w-full max-w-3xl px-4 py-16 scroll-mt-16">
      <h2 className="font-display text-4xl sm:text-5xl">Contact me</h2>
      <p className="text-neutral mt-2">{blurb}</p>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <input className="input input-bordered bg-base-200" placeholder="Name" required maxLength={100} value={form.name} onChange={set("name")} />
        <input className="input input-bordered bg-base-200" type="email" placeholder="Email" required maxLength={200} value={form.email} onChange={set("email")} />
        <select className="select select-bordered bg-base-200" value={form.reason} onChange={set("reason")}>
          {reasons.map((r) => <option key={r}>{r}</option>)}
        </select>
        <textarea className="textarea textarea-bordered bg-base-200 min-h-32" placeholder="Message" required maxLength={2000} value={form.message} onChange={set("message")} />
        <button className="btn btn-primary w-fit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send message"}</button>
        {status === "sent" && <p className="text-success" role="status">Thank you! Your message was sent.</p>}
        {status === "error" && <p className="text-error" role="alert">Sorry, that didn't send. Please email {ADMIN_EMAIL} directly.</p>}
      </form>
    </section>
  );
};

export default Contact;
