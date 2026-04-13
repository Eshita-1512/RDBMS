# SkillBridge — Minimalist Frontend Design System

SkillBridge is an educational platform. The goal of this frontend design is to eliminate distractions and provide a clean, hyper-focused, and accessible learning environment.

## 1. Core Design Philosophy
- **Minimalist & Simple**: Lots of negative (white) space. Content is the primary focus.
- **High Contrast, Low Noise**: Use highly legible fonts against soft backgrounds. Avoid harsh borders or heavy drop shadows.
- **Intuitive**: Forms and inputs should be completely frictionless. "One action per view" whenever possible.

---

## 2. Color Palette
The color scheme should feel calm, trustworthy, and academic.

| Type | Hex Code | Purpose |
|------|----------|---------|
| **Background (Primary)** | `#FFFFFF` | Main application background (Clean White) |
| **Background (Secondary)** | `#F8F9FA` | Light off-white for sidebars or highlighted sections |
| **Primary Accent** | `#0F172A` | Deep slate for strong contrast buttons and primary headings |
| **Secondary Accent** | `#3B82F6` | Soft blue for active states, links, and progress bars |
| **Text (Main)** | `#334155` | Slate grey for high readability body text (softer than pure black) |
| **Text (Muted)** | `#94A3B8` | Light grey for timestamps, secondary labels |

---

## 3. Typography
Use modern, highly legible sans-serif fonts to maintain a minimal feel.

- **Primary Font Family**: `Inter` (Google Fonts)
- **Headings (H1, H2, H3)**: Semi-Bold (600), dark slate (`#0F172A`). Keep letter-spacing slightly tight.
- **Body Text**: Regular (400), line-height at `1.6`, size `16px`.
- **Labels / Metadata**: Medium (500), size `13px`, uppercase with slight letter-spacing.

---

## 4. UI Components

### Buttons
- **Primary**: Solid background (`#0F172A`), white text, slightly rounded corners (`rounded-md` or `4px`). No shadow. On hover: slightly lighter slate.
- **Secondary**: Transparent background, faint border (`#E2E8F0`), dark text. On hover: off-white background.
- **Padding**: Generous padding (`px-6 py-2`) so buttons feel clickable and spacious.

### Course Cards
- Completely flat design with a thin, subtle border (`1px solid #F1F5F9`).
- **No heavy drop shadows**. If a shadow is used on hover, make it an extremely soft, large blur (`box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08)`).
- Clean thumbnail image, clear bold title, muted instructor name, and a simple progress bar at the bottom.

### Inputs & Forms
- Border only on the bottom line (Material design style) OR a very faint full border with no background.
- Floating labels or very clear, small labels above the input fields.
- Input height should be at least `44px` for accessibility.

---

## 5. Main Layouts

### Navigation (NavBar)
- **Top Bar**: Stuck to the top but completely transparent or solid white.
- **Left side**: Simple text logo `SkillBridge.` in bold.
- **Right side**: Login / Dashboard links. No heavy boxes.

### Student Dashboard
- **Sidebar (Optional but recommended)**: Clean, unboxed text links to "Overview", "My Courses", "Assignments", "Certificates".
- **Main Area**: Greeting ("Welcome back, Eshita"), followed by a horizontal scroll of "Continue Learning" cards.

### Course Viewer
- **Layout**: 70% video/content area (left), 30% lesson scroll list (right).
- **Distraction-Free**: When playing a video, the rest of the UI should ideally fade or remain completely static/white.

## 6. CSS Framework
Using **Tailwind CSS** is highly recommended to achieve this. You can remove all default styling and rely completely on utility classes to build out the exact paddings, colors, and borders specified above.
