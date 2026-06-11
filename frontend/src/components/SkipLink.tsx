export function SkipLink() {
  return (
    <a
      href="#main"
      role="complementary"
      aria-label="Skip to main content"
      style={{
        position: "absolute",
        left: "-9999px",
        top: "auto",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        zIndex: -999,
      }}
      onFocus={(e) => {
        const el = e.currentTarget;
        el.style.left = "8px";
        el.style.top = "8px";
        el.style.width = "auto";
        el.style.height = "auto";
        el.style.overflow = "visible";
        el.style.zIndex = "9999";
        el.style.background = "#1E3A5F";
        el.style.color = "#FBF8F1";
        el.style.padding = "12px 20px";
        el.style.borderRadius = "6px";
        el.style.fontFamily = "var(--app-font-sans)";
        el.style.fontSize = "14px";
        el.style.fontWeight = "600";
        el.style.textDecoration = "none";
        el.style.border = "2px solid #FBF8F1";
        el.style.display = "inline-block";
        el.style.minHeight = "48px";
        el.style.minWidth = "48px";
        el.style.display = "inline-flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
      }}
      onBlur={(e) => {
        const el = e.currentTarget;
        el.style.left = "-9999px";
        el.style.width = "1px";
        el.style.height = "1px";
        el.style.overflow = "hidden";
        el.style.zIndex = "-999";
      }}
    >
      Skip to main content
    </a>
  );
}
