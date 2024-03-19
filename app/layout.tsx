import '@/app/ui/global.css';
import { inter,lusitana } from './ui/font';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lusitana.className}`}>{children}</body>
    </html>
  );
}
