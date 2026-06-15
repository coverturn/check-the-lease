import { Link } from "wouter";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function BuildLog() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", backgroundColor: "#FBF8F1", color: "#171717" }}>
      <Nav />
      <SkipLink />

      <main id="main" style={{ flex: 1, width: "100%" }} role="main">
        {/* Header section */}
        <section style={{ padding: "clamp(80px, 10vw, 120px) clamp(24px, 4vw, 48px) clamp(48px, 6vw, 80px)" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 48 }}>
              {/* Founder portrait - tilted polaroid frame */}
              <div style={{
                width: 280,
                height: 280,
                borderRadius: 8,
                overflow: "hidden",
                border: "2.5px solid #171717",
                boxShadow: "4px 4px 0 0 #171717",
                transform: "rotate(-2deg)",
                marginBottom: 32,
                backgroundColor: "#fff",
              }}>
                <img
                  src="/profile.jpg"
                  alt="Ishmael McCalla, founder"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              
              <p style={{
                fontFamily: "var(--app-font-serif)",
                fontStyle: "italic",
                fontSize: 13,
                color: "#6B6B6B",
                margin: "0 0 24px",
              }}>
                Ishmael McCalla. Building solo. May 2-3, 2026.
              </p>

              <span style={{
                fontFamily: "var(--app-font-sans)",
                fontSize: 11,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--color-sage)",
                display: "block",
                marginBottom: 16,
              }}>
                BUILD LOG
              </span>

              <h1 style={{
                fontFamily: "var(--app-font-serif)",
                fontStyle: "italic",
                fontSize: "clamp(32px, 6vw, 56px)",
                fontWeight: 500,
                letterSpacing: "-0.03em",
                color: "#171717",
                margin: "0 0 20px",
                lineHeight: 1.1,
              }}>
                How I built Check the Lease in 24 hours.
              </h1>

              <p style={{
                fontFamily: "var(--app-font-sans)",
                fontSize: "clamp(15px, 1.8vw, 18px)",
                color: "#6B6B6B",
                margin: 0,
                lineHeight: 1.6,
              }}>
                For the Replit 10 Year Buildathon, May 2-3 2026.
              </p>
            </div>
          </div>
        </section>

        {/* Hour-by-hour blocks */}
        <section style={{ padding: "0 clamp(24px, 4vw, 48px) clamp(48px, 6vw, 80px)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {[
              {
                hours: "HOUR 0 to 4",
                heading: "Started simple.",
                body: "Built the first version from one prompt: make a free lease reader that shows state law. It worked but looked rough. A dropzone, a text field, plain text back. Not something you'd trust with a real lease. It proved the idea worked. Everything after was making it real.",
              },
              {
                hours: "HOUR 4 to 10",
                heading: "Made it real.",
                body: "Redesigned from scratch. Cream, sage, clay, and Fraunces italic - not another hackathon site. Drew all the icons by hand because AI couldn't get the style right. Made it feel careful. A renter needs to trust this with their real lease.",
              },
              {
                hours: "HOUR 10 to 18",
                heading: "Built the results page.",
                body: "Eleven tries to get this right. Four tabs showing what matters: key terms, problems, gaps, and what to ask. Most lease readers just show scary flags. I wanted a real list you could actually use in a talk with your landlord.",
              },
              {
                hours: "HOUR 18 to 24",
                heading: "Finished it off.",
                body: "Added a legal aid directory for all 50 states because renters who get hurt usually don't have a lawyer's number. Built a chat tool that answers questions in plain English. Free, no sign-up, nothing stored. Last hours were for copy: making every word work for both renters and landlords.",
              },
            ].map(({ hours, heading, body }, idx) => (
              <div key={hours} style={{ marginBottom: idx < 3 ? 32 : 48 }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  gap: 20,
                  alignItems: "flex-start",
                  paddingBottom: idx < 3 ? 32 : 0,
                  borderBottom: idx < 3 ? "1px solid rgba(23,23,23,0.08)" : "none",
                }}>
                  <div>
                    <span style={{
                      fontFamily: "var(--app-font-sans)",
                      fontSize: 11,
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      color: "var(--color-sage)",
                      display: "block",
                    }}>
                      {hours}
                    </span>
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: "var(--app-font-serif)",
                      fontStyle: "italic",
                      fontSize: "clamp(20px, 2.5vw, 28px)",
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      color: "#171717",
                      margin: "0 0 12px",
                    }}>
                      {heading}
                    </h3>
                    <p style={{
                      fontFamily: "var(--app-font-sans)",
                      fontSize: 15,
                      color: "#6B6B6B",
                      lineHeight: 1.65,
                      margin: 0,
                    }}>
                      {body}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Sign-off */}
            <div style={{ textAlign: "center", marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(23,23,23,0.08)" }}>
              <p style={{
                fontFamily: "var(--app-font-serif)",
                fontStyle: "italic",
                fontSize: 16,
                color: "#6B6B6B",
                margin: "0 0 8px",
              }}>
                Built with Replit Agent. May 2-3 2026.
              </p>
              <p style={{
                fontFamily: "var(--app-font-serif)",
                fontStyle: "italic",
                fontSize: 16,
                color: "#6B6B6B",
                margin: 0,
              }}>
                Ishmael McCalla
              </p>
            </div>

            {/* CTA strip */}
            <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginTop: 48 }}>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 999,
                  padding: "14px 28px",
                  fontFamily: "var(--app-font-sans)",
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: "none",
                  backgroundColor: "#5A8B7A",
                  color: "#FBF8F1",
                  border: "2px solid #171717",
                  boxShadow: "4px 4px 0 0 #171717",
                  transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
                }}
              >
                See the live site →
              </Link>
              <Link
                href="/results/demo"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 999,
                  padding: "14px 28px",
                  fontFamily: "var(--app-font-sans)",
                  fontWeight: 500,
                  fontSize: 14,
                  textDecoration: "none",
                  backgroundColor: "transparent",
                  color: "#171717",
                  border: "2px solid rgba(23,23,23,0.25)",
                  transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
                }}
              >
                Try the demo result →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
