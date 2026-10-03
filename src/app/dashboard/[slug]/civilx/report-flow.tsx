"use client";

import { useState } from "react";
import { Icon } from "./shared";

type Analysis = { category: string; severity: string; confidence: number; reportId: string };

export function ReportFlow() {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address?: string } | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function detectLocation() {
    setError("");
    if (!navigator.geolocation) return setError("Location is not available in this browser.");
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const base = { latitude: coords.latitude, longitude: coords.longitude };
      try { const result = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${base.latitude}&lon=${base.longitude}`).then((response) => response.json()); setLocation({ ...base, address: result.display_name }); }
      catch { setLocation(base); }
    }, () => setError("Allow location access to tag this report."));
  }

  async function compressImages(files: FileList | null) {
    if (!files) return;
    const compressed = await Promise.all([...files].slice(0, 6).map((file) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => { const image = new Image(); image.onload = () => { const canvas = document.createElement("canvas"); const scale = Math.min(1, 1200 / image.width); canvas.width = image.width * scale; canvas.height = image.height * scale; canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height); resolve(canvas.toDataURL("image/jpeg", 0.78)); }; image.onerror = () => reject(new Error("Could not read image")); image.src = String(reader.result); };
      reader.onerror = () => reject(new Error("Could not read image")); reader.readAsDataURL(file);
    })));
    setImages(compressed);
  }

  async function submit() {
    if (description.trim().length < 10) return setError("Add at least 10 characters describing the issue.");
    if (!location) return setError("Detect your location before submitting.");
    setBusy(true); setError("");
    try { const response = await fetch("/api/civicfix/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ description, imageUrls: images, location }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setAnalysis({ ...data.analysis, reportId: data.report.id }); setCategory(data.analysis.category); setSeverity(data.analysis.severity); }
    catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Could not submit report."); } finally { setBusy(false); }
  }

  async function confirm() {
    if (!analysis) return;
    setBusy(true);
    try { const response = await fetch(`/api/civicfix/reports/${analysis.reportId}/analysis`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category, severity }) }); if (!response.ok) throw new Error(); setAnalysis(null); setDescription(""); setImages([]); }
    catch { setError("The report was created, but the override could not be saved."); } finally { setBusy(false); }
  }

  if (analysis) return <><div className="app-header"><div className="brand-lockup"><div className="brand-mark"><Icon name="shield_with_heart" /></div><div><div className="brand-name">CivicFix <span>Metro</span></div><div className="brand-subtitle">Metro City Council · AI Confirmation</div></div></div></div><main className="screen analysis-screen"><div className="ai-badge"><Icon name="auto_awesome" /> AI analysis complete</div><h1>Review your report</h1><p>We found the best department and priority from your description. Adjust either value if needed.</p><label className="form-label">Category</label><select value={category} onChange={(event) => setCategory(event.target.value)}><option>Road Maintenance</option><option>Sanitation</option><option>Water Supply</option><option>Electricity/Streetlight</option><option>Public Safety</option><option>Other</option></select><label className="form-label">Severity</label><select value={severity} onChange={(event) => setSeverity(event.target.value)}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select><div className="analysis-score"><Icon name="verified" /><div><strong>{Math.round(analysis.confidence * 100)}% confidence</strong><span>Overrides are logged for future model improvement.</span></div></div>{error && <p className="form-error">{error}</p>}<button className="primary-button" onClick={confirm} disabled={busy}>{busy ? "Saving..." : "Confirm & track report"}<Icon name="arrow_forward" /></button></main></>;

  return <><div className="app-header"><div className="brand-lockup"><div className="brand-mark"><Icon name="shield_with_heart" /></div><div><div className="brand-name">CivicFix <span>Metro</span></div><div className="brand-subtitle">Metro City Council · Report an Issue</div></div></div></div><main className="screen report-screen"><div className="page-intro"><div><div className="eyebrow"><Icon name="location_on" /> {location?.address ?? "Location not detected"}</div><h1>Report a civic issue</h1><p>Help Metro City fix what matters in your neighborhood.</p></div></div><div className="upload-box"><Icon name="add_a_photo" /><strong>{images.length ? `${images.length} compressed photo${images.length > 1 ? "s" : ""} ready` : "Add photos of the issue"}</strong><span>Clear photos help our AI triage your report</span><label className="outline-button">Choose from gallery<input type="file" accept="image/*" multiple onChange={(event) => void compressImages(event.target.files)} /></label></div><button className="location-button" onClick={detectLocation}><Icon name="my_location" /> {location ? "Location detected" : "Use my current location"}</button><label className="form-label">Tell us what happened <span>{description.length}/1000</span></label><textarea maxLength={1000} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the issue and anything responders should know..." />{error && <p className="form-error">{error}</p>}<button className="primary-button" onClick={submit} disabled={busy}>{busy ? "Analyzing report..." : "Submit for AI analysis"}<Icon name="arrow_forward" /></button></main></>;
}
