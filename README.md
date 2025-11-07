# 光復超人 GuangFu Hero

[中文版](./README_zh-TW.md) | English

> 無論在哪裡，都能成為光復的超人

A disaster relief coordination platform connecting volunteers and victims in Hualien, Taiwan. Built by remote volunteers who want to support disaster relief efforts from afar.

## 🎯 Project Overview

**光復超人** (GuangFu Hero) is a web-based platform created by "remote volunteers" and "keyboard volunteers" who cannot physically be at disaster sites but want to contribute using their professional skills. The platform provides real-time information systems to support on-ground relief efforts.

## ✨ Key Features

### 🧭 Volunteer Guidance

- Pre-departure information and onboarding
- Registration and check-in procedures
- Transportation information
- Equipment and preparation checklists
- Local community and team connections

### 🗺️ Interactive Disaster Area Map

- Medical stations and health facilities
- Supply distribution points
- Public facilities (restrooms, showers)
- Real-time location information for volunteers

### 💬 Victim Assistance System

- Medical assistance requests
- Mental health resources
- Shelter information
- Direct needs registration by victims
- Real-time matching with available volunteers

### 🐝 Resource Matching (小蜜蜂 System)

- Supply delivery coordination
- Motorcycle volunteer ("Little Bee") dispatch
- Request tracking from submission to delivery
- Integrated with supply stations

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 15.5.4 with Turbopack
- **UI Library**: [React](https://react.dev) 19.1.0
- **Language**: [TypeScript](https://www.typescriptlang.org) 5
- **Styling**: [Tailwind CSS](https://tailwindcss.com) 4
- **Analytics**: Google Analytics 4
- **Utilities**: dayjs for date handling

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/GuangFuHero/guangfu-hero-web-org.git
cd guangfu-hero-web-org
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will automatically redirect to the map page (`/map`).

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── app/
│   ├── map/              # Interactive disaster area map
│   ├── full-screen-map/  # Full-screen map view
│   ├── victim/           # Victim assistance pages
│   │   ├── house-repair/ # House repair store information
│   │   ├── medical/      # Medical assistance (no use)
│   │   ├── mental-health/# Mental health resources
│   │   ├── shelter/      # Shelter information (no use)
│   │   ├── site/         # map site information list
│   │   └── support-information/ # Support information
│   ├── volunteer/        # Volunteer information
│   │   ├── about-us/     # Team information
│   │   ├── preparation/  # Equipment checklists
│   │   ├── transportation/ # Transport info
│   │   └── accommodations/ # Accommodation info
│   ├── resources/        # Resource matching system
│   ├── volunteer-register/ # Volunteer registration
│   ├── supply-depot-form-2/ # Supply depot forms
│   ├── auth/             # Authentication
│   │   └── line/         # LINE login
│   ├── privacy/          # Privacy policy
│   └── terms/            # Terms of service
├── components/           # Reusable UI components
│   ├── ActionButton/     # Action buttons
│   ├── AlertBanner/      # Alert notifications
│   ├── Button/           # Basic buttons
│   ├── DropdownSelect/   # Dropdown components
│   ├── PageLayout/       # Page layout wrapper
│   ├── Sidebar/          # Navigation sidebar
│   ├── Toast/            # Toast notifications
├── features/             # Feature-specific components
│   ├── MapContainer/     # Map functionality
│   │   ├── ReactLeafletMap/ # Leaflet map integration
│   │   ├── InfoSidebar/  # Map information panel
│   │   ├── Modals/       # Map-related modals
│   │   └── ...          # Other map features
│   ├── SiteMap/          # Site map component
│   ├── PlaceList/        # Place listing functionality
│   ├── VictimAssistance/ # Victim support features
│   ├── VolunteerInfo/    # Volunteer information
│   ├── SupplyDepot/      # Supply management
│   ├── Resources/        # Resource matching
│   ├── AboutUs/          # About team page
├── lib/                  # Utilities and API
├── hooks/                # Custom React hooks
├── providers/            # React Context
```

## 👥 Team

This platform is built and maintained by a distributed team of remote volunteers working around the clock:

- **Website Development Team** - Frontend and backend development
- **Map Team** - GIS data and map integration
- **Design Team** - UI/UX design
- **Verification Team** - Data validation
- **Promotion Team** - Community outreach
- **DC Management Team** - Discord community management
- **Public Relations Team** - External communications

See the full team list in the [About Us](/volunteer/about-us) page.

## 🤝 Contributing

We welcome contributions from volunteers! This is an ongoing relief effort, and we appreciate:

- Bug reports and fixes
- Feature suggestions and implementations
- Documentation improvements
- Translation help
- Design improvements

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request to the `dev` branch

### Branch Strategy

- `main` - Production branch
- `dev` - Development branch (target for PRs)
- `feat/*` - Feature branches

## 📜 License

This project is private and maintained by the GuangFu Hero volunteer team.

## 💝 Mission

> 救災不只是短暫的行動，而是一場持續的接力。

Disaster relief is not just a temporary action, but a continuous relay. Whether you're on-site or remote, everyone can be a hero for Guangfu.

---

Built with ❤️ by remote volunteers for the Hualien community
