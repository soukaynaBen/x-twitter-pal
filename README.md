# X-Twitter Pal

**Version:** 1.0.1

A browser extension built with [Plasmo](https://www.plasmo.com/) and styled using [shadcn/ui](https://ui.shadcn.com/) + Tailwind CSS.

> 💛 **Support Notice:** If you find this project useful, please support my work with a paid [GitHub Sponsors](https://github.com/sponsors/soukaynaben)subscription before using it — for both personal and business use. See the [License](#-license) section below for details.

## ✨ Features

- ⚡️ Built with Plasmo framework
- 🎨 Styled with shadcn/ui components
- 🌗 Light/Dark mode support
- 🧩 Popup, Options page, and Content Script support
- 🔒 Type-safe with TypeScript

## 📦 Tech Stack

- **Framework:** [Plasmo](https://docs.plasmo.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm / npm / yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/soukaynaben/x-twitter-pal.git
   cd x-twitter-pal
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Load the extension in your browser:
   - Open `chrome://extensions`
   - Enable **Developer mode**
   - Click **Load unpacked**
   - Select the `build/chrome-mv3-dev` folder

## 🏗️ Building for Production

```bash
pnpm build
```

This creates a production-ready build in `build/chrome-mv3-prod`, which you can zip and submit to the Chrome Web Store.

## 📁 Project Structure

```
├── popup.tsx              # Extension popup UI
├── contents/               # Content scripts
├── background.ts           # Background service worker
├── components/
│   └── ui/                 # shadcn/ui components
├── lib/
│   └── utils.ts            # Utility functions (cn helper, etc.)
├── globals.css             # Tailwind + shadcn theme variables
├── tailwind.config.js
└── package.json
```

## 🎨 Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add button
```

> Note: Component paths may need adjusting since Plasmo's folder structure differs from Next.js.

## 🧪 Testing

```bash
pnpm test
```

## 📄 License

If you find this project useful, please support my work by subscribing via [GitHub Sponsors](https://github.com/sponsors/soukaynaben) before using it.

- 💛 Sponsorship is requested for both personal and business use.
- 📧 Contact the author for enterprise/team licensing options.

See the [LICENSE](LICENSE) file for full terms.

## 🙏 Acknowledgments

- [Plasmo](https://www.plasmo.com/)
- [shadcn/ui](https://ui.shadcn.com/)