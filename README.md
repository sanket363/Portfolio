# DevOps Portfolio Website

This project aims to create a modern, clean, and animated personal portfolio website for a DevOps/Cloud engineer, inspired by the design and animations of [animejs.com](https://animejs.com/).

## Purpose

To showcase skills, projects, certifications, blog posts, and contact information, demonstrating proficiency in DevOps and Cloud technologies such as Kubernetes, Docker, GitHub Actions, Terraform, AWS, CI/CD, and Monitoring (Prometheus/Grafana).

## Design and Aesthetics

-   **Inspiration**: Minimalist layout and smooth animations similar to animejs.com.
-   **Hero Section**: Full-screen hero with an animated logo/text.
-   **Animations**: Utilizes `anime.js` (or optionally `GSAP`/`Framer Motion`) for scroll-based and entrance animations.
-   **Transitions**: Smooth scrolling transitions.
-   **Interactivity**: Subtle hover effects and interactive buttons.
-   **Theming**: Support for dark mode.

## Tech Stack

-   **Frontend**: React with Vite
-   **Styling**: Tailwind CSS
-   **Language**: TypeScript
-   **Animation**: `anime.js` (primary), with potential for `Framer Motion` or `GSAP`.

## Sections

1.  **Hero Section**:
    -   Name, Role (DevOps Engineer)
    -   Tagline with animated text
    -   CTA buttons: "View Projects", "Contact Me"
2.  **About Me**:
    -   Short biography
    -   Skills list with icons
3.  **Projects**:
    -   Cards or tiles for key DevOps projects (CI/CD pipelines, Kubernetes infra, Terraform modules).
4.  **Certifications**:
    -   Logos or list of AWS, Kubernetes, etc. certifications.
5.  **Blog (Optional)**:
    -   List of recent technical articles (can be markdown or static list).
6.  **Contact**:
    -   Contact form or mailto link
    -   Social icons (GitHub, LinkedIn)

## Features

-   **Responsive**: Optimized for mobile, tablet, and desktop.
-   **SEO Friendly**.
-   **Performance Optimized**: Lazy loading, minimal JavaScript.

## Optional Enhancements

-   Interactive terminal-style animation in the header or background.
-   Animated stats counters for tools used/projects deployed.
-   Sticky header with scroll-based animation.

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd Portfolio
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
4.  **Open in browser**:
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure (Planned)

```
src/
├── App.tsx             # Main application component, routing
├── main.tsx            # Entry point
├── index.css           # Global styles, Tailwind imports
├── components/
│   ├── Header.tsx      # Navigation, sticky header logic
│   ├── Footer.tsx      # Footer content
│   ├── Layout.tsx      # Overall layout, theme provider
│   ├── Hero.tsx        # Hero section with animations
│   ├── About.tsx       # About Me section
│   ├── Skills.tsx      # Skills section with icons
│   ├── Projects.tsx    # Projects section, project cards
│   ├── Certifications.tsx # Certifications section
│   ├── Blog.tsx        # Blog section (optional)
│   ├── Contact.tsx     # Contact form/info
│   ├── ThemeToggle.tsx # Dark mode toggle
│   └── ui/             # UI components (buttons, cards, etc.)
│       ├── AnimatedGridPattern.tsx # Background animation
│       └── ...
├── pages/
│   ├── HomePage.tsx    # Combines Hero, About, Skills, Projects
│   └── ProjectsPage.tsx # Dedicated projects page (if needed)
├── lib/
│   └── utils.ts        # Utility functions
└── assets/
    └── ...             # Images, icons, etc.
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.