import { useState, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────────────────────────────────────
const SEED_USERS = [
  {
    id: "u1", name: "Maya Chen", handle: "@mayabeats", avatar: "🎸", following: true,
    encoreList: ["fc1", "fc2"],
    concerts: [
      { id: "fc1", artist: "Mitski", venue: "Terminal 5", city: "New York, NY", date: "2024-03-08", genre: "Indie Rock", rating: 5, review: "One of the most emotionally devastating sets I've ever witnessed. Every song felt like a confession.", setlist: ["Bury Me at Makeout Creek", "Nobody", "Washing Machine Heart", "Two Slow Dancers"], media: [] },
      { id: "fc2", artist: "Weyes Blood", venue: "The Fillmore", city: "San Francisco", date: "2023-11-20", genre: "Art Pop", rating: 4, review: "Natalie Mering floated across the stage like a dream. Haunting and perfect.", setlist: ["It's Not Just Me, It's Everybody", "Andromeda", "Movies"], media: [] },
      { id: "fc7", artist: "Big Thief", venue: "Brooklyn Steel", city: "Brooklyn, NY", date: "2023-05-14", genre: "Indie Folk", rating: 4, review: "Adrianne Lenker is otherworldly live.", setlist: ["Masterpiece", "Not", "Wolf"], media: [] },
    ]
  },
  {
    id: "u2", name: "Jordan Kwame", handle: "@jkwame", avatar: "🎺", following: true,
    encoreList: ["fc3", "fc4"],
    concerts: [
      { id: "fc3", artist: "Kendrick Lamar", venue: "Kia Forum", city: "Los Angeles, CA", date: "2024-02-14", genre: "Hip-Hop", rating: 5, review: "Historic. The man is untouchable right now.", setlist: ["N95", "DNA.", "Humble.", "Alright", "The Heart Part 5"], media: [] },
      { id: "fc4", artist: "SZA", venue: "Madison Square Garden", city: "New York, NY", date: "2023-12-01", genre: "R&B", rating: 4, review: "SOS era in full force. Her voice live is something else entirely.", setlist: ["Kill Bill", "Good Days", "Snooze", "Low"], media: [] },
    ]
  },
  {
    id: "u3", name: "Sam Rivera", handle: "@samtheshow", avatar: "🥁", following: false,
    encoreList: ["fc5"],
    concerts: [
      { id: "fc5", artist: "Nine Inch Nails", venue: "Red Rocks", city: "Morrison, CO", date: "2024-01-19", genre: "Industrial", rating: 5, review: "Terrifying. Transcendent. The venue made it feel like the end of the world in the best possible way.", setlist: ["Mr. Self Destruct", "Closer", "Hurt", "Head Like a Hole"], media: [] },
    ]
  },
  {
    id: "u4", name: "Priya Nair", handle: "@priyasounds", avatar: "🎹", following: false,
    encoreList: ["fc6"],
    concerts: [
      { id: "fc6", artist: "Arooj Aftab", venue: "Village Vanguard", city: "New York, NY", date: "2024-04-02", genre: "Jazz", rating: 5, review: "Intimate and otherworldly. The Village Vanguard was the perfect room for her voice.", setlist: ["Mohabbat", "Saans Lo", "Last Night"], media: [] },
    ]
  },
];

const SEED_CONCERTS = [
  { id: 1, artist: "Radiohead", venue: "Madison Square Garden", city: "New York, NY", date: "2023-06-14", genre: "Alternative", review: "Karma Police encore brought actual tears. Thom Yorke is from another dimension.", rating: 5, setlist: ["Daydreaming", "Lucky", "All I Need", "Karma Police", "Creep"], media: [] },
  { id: 2, artist: "Tame Impala", venue: "The Greek Theatre", city: "Los Angeles, CA", date: "2023-08-22", genre: "Psychedelic", review: "Laser show was insane. Lost My Mind felt like actually losing my mind.", rating: 5, setlist: ["Let It Happen", "The Less I Know the Better", "Lost In Yesterday", "Eventually"], media: [] },
  { id: 3, artist: "Phoebe Bridgers", venue: "Red Rocks", city: "Morrison, CO", date: "2022-09-10", genre: "Indie Folk", review: "Skeleton costume against the red rocks backdrop. Full band version of Motion Sickness was a revelation.", rating: 4, setlist: ["Garden Song", "Savior Complex", "Motion Sickness", "Funeral"], media: [] },
];

const GENRES = ["Rock","Pop","Hip-Hop","Jazz","Electronic","Alternative","Indie","R&B","Country","Classical","Metal","Psychedelic","Indie Folk","Industrial","Art Pop","Folk","Other"];
const APP_NAME = "Record";
const APP_TAGLINE = "Every show, pressed to memory.";
const APP_SUBTITLE = "A Live Music Journal for You & Your Friends";
const CONTACT_EMAIL = "hello@recordapp.com";
const LAST_UPDATED = "March 2026";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — warm retro brown + retro light-blue accent
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  // Backgrounds
  bg:        "#c8b89a",   // lighter warm brown page bg
  paper:     "#d4c4a8",   // card/panel bg
  cream:     "#ede0c4",   // lightest surface
  // Ink
  ink:       "#2a1f14",   // near-black brown
  inkLight:  "#4a3828",
  // Accent — retro light blue
  accent:    "#7ec8d8",
  accentDk:  "#5ab5c8",
  accentPale:"#d8eef3",
  // Neutrals
  groove:    "#b8a488",
  grooveLt:  "#cec0a8",
  stamp:     "#6b4c1e",
  red:       "#8b2020",
  // Title
  title:     "#f0ece4",
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
  r.onload = (e) => res({ url: e.target.result, type: file.type.startsWith("video/") ? "video" : "image", name: file.name });
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

// Uniform ▶ / ■ symbols — fixed size wrapper
const Sym = ({ children }) => (
  <span style={{ fontSize: "13px", lineHeight: 1, display: "inline-block", verticalAlign: "middle" }}>
    {children}
  </span>
);

// ♪-note star rating
const NoteRating = ({ v, onChange, size = "sm" }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[1,2,3,4,5].map(n => (
      <span key={n} onClick={() => onChange && onChange(n)}
        style={{ fontSize: size === "lg" ? "22px" : "14px", cursor: onChange ? "pointer" : "default",
          color: n <= v ? T.accent : T.grooveLt, transition: "color .15s", userSelect: "none" }}>♪</span>
    ))}
  </div>
);

// Vinyl groove divider
const Groove = () => (
  <div style={{ height: "14px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "3px" }}>
    {[0.1, 0.18, 0.12, 0.08].map((op, i) =>
      <div key={i} style={{ height: "1px", background: `rgba(100,76,40,${op})` }} />)}
  </div>
);

// Genre label
const GenreSticker = ({ genre }) => (
  <span style={{
    background: T.accentPale, border: `1px solid ${T.accent}`, borderRadius: "2px",
    padding: "2px 7px", fontSize: "9px", color: T.stamp,
    fontFamily: "'Outfit', sans-serif", letterSpacing: "1.5px",
    textTransform: "uppercase", fontWeight: "700",
  }}>{genre}</span>
);

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA STRIP
// ─────────────────────────────────────────────────────────────────────────────
const MediaStrip = ({ media, onAdd, onRemove }) => {
  const ref = useRef();
  const handleFiles = async (files) => {
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/") && !f.type.startsWith("video/")) continue;
      const data = await readFile(f);
      onAdd && onAdd(data);
    }
  };
  if (!media?.length && !onAdd) return null;
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
      {(media || []).map((item, i) => (
        <div key={i} style={{ position: "relative", width: 72, height: 72 }}>
          {item.type === "video"
            ? <video src={item.url} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: "3px", border: `1px solid ${T.groove}` }} />
            : <img src={item.url} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: "3px", border: `1px solid ${T.groove}` }} />}
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
          <span style={{ fontSize: "20px" }}>♪</span><span>Add</span>
          <input ref={ref} type="file" accept="image/*,video/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
        </div>
      )}
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
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const addMedia  = (item) => setF(p => ({ ...p, media: [...(p.media || []), item] }));
  const removeMedia = (i) => setF(p => ({ ...p, media: p.media.filter((_, j) => j !== i) }));
  const handleSave = () => {
    if (!f.artist.trim()) return;
    onSave({ ...f, setlist: setlistInput.split("\n").map(s => s.trim()).filter(Boolean) });
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
          <div><label style={S.label}>Artist / Band *</label><input style={S.input} value={f.artist} onChange={e => set("artist", e.target.value)} placeholder="e.g. Arctic Monkeys" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div><label style={S.label}>Venue</label><input style={S.input} value={f.venue} onChange={e => set("venue", e.target.value)} placeholder="e.g. The Fillmore" /></div>
            <div><label style={S.label}>City</label><input style={S.input} value={f.city} onChange={e => set("city", e.target.value)} placeholder="e.g. Chicago, IL" /></div>
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
          <div><label style={S.label}>Photos & Videos</label><MediaStrip media={f.media} onAdd={addMedia} onRemove={removeMedia} /></div>
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "24px", borderTop: `1px solid ${T.groove}`, paddingTop: "20px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px", background: "transparent", border: `1.5px solid ${T.groove}`, borderRadius: "3px", color: T.stamp, cursor: "pointer", fontSize: "13px", fontFamily: "'Outfit', sans-serif" }}><Sym>■</Sym> Cancel</button>
          <button onClick={handleSave}
            style={{ flex: 2, padding: "11px", background: T.ink, border: "none", borderRadius: "3px", color: T.cream, cursor: "pointer", fontSize: "13px", fontWeight: "700", fontFamily: "'Fraunces', serif", opacity: f.artist.trim() ? 1 : 0.4 }}>
            <Sym>▶</Sym> {concert?.id ? "Save Changes" : "Press It"}
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

        {/* Header */}
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

        {/* Body */}
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
const TicketStub = ({ concert, onEdit, onDelete, onOpen, showOwner, ownerName, ownerHandle, ownerAvatar, isEncore }) => {
  const [hov, setHov] = useState(false);
  const { month, day, year } = fmtDate(concert.date);
  const mediaCount = concert.media?.length || 0;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(concert)}
      style={{
        display: "flex", cursor: "pointer",
        border: `1.5px solid ${isEncore ? T.accent : T.inkLight}`,
        borderRadius: "3px", overflow: "hidden",
        transition: "transform .15s, box-shadow .15s",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? `4px 4px 0 ${T.accent}` : `3px 3px 0 ${T.groove}`,
        background: T.cream,
      }}>
      {/* Date column */}
      <div style={{ background: T.ink, width: 68, minWidth: 68, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "14px 6px", position: "relative" }}>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "1px", background: `repeating-linear-gradient(to bottom, ${T.groove} 0, ${T.groove} 4px, transparent 4px, transparent 8px)` }} />
        <div style={{ color: T.accent, fontSize: "9px", fontWeight: "700", letterSpacing: "2px", fontFamily: "'Outfit', sans-serif" }}>{month}</div>
        <div style={{ color: T.title, fontSize: "28px", fontFamily: "'Fraunces', serif", fontWeight: "900", lineHeight: 1 }}>{day}</div>
        <div style={{ color: T.groove, fontSize: "9px", fontFamily: "'Outfit', sans-serif" }}>{year}</div>
        <div style={{ color: T.accent, fontSize: "16px", marginTop: "6px" }}>♪</div>
      </div>

      {/* Info */}
      <div style={{ flex: 1, padding: "14px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          {showOwner && (
            <div style={{ color: T.stamp, fontSize: "10px", fontFamily: "'Outfit', sans-serif", marginBottom: "4px" }}>
              {ownerAvatar} {ownerName} <span style={{ color: T.grooveLt }}>{ownerHandle}</span>
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

      {/* Actions (hover) */}
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
// PROFILE MODAL
// ─────────────────────────────────────────────────────────────────────────────
const ProfileModal = ({ user, onClose, onToggleFollow }) => {
  const [sleeve, setSleeve] = useState(null);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,16,8,.78)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: T.cream, border: `2px solid ${T.ink}`, borderRadius: "2px", width: "100%", maxWidth: "640px", maxHeight: "90vh", overflowY: "auto", boxShadow: `6px 6px 0 ${T.groove}` }}>
        <div style={{ background: T.ink, padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ fontSize: "34px", background: "rgba(255,255,255,.07)", width: 54, height: 54, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{user.avatar}</div>
              <div>
                <div style={{ color: T.accent, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif", marginBottom: "4px" }}>♪ PUBLIC PROFILE</div>
                <div style={{ color: T.title, fontFamily: "'Fraunces', serif", fontSize: "22px", fontWeight: "700" }}>{user.name}</div>
                <div style={{ color: T.groove, fontFamily: "'Outfit', sans-serif", fontSize: "11px" }}>{user.handle} · {user.concerts.length} shows pressed</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button onClick={() => onToggleFollow(user.id)}
                style={{ background: user.following ? "transparent" : T.accent, border: user.following ? `1px solid ${T.groove}` : "none", color: user.following ? T.groove : T.ink, borderRadius: "3px", padding: "8px 16px", cursor: "pointer", fontSize: "12px", fontWeight: "700", fontFamily: "'Outfit', sans-serif" }}>
                {user.following ? <><Sym>■</Sym> Unfollow</> : <><Sym>▶</Sym> Follow</>}
              </button>
              <button onClick={onClose} style={{ background: "none", border: "none", color: T.groove, cursor: "pointer" }}><Sym>■</Sym></button>
            </div>
          </div>
        </div>
        <div style={{ padding: "24px 32px" }}>
          <EncoreListSection concerts={user.concerts} encoreList={user.encoreList} onOpen={setSleeve} isOwn={false} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {user.concerts.map((c, i) => (
              <div key={c.id}>
                <TicketStub concert={c} onOpen={setSleeve} />
                {i < user.concerts.length - 1 && <Groove />}
              </div>
            ))}
          </div>
        </div>
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
    ? users.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.handle.toLowerCase().includes(q.toLowerCase()))
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
                <span style={{ fontSize: "22px" }}>{u.avatar}</span>
                <div style={{ flex: 1, cursor: "pointer" }} onClick={() => { onViewProfile(u); onClose(); }}>
                  <div style={{ color: T.ink, fontFamily: "'Fraunces', serif", fontSize: "15px", fontWeight: "700" }}>{u.name}</div>
                  <div style={{ color: T.stamp, fontSize: "11px", fontFamily: "'Outfit', sans-serif" }}>{u.handle} · {u.concerts.length} shows · <span style={{ color: T.accent }}><Sym>▶</Sym> View</span></div>
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
// PRIVACY POLICY MODAL
// ─────────────────────────────────────────────────────────────────────────────
const PrivacyPolicy = ({ onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(26,16,8,.78)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()}
      style={{ background: T.cream, border: `2px solid ${T.ink}`, borderRadius: "2px", width: "100%", maxWidth: "640px", maxHeight: "88vh", overflowY: "auto", boxShadow: `8px 8px 0 ${T.groove}` }}>
      <div style={{ background: T.ink, padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 1 }}>
        <div>
          <div style={{ color: T.accent, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif" }}>♪ Legal</div>
          <h2 style={{ color: T.title, fontFamily: "'Fraunces', serif", fontSize: "22px", margin: "4px 0 0" }}>Privacy Policy</h2>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: T.groove, cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: "13px" }}><Sym>■</Sym> Close</button>
      </div>
      <div style={{ padding: "32px", fontFamily: "'Outfit', sans-serif", color: T.ink, lineHeight: 1.8 }}>
        <p style={{ color: T.stamp, fontSize: "12px", marginBottom: "28px" }}>Last updated: {LAST_UPDATED}</p>
        {[
          { title: "1. Who We Are", body: `${APP_NAME} is a personal live music logging platform where users can record concerts they have attended, write reviews, log setlists, and connect with friends. If you have questions about this policy, contact us at ${CONTACT_EMAIL}.` },
          { title: "2. What Information We Collect", body: "We collect information you provide directly, including your name, email address, and the concert data you log such as artist names, venues, dates, reviews, ratings, setlists, and any photos or videos you choose to upload. We do not collect payment information." },
          { title: "3. How We Use Your Information", body: `We use your information solely to provide and improve the ${APP_NAME} service — to display your concert log, enable social features like following other users, and maintain your account. We do not use your data for advertising purposes.` },
          { title: "4. Who We Share Your Information With", body: `${APP_NAME} is designed as a social platform. Your profile and concert log are visible to other users of the app. We do not sell, rent, or share your personal data with third parties for their marketing purposes.` },
          { title: "5. Photos and Videos You Upload", body: "When you upload photos or videos, they are stored on our servers and may be visible to other users. You retain ownership of any content you upload. By uploading content, you grant us a limited licence to store and display it within the app. You are responsible for ensuring you have the right to upload any content you share." },
          { title: "6. Data Retention", body: `We retain your data for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us at ${CONTACT_EMAIL}. We will action deletion requests within 30 days.` },
          { title: "7. Cookies", body: "We use only essential cookies necessary to keep you logged in and maintain your session. We do not use tracking or advertising cookies." },
          { title: "8. Your Rights", body: `You have the right to access, correct, or delete your personal data at any time. To exercise any of these rights, contact us at ${CONTACT_EMAIL}.` },
          { title: "9. Children's Privacy", body: `${APP_NAME} is not intended for use by anyone under the age of 13. We do not knowingly collect personal information from children under 13.` },
          { title: "10. Changes to This Policy", body: "We may update this Privacy Policy from time to time. We will notify users of significant changes by updating the date at the top of this page. Continued use of the platform after changes constitutes acceptance of the updated policy." },
        ].map(s => (
          <div key={s.title} style={{ marginBottom: "24px" }}>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "16px", color: T.ink, marginBottom: "8px", borderBottom: `1px solid ${T.groove}`, paddingBottom: "6px" }}>{s.title}</h3>
            <p style={{ fontSize: "14px", color: T.inkLight }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// TERMS OF SERVICE MODAL
// ─────────────────────────────────────────────────────────────────────────────
const TermsOfService = ({ onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(26,16,8,.78)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()}
      style={{ background: T.cream, border: `2px solid ${T.ink}`, borderRadius: "2px", width: "100%", maxWidth: "640px", maxHeight: "88vh", overflowY: "auto", boxShadow: `8px 8px 0 ${T.groove}` }}>
      <div style={{ background: T.ink, padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 1 }}>
        <div>
          <div style={{ color: T.accent, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif" }}>♪ Legal</div>
          <h2 style={{ color: T.title, fontFamily: "'Fraunces', serif", fontSize: "22px", margin: "4px 0 0" }}>Terms of Service</h2>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: T.groove, cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: "13px" }}><Sym>■</Sym> Close</button>
      </div>
      <div style={{ padding: "32px", fontFamily: "'Outfit', sans-serif", color: T.ink, lineHeight: 1.8 }}>
        <p style={{ color: T.stamp, fontSize: "12px", marginBottom: "28px" }}>Last updated: {LAST_UPDATED}</p>
        {[
          { title: "1. Acceptance of Terms", body: `By using ${APP_NAME}, you agree to these Terms of Service. If you do not agree, please do not use the platform. We reserve the right to update these terms at any time.` },
          { title: "2. Your Account", body: "You are responsible for maintaining the security of your account and password. You agree to provide accurate information when creating your account. You may not create accounts for others without their permission." },
          { title: "3. Acceptable Use", body: `You agree to use ${APP_NAME} only for its intended purpose — logging concerts and connecting with friends around live music. You agree not to post content that is illegal, harmful, threatening, abusive, harassing, or defamatory.` },
          { title: "4. Your Content", body: "You retain ownership of all content you post, including reviews, photos, and videos. By posting content, you grant us a non-exclusive, royalty-free licence to display and store that content within the platform. You are solely responsible for the content you post." },
          { title: "5. Content You Must Not Post", body: "You must not upload content that infringes on the intellectual property rights of others, contains nudity or sexually explicit material, depicts or promotes violence or illegal activity, or violates the privacy of others." },
          { title: "6. Artist Names and Setlists", body: "Logging artist names, venue names, and setlists for personal record-keeping and non-commercial sharing is considered fair use. You agree not to use this platform to commercially exploit the intellectual property of artists or venues." },
          { title: "7. Platform Availability", body: `We aim to keep ${APP_NAME} available at all times but cannot guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue the service at any time without notice.` },
          { title: "8. Limitation of Liability", body: `${APP_NAME} is provided as-is without warranties of any kind. To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.` },
          { title: "9. Account Termination", body: "We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time by contacting us." },
          { title: "10. Governing Law", body: `These terms are governed by applicable law. Any disputes shall be resolved through good faith negotiation before any formal proceedings. Contact us at ${CONTACT_EMAIL}.` },
        ].map(s => (
          <div key={s.title} style={{ marginBottom: "24px" }}>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "16px", color: T.ink, marginBottom: "8px", borderBottom: `1px solid ${T.groove}`, paddingBottom: "6px" }}>{s.title}</h3>
            <p style={{ fontSize: "14px", color: T.inkLight }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

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
          <button onClick={onTerms} style={{ background: "none", border: "none", color: T.groove, cursor: "pointer", fontSize: "12px", fontFamily: "'Outfit', sans-serif", textDecoration: "underline" }}>Terms of Service</button>
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
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]               = useState("my");
  const [concerts, setConcerts]     = useState(SEED_CONCERTS);
  const [encoreList, setEncoreList] = useState([1]);
  const [users, setUsers]           = useState(SEED_USERS);
  const [modal, setModal]           = useState(null);
  const [sleeve, setSleeve]         = useState(null);
  const [profileView, setProfileView] = useState(null);
  const [showFindUsers, setShowFindUsers] = useState(false);
  const [showPrivacy, setShowPrivacy]   = useState(false);
  const [showTerms, setShowTerms]       = useState(false);
  const [search, setSearch]         = useState("");
  const [sort, setSort]             = useState("date-desc");

  const toggleEncore = (id) => {
    setEncoreList(prev => {
      const strId = String(id);
      if (prev.map(String).includes(strId)) return prev.filter(e => String(e) !== strId);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const filtered = concerts
    .filter(c => {
      const q = search.toLowerCase();
      return !q || [c.artist, c.venue, c.city, c.genre].some(x => (x||"").toLowerCase().includes(q));
    })
    .sort((a, b) =>
      sort === "date-desc" ? (b.date||"").localeCompare(a.date||"") :
      sort === "date-asc"  ? (a.date||"").localeCompare(b.date||"") :
      sort === "rating"    ? b.rating - a.rating :
      a.artist.localeCompare(b.artist)
    );

  const feed = users
    .filter(u => u.following)
    .flatMap(u => u.concerts.map(c => ({ ...c, _owner: u })))
    .sort((a, b) => (b.date||"").localeCompare(a.date||""));

  const handleSave = (form) => {
    if (form.id) setConcerts(cs => cs.map(c => c.id === form.id ? form : c));
    else setConcerts(cs => [...cs, { ...form, id: Date.now() }]);
    setModal(null);
  };

  const toggleFollow = (id) => setUsers(us => us.map(u => u.id === id ? { ...u, following: !u.following } : u));
  const avgRating = concerts.length ? (concerts.reduce((s,c) => s + c.rating, 0) / concerts.length).toFixed(1) : "—";

  const tabStyle = (t) => ({
    padding: "8px 18px", cursor: "pointer", fontSize: "10px", letterSpacing: "2px",
    textTransform: "uppercase", fontFamily: "'Outfit', sans-serif",
    background: tab === t ? T.accent : "transparent",
    color: tab === t ? T.ink : T.groove,
    border: `1.5px solid ${tab === t ? T.accent : "rgba(255,255,255,.15)"}`,
    borderRadius: "2px", fontWeight: "700", transition: "all .2s",
  });

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.ink, fontFamily: "'Outfit', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,900;1,9..144,300;1,9..144,400&family=Outfit:wght@300;400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.bg}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${T.paper}; }
        ::-webkit-scrollbar-thumb { background: ${T.groove}; border-radius: 2px; }
        input:focus, select:focus, textarea:focus { border-color: ${T.accent} !important; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: sepia(.5); }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: T.ink, padding: "40px 32px 32px", borderBottom: `4px solid ${T.accent}` }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          {/* Groove lines decoration */}
          <div style={{ marginBottom: "22px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {[0.06, 0.1, 0.07].map((op, i) =>
              <div key={i} style={{ height: "1px", background: `rgba(126,200,216,${op})` }} />)}
          </div>

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
            <button
              onClick={() => setModal("new")}
              style={{ background: T.accent, color: T.ink, border: "none", borderRadius: "2px", padding: "14px 26px", fontWeight: "700", cursor: "pointer", fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif", boxShadow: `3px 3px 0 ${T.accentDk}`, whiteSpace: "nowrap", transition: "all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = `4px 4px 0 ${T.accentDk}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `3px 3px 0 ${T.accentDk}`; }}>
              ♪ Press a Record
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "36px", marginTop: "28px", paddingTop: "20px", borderTop: `1px solid rgba(255,255,255,.08)`, flexWrap: "wrap" }}>
            {[
              { l: "Shows Pressed", v: concerts.length },
              { l: "Avg Rating",    v: avgRating },
              { l: "Listeners Following", v: users.filter(u => u.following).length },
            ].map(s => (
              <div key={s.l}>
                <div style={{ color: T.accent, fontSize: "24px", fontFamily: "'Fraunces', serif", fontWeight: "700" }}>{s.v}</div>
                <div style={{ color: T.groove, fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", marginTop: "2px" }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "8px", marginTop: "24px", flexWrap: "wrap" }}>
            <button style={tabStyle("my")}     onClick={() => setTab("my")}>     <Sym>▶</Sym> My Shows</button>
            <button style={tabStyle("feed")}   onClick={() => setTab("feed")}>    ♪ The Listening Room</button>
            <button style={tabStyle("people")} onClick={() => setTab("people")}>  ♫ Listeners</button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, maxWidth: "760px", width: "100%", margin: "0 auto", padding: "28px 32px 40px" }}>

        {/* MY SHOWS */}
        {tab === "my" && <>
          <EncoreListSection concerts={concerts} encoreList={encoreList} onOpen={setSleeve} onToggleEncore={toggleEncore} isOwn={true} />

          <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="♪  Search the collection…" style={{ ...S.input, flex: 1, minWidth: "180px" }} />
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ ...S.input, width: "auto", color: T.stamp }}>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="rating">Top Rated</option>
              <option value="artist">Artist A–Z</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ fontSize: "52px", color: T.groove, marginBottom: "16px" }}>♪</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", color: T.groove, marginBottom: "8px" }}>{search ? "Nothing in the collection matches." : "Your record collection is empty."}</div>
              <div style={{ fontSize: "13px", color: T.grooveLt, fontStyle: "italic" }}>{search ? "Try a different search." : "Press your first record to get started."}</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {filtered.map((c, i) => (
                <div key={c.id}>
                  <div style={{ position: "relative" }}>
                    <TicketStub
                      concert={c}
                      onOpen={setSleeve}
                      onEdit={setModal}
                      onDelete={id => setConcerts(cs => cs.filter(x => x.id !== id))}
                      isEncore={encoreList.map(String).includes(String(c.id))}
                    />
                    {/* Encore star toggle */}
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
        </>}

        {/* LISTENING ROOM FEED */}
        {tab === "feed" && <>
          <div style={{ color: T.stamp, fontSize: "12px", fontStyle: "italic", marginBottom: "20px" }}>
            ♪ Recent shows from {users.filter(u => u.following).length} listeners you follow
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
                  <TicketStub concert={c} onOpen={setSleeve} showOwner ownerName={c._owner.name} ownerHandle={c._owner.handle} ownerAvatar={c._owner.avatar} />
                  {i < feed.length - 1 && <Groove />}
                </div>
              ))}
            </div>
          )}
        </>}

        {/* PEOPLE / LISTENERS */}
        {tab === "people" && <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ color: T.stamp, fontSize: "12px", fontStyle: "italic" }}>All profiles are public — anyone can be found &amp; followed</div>
            <button onClick={() => setShowFindUsers(true)}
              style={{ background: T.ink, border: "none", color: T.cream, borderRadius: "2px", padding: "8px 16px", cursor: "pointer", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif" }}>
              ♪ Find Listeners
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {users.map(u => (
              <div key={u.id}
                style={{ background: T.paper, border: `1.5px solid ${T.groove}`, borderRadius: "3px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "14px", boxShadow: `2px 2px 0 ${T.grooveLt}` }}>
                <div style={{ fontSize: "26px", width: 42, height: 42, background: T.cream, border: `1px solid ${T.groove}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{u.avatar}</div>
                <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setProfileView(u)}>
                  <div style={{ color: T.ink, fontFamily: "'Fraunces', serif", fontSize: "16px", fontWeight: "700" }}>{u.name}</div>
                  <div style={{ color: T.stamp, fontSize: "11px" }}>{u.handle} · {u.concerts.length} shows · <span style={{ color: T.accent }}><Sym>▶</Sym> View profile</span></div>
                </div>
                <button onClick={() => toggleFollow(u.id)}
                  style={{ background: u.following ? "transparent" : T.ink, border: u.following ? `1.5px solid ${T.groove}` : "none", color: u.following ? T.stamp : T.cream, borderRadius: "2px", padding: "7px 14px", cursor: "pointer", fontSize: "11px", fontWeight: "700", fontFamily: "'Outfit', sans-serif", letterSpacing: "1px", transition: "all .2s" }}>
                  {u.following ? <><Sym>■</Sym> Unfollow</> : <><Sym>▶</Sym> Follow</>}
                </button>
              </div>
            ))}
          </div>
        </>}
      </div>

      <Footer onPrivacy={() => setShowPrivacy(true)} onTerms={() => setShowTerms(true)} />

      {/* ── MODALS ── */}
      {modal        && <ConcertModal concert={modal === "new" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
      {sleeve       && <SleeveModal concert={sleeve} onClose={() => setSleeve(null)} isOwn={!sleeve._owner} onEdit={(c) => { setSleeve(null); setModal(c); }} />}
      {profileView  && <ProfileModal user={profileView} onClose={() => setProfileView(null)} onToggleFollow={toggleFollow} />}
      {showFindUsers && <FindUsersModal onClose={() => setShowFindUsers(false)} users={users} onToggleFollow={toggleFollow} onViewProfile={(u) => { setProfileView(u); setShowFindUsers(false); }} />}
      {showPrivacy  && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
      {showTerms    && <TermsOfService onClose={() => setShowTerms(false)} />}
    </div>
  );
}
