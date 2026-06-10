import './globals.css';

export const metadata = {
  title: 'LokalSense - Panduan Budaya & Bahasa Real-Time',
  description: 'AI Offline Penterjemah Bahasa Daerah dan Etika Budaya Lokal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Mengintegrasikan Pi SDK v2 Resmi */}
        <script src="https://sdk.minepi.com/pi-sdk.js" defer></script>
      </head>
      <body className="bg-[#FDFBF7] text-[#2C2A29] antialiased">
        {children}
      </h2>
    </html>
  );
}

