import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE CLIENT
// Env vars needed in your .env file:
//   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
//   REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key
// ─────────────────────────────────────────────────────────────────────────────
const supabase = createClient(
  "https://yhawkpdhjwzzffunorjm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloYXdrcGRoand6emZmdW5vcmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjg3MDQsImV4cCI6MjA4ODc0NDcwNH0.8C407bilajhjIf7vYvdeoSsciwtVPOrOcPNgWJg2Bjk"
);

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const GENRES = ["Rock","Pop","Hip-Hop","Jazz","Electronic","Alternative","Indie","R&B","Country","Classical","Metal","Psychedelic","Indie Folk","Industrial","Art Pop","Folk","Other"];

// Profile avatar options — upload your own photo, or pick a music icon
const AVATAR_ICONS = [
  { id: "vinyl",    label: "Vinyl",       svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="19" fill="#2a1f14"/><circle cx="20" cy="20" r="14" fill="none" stroke="#7ec8d8" stroke-width="1" opacity="0.4"/><circle cx="20" cy="20" r="10" fill="none" stroke="#7ec8d8" stroke-width="1" opacity="0.3"/><circle cx="20" cy="20" r="6" fill="none" stroke="#7ec8d8" stroke-width="1" opacity="0.5"/><circle cx="20" cy="20" r="2.5" fill="#7ec8d8"/></svg>` },
  { id: "mic",      label: "Mic",         svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="6" width="10" height="16" rx="5" fill="#7ec8d8"/><path d="M10 20a10 10 0 0 0 20 0" fill="none" stroke="#7ec8d8" stroke-width="2" stroke-linecap="round"/><line x1="20" y1="30" x2="20" y2="35" stroke="#7ec8d8" stroke-width="2"/><line x1="14" y1="35" x2="26" y2="35" stroke="#7ec8d8" stroke-width="2" stroke-linecap="round"/></svg>` },
  { id: "guitar",   label: "Guitar",      svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><line x1="10" y1="8" x2="30" y2="28" stroke="#7ec8d8" stroke-width="2"/><circle cx="27" cy="30" r="6" fill="none" stroke="#7ec8d8" stroke-width="2"/><circle cx="27" cy="30" r="2" fill="#7ec8d8"/><circle cx="12" cy="9" r="3" fill="none" stroke="#7ec8d8" stroke-width="1.5"/><line x1="8" y1="8" x2="16" y2="8" stroke="#7ec8d8" stroke-width="1.5"/></svg>` },
  { id: "note",     label: "Note",        svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M16 28V12l16-3v13" fill="none" stroke="#7ec8d8" stroke-width="2" stroke-linejoin="round"/><circle cx="13" cy="28" r="4" fill="none" stroke="#7ec8d8" stroke-width="2"/><circle cx="29" cy="22" r="4" fill="none" stroke="#7ec8d8" stroke-width="2"/></svg>` },
  { id: "drum",     label: "Drums",       svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="22" rx="14" ry="7" fill="none" stroke="#7ec8d8" stroke-width="2"/><rect x="6" y="22" width="28" height="8" rx="0" fill="none" stroke="#7ec8d8" stroke-width="2"/><ellipse cx="20" cy="22" rx="14" ry="7" fill="#2a1f14" opacity="0.6"/><line x1="14" y1="10" x2="18" y2="22" stroke="#7ec8d8" stroke-width="2" stroke-linecap="round"/><line x1="26" y1="10" x2="22" y2="22" stroke="#7ec8d8" stroke-width="2" stroke-linecap="round"/></svg>` },
  { id: "tape",     label: "Cassette",    svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="11" width="30" height="20" rx="3" fill="none" stroke="#7ec8d8" stroke-width="2"/><circle cx="14" cy="24" r="4" fill="none" stroke="#7ec8d8" stroke-width="1.5"/><circle cx="26" cy="24" r="4" fill="none" stroke="#7ec8d8" stroke-width="1.5"/><path d="M18 24 h4" stroke="#7ec8d8" stroke-width="1.5"/><rect x="12" y="14" width="16" height="6" rx="1" fill="none" stroke="#7ec8d8" stroke-width="1"/></svg>` },
  { id: "wave",     label: "Sound Wave",  svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><line x1="4"  y1="20" x2="4"  y2="20" stroke="#7ec8d8" stroke-width="2" stroke-linecap="round"/><line x1="9"  y1="15" x2="9"  y2="25" stroke="#7ec8d8" stroke-width="2" stroke-linecap="round"/><line x1="14" y1="10" x2="14" y2="30" stroke="#7ec8d8" stroke-width="2" stroke-linecap="round"/><line x1="19" y1="6"  x2="19" y2="34" stroke="#7ec8d8" stroke-width="2" stroke-linecap="round"/><line x1="24" y1="10" x2="24" y2="30" stroke="#7ec8d8" stroke-width="2" stroke-linecap="round"/><line x1="29" y1="15" x2="29" y2="25" stroke="#7ec8d8" stroke-width="2" stroke-linecap="round"/><line x1="34" y1="20" x2="34" y2="20" stroke="#7ec8d8" stroke-width="2" stroke-linecap="round"/></svg>` },
  { id: "ticket",   label: "Ticket",      svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M5 14h30v4a3 3 0 0 0 0 6v4H5v-4a3 3 0 0 1 0-6V14z" fill="none" stroke="#7ec8d8" stroke-width="2"/><line x1="15" y1="14" x2="15" y2="28" stroke="#7ec8d8" stroke-width="1.5" stroke-dasharray="2 2"/></svg>` },
  { id: "piano",    label: "Piano",       svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="12" width="30" height="20" rx="2" fill="none" stroke="#7ec8d8" stroke-width="2"/><line x1="5" y1="26" x2="35" y2="26" stroke="#7ec8d8" stroke-width="1"/><rect x="9"  y="12" width="4" height="9" rx="1" fill="#7ec8d8" opacity="0.8"/><rect x="16" y="12" width="4" height="9" rx="1" fill="#7ec8d8" opacity="0.8"/><rect x="23" y="12" width="4" height="9" rx="1" fill="#7ec8d8" opacity="0.8"/></svg>` },
  { id: "star",     label: "Star",        svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><polygon points="20,5 24,15 35,15 26,22 29,33 20,27 11,33 14,22 5,15 16,15" fill="none" stroke="#7ec8d8" stroke-width="2" stroke-linejoin="round"/></svg>` },
];
const APP_NAME = "Record";
const APP_TAGLINE = "Every show, pressed to memory.";
const APP_SUBTITLE = "A Live Music Journal for You & Your Friends";
const CONTACT_EMAIL = "hello@recordapp.com";
const LAST_UPDATED = "March 2026";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  bg:         "#c8b89a",
  paper:      "#d4c4a8",
  cream:      "#ede0c4",
  ink:        "#2a1f14",
  inkLight:   "#4a3828",
  accent:     "#7ec8d8",
  accentDk:   "#5ab5c8",
  accentPale: "#d8eef3",
  groove:     "#b8a488",
  grooveLt:   "#cec0a8",
  stamp:      "#6b4c1e",
  red:        "#8b2020",
  title:      "#f0ece4",
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return { month: "—", day: "—", year: "", full: "" };
  const o = new Date(d + "T12:00:00");
  return {
    month: o.toLocaleString("default", { month: "short" }).toUpperCase(),
    day:   o.getDate(),
    year:  o.getFullYear(),
    full:  o.toLocaleDateString("default", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
  };
};

const readFile = (file) => new Promise((res) => {
  const r = new FileReader();
  r.onload = (e) => res({ url: e.target.result, type: "image", name: file.name });
  r.readAsDataURL(file);
});

// ─────────────────────────────────────────────────────────────────────────────
// SHARED STYLE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const S = {
  input: {
    width: "100%", background: T.cream, border: `1.5px solid ${T.groove}`,
    borderRadius: "4px", color: T.ink, padding: "10px 14px", fontSize: "14px",
    outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif",
    transition: "border-color 0.2s",
  },
  label: {
    color: T.stamp, fontSize: "10px", letterSpacing: "2.5px",
    textTransform: "uppercase", marginBottom: "6px", display: "block",
    fontFamily: "'Outfit', sans-serif",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MICRO COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const Sym = ({ children }) => (
  <span style={{ fontSize: "13px", lineHeight: 1, display: "inline-block", verticalAlign: "middle" }}>{children}</span>
);

const NoteRating = ({ v, onChange, size = "sm" }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[1,2,3,4,5].map(n => (
      <span key={n} onClick={() => onChange && onChange(n)}
        style={{ fontSize: size === "lg" ? "22px" : "14px", cursor: onChange ? "pointer" : "default",
          color: n <= v ? T.accent : T.grooveLt, transition: "color .15s", userSelect: "none" }}>♪</span>
    ))}
  </div>
);

const Groove = () => (
  <div style={{ height: "14px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "3px" }}>
    {[0.1, 0.18, 0.12, 0.08].map((op, i) =>
      <div key={i} style={{ height: "1px", background: `rgba(100,76,40,${op})` }} />)}
  </div>
);

const GenreSticker = ({ genre }) => (
  <span style={{
    background: T.accentPale, border: `1px solid ${T.accent}`, borderRadius: "2px",
    padding: "2px 7px", fontSize: "9px", color: T.stamp,
    fontFamily: "'Outfit', sans-serif", letterSpacing: "1.5px",
    textTransform: "uppercase", fontWeight: "700",
  }}>{genre}</span>
);

const Spinner = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
    <div style={{ width: 28, height: 28, border: `3px solid ${T.groove}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
  </div>
);

// Renders either an uploaded photo or an SVG icon avatar
const AvatarImg = ({ profile, size = 40 }) => {
  if (profile?.avatar_url) {
    return <img src={profile.avatar_url} alt="avatar" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: `1.5px solid ${T.groove}`, flexShrink: 0 }} />;
  }
  const iconId = profile?.avatar_emoji && AVATAR_ICONS.some(a => a.id === profile.avatar_emoji) ? profile.avatar_emoji : null;
  if (iconId) {
    const icon = AVATAR_ICONS.find(a => a.id === iconId);
    const inner = icon.svg.replace(/<svg[^>]*>/, "").replace("</svg>", "");
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", background: T.ink, border: `1.5px solid ${T.groove}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}
        dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 40 40" width="${Math.round(size * 0.7)}" height="${Math.round(size * 0.7)}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>` }} />
    );
  }
  // Fallback: old emoji or default
  const emoji = profile?.avatar_emoji || "🎵";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: T.cream, border: `1.5px solid ${T.groove}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5, flexShrink: 0 }}>
      {emoji}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA STRIP — photos only
// ─────────────────────────────────────────────────────────────────────────────
const MediaStrip = ({ media, onAdd, onRemove }) => {
  const ref = useRef();
  const handleFiles = async (files) => {
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) continue;
      const data = await readFile(f);
      onAdd && onAdd(data);
    }
  };
  if (!media?.length && !onAdd) return null;
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
      {(media || []).map((item, i) => (
        <div key={i} style={{ position: "relative", width: 72, height: 72 }}>
          <img src={item.url} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: "3px", border: `1px solid ${T.groove}` }} />
          {onRemove && (
            <button onClick={() => onRemove(i)} style={{ position: "absolute", top: 2, right: 2, background: "rgba(26,16,8,.7)", border: "none", borderRadius: "50%", color: T.cream, width: 18, height: 18, cursor: "pointer", fontSize: "10px", lineHeight: "18px", padding: 0 }}>✕</button>
          )}
        </div>
      ))}
      {onAdd && (
        <div onClick={() => ref.current.click()}
          style={{ width: 72, height: 72, border: `1.5px dashed ${T.groove}`, borderRadius: "3px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.groove, fontSize: "10px", gap: "3px", transition: "all .2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.groove; e.currentTarget.style.color = T.groove; }}>
          <span style={{ fontSize: "20px" }}>♪</span><span>Add Photo</span>
          <input ref={ref} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AUTH MODAL  (email OR username login)
// ─────────────────────────────────────────────────────────────────────────────
const AuthModal = ({ onClose, onAuth }) => {
  const [mode, setMode]           = useState("login"); // "login" | "signup"
  const [identifier, setIdentifier] = useState("");   // email or username on login
  const [email, setEmail]         = useState("");      // signup only
  const [password, setPassword]   = useState("");
  const [username, setUsername]   = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  // Resolve username → email for login
  const resolveEmail = async (input) => {
    // If it looks like an email just return it
    if (input.includes("@")) return input.trim();
    // Otherwise look up by username
    const handle = input.replace(/^@/, "").trim().toLowerCase();
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", handle)
      .single();
    if (!data) throw new Error("No account found with that username.");
    // Get the email from auth — we need to use a server-side lookup trick:
    // store email in profiles table on signup so we can resolve it here
    const { data: prof } = await supabase
      .from("profiles")
      .select("email")
      .eq("username", handle)
      .single();
    if (!prof?.email) throw new Error("No account found with that username.");
    return prof.email;
  };

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "signup") {
        if (!username.trim()) throw new Error("Username is required.");
        if (!email.trim())    throw new Error("Email is required.");
        // Check username not taken
        const { data: existing } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", username.trim().toLowerCase())
          .single();
        if (existing) throw new Error("That username is already taken.");

        const { data, error: e } = await supabase.auth.signUp({ email: email.trim(), password });
        if (e) throw e;
        if (data.user) {
          await supabase.from("profiles").insert({
            id:           data.user.id,
            username:     username.trim().toLowerCase(),
            display_name: displayName.trim() || username.trim(),
            avatar_emoji: "🎵",
            email:        email.trim(),
          });
          onAuth(data.user);
        }
      } else {
        const resolvedEmail = await resolveEmail(identifier);
        const { data, error: e } = await supabase.auth.signInWithPassword({ email: resolvedEmail, password });
        if (e) throw e;
        onAuth(data.user);
      }
    } catch (e) {
      setError(e.message || "Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,16,8,.82)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: T.cream, border: `2px solid ${T.inkLight}`, borderRadius: "3px", padding: "36px", width: "100%", maxWidth: "420px", boxShadow: `6px 6px 0 ${T.groove}` }}>
        <div style={{ borderBottom: `2px solid ${T.ink}`, paddingBottom: "16px", marginBottom: "28px" }}>
          <div style={{ color: T.accent, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif", marginBottom: "6px" }}>♪ {APP_NAME}</div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "26px", color: T.ink, margin: 0 }}>
            {mode === "login" ? "Welcome Back" : "Join the Collection"}
          </h2>
          <p style={{ color: T.stamp, fontSize: "12px", fontFamily: "'Outfit', sans-serif", marginTop: "6px", fontStyle: "italic" }}>
            {mode === "login" ? "Sign in with your email or @username." : "Start pressing your live music memories."}
          </p>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          {mode === "signup" ? (
            <>
              <div>
                <label style={S.label}>Username *</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: T.groove, fontFamily: "'Outfit', sans-serif", fontSize: "14px" }}>@</span>
                  <input style={{ ...S.input, paddingLeft: "26px" }} value={username} onChange={e => setUsername(e.target.value.replace(/\s/g, ""))} placeholder="yourhandle" />
                </div>
                <div style={{ color: T.groove, fontSize: "10px", fontFamily: "'Outfit', sans-serif", marginTop: "4px" }}>Searchable by other users. Lowercase, no spaces.</div>
              </div>
              <div>
                <label style={S.label}>Display Name</label>
                <input style={S.input} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="e.g. Maya Chen (optional)" />
              </div>
              <div>
                <label style={S.label}>Email *</label>
                <input type="email" style={S.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
            </>
          ) : (
            <div>
              <label style={S.label}>Email or @Username</label>
              <input style={S.input} value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="you@example.com or @handle" autoFocus />
            </div>
          )}
          <div>
            <label style={S.label}>Password</label>
            <input type="password" style={S.input} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>
          {error && (
            <div style={{ background: "#fde8e8", border: `1px solid ${T.red}`, borderRadius: "3px", padding: "10px 14px", color: T.red, fontSize: "12px", fontFamily: "'Outfit', sans-serif" }}>
              {error}
            </div>
          )}
        </div>

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", marginTop: "24px", padding: "13px", background: T.ink, border: "none", borderRadius: "3px", color: T.cream, cursor: loading ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: "700", fontFamily: "'Fraunces', serif", opacity: loading ? 0.6 : 1 }}>
          {loading ? "♪ Loading…" : mode === "login" ? "▶ Play My Collection" : "▶ Press My First Record"}
        </button>

        <div style={{ marginTop: "18px", textAlign: "center", fontSize: "12px", fontFamily: "'Outfit', sans-serif", color: T.stamp }}>
          {mode === "login" ? "New to Record? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            style={{ background: "none", border: "none", color: T.accentDk, cursor: "pointer", fontSize: "12px", fontFamily: "'Outfit', sans-serif", textDecoration: "underline" }}>
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONCERT FORM MODAL
// ─────────────────────────────────────────────────────────────────────────────
const ConcertModal = ({ concert, onClose, onSave }) => {
  const blank = { artist: "", venue: "", city: "", date: "", genre: "", review: "", rating: 0, setlist: [], media: [] };
  const [f, setF] = useState(concert ? { ...blank, ...concert } : blank);
  const [setlistInput, setSetlistInput] = useState((concert?.setlist || []).join("\n"));
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const addMedia    = (item) => setF(p => ({ ...p, media: [...(p.media || []), item] }));
  const removeMedia = (i)    => setF(p => ({ ...p, media: p.media.filter((_, j) => j !== i) }));

  const handleSave = async () => {
    if (!f.artist.trim()) return;
    setSaving(true);
    await onSave({ ...f, setlist: setlistInput.split("\n").map(s => s.trim()).filter(Boolean) });
    setSaving(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,16,8,.72)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(3px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: T.cream, border: `2px solid ${T.inkLight}`, borderRadius: "3px", padding: "32px", width: "100%", maxWidth: "560px", boxShadow: `6px 6px 0 ${T.groove}`, maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ borderBottom: `2px solid ${T.ink}`, paddingBottom: "16px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ color: T.accent, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif" }}>♪ NEW ENTRY</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", color: T.ink, margin: "4px 0 0" }}>{concert?.id ? "Edit Record" : "Press a Record"}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.groove, cursor: "pointer" }}><Sym>■</Sym></button>
        </div>
        <div style={{ display: "grid", gap: "16px" }}>
          <div>
            <label style={S.label}>Artist / Band *</label>
            <input style={S.input} value={f.artist} onChange={e => set("artist", e.target.value)} placeholder="e.g. Arctic Monkeys" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={S.label}>Venue</label>
              <input style={S.input} value={f.venue} onChange={e => set("venue", e.target.value)} placeholder="Type any venue name" />
            </div>
            <div>
              <label style={S.label}>City</label>
              <input style={S.input} value={f.city} onChange={e => set("city", e.target.value)} placeholder="e.g. Chicago, IL" />
            </div>
          </div>
          <div style={{ marginTop: "-8px", color: T.groove, fontSize: "10px", fontFamily: "'Outfit', sans-serif" }}>
            ♪ Type any artist, venue, or city — not in the list? Just write it in.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div><label style={S.label}>Date</label><input type="date" style={S.input} value={f.date} onChange={e => set("date", e.target.value)} /></div>
            <div>
              <label style={S.label}>Genre</label>
              <select style={S.input} value={f.genre} onChange={e => set("genre", e.target.value)}>
                <option value="">Select…</option>
                {GENRES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div><label style={S.label}>♪ Note Rating</label><NoteRating v={f.rating} onChange={v => set("rating", v)} size="lg" /></div>
          <div><label style={S.label}>Your Review</label><textarea style={{ ...S.input, minHeight: "88px", resize: "vertical" }} value={f.review} onChange={e => set("review", e.target.value)} placeholder="What made this show unforgettable?" /></div>
          <div><label style={S.label}>Setlist — one song per line</label><textarea style={{ ...S.input, minHeight: "96px", resize: "vertical", fontSize: "13px" }} value={setlistInput} onChange={e => setSetlistInput(e.target.value)} placeholder={"Opening Song\nFan Favourite\nClosing Number"} /></div>
          <div><label style={S.label}>Photos</label><MediaStrip media={f.media} onAdd={addMedia} onRemove={removeMedia} /></div>
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "24px", borderTop: `1px solid ${T.groove}`, paddingTop: "20px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px", background: "transparent", border: `1.5px solid ${T.groove}`, borderRadius: "3px", color: T.stamp, cursor: "pointer", fontSize: "13px", fontFamily: "'Outfit', sans-serif" }}><Sym>■</Sym> Cancel</button>
          <button onClick={handleSave} disabled={saving || !f.artist.trim()}
            style={{ flex: 2, padding: "11px", background: T.ink, border: "none", borderRadius: "3px", color: T.cream, cursor: "pointer", fontSize: "13px", fontWeight: "700", fontFamily: "'Fraunces', serif", opacity: f.artist.trim() && !saving ? 1 : 0.4 }}>
            <Sym>▶</Sym> {saving ? "Saving…" : concert?.id ? "Save Changes" : "Press It"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SLEEVE / DETAIL MODAL
// ─────────────────────────────────────────────────────────────────────────────
const SleeveModal = ({ concert, onClose, isOwn, onEdit }) => {
  const { full, month, day, year } = fmtDate(concert.date);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,16,8,.78)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: T.paper, border: `2px solid ${T.ink}`, borderRadius: "2px", width: "100%", maxWidth: "620px", maxHeight: "92vh", overflowY: "auto", boxShadow: `8px 8px 0 ${T.inkLight}` }}>
        <div style={{ background: T.ink, padding: "36px 40px", position: "relative", overflow: "hidden" }}>
          {[220,180,140,100,60].map((size, i) => (
            <div key={i} style={{ position: "absolute", right: -(size/2.5), top: -(size/2.5), width: size, height: size, borderRadius: "50%", border: `1px solid rgba(126,200,216,${0.04 + i * 0.02})`, pointerEvents: "none" }} />
          ))}
          <div style={{ color: T.accent, fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif", marginBottom: "12px" }}>
            ♪ RECORD · LIVE PRESSING · {month} {day}, {year}
          </div>
          <h1 style={{ color: T.title, fontFamily: "'Fraunces', serif", fontSize: "clamp(26px,5vw,42px)", fontWeight: "900", lineHeight: 1, margin: "0 0 10px", letterSpacing: "-1px" }}>{concert.artist}</h1>
          <div style={{ color: T.accent, fontFamily: "'Outfit', sans-serif", fontSize: "14px", marginBottom: "4px" }}>{concert.venue}</div>
          <div style={{ color: T.groove, fontFamily: "'Outfit', sans-serif", fontSize: "12px", marginBottom: "18px" }}>{concert.city} · {full}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <NoteRating v={concert.rating} size="lg" />
            {concert.genre && <GenreSticker genre={concert.genre} />}
          </div>
          <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: T.groove, cursor: "pointer" }}><Sym>■</Sym></button>
        </div>
        <div style={{ padding: "32px 40px" }}>
          {concert.review && (
            <div style={{ marginBottom: "28px" }}>
              <div style={{ ...S.label, marginBottom: "12px" }}>♪ Review</div>
              <blockquote style={{ color: T.inkLight, fontFamily: "'Fraunces', serif", fontSize: "16px", lineHeight: 1.75, fontStyle: "italic", borderLeft: `3px solid ${T.accent}`, paddingLeft: "18px", margin: 0 }}>"{concert.review}"</blockquote>
            </div>
          )}
          <Groove />
          {concert.setlist?.length > 0 && (
            <div style={{ margin: "24px 0" }}>
              <div style={{ ...S.label, marginBottom: "14px" }}>♪ Setlist</div>
              {concert.setlist.map((song, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "9px 0", borderBottom: `1px solid ${T.grooveLt}` }}>
                  <span style={{ color: T.grooveLt, fontFamily: "'Outfit', sans-serif", fontSize: "10px", minWidth: "22px", textAlign: "right" }}>{String(i+1).padStart(2,"0")}</span>
                  <span style={{ color: T.accent, fontSize: "11px" }}>♪</span>
                  <span style={{ color: T.ink, fontFamily: "'Fraunces', serif", fontSize: "16px" }}>{song}</span>
                </div>
              ))}
            </div>
          )}
          {concert.media?.length > 0 && (
            <>
              <Groove />
              <div style={{ margin: "24px 0" }}>
                <div style={{ ...S.label, marginBottom: "12px" }}>♪ Photos & Videos</div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {concert.media.map((item, i) => (
                    item.type === "video"
                      ? <video key={i} src={item.url} controls style={{ height: 120, borderRadius: "3px", border: `1px solid ${T.groove}` }} />
                      : <img key={i} src={item.url} alt="" style={{ height: 120, borderRadius: "3px", objectFit: "cover", border: `1px solid ${T.groove}`, cursor: "pointer" }} onClick={() => window.open(item.url, "_blank")} />
                  ))}
                </div>
              </div>
            </>
          )}
          <div style={{ display: "flex", gap: "10px", marginTop: "24px", borderTop: `1px solid ${T.groove}`, paddingTop: "20px" }}>
            <button onClick={onClose} style={{ flex: 1, padding: "11px", background: "transparent", border: `1.5px solid ${T.groove}`, borderRadius: "3px", color: T.stamp, cursor: "pointer", fontSize: "13px", fontFamily: "'Outfit', sans-serif" }}><Sym>■</Sym> Close</button>
            {isOwn && (
              <button onClick={() => { onClose(); onEdit(concert); }}
                style={{ flex: 1, padding: "11px", background: T.ink, border: "none", borderRadius: "3px", color: T.cream, cursor: "pointer", fontSize: "13px", fontFamily: "'Outfit', sans-serif" }}>
                <Sym>▶</Sym> Edit This Record
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TICKET STUB
// ─────────────────────────────────────────────────────────────────────────────
const TicketStub = ({ concert, onEdit, onDelete, onOpen, showOwner, ownerName, ownerHandle, ownerProfile, isEncore, onOwnerClick }) => {
  const [hov, setHov] = useState(false);
  const { month, day, year } = fmtDate(concert.date);
  const mediaCount = concert.media?.length || 0;

  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(concert)}
      style={{
        display: "flex", cursor: "pointer",
        border: `1.5px solid ${isEncore ? T.accent : T.inkLight}`,
        borderRadius: "3px", overflow: "hidden", transition: "transform .15s, box-shadow .15s",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? `4px 4px 0 ${T.accent}` : `3px 3px 0 ${T.groove}`,
        background: T.cream,
      }}>
      <div style={{ background: T.ink, width: 68, minWidth: 68, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "14px 6px", position: "relative" }}>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "1px", background: `repeating-linear-gradient(to bottom, ${T.groove} 0, ${T.groove} 4px, transparent 4px, transparent 8px)` }} />
        <div style={{ color: T.accent, fontSize: "9px", fontWeight: "700", letterSpacing: "2px", fontFamily: "'Outfit', sans-serif" }}>{month}</div>
        <div style={{ color: T.title, fontSize: "28px", fontFamily: "'Fraunces', serif", fontWeight: "900", lineHeight: 1 }}>{day}</div>
        <div style={{ color: T.groove, fontSize: "9px", fontFamily: "'Outfit', sans-serif" }}>{year}</div>
        <div style={{ color: T.accent, fontSize: "16px", marginTop: "6px" }}>♪</div>
      </div>
      <div style={{ flex: 1, padding: "14px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          {showOwner && (
            <div
              onClick={onOwnerClick ? (e) => { e.stopPropagation(); onOwnerClick(); } : undefined}
              style={{ color: T.stamp, fontSize: "10px", fontFamily: "'Outfit', sans-serif", marginBottom: "4px", cursor: onOwnerClick ? "pointer" : "default", display: "inline-flex", alignItems: "center", gap: "5px" }}>
              <AvatarImg profile={ownerProfile} size={18} />
              <span style={{ fontWeight: "700" }}>{ownerName}</span>
              <span style={{ color: T.grooveLt }}>{ownerHandle}</span>
              {onOwnerClick && <span style={{ color: T.accent, fontSize: "9px" }}>↗</span>}
            </div>
          )}
          {isEncore && (
            <div style={{ color: T.accent, fontSize: "9px", fontFamily: "'Outfit', sans-serif", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "2px" }}>★ Encore List</div>
          )}
          <div style={{ color: T.ink, fontSize: "19px", fontFamily: "'Fraunces', serif", fontWeight: "700", lineHeight: 1.15 }}>{concert.artist}</div>
          <div style={{ color: T.stamp, fontSize: "12px", fontFamily: "'Outfit', sans-serif", marginTop: "3px" }}>{[concert.venue, concert.city].filter(Boolean).join(" · ")}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px", flexWrap: "wrap", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <NoteRating v={concert.rating} />
            {concert.genre && <GenreSticker genre={concert.genre} />}
          </div>
          <div style={{ display: "flex", gap: "10px", color: T.groove, fontSize: "11px", fontFamily: "'Outfit', sans-serif" }}>
            {concert.setlist?.length > 0 && <span>♪ {concert.setlist.length} tracks</span>}
            {mediaCount > 0 && <span>◈ {mediaCount}</span>}
            {concert.review && <span>✍</span>}
          </div>
        </div>
      </div>
      {(onEdit || onDelete) && (
        <div onClick={e => e.stopPropagation()}
          style={{ background: T.paper, borderLeft: `1px dashed ${T.groove}`, width: 40, minWidth: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", opacity: hov ? 1 : 0, transition: "opacity .2s" }}>
          <button onClick={() => onEdit(concert)} style={{ background: "none", border: "none", color: T.stamp, cursor: "pointer", padding: "4px" }}><Sym>▶</Sym></button>
          <button onClick={() => onDelete(concert.id)} style={{ background: "none", border: "none", color: T.red, cursor: "pointer", padding: "4px" }}><Sym>■</Sym></button>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ENCORE LIST SECTION
// ─────────────────────────────────────────────────────────────────────────────
const EncoreListSection = ({ concerts, encoreList, onOpen, onToggleEncore, isOwn }) => {
  const encoreConcerts = concerts.filter(c => encoreList?.map(String).includes(String(c.id)));
  return (
    <div style={{ background: T.paper, border: `2px solid ${T.accent}`, borderRadius: "4px", padding: "24px", marginBottom: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
        <div>
          <div style={{ color: T.accent, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif", marginBottom: "4px" }}>★ All-Time</div>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", color: T.ink, margin: 0, fontStyle: "italic" }}>The Encore List</h3>
        </div>
        <div style={{ color: T.groove, fontSize: "11px", fontFamily: "'Outfit', sans-serif" }}>{encoreConcerts.length} / 3</div>
      </div>
      {encoreConcerts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px", color: T.groove, fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontStyle: "italic", border: `1px dashed ${T.groove}`, borderRadius: "3px" }}>
          {isOwn
            ? "Add up to 3 all-time favourite shows — hover a show below and click ★ to add it here."
            : "No shows added to the Encore List yet."}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {encoreConcerts.map((c, i) => (
            <div key={c.id}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ color: T.accent, fontFamily: "'Fraunces', serif", fontSize: "28px", fontWeight: "900", minWidth: "32px", textAlign: "center", lineHeight: 1 }}>{i + 1}</div>
                <div style={{ flex: 1 }}><TicketStub concert={c} onOpen={onOpen} isEncore /></div>
                {isOwn && (
                  <button onClick={() => onToggleEncore(c.id)} style={{ background: "none", border: "none", color: T.accent, cursor: "pointer", fontSize: "18px", padding: "4px" }}>★</button>
                )}
              </div>
              {i < encoreConcerts.length - 1 && <Groove />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE MODAL (other users)
// ─────────────────────────────────────────────────────────────────────────────
const ProfilePage = ({ user, onClose, onToggleFollow, onLogConcert }) => {
  const [sleeve, setSleeve] = useState(null);
  const [search, setSearch] = useState("");
  const concerts = (user.concerts || []);
  const filtered = search.trim()
    ? concerts.filter(c => [c.artist, c.venue, c.city, c.genre].some(x => (x||"").toLowerCase().includes(search.toLowerCase())))
    : concerts;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: T.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>

      {/* ── Header bar ── */}
      <div style={{ background: T.ink, borderBottom: `4px solid ${T.accent}`, padding: "0 32px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "20px 0", display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={onClose}
            style={{ background: "transparent", border: `1px solid ${T.groove}`, color: T.groove, borderRadius: "2px", padding: "7px 14px", cursor: "pointer", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif", whiteSpace: "nowrap" }}>
            ← Back
          </button>
          <div style={{ flex: 1 }} />
          <button onClick={() => onToggleFollow(user.id)}
            style={{ background: user.following ? "transparent" : T.accent, border: user.following ? `1.5px solid ${T.groove}` : "none", color: user.following ? T.groove : T.ink, borderRadius: "2px", padding: "8px 18px", cursor: "pointer", fontSize: "11px", fontWeight: "700", fontFamily: "'Outfit', sans-serif", letterSpacing: "1px" }}>
            {user.following ? <><Sym>■</Sym> Unfollow</> : <><Sym>▶</Sym> Follow</>}
          </button>
        </div>
      </div>

      {/* ── Profile hero ── */}
      <div style={{ background: T.ink, padding: "0 32px 40px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          {/* Groove lines */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "28px" }}>
            {[0.05, 0.09, 0.06].map((op, i) => <div key={i} style={{ height: "1px", background: `rgba(126,200,216,${op})` }} />)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <AvatarImg profile={user} size={72} />
            <div>
              <div style={{ color: T.accent, fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif", marginBottom: "6px" }}>♪ Listener</div>
              <div style={{ color: T.title, fontFamily: "'Fraunces', serif", fontSize: "clamp(28px,5vw,42px)", fontWeight: "900", letterSpacing: "-1px", lineHeight: 1 }}>
                {user.display_name || user.username}
              </div>
              <div style={{ color: T.groove, fontFamily: "'Outfit', sans-serif", fontSize: "12px", marginTop: "6px" }}>
                @{user.username} · {concerts.length} show{concerts.length !== 1 ? "s" : ""} pressed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, maxWidth: "760px", width: "100%", margin: "0 auto", padding: "28px 32px 60px" }}>

        {/* Encore List */}
        <EncoreListSection
          concerts={concerts}
          encoreList={user.encore_list || []}
          onOpen={setSleeve}
          isOwn={false}
        />

        {/* Concert log header + search */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", marginTop: "8px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ color: T.accent, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif" }}>
            ♫ {concerts.length} Show{concerts.length !== 1 ? "s" : ""} Pressed
          </div>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="♪  Filter shows…"
            style={{ ...S.input, width: "220px", fontSize: "13px" }}
          />
        </div>

        {/* Concert list with + buttons */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: T.groove, fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontStyle: "italic" }}>
            {search ? "No shows match that search." : "No shows logged yet."}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filtered.map((c, i) => (
              <div key={c.id}>
                <div style={{ display: "flex", alignItems: "stretch" }}>
                  <div style={{ flex: 1 }}>
                    <TicketStub concert={c} onOpen={setSleeve} />
                  </div>
                  {/* + Log this show */}
                  <button
                    onClick={() => onLogConcert(c)}
                    title="Log this show to your collection"
                    style={{ background: T.paper, border: `1.5px solid ${T.inkLight}`, borderLeft: "none", borderRadius: "0 3px 3px 0", padding: "0 16px", cursor: "pointer", color: T.stamp, fontSize: "20px", fontWeight: "700", transition: "all .2s", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.accent; e.currentTarget.style.color = T.ink; }}
                    onMouseLeave={e => { e.currentTarget.style.background = T.paper; e.currentTarget.style.color = T.stamp; }}>
                    +
                  </button>
                </div>
                {i < filtered.length - 1 && <Groove />}
              </div>
            ))}
          </div>
        )}
      </div>

      {sleeve && <SleeveModal concert={sleeve} onClose={() => setSleeve(null)} isOwn={false} onEdit={() => {}} />}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FIND USERS MODAL
// ─────────────────────────────────────────────────────────────────────────────
const FindUsersModal = ({ onClose, users, onToggleFollow, onViewProfile }) => {
  const [q, setQ] = useState("");
  const results = q.trim()
    ? users.filter(u => (u.display_name||"").toLowerCase().includes(q.toLowerCase()) || (u.username||"").toLowerCase().includes(q.toLowerCase()))
    : users;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,16,8,.78)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: T.cream, border: `2px solid ${T.ink}`, borderRadius: "2px", width: "100%", maxWidth: "460px", boxShadow: `6px 6px 0 ${T.groove}` }}>
        <div style={{ background: T.ink, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: T.accent, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif" }}>♪ FIND LISTENERS</div>
            <h2 style={{ color: T.title, fontFamily: "'Fraunces', serif", fontSize: "20px", margin: "4px 0 0" }}>Search the Collection</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.groove, cursor: "pointer" }}><Sym>■</Sym></button>
        </div>
        <div style={{ padding: "20px 28px" }}>
          <input style={S.input} value={q} onChange={e => setQ(e.target.value)} placeholder="♪  Search by name or @handle…" autoFocus />
          <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {results.map(u => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", background: T.paper, border: `1px solid ${T.groove}`, borderRadius: "3px" }}>
                <AvatarImg profile={u} size={36} />
                <div style={{ flex: 1, cursor: "pointer" }} onClick={() => { onViewProfile(u); onClose(); }}>
                  <div style={{ color: T.ink, fontFamily: "'Fraunces', serif", fontSize: "15px", fontWeight: "700" }}>{u.display_name || u.username}</div>
                  <div style={{ color: T.stamp, fontSize: "11px", fontFamily: "'Outfit', sans-serif" }}>@{u.username} · <span style={{ color: T.accent }}><Sym>▶</Sym> View</span></div>
                </div>
                <button onClick={() => onToggleFollow(u.id)}
                  style={{ background: u.following ? "transparent" : T.ink, border: u.following ? `1px solid ${T.groove}` : "none", color: u.following ? T.stamp : T.cream, borderRadius: "3px", padding: "6px 12px", cursor: "pointer", fontSize: "11px", fontWeight: "700", fontFamily: "'Outfit', sans-serif", whiteSpace: "nowrap" }}>
                  {u.following ? <><Sym>■</Sym> Unfollow</> : <><Sym>▶</Sym> Follow</>}
                </button>
              </div>
            ))}
            {results.length === 0 && <div style={{ color: T.groove, textAlign: "center", padding: "24px", fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontStyle: "italic" }}>No listeners found.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL SEARCH RESULTS PANEL  (concerts + users)
// ─────────────────────────────────────────────────────────────────────────────
const GlobalSearchPanel = ({ query, allConcerts, allUsers, onOpenConcert, onOpenProfile, onToggleFollow, onClose }) => {
  if (!query.trim()) return null;
  const q = query.toLowerCase().replace(/^@/, "");

  const concertResults = allConcerts.filter(c =>
    [c.artist, c.venue, c.city, c.genre].some(x => (x||"").toLowerCase().includes(q))
  );
  const userResults = allUsers.filter(u =>
    (u.username||"").toLowerCase().includes(q) ||
    (u.display_name||"").toLowerCase().includes(q)
  );

  const total = concertResults.length + userResults.length;

  return (
    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100, background: T.cream, border: `2px solid ${T.inkLight}`, borderTop: "none", borderRadius: "0 0 4px 4px", boxShadow: `4px 6px 0 ${T.groove}`, maxHeight: "420px", overflowY: "auto" }}>
      {/* Header */}
      <div style={{ padding: "10px 16px", borderBottom: `1px solid ${T.groove}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: T.cream, zIndex: 1 }}>
        <span style={{ color: T.stamp, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif" }}>
          {total} result{total !== 1 ? "s" : ""} for "{query}"
        </span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: T.groove, cursor: "pointer", fontSize: "11px", fontFamily: "'Outfit', sans-serif" }}>✕ Close</button>
      </div>

      {total === 0 ? (
        <div style={{ padding: "24px", textAlign: "center", color: T.groove, fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontStyle: "italic" }}>
          Nothing found — try a different search.
        </div>
      ) : (
        <div style={{ padding: "8px" }}>

          {/* ── Users section ── */}
          {userResults.length > 0 && (
            <>
              <div style={{ padding: "6px 12px 4px", color: T.stamp, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif" }}>
                ♫ Listeners
              </div>
              {userResults.map(u => (
                <div key={u.id}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "3px", borderBottom: `1px solid ${T.grooveLt}` }}>
                  {/* Avatar + name — clickable to open profile */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, cursor: "pointer" }}
                    onClick={() => { onOpenProfile(u); onClose(); }}>
                    <AvatarImg profile={u} size={36} />
                    <div>
                      <div style={{ color: T.ink, fontFamily: "'Fraunces', serif", fontSize: "15px", fontWeight: "700", lineHeight: 1.2 }}>{u.display_name || u.username}</div>
                      <div style={{ color: T.stamp, fontSize: "11px", fontFamily: "'Outfit', sans-serif" }}>
                        @{u.username} · {u.concerts?.length || 0} shows
                        <span style={{ color: T.accent, marginLeft: "6px" }}><Sym>▶</Sym> View profile</span>
                      </div>
                    </div>
                  </div>
                  {/* Inline follow button */}
                  <button
                    onClick={e => { e.stopPropagation(); onToggleFollow(u.id); }}
                    style={{
                      background: u.following ? "transparent" : T.ink,
                      border: u.following ? `1.5px solid ${T.groove}` : "none",
                      color: u.following ? T.stamp : T.cream,
                      borderRadius: "2px", padding: "6px 14px", cursor: "pointer",
                      fontSize: "10px", fontWeight: "700", fontFamily: "'Outfit', sans-serif",
                      letterSpacing: "1px", whiteSpace: "nowrap", transition: "all .2s",
                    }}>
                    {u.following ? <><Sym>■</Sym> Unfollow</> : <><Sym>▶</Sym> Follow</>}
                  </button>
                </div>
              ))}
            </>
          )}

          {/* ── Concerts section ── */}
          {concertResults.length > 0 && (
            <>
              <div style={{ padding: "10px 12px 4px", color: T.stamp, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif" }}>
                ♪ Shows
              </div>
              {concertResults.map((c, i) => (
                <div key={c.id} onClick={() => { onOpenConcert(c); onClose(); }}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "3px", cursor: "pointer", borderBottom: i < concertResults.length - 1 ? `1px solid ${T.grooveLt}` : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.accentPale}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ background: T.ink, color: T.accent, borderRadius: "2px", padding: "4px 8px", fontFamily: "'Fraunces', serif", fontSize: "11px", minWidth: "36px", textAlign: "center", lineHeight: 1.2, flexShrink: 0 }}>
                    <div style={{ fontSize: "9px" }}>{fmtDate(c.date).month}</div>
                    <div style={{ fontWeight: "900", fontSize: "14px" }}>{fmtDate(c.date).day}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: T.ink, fontFamily: "'Fraunces', serif", fontSize: "15px", fontWeight: "700" }}>{c.artist}</div>
                    <div style={{ color: T.stamp, fontSize: "11px", fontFamily: "'Outfit', sans-serif" }}>{[c.venue, c.city].filter(Boolean).join(" · ")}</div>
                  </div>
                  {c.genre && <GenreSticker genre={c.genre} />}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PRIVACY POLICY & TERMS
// ─────────────────────────────────────────────────────────────────────────────
const LegalModal = ({ title, sections, onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(26,16,8,.78)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()}
      style={{ background: T.cream, border: `2px solid ${T.ink}`, borderRadius: "2px", width: "100%", maxWidth: "640px", maxHeight: "88vh", overflowY: "auto", boxShadow: `8px 8px 0 ${T.groove}` }}>
      <div style={{ background: T.ink, padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 1 }}>
        <div>
          <div style={{ color: T.accent, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif" }}>♪ Legal</div>
          <h2 style={{ color: T.title, fontFamily: "'Fraunces', serif", fontSize: "22px", margin: "4px 0 0" }}>{title}</h2>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: T.groove, cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: "13px" }}><Sym>■</Sym> Close</button>
      </div>
      <div style={{ padding: "32px", fontFamily: "'Outfit', sans-serif", color: T.ink, lineHeight: 1.8 }}>
        <p style={{ color: T.stamp, fontSize: "12px", marginBottom: "28px" }}>Last updated: {LAST_UPDATED}</p>
        {sections.map(s => (
          <div key={s.title} style={{ marginBottom: "24px" }}>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "16px", color: T.ink, marginBottom: "8px", borderBottom: `1px solid ${T.groove}`, paddingBottom: "6px" }}>{s.title}</h3>
            <p style={{ fontSize: "14px", color: T.inkLight }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PRIVACY_SECTIONS = [
  { title: "1. Who We Are", body: `${APP_NAME} is a personal live music logging platform. Contact us at ${CONTACT_EMAIL}.` },
  { title: "2. What Information We Collect", body: "We collect your name, email, and concert data you log including artists, venues, dates, reviews, ratings, setlists, and any media you upload." },
  { title: "3. How We Use Your Information", body: `We use your information solely to provide the ${APP_NAME} service. We do not use your data for advertising.` },
  { title: "4. Who We Share Your Information With", body: `Your profile and concert log are visible to other users. We do not sell or share your data with third parties.` },
  { title: "5. Photos and Videos", body: "You retain ownership of content you upload. By uploading, you grant us a limited licence to store and display it within the app." },
  { title: "6. Data Retention", body: `We retain your data while your account is active. Request deletion at ${CONTACT_EMAIL}.` },
  { title: "7. Cookies", body: "We use only essential cookies to maintain your session." },
  { title: "8. Your Rights", body: `Contact us at ${CONTACT_EMAIL} to access, correct, or delete your data.` },
  { title: "9. Children's Privacy", body: `${APP_NAME} is not intended for anyone under 13.` },
  { title: "10. Changes", body: "We may update this policy and will notify users by updating the date at the top." },
];

const TERMS_SECTIONS = [
  { title: "1. Acceptance", body: `By using ${APP_NAME}, you agree to these Terms. We reserve the right to update them at any time.` },
  { title: "2. Your Account", body: "You are responsible for your account security and for providing accurate information." },
  { title: "3. Acceptable Use", body: `Use ${APP_NAME} only for logging concerts and connecting with friends around live music.` },
  { title: "4. Your Content", body: "You retain ownership of content you post and grant us a licence to display it within the platform." },
  { title: "5. Prohibited Content", body: "Do not upload content that infringes IP rights, contains explicit material, or violates others' privacy." },
  { title: "6. Platform Availability", body: `We aim for continuous availability but reserve the right to modify or suspend the service.` },
  { title: "7. Limitation of Liability", body: `${APP_NAME} is provided as-is. We are not liable for indirect or consequential damages.` },
  { title: "8. Termination", body: "We may suspend accounts that violate these terms." },
  { title: "9. Governing Law", body: `Contact us at ${CONTACT_EMAIL} to resolve any disputes.` },
];

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
const Footer = ({ onPrivacy, onTerms }) => (
  <div style={{ background: T.ink, padding: "28px 32px", borderTop: `4px solid ${T.accent}` }}>
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ color: T.title, fontFamily: "'Fraunces', serif", fontSize: "20px", fontWeight: "700" }}>{APP_NAME}</div>
          <div style={{ color: T.groove, fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontStyle: "italic", marginTop: "2px" }}>{APP_TAGLINE}</div>
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={onPrivacy} style={{ background: "none", border: "none", color: T.groove, cursor: "pointer", fontSize: "12px", fontFamily: "'Outfit', sans-serif", textDecoration: "underline" }}>Privacy Policy</button>
          <button onClick={onTerms}   style={{ background: "none", border: "none", color: T.groove, cursor: "pointer", fontSize: "12px", fontFamily: "'Outfit', sans-serif", textDecoration: "underline" }}>Terms of Service</button>
          <span style={{ color: T.stamp, fontSize: "12px", fontFamily: "'Outfit', sans-serif" }}>{CONTACT_EMAIL}</span>
        </div>
      </div>
      <div style={{ marginTop: "16px", color: T.stamp, fontSize: "11px", fontFamily: "'Outfit', sans-serif" }}>
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved. ♪
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// EDIT PROFILE MODAL
// ─────────────────────────────────────────────────────────────────────────────
const EditProfileModal = ({ profile, onClose, onSave }) => {
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [username, setUsername]       = useState(profile?.username || "");
  const [avatarType, setAvatarType]   = useState(profile?.avatar_url ? "upload" : "icon");
  const [selectedIcon, setSelectedIcon] = useState(profile?.avatar_emoji || "vinyl");
  const [uploadedPhoto, setUploadedPhoto] = useState(profile?.avatar_url || null);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");
  const photoRef                      = useRef();

  // Detect if current avatar_emoji is actually an icon id or an old emoji
  const currentIsIcon = AVATAR_ICONS.some(a => a.id === selectedIcon);

  const handlePhoto = (e) => {
    const f = e.target.files[0];
    if (!f || !f.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = (ev) => { setUploadedPhoto(ev.target.result); setAvatarType("upload"); };
    r.readAsDataURL(f);
  };

  const handleSave = async () => {
    setError(""); setSaving(true);
    try {
      if (!username.trim()) throw new Error("Username is required.");
      // Check username uniqueness (exclude self)
      const { data: existing } = await supabase.from("profiles").select("id").eq("username", username.trim().toLowerCase()).neq("id", profile.id).single();
      if (existing) throw new Error("That username is already taken.");
      const updates = {
        username: username.trim().toLowerCase(),
        display_name: displayName.trim() || username.trim(),
        avatar_emoji: avatarType === "icon" ? selectedIcon : "upload",
        avatar_url: avatarType === "upload" ? uploadedPhoto : null,
      };
      const { error: e } = await supabase.from("profiles").update(updates).eq("id", profile.id);
      if (e) throw e;
      onSave({ ...profile, ...updates });
      onClose();
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const AvatarPreview = ({ size = 56 }) => {
    if (avatarType === "upload" && uploadedPhoto) {
      return <img src={uploadedPhoto} alt="avatar" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: `2px solid ${T.accent}` }} />;
    }
    const icon = AVATAR_ICONS.find(a => a.id === selectedIcon) || AVATAR_ICONS[0];
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", background: T.ink, border: `2px solid ${T.accent}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
        dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 40 40" width="${size - 12}" height="${size - 12}" xmlns="http://www.w3.org/2000/svg">${icon.svg.replace(/<svg[^>]*>/, "").replace("</svg>", "")}</svg>` }} />
    );
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,16,8,.78)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: T.cream, border: `2px solid ${T.ink}`, borderRadius: "2px", width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto", boxShadow: `6px 6px 0 ${T.groove}` }}>

        {/* Header */}
        <div style={{ background: T.ink, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 1 }}>
          <div>
            <div style={{ color: T.accent, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif", marginBottom: "3px" }}>♪ Profile</div>
            <h2 style={{ color: T.title, fontFamily: "'Fraunces', serif", fontSize: "20px", margin: 0 }}>Edit Your Profile</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.groove, cursor: "pointer", fontSize: "18px" }}>✕</button>
        </div>

        <div style={{ padding: "24px" }}>
          {/* Avatar preview + upload */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px", padding: "16px", background: T.paper, border: `1.5px solid ${T.groove}`, borderRadius: "3px" }}>
            <AvatarPreview size={64} />
            <div>
              <div style={{ color: T.stamp, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif", marginBottom: "8px" }}>Your Avatar</div>
              <button onClick={() => photoRef.current.click()}
                style={{ background: T.ink, border: "none", color: T.cream, borderRadius: "2px", padding: "7px 14px", cursor: "pointer", fontSize: "11px", fontWeight: "700", fontFamily: "'Outfit', sans-serif", letterSpacing: "1px", marginRight: "8px" }}>
                ↑ Upload Photo
              </button>
              {uploadedPhoto && (
                <button onClick={() => { setUploadedPhoto(null); setAvatarType("icon"); }}
                  style={{ background: "transparent", border: `1px solid ${T.groove}`, color: T.stamp, borderRadius: "2px", padding: "7px 12px", cursor: "pointer", fontSize: "11px", fontFamily: "'Outfit', sans-serif" }}>
                  Remove
                </button>
              )}
              <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
            </div>
          </div>

          {/* Icon picker */}
          <div style={{ marginBottom: "24px" }}>
            <label style={S.label}>Or choose an icon</label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {AVATAR_ICONS.map(icon => {
                const isSelected = avatarType === "icon" && selectedIcon === icon.id;
                return (
                  <div key={icon.id} onClick={() => { setSelectedIcon(icon.id); setAvatarType("icon"); }}
                    title={icon.label}
                    style={{ width: 48, height: 48, borderRadius: "50%", background: isSelected ? T.ink : T.paper, border: `2px solid ${isSelected ? T.accent : T.groove}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", overflow: "hidden" }}
                    dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 40 40" width="30" height="30" xmlns="http://www.w3.org/2000/svg">${icon.svg.replace(/<svg[^>]*>/, "").replace("</svg>", "")}</svg>` }}
                  />
                );
              })}
            </div>
          </div>

          {/* Name fields */}
          <div style={{ display: "grid", gap: "14px" }}>
            <div>
              <label style={S.label}>Display Name</label>
              <input style={S.input} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="e.g. Maya Chen" />
            </div>
            <div>
              <label style={S.label}>Username *</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: T.groove }}>@</span>
                <input style={{ ...S.input, paddingLeft: "26px" }} value={username} onChange={e => setUsername(e.target.value.replace(/\s/g, ""))} placeholder="yourhandle" />
              </div>
            </div>
          </div>

          {error && (
            <div style={{ marginTop: "14px", background: "#fde8e8", border: `1px solid ${T.red}`, borderRadius: "3px", padding: "10px 14px", color: T.red, fontSize: "12px", fontFamily: "'Outfit', sans-serif" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button onClick={onClose} style={{ flex: 1, padding: "12px", background: "transparent", border: `1.5px solid ${T.groove}`, borderRadius: "3px", color: T.stamp, cursor: "pointer", fontSize: "12px", fontFamily: "'Outfit', sans-serif" }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              style={{ flex: 2, padding: "12px", background: T.ink, border: "none", borderRadius: "3px", color: T.cream, cursor: saving ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: "700", fontFamily: "'Fraunces', serif", opacity: saving ? 0.6 : 1, boxShadow: `3px 3px 0 ${T.groove}` }}>
              {saving ? "Saving…" : "▶ Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AUTH PANEL — inline form used on the dedicated login page
// ─────────────────────────────────────────────────────────────────────────────
const AuthPanel = ({ onAuth }) => {
  const [mode, setMode]               = useState("login");
  const [identifier, setIdentifier]   = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [username, setUsername]       = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);

  const resolveEmail = async (input) => {
    if (input.includes("@") && input.includes(".")) return input.trim();
    const handle = input.replace(/^@/, "").trim().toLowerCase();
    const { data } = await supabase.from("profiles").select("email").eq("username", handle).single();
    if (!data?.email) throw new Error("No account found with that username.");
    return data.email;
  };

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "signup") {
        if (!username.trim()) throw new Error("Username is required.");
        if (!email.trim())    throw new Error("Email is required.");
        const { data: existing } = await supabase.from("profiles").select("id").eq("username", username.trim().toLowerCase()).single();
        if (existing) throw new Error("That username is already taken.");
        const { data, error: e } = await supabase.auth.signUp({ email: email.trim(), password });
        if (e) throw e;
        if (data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            username: username.trim().toLowerCase(),
            display_name: displayName.trim() || username.trim(),
            avatar_emoji: "🎵",
            email: email.trim(),
          });
          onAuth(data.user);
        }
      } else {
        const resolvedEmail = await resolveEmail(identifier);
        const { data, error: e } = await supabase.auth.signInWithPassword({ email: resolvedEmail, password });
        if (e) throw e;
        onAuth(data.user);
      }
    } catch (e) { setError(e.message || "Something went wrong."); }
    setLoading(false);
  };

  return (
    <div>
      {/* Mode toggle */}
      <div style={{ display: "flex", marginBottom: "32px", background: T.paper, borderRadius: "3px", padding: "3px", border: `1px solid ${T.groove}` }}>
        {["login","signup"].map(m => (
          <button key={m} onClick={() => { setMode(m); setError(""); }}
            style={{ flex: 1, padding: "10px", background: mode === m ? T.ink : "transparent", color: mode === m ? T.cream : T.stamp, border: "none", borderRadius: "2px", cursor: "pointer", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif", transition: "all .2s" }}>
            {m === "login" ? "▶ Sign In" : "♪ Join"}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: "8px" }}>
        <div style={{ color: T.ink, fontFamily: "'Fraunces', serif", fontSize: "26px", fontWeight: "700", marginBottom: "4px" }}>
          {mode === "login" ? "Welcome back." : "Start your collection."}
        </div>
        <div style={{ color: T.stamp, fontSize: "13px", fontFamily: "'Outfit', sans-serif", fontStyle: "italic" }}>
          {mode === "login" ? "Sign in with your email or @username." : "Create your account to press your first record."}
        </div>
      </div>

      <div style={{ display: "grid", gap: "14px", marginTop: "24px" }}>
        {mode === "signup" ? (
          <>
            <div>
              <label style={S.label}>Username *</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: T.groove, fontSize: "14px" }}>@</span>
                <input style={{ ...S.input, paddingLeft: "26px" }} value={username} onChange={e => setUsername(e.target.value.replace(/\s/g, ""))} placeholder="yourhandle" />
              </div>
              <div style={{ color: T.groove, fontSize: "10px", fontFamily: "'Outfit', sans-serif", marginTop: "4px" }}>Searchable by other users. Lowercase, no spaces.</div>
            </div>
            <div>
              <label style={S.label}>Display Name</label>
              <input style={S.input} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="e.g. Maya Chen (optional)" />
            </div>
            <div>
              <label style={S.label}>Email *</label>
              <input type="email" style={S.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
          </>
        ) : (
          <div>
            <label style={S.label}>Email or @Username</label>
            <input style={S.input} value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="you@example.com or @handle" autoFocus />
          </div>
        )}
        <div>
          <label style={S.label}>Password</label>
          <input type="password" style={S.input} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>
        {error && (
          <div style={{ background: "#fde8e8", border: `1px solid ${T.red}`, borderRadius: "3px", padding: "10px 14px", color: T.red, fontSize: "12px", fontFamily: "'Outfit', sans-serif" }}>
            {error}
          </div>
        )}
      </div>

      <button onClick={handleSubmit} disabled={loading}
        style={{ width: "100%", marginTop: "20px", padding: "14px", background: T.ink, border: "none", borderRadius: "3px", color: T.cream, cursor: loading ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: "700", fontFamily: "'Fraunces', serif", letterSpacing: "0.5px", opacity: loading ? 0.6 : 1, boxShadow: `3px 3px 0 ${T.groove}`, transition: "all .15s" }}
        onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = `4px 4px 0 ${T.groove}`; } }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `3px 3px 0 ${T.groove}`; }}>
        {loading ? "♪ Loading…" : mode === "login" ? "▶ Play My Collection" : "▶ Press My First Record"}
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FOLLOWING MODAL — people you follow, with profile drill-down
// ─────────────────────────────────────────────────────────────────────────────
const FollowingModal = ({ users, onClose, onViewProfile, onToggleFollow }) => {
  const following = users.filter(u => u.following);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,16,8,.78)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: T.cream, border: `2px solid ${T.ink}`, borderRadius: "2px", width: "100%", maxWidth: "480px", maxHeight: "80vh", overflowY: "auto", boxShadow: `6px 6px 0 ${T.groove}` }}>

        {/* Header */}
        <div style={{ background: T.ink, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 1 }}>
          <div>
            <div style={{ color: T.accent, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif", marginBottom: "4px" }}>♫ Following</div>
            <h2 style={{ color: T.title, fontFamily: "'Fraunces', serif", fontSize: "20px", margin: 0 }}>
              {following.length} Listener{following.length !== 1 ? "s" : ""} You Follow
            </h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.groove, cursor: "pointer" }}><Sym>■</Sym></button>
        </div>

        {/* List */}
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {following.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: T.groove, fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontStyle: "italic" }}>
              You're not following anyone yet.<br />
              <span style={{ fontSize: "12px", color: T.grooveLt }}>Head to A-Side to find listeners.</span>
            </div>
          ) : (
            following.map(u => (
              <div key={u.id}
                style={{ background: T.paper, border: `1.5px solid ${T.groove}`, borderRadius: "3px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", boxShadow: `2px 2px 0 ${T.grooveLt}` }}>
                <div onClick={() => { onViewProfile(u); onClose(); }} style={{ cursor: "pointer" }}>
                  <AvatarImg profile={u} size={42} />
                </div>
                <div style={{ flex: 1, cursor: "pointer", minWidth: 0 }} onClick={() => { onViewProfile(u); onClose(); }}>
                  <div style={{ color: T.ink, fontFamily: "'Fraunces', serif", fontSize: "16px", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {u.display_name || u.username}
                  </div>
                  <div style={{ color: T.stamp, fontSize: "11px", fontFamily: "'Outfit', sans-serif" }}>
                    @{u.username} · {u.concerts?.length || 0} shows ·{" "}
                    <span style={{ color: T.accent }}><Sym>▶</Sym> View profile</span>
                  </div>
                </div>
                <button onClick={() => onToggleFollow(u.id)}
                  style={{ background: "transparent", border: `1.5px solid ${T.groove}`, color: T.stamp, borderRadius: "2px", padding: "6px 12px", cursor: "pointer", fontSize: "10px", fontWeight: "700", fontFamily: "'Outfit', sans-serif", letterSpacing: "1px", whiteSpace: "nowrap", transition: "all .2s", flexShrink: 0 }}>
                  <Sym>■</Sym> Unfollow
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // ── Auth state ──
  const [authUser, setAuthUser]       = useState(null);   // Supabase auth user
  const [profile, setProfile]         = useState(null);   // profiles row
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuth, setShowAuth]       = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // ── App state ──
  const [tab, setTab]                 = useState("upcoming");
  const [concerts, setConcerts]       = useState([]);
  const [encoreList, setEncoreList]   = useState([]);
  const [users, setUsers]             = useState([]);
  const [modal, setModal]             = useState(null);
  const [sleeve, setSleeve]           = useState(null);
  const [profileView, setProfileView] = useState(null);
  const [showFindUsers, setShowFindUsers] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms]     = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [sort, setSort]               = useState("date-desc");
  const [concertSearch, setConcertSearch] = useState("");
  const [loading, setLoading]         = useState(false);
  const searchRef                     = useRef();

  // ── On mount: check session ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthUser(session.user);
        loadProfile(session.user.id);
      }
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthUser(session.user);
        loadProfile(session.user.id);
      } else {
        setAuthUser(null);
        setProfile(null);
        setConcerts([]);
        setEncoreList([]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (uid) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    if (data) {
      setProfile(data);
      loadConcerts(uid);
      loadEncoreList(uid);
      loadUsers(uid);
    }
  };

  const loadConcerts = async (uid) => {
    setLoading(true);
    const { data } = await supabase
      .from("concerts")
      .select("*")
      .eq("user_id", uid)
      .order("date", { ascending: false });
    setConcerts(data || []);
    setLoading(false);
  };

  const loadEncoreList = async (uid) => {
    const { data } = await supabase.from("encore_list").select("concert_id").eq("user_id", uid);
    setEncoreList((data || []).map(r => r.concert_id));
  };

  const loadUsers = async (uid) => {
    // Load all profiles except self
    const { data: profiles } = await supabase.from("profiles").select("*").neq("id", uid);
    // Load who current user follows
    const { data: follows } = await supabase.from("follows").select("following_id").eq("follower_id", uid);
    const followingIds = new Set((follows || []).map(f => f.following_id));
    // For each profile, load their concerts
    const withConcerts = await Promise.all((profiles || []).map(async (p) => {
      const { data: pConcerts } = await supabase.from("concerts").select("*").eq("user_id", p.id).order("date", { ascending: false });
      const { data: pEncore } = await supabase.from("encore_list").select("concert_id").eq("user_id", p.id);
      return {
        ...p,
        following: followingIds.has(p.id),
        concerts: pConcerts || [],
        encore_list: (pEncore || []).map(r => r.concert_id),
      };
    }));
    setUsers(withConcerts);
  };

  // ── Concert CRUD ──
  const handleSave = async (form) => {
    if (!authUser) return;
    const payload = {
      user_id:  authUser.id,
      artist:   form.artist,
      venue:    form.venue,
      city:     form.city,
      date:     form.date || null,
      genre:    form.genre,
      review:   form.review,
      rating:   form.rating,
      setlist:  form.setlist,
      media:    form.media,
    };
    if (form.id) {
      const { data } = await supabase.from("concerts").update(payload).eq("id", form.id).select().single();
      if (data) setConcerts(cs => cs.map(c => c.id === form.id ? data : c));
    } else {
      const { data } = await supabase.from("concerts").insert(payload).select().single();
      if (data) setConcerts(cs => [data, ...cs]);
    }
    setModal(null);
  };

  const handleDelete = async (id) => {
    await supabase.from("concerts").delete().eq("id", id);
    setConcerts(cs => cs.filter(c => c.id !== id));
    setEncoreList(el => el.filter(e => String(e) !== String(id)));
  };

  // ── Encore list ──
  const toggleEncore = async (id) => {
    if (!authUser) return;
    const strId = String(id);
    const isIn = encoreList.map(String).includes(strId);
    if (isIn) {
      await supabase.from("encore_list").delete().eq("user_id", authUser.id).eq("concert_id", id);
      setEncoreList(prev => prev.filter(e => String(e) !== strId));
    } else {
      if (encoreList.length >= 3) return;
      await supabase.from("encore_list").insert({ user_id: authUser.id, concert_id: id });
      setEncoreList(prev => [...prev, id]);
    }
  };

  // ── Follow / unfollow ──
  const toggleFollow = async (targetId) => {
    if (!authUser) return;
    const u = users.find(x => x.id === targetId);
    if (!u) return;
    if (u.following) {
      await supabase.from("follows").delete().eq("follower_id", authUser.id).eq("following_id", targetId);
    } else {
      await supabase.from("follows").insert({ follower_id: authUser.id, following_id: targetId });
    }
    setUsers(us => us.map(x => x.id === targetId ? { ...x, following: !x.following } : x));
    if (profileView?.id === targetId) setProfileView(pv => ({ ...pv, following: !pv.following }));
  };

  // ── Sign out ──
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // ── Derived data ──
  const allConcerts = [
    ...concerts,
    ...users.flatMap(u => u.concerts),
  ];

  const filtered = concerts
    .filter(c => {
      const q = concertSearch.toLowerCase();
      return !q || [c.artist, c.venue, c.city, c.genre].some(x => (x||"").toLowerCase().includes(q));
    })
    .sort((a, b) =>
      sort === "date-desc" ? (b.date||"").localeCompare(a.date||"") :
      sort === "date-asc"  ? (a.date||"").localeCompare(b.date||"") :
      sort === "rating"    ? b.rating - a.rating :
      (a.artist||"").localeCompare(b.artist||"")
    );

  const feed = users
    .filter(u => u.following)
    .flatMap(u => u.concerts.map(c => ({ ...c, _owner: u })))
    .sort((a, b) => (b.date||"").localeCompare(a.date||""));

  const avgRating = concerts.length
    ? (concerts.reduce((s,c) => s + (c.rating||0), 0) / concerts.length).toFixed(1)
    : "—";

  // ── Tab styles ──
  const tabStyle = (t) => ({
    padding: "8px 18px", cursor: "pointer", fontSize: "10px", letterSpacing: "2px",
    textTransform: "uppercase", fontFamily: "'Outfit', sans-serif",
    background: tab === t ? T.accent : "transparent",
    color: tab === t ? T.ink : T.groove,
    border: `1.5px solid ${tab === t ? T.accent : "rgba(255,255,255,.15)"}`,
    borderRadius: "2px", fontWeight: "700", transition: "all .2s",
  });

  if (authLoading) return (
    <div style={{ minHeight: "100vh", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,900;1,9..144,400&family=Outfit:wght@300;400;700&display=swap'); @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ color: T.title, fontFamily: "'Fraunces', serif", fontSize: "52px", fontWeight: "900", letterSpacing: "-2px" }}>Record</div>
      <Spinner />
    </div>
  );

  // ── DEDICATED LOGIN / SIGNUP PAGE (shown when not logged in) ──
  if (!authUser) return (
    <div style={{ minHeight: "100vh", background: T.ink, display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,900;1,9..144,300;1,9..144,400&family=Outfit:wght@300;400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.ink}; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { border-color: ${T.accent} !important; }
      `}</style>

      <div style={{ flex: 1, display: "flex", alignItems: "stretch", minHeight: "100vh" }}>

        {/* ── LEFT PANEL — branding ── */}
        <div style={{ flex: 1, background: T.ink, padding: "60px 56px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
          {/* Vinyl ring decorations */}
          {[420, 340, 260, 180, 100].map((size, i) => (
            <div key={i} style={{ position: "absolute", right: -(size / 3), bottom: -(size / 3), width: size, height: size, borderRadius: "50%", border: `1px solid rgba(126,200,216,${0.03 + i * 0.025})`, pointerEvents: "none" }} />
          ))}
          {/* Groove lines */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "auto" }}>
            {[0.05, 0.09, 0.06, 0.04].map((op, i) => (
              <div key={i} style={{ height: "1px", background: `rgba(126,200,216,${op})` }} />
            ))}
          </div>

          <div style={{ marginTop: "48px" }}>
            <div style={{ color: T.accent, fontSize: "10px", letterSpacing: "5px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif", marginBottom: "20px" }}>
              ♪ ♫ &nbsp; {APP_SUBTITLE}
            </div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(64px, 10vw, 96px)", fontWeight: "900", letterSpacing: "-4px", lineHeight: 0.88, color: T.title }}>
              {APP_NAME}
            </h1>
            <p style={{ color: T.groove, fontSize: "16px", marginTop: "20px", fontStyle: "italic", fontFamily: "'Outfit', sans-serif", lineHeight: 1.6, maxWidth: "340px" }}>
              {APP_TAGLINE}
            </p>
          </div>

          {/* Feature list */}
          <div style={{ marginTop: "56px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { icon: "♪", text: "Log every concert you've ever been to" },
              { icon: "★", text: "Build your all-time Encore List" },
              { icon: "♫", text: "Follow friends & see what they've seen" },
              { icon: "▶", text: "Rate, review & log full setlists" },
            ].map(f => (
              <div key={f.icon} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ color: T.accent, fontSize: "16px", width: "20px", textAlign: "center" }}>{f.icon}</span>
                <span style={{ color: T.grooveLt, fontFamily: "'Outfit', sans-serif", fontSize: "13px" }}>{f.text}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "48px", color: T.stamp, fontSize: "11px", fontFamily: "'Outfit', sans-serif" }}>
            © {new Date().getFullYear()} {APP_NAME} · {CONTACT_EMAIL}
          </div>
        </div>

        {/* ── RIGHT PANEL — auth form ── */}
        <div style={{ width: "460px", minWidth: "360px", background: T.cream, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 48px", position: "relative" }}>
          {/* Top accent bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: T.accent }} />

          <AuthPanel onAuth={(u) => setAuthUser(u)} />

          <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: `1px solid ${T.groove}`, display: "flex", gap: "16px", justifyContent: "center" }}>
            <button onClick={() => setShowPrivacy(true)} style={{ background: "none", border: "none", color: T.groove, cursor: "pointer", fontSize: "11px", fontFamily: "'Outfit', sans-serif", textDecoration: "underline" }}>Privacy Policy</button>
            <button onClick={() => setShowTerms(true)} style={{ background: "none", border: "none", color: T.groove, cursor: "pointer", fontSize: "11px", fontFamily: "'Outfit', sans-serif", textDecoration: "underline" }}>Terms of Service</button>
          </div>
        </div>
      </div>

      {showPrivacy && <LegalModal title="Privacy Policy" sections={PRIVACY_SECTIONS} onClose={() => setShowPrivacy(false)} />}
      {showTerms   && <LegalModal title="Terms of Service" sections={TERMS_SECTIONS}  onClose={() => setShowTerms(false)} />}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.ink, fontFamily: "'Outfit', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,900;1,9..144,300;1,9..144,400&family=Outfit:wght@300;400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.bg}; }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${T.paper}; }
        ::-webkit-scrollbar-thumb { background: ${T.groove}; border-radius: 2px; }
        input:focus, select:focus, textarea:focus { border-color: ${T.accent} !important; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: sepia(.5); }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: T.ink, padding: "40px 32px 0", borderBottom: `4px solid ${T.accent}` }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          {/* Groove decoration */}
          <div style={{ marginBottom: "22px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {[0.06, 0.1, 0.07].map((op, i) =>
              <div key={i} style={{ height: "1px", background: `rgba(126,200,216,${op})` }} />)}
          </div>

          {/* Title row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ color: T.accent, fontSize: "10px", letterSpacing: "5px", textTransform: "uppercase", marginBottom: "10px", fontFamily: "'Outfit', sans-serif" }}>
                ♪ ♫ &nbsp; {APP_SUBTITLE}
              </div>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(52px,8vw,80px)", fontWeight: "900", letterSpacing: "-3px", lineHeight: 0.9, color: T.title }}>
                {APP_NAME}
              </h1>
              <p style={{ color: T.groove, fontSize: "14px", marginTop: "12px", fontStyle: "italic", fontFamily: "'Outfit', sans-serif" }}>{APP_TAGLINE}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div onClick={() => setShowEditProfile(true)} style={{ cursor: "pointer" }} title="Edit profile">
                  <AvatarImg profile={profile} size={32} />
                </div>
                <div style={{ color: T.groove, fontSize: "12px", fontFamily: "'Outfit', sans-serif" }}>
                  {profile?.display_name || profile?.username || authUser.email}
                </div>
                <button onClick={handleSignOut}
                  style={{ background: "transparent", border: `1px solid ${T.groove}`, color: T.groove, borderRadius: "2px", padding: "6px 12px", cursor: "pointer", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif" }}>
                  Sign Out
                </button>
              </div>
              <button
                onClick={() => setModal("new")}
                style={{ background: T.accent, color: T.ink, border: "none", borderRadius: "2px", padding: "14px 26px", fontWeight: "700", cursor: "pointer", fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif", boxShadow: `3px 3px 0 ${T.accentDk}`, whiteSpace: "nowrap", transition: "all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = `4px 4px 0 ${T.accentDk}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `3px 3px 0 ${T.accentDk}`; }}>
                ♪ Press a Record
              </button>
            </div>
          </div>

          {/* Global search bar */}
          <div style={{ position: "relative", marginTop: "28px" }} ref={searchRef}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: T.groove, fontSize: "14px", pointerEvents: "none" }}>♪</span>
              <input
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                placeholder="Find artists, venues, cities, & users…"
                style={{ ...S.input, paddingLeft: "36px", background: "rgba(255,255,255,.08)", border: `1.5px solid rgba(255,255,255,.12)`, color: T.title, fontSize: "14px" }}
              />
              {globalSearch && (
                <button onClick={() => setGlobalSearch("")}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: T.groove, cursor: "pointer", fontSize: "14px" }}>✕</button>
              )}
            </div>
            {searchFocused && globalSearch && (
              <GlobalSearchPanel
                query={globalSearch}
                allConcerts={allConcerts}
                allUsers={users}
                onOpenConcert={setSleeve}
                onOpenProfile={setProfileView}
                onToggleFollow={toggleFollow}
                onClose={() => { setGlobalSearch(""); setSearchFocused(false); }}
              />
            )}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "36px", marginTop: "24px", paddingTop: "20px", borderTop: `1px solid rgba(255,255,255,.08)`, flexWrap: "wrap" }}>
            {[
              { l: "Shows Pressed",       v: concerts.length,                        onClick: () => setTab("b-side") },
              { l: "Avg Rating",          v: avgRating,                              onClick: null },
              { l: "Listeners Following", v: users.filter(u => u.following).length,  onClick: () => setShowFollowing(true) },
            ].map(s => (
              <div key={s.l} onClick={s.onClick || undefined}
                style={{ cursor: s.onClick ? "pointer" : "default", transition: "opacity .15s" }}
                onMouseEnter={e => { if (s.onClick) e.currentTarget.style.opacity = "0.75"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
                <div style={{ color: T.accent, fontSize: "24px", fontFamily: "'Fraunces', serif", fontWeight: "700" }}>{s.v}</div>
                <div style={{ color: T.groove, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", marginTop: "2px" }}>
                  {s.l}{s.onClick ? <span style={{ color: T.accent, marginLeft: "4px" }}>↗</span> : ""}
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "8px", marginTop: "24px", paddingBottom: "0", flexWrap: "wrap" }}>
            <button style={tabStyle("upcoming")} onClick={() => setTab("upcoming")}>
              ♪ Upcoming
            </button>
            <button style={tabStyle("a-side")} onClick={() => setTab("a-side")}>
              ▶ A-Side
            </button>
            {/* Spacer pushes B-Side to the right */}
            <div style={{ flex: 1 }} />
            <button style={tabStyle("b-side")} onClick={() => setTab("b-side")}>
              ■ B-Side
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, maxWidth: "760px", width: "100%", margin: "0 auto", padding: "28px 32px 40px" }}>

        {/* ── UPCOMING ── */}
        {tab === "upcoming" && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "52px", color: T.groove, marginBottom: "16px" }}>♫</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "28px", color: T.inkLight, marginBottom: "10px" }}>Upcoming Shows</div>
            <div style={{ fontSize: "14px", color: T.groove, fontStyle: "italic", maxWidth: "380px", margin: "0 auto", lineHeight: 1.7 }}>
              Soon: browse upcoming concerts near you, see who else is going, and log your plans.<br /><br />
              <span style={{ color: T.stamp, fontSize: "12px" }}>API integration coming soon.</span>
            </div>
          </div>
        )}

        {/* ── A-SIDE (friends feed) ── */}
        {tab === "a-side" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ color: T.stamp, fontSize: "12px", fontStyle: "italic" }}>
                ♪ Recent shows from {users.filter(u => u.following).length} listeners you follow
              </div>
              <button onClick={() => setShowFindUsers(true)}
                style={{ background: T.ink, border: "none", color: T.cream, borderRadius: "2px", padding: "8px 16px", cursor: "pointer", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif" }}>
                ♪ Find Listeners
              </button>
            </div>
            {feed.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: "52px", color: T.groove, marginBottom: "16px" }}>♫</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", color: T.groove, marginBottom: "8px" }}>The listening room is quiet.</div>
                <div style={{ fontSize: "13px", color: T.grooveLt, fontStyle: "italic" }}>Follow some listeners to hear what they've been to.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {feed.map((c, i) => (
                  <div key={c.id + c._owner.id}>
                    {/* Feed ticket row — stub + copy button side by side */}
                    <div style={{ display: "flex", alignItems: "stretch", gap: "0" }}>
                      <div style={{ flex: 1 }}>
                        <TicketStub
                          concert={c}
                          onOpen={setSleeve}
                          showOwner
                          ownerName={c._owner.display_name || c._owner.username}
                          ownerHandle={`@${c._owner.username}`}
                          ownerProfile={c._owner}
                          onOwnerClick={() => setProfileView(c._owner)}
                        />
                      </div>
                      {/* + Log this show button */}
                      {authUser && (
                        <button
                          onClick={() => setModal({ artist: c.artist, venue: c.venue, city: c.city, date: c.date, genre: c.genre, setlist: [], media: [], review: "", rating: 0 })}
                          title="Log this show to your collection"
                          style={{ background: T.paper, border: `1.5px solid ${T.inkLight}`, borderLeft: "none", borderRadius: "0 3px 3px 0", padding: "0 14px", cursor: "pointer", color: T.stamp, fontSize: "18px", fontWeight: "700", transition: "all .2s", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                          onMouseEnter={e => { e.currentTarget.style.background = T.accent; e.currentTarget.style.color = T.ink; }}
                          onMouseLeave={e => { e.currentTarget.style.background = T.paper; e.currentTarget.style.color = T.stamp; }}>
                          +
                        </button>
                      )}
                    </div>
                    {i < feed.length - 1 && <Groove />}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── B-SIDE (your logs) ── */}
        {tab === "b-side" && (
          <>
                {/* Encore list */}
                <EncoreListSection
                  concerts={concerts}
                  encoreList={encoreList}
                  onOpen={setSleeve}
                  onToggleEncore={toggleEncore}
                  isOwn={true}
                />

                {/* Search + sort */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                  <input value={concertSearch} onChange={e => setConcertSearch(e.target.value)} placeholder="♪  Filter your shows…" style={{ ...S.input, flex: 1, minWidth: "180px" }} />
                  <select value={sort} onChange={e => setSort(e.target.value)} style={{ ...S.input, width: "auto", color: T.stamp }}>
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="rating">Top Rated</option>
                    <option value="artist">Artist A–Z</option>
                  </select>
                </div>

                {loading && <Spinner />}
                {!loading && filtered.length === 0 && (
                  <div style={{ textAlign: "center", padding: "80px 20px" }}>
                    <div style={{ fontSize: "52px", color: T.groove, marginBottom: "16px" }}>♪</div>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", color: T.groove, marginBottom: "8px" }}>
                      {concertSearch ? "Nothing in the collection matches." : "Your record collection is empty."}
                    </div>
                    <div style={{ fontSize: "13px", color: T.grooveLt, fontStyle: "italic" }}>
                      {concertSearch ? "Try a different search." : "Press your first record to get started."}
                    </div>
                  </div>
                )}
                {!loading && filtered.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {filtered.map((c, i) => (
                      <div key={c.id}>
                        <div style={{ position: "relative" }}>
                          <TicketStub
                            concert={c}
                            onOpen={setSleeve}
                            onEdit={setModal}
                            onDelete={handleDelete}
                            isEncore={encoreList.map(String).includes(String(c.id))}
                          />
                          <button
                            onClick={() => toggleEncore(c.id)}
                            title={
                              encoreList.map(String).includes(String(c.id)) ? "Remove from Encore List" :
                              encoreList.length >= 3 ? "Encore List full (max 3)" : "Add to Encore List"
                            }
                            style={{
                              position: "absolute", top: 8, right: 52,
                              background: "none", border: "none",
                              cursor: encoreList.length >= 3 && !encoreList.map(String).includes(String(c.id)) ? "not-allowed" : "pointer",
                              fontSize: "16px",
                              color: encoreList.map(String).includes(String(c.id)) ? T.accent : T.groove,
                              opacity: encoreList.length >= 3 && !encoreList.map(String).includes(String(c.id)) ? 0.3 : 1,
                              transition: "color .2s",
                            }}>★</button>
                        </div>
                        {i < filtered.length - 1 && <Groove />}
                      </div>
                    ))}
                  </div>
                )}
          </>
        )}
      </div>

      <Footer onPrivacy={() => setShowPrivacy(true)} onTerms={() => setShowTerms(true)} />

      {/* ── MODALS ── */}
      {modal        && <ConcertModal concert={modal === "new" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
      {sleeve       && <SleeveModal concert={sleeve} onClose={() => setSleeve(null)} isOwn={authUser && !sleeve._owner} onEdit={(c) => { setSleeve(null); setModal(c); }} />}
      {profileView  && <ProfilePage user={profileView} onClose={() => setProfileView(null)} onToggleFollow={toggleFollow} onLogConcert={(c) => { setProfileView(null); setModal({ artist: c.artist, venue: c.venue, city: c.city, date: c.date, genre: c.genre, setlist: [], media: [], review: "", rating: 0 }); }} />}
      {showFindUsers && <FindUsersModal onClose={() => setShowFindUsers(false)} users={users} onToggleFollow={toggleFollow} onViewProfile={(u) => { setProfileView(u); setShowFindUsers(false); }} />}
      {showFollowing && <FollowingModal users={users} onClose={() => setShowFollowing(false)} onViewProfile={setProfileView} onToggleFollow={toggleFollow} />}
      {showEditProfile && <EditProfileModal profile={profile} onClose={() => setShowEditProfile(false)} onSave={(updated) => setProfile(updated)} />}
      {showPrivacy  && <LegalModal title="Privacy Policy" sections={PRIVACY_SECTIONS} onClose={() => setShowPrivacy(false)} />}
      {showTerms    && <LegalModal title="Terms of Service" sections={TERMS_SECTIONS} onClose={() => setShowTerms(false)} />}
    </div>
  );
}
