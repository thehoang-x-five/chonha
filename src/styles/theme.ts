// JS-accessible mirror of the design tokens defined in src/styles.css.
// Read these in components when you need a token outside of Tailwind classes
// (e.g. inline SVG fill, chart colors). DO NOT hardcode hex values in pages.

export const theme = {
  color: {
    primary: "var(--primary)",
    primaryForeground: "var(--primary-foreground)",
    secondary: "var(--secondary)",
    secondaryForeground: "var(--secondary-foreground)",
    background: "var(--background)",
    foreground: "var(--foreground)",
    card: "var(--card)",
    muted: "var(--muted)",
    mutedForeground: "var(--muted-foreground)",
    accent: "var(--accent)",
    border: "var(--border)",
    success: "var(--success)",
    warning: "var(--warning)",
    info: "var(--info)",
    destructive: "var(--destructive)",
  },
  radius: { sm: "0.5rem", md: "0.75rem", lg: "1rem", xl: "1.25rem", "2xl": "1.5rem" },
  shadow: {
    sm: "0 1px 2px rgba(0,0,0,0.04)",
    md: "0 4px 12px rgba(0,0,0,0.06)",
    lg: "0 10px 30px rgba(0,0,0,0.08)",
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, "2xl": 32 },
  font: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, "2xl": 24, "3xl": 30 },
  layout: {
    bottomNavHeight: 64,
    safeTop: "env(safe-area-inset-top)",
    safeBottom: "env(safe-area-inset-bottom)",
    sidebarWidth: 256,
    mobileMaxWidth: 480,
  },
} as const;

export type Theme = typeof theme;
