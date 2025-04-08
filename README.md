# Fashion Trend Analyzer

A visually elegant, scalable fashion trend analysis web application built with Next.js, React, Tailwind CSS v3, and shadcn UI. This application analyzes data from platforms like Google, Pinterest, Instagram, and TikTok, presenting results in a user-friendly dashboard.

## Features

- **Multi-Platform Analysis**: Analyze fashion trends from Google, Pinterest, Instagram, and TikTok in one unified dashboard
- **Visual Analytics**: Beautiful charts and visualizations to understand trend patterns
- **Detailed Trend Reports**: Comprehensive analysis of each trend with growth metrics, platform distribution, and demographics
- **Responsive Design**: Fully responsive UI that works on desktop, tablet, and mobile devices
- **Modern UI**: Built with shadcn UI components and Tailwind CSS for a clean, modern interface

## Tech Stack

- **Next.js**: React framework for server-rendered applications
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed JavaScript for better developer experience
- **Tailwind CSS v3**: Utility-first CSS framework
- **shadcn UI**: High-quality UI components built with Radix UI and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fashion-trend-analyzer.git
cd fashion-trend-analyzer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
fashion-trend-analyzer/
├── src/
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   │   ├── ui/            # UI components (shadcn)
│   │   └── layout/        # Layout components
│   ├── lib/               # Utility functions
│   ├── services/          # API services
│   ├── styles/            # Global styles
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Helper functions
│   └── hooks/             # Custom React hooks
├── public/                # Static assets
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## Future Enhancements

- Integration with real data sources via APIs
- AI-powered trend prediction models
- User authentication and personalized dashboards
- Advanced filtering and search capabilities
- Export functionality for reports and visualizations

## License

This project is licensed under the ISC License.
