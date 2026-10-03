"use client";

import { useState } from "react";
import "./civilx.css";
import { AuthGate } from "./auth-gate";
import { ReportFlow } from "./report-flow";

type Screen = "home" | "track" | "report" | "alerts" | "profile";

const navItems: { id: Screen; icon: string; label: string }[] = [
  { id: "home", icon: "home", label: "Home" },
  { id: "track", icon: "rule", label: "Track" },
  { id: "report", icon: "add_a_photo", label: "Report" },
  { id: "alerts", icon: "notifications", label: "Alerts" },
  { id: "profile", icon: "account_circle", label: "Profile" },
];

function Icon({ name }: { name: string }) {
  return <span className="material-symbols-outlined" aria-hidden="true">{name}</span>;
}

function Header({ subtitle }: { subtitle: string }) {
  return (
    <header className="app-header">
      <div className="brand-lockup">
        <div className="brand-mark"><Icon name="shield_with_heart" /></div>
        <div>
          <div className="brand-name">CivicFix <span>Metro</span></div>
          <div className="brand-subtitle">Metro City Council · {subtitle}</div>
        </div>
      </div>
      <div className="header-actions">
        <button aria-label="Search or support"><Icon name="support_agent" /></button>
        <button className="avatar" aria-label="Profile"><span>SJ</span></button>
      </div>
    </header>
  );
}

function HomeScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <>
      <Header subtitle="Home" />
      <main className="screen home-screen">
        <section className="welcome-row">
          <div>
            <div className="eyebrow"><Icon name="location_on" /> Ward 7 · Downtown Metro</div>
            <h1>Welcome back, Sarah</h1>
          </div>
          <Icon name="shield_with_heart" />
        </section>

        <section className="advisory-card">
          <div className="advisory-icon"><Icon name="warning" /></div>
          <div><div className="card-label">Advisory Update <span>Active</span></div><p>Monsoon Preparedness: Storm drain clearing in progress across North Sector.</p></div>
        </section>

        <button className="report-hero" onClick={() => onNavigate("report")}>
          <div className="report-hero-icon"><Icon name="add_a_photo" /></div>
          <div><strong>Report an Issue</strong><span>Instant geo-tag & auto-assignment</span></div>
          <Icon name="arrow_forward" />
        </button>

        <div className="category-row">
          {[["apps", "All Issues"], ["add_road", "Road & Potholes"], ["delete_sweep", "Waste & Garbage"], ["water_drop", "Water Leakage"], ["lightbulb", "Streetlights"]].map(([icon, label]) => <button key={label}><Icon name={icon} /><span>{label}</span></button>)}
        </div>

        <section className="section-block">
          <div className="section-heading"><div><h2><Icon name="explore" /> Nearby Incidents</h2><span>3 reports within 500m</span></div><button>View Ward Map <Icon name="chevron_right" /></button></div>
          <div className="map-card">
            <div className="map-grid"><span className="map-road road-a" /><span className="map-road road-b" /><span className="map-road road-c" /><i className="pin pin-critical"><Icon name="priority_high" /></i><i className="pin pin-medium"><Icon name="delete" /></i><i className="pin pin-solved"><Icon name="check" /></i></div>
            <div className="map-legend"><span><i className="dot critical" /> Critical</span><span><i className="dot medium" /> Medium</span><span><i className="dot solved" /> Solved</span><small>GPS Accurate (±4m)</small></div>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading"><div><h2><Icon name="assignment" /> Your Active Reports</h2><span>3 Total Filed</span></div></div>
          <ReportCard status="In Progress" tone="orange" icon="add_road" title="Deep Pothole on 5th Ave & Elm" meta="Dept of Transportation · Crew Unit #4" progress="Crew Dispatched (65%)" time="Reported 4h ago" action={() => onNavigate("track")} />
          <ReportCard status="Pending Triage" tone="blue" icon="delete_sweep" title="Overflowing Community Dumpster" meta="Sanitation Board · Downtown Zone" progress="Triage Scheduled" time="Reported Yesterday" />
          <ReportCard status="Resolved" tone="green" icon="lightbulb" title="Flickering High-Mast Streetlamp" meta="Fixed by Crew #12 on Oct 24" progress="Ticket #CVX-89410" time="Feedback & Rating" />
        </section>

        <section className="impact-strip"><Icon name="insights" /><div><strong>Metro Impact Score</strong><span>You contributed to fixing 14 local issues</span></div><b>92%</b></section>
      </main>
    </>
  );
}

function ReportCard({ status, tone, icon, title, meta, progress, time, action }: { status: string; tone: string; icon: string; title: string; meta: string; progress: string; time: string; action?: () => void }) {
  return <button className="report-card" onClick={action}><div className="report-card-top"><span className={`status ${tone}`}>{status}</span><span className="severity">{tone === "orange" ? "⚠ High Severity" : tone === "green" ? "✓ Low Severity" : "Medium Severity"}</span></div><div className="report-card-body"><div className={`issue-icon ${tone}`}><Icon name={icon} /></div><div><div className="issue-type"><Icon name={tone === "orange" ? "alt_route" : tone === "green" ? "bolt" : "recycling"} /> {tone === "orange" ? "Road Maintenance" : tone === "green" ? "Electrical & Lighting" : "Waste Management"}</div><h3>{title}</h3><p>{meta}</p></div></div><div className="report-card-foot"><span>{progress}</span><span>{time}</span></div></button>;
}

function TrackScreen() {
  return <><Header subtitle="Track Issues" /><main className="screen track-screen"><div className="track-top"><div><code>#CVX-94821</code><span className="status orange">In Progress</span></div><button><Icon name="share" /> Share</button></div><div className="track-title"><div className="track-image"><Icon name="add_road" /></div><div><div className="track-badges"><span>⚠ High Severity</span><span>✦ 98% Verified</span><span>▣ 2 Photos</span></div><div className="issue-type"><Icon name="construction" /> Road Maintenance <small>· Ward 7</small></div><h1>Deep Pothole on 5th Ave & Elm</h1><p><Icon name="location_on" /> 742 Evergreen Terrace, Metro Ward 7</p></div></div><div className="arrival-card"><Icon name="local_shipping" /><div><span>Estimated Arrival</span><strong>Today, ~1:45 PM</strong></div><b>Crew #4 En Route</b></div><section className="timeline-section"><div className="section-heading"><div><h2>Lifecycle Timeline</h2><span>Step 3 of 5</span></div></div><TimelineItem icon="check" title="Submitted" date="Oct 26, 10:42 AM" text="Report submitted by Sarah Jenkins with 2 photos & high-accuracy GPS coordinates." done /><TimelineItem icon="auto_awesome" title="AI Triaged & Verified" date="Oct 26, 10:43 AM" text="Categorized as High Severity Road Hazard. Automatic work-order created & queued for dispatch." done /><TimelineItem icon="engineering" title="Work Crew Dispatched" date="Oct 26, 1:15 PM" text="Crew #4 (Asphalt Unit) assigned. Equipment & cold-mix asphalt transit en route." active /><TimelineItem icon="hardware" title="Inspection & Repair" date="Est. Oct 27, 10:00 AM" text="Excavation, hot-tack binder sealing, and steamroller leveling scheduled." /><TimelineItem icon="verified_user" title="Resolution & Citizen Sign-off" date="Pending Repair" text="Before & after photographic proof will be uploaded with 48h citizen review window." /></section><section className="crew-card"><div className="section-heading"><div><h2><Icon name="pin_drop" /> Crew GPS Coordinates</h2><span>Live Tracking</span></div></div><div className="crew-stats"><strong><Icon name="near_me" /> 0.6 miles away from incident</strong><span>Within 5m precision</span></div></section><section className="contact-card"><Icon name="corporate_fare" /><div><h3>Metro Dept of Public Works</h3><p>Road Maintenance & Asphalt Division</p><div className="contact-links"><a href="tel:5550193829"><Icon name="phone_in_talk" /> Hotline<br /><b>(555) 019-3829</b></a><a href="mailto:rapidrepair@metro.gov"><Icon name="mail" /> Email<br /><b>rapidrepair@metro.gov</b></a></div><button className="wide-button"><Icon name="notifications_active" /> Request Status Update / Ping Crew</button><button className="wide-button secondary"><Icon name="share" /> Share Report Link</button></div></section></main></>;
}

function TimelineItem({ icon, title, date, text, done, active }: { icon: string; title: string; date: string; text: string; done?: boolean; active?: boolean }) { return <div className={`timeline-item ${done ? "done" : ""} ${active ? "active" : ""}`}><div className="timeline-icon"><Icon name={icon} /></div><div><div className="timeline-title"><h3>{title}</h3><span>{date}</span></div><p>{text}</p>{active && <div className="foreman"><b>MV</b><span>Foreman Marcus Vance<br /><small>Heavy Utility Truck #PW-88</small></span><em>Active</em></div>}</div></div>; }

function AlertsScreen() { return <><Header subtitle="Alerts" /><main className="screen alerts-screen"><div className="page-intro"><div><h1>Civic Alerts & Updates</h1><p>Real-time status updates from Metro Municipal Services</p></div><button className="outline-button"><Icon name="done_all" /> Mark Read</button></div><div className="tabs"><button className="selected">All <b>3</b></button><button>My Reports</button><button>Ward Alerts</button></div><AlertCard icon="local_shipping" title="Repair Crew Dispatched" time="20m ago" text="Crew #4 has been assigned to your pothole report on 5th Ave & Elm (#CVX-94821). Repair in progress." tone="orange" /><AlertCard icon="check_circle" title="Issue Resolved & Closed 🎉" time="Yesterday" text="Your complaint regarding Broken Streetlamp on Oakwood Lane (#CVX-89410) was marked resolved. View before/after photos and rate the repair work." tone="green" rating /><AlertCard icon="auto_awesome" title="AI Auto-Triage Completed" time="3h ago" text="Report #CVX-94821 was verified with 98% accuracy and assigned High Severity priority." tone="blue" /><AlertCard icon="campaign" title="Storm Water Maintenance" time="2d ago" text="City drainage cleaning operations scheduled on Elm Street between 8 AM - 2 PM tomorrow. Street parking restricted." tone="teal" /></main></>; }

function AlertCard({ icon, title, time, text, tone, rating }: { icon: string; title: string; time: string; text: string; tone: string; rating?: boolean }) { return <article className={`alert-card ${tone}`}><div className="alert-icon"><Icon name={icon} /></div><div className="alert-content"><div className="alert-title"><h2>{title}</h2><span>{time}</span></div><p>{text}</p>{rating ? <div className="rating"><span>Rate Council Response</span><span className="stars">☆ ☆ ☆ ☆ ☆</span></div> : <div className="alert-tag">{tone === "blue" ? "✦ 98% Pothole match" : tone === "teal" ? "Tow zone active 08:00–14:00 tomorrow" : "Track Live Progress →"}</div>}</div></article>; }

function ProfileScreen() { return <><Header subtitle="Alerts" /><main className="screen profile-screen"><section className="profile-hero"><div className="profile-avatar">SJ</div><div><span className="verified"><Icon name="verified" /> Verified Resident</span><h1>Sarah Jenkins</h1><p>Civic Champion · Level 4</p><div className="eyebrow"><Icon name="location_city" /> Ward 7 (Oakwood District)</div></div><button aria-label="Edit profile"><Icon name="tune" /></button></section><section className="profile-stats"><div><b>14</b><span>Issues Fixed</span></div><div><b>92%</b><span>Impact Score</span></div><div><b>4</b><span>Current Level</span></div></section><section className="profile-list"><div className="list-heading"><h2>Community Impact</h2><button>View details <Icon name="chevron_right" /></button></div><div className="impact-progress"><div><strong>Metro Impact Score</strong><span>Top 8% of residents in Ward 7</span></div><b>92%</b><div className="progress"><i /></div></div><div className="profile-row"><Icon name="badge" /><div><strong>Civic Champion</strong><span>Earned for resolving 10+ local issues</span></div><Icon name="chevron_right" /></div><div className="profile-row"><Icon name="notifications_active" /><div><strong>Notification Preferences</strong><span>SMS, Push, Ward Digests</span></div><Icon name="chevron_right" /></div><div className="profile-row"><Icon name="privacy_tip" /><div><strong>Privacy & Public Records</strong><span>Protected under Directive 12B</span></div><Icon name="chevron_right" /></div></section></main></>; }

function ReportScreen() { return <><Header subtitle="Report an Issue" /><main className="screen report-screen"><div className="page-intro"><div><div className="eyebrow"><Icon name="location_on" /> GPS Accurate (±4m)</div><h1>Report a civic issue</h1><p>Help Metro City fix what matters in your neighborhood.</p></div></div><div className="upload-box"><Icon name="add_a_photo" /><strong>Add photos of the issue</strong><span>Clear photos help our AI triage your report</span><button className="outline-button">Choose from gallery</button></div><label className="form-label">What needs attention?</label><div className="report-options"><button><Icon name="add_road" /> Road & Potholes</button><button><Icon name="delete_sweep" /> Waste & Garbage</button><button><Icon name="water_drop" /> Water Leakage</button><button><Icon name="lightbulb" /> Streetlights</button></div><label className="form-label">Tell us more <span>Optional</span></label><textarea placeholder="Describe the issue and anything responders should know..." /><button className="primary-button">Submit Report <Icon name="arrow_forward" /></button></main></>; }

export default function CivicFixPage() {
  const [screen, setScreen] = useState<Screen>("home");
  return <div className="civicfix-app"><div className="civicfix-content"><AuthGate>{() => <>{screen === "home" && <HomeScreen onNavigate={setScreen} />}{screen === "track" && <TrackScreen />}{screen === "alerts" && <AlertsScreen />}{screen === "profile" && <ProfileScreen />}{screen === "report" && <ReportFlow />}</>}</AuthGate></div><button className="floating-report" onClick={() => setScreen("report")} aria-label="Report an issue"><Icon name="add_a_photo" /></button><nav className="bottom-nav">{navItems.map(item => <button key={item.id} className={screen === item.id ? "active" : ""} onClick={() => setScreen(item.id)}><Icon name={item.icon} />{item.id === "alerts" && <b>3</b>}<span>{item.label}</span></button>)}</nav></div>;
}