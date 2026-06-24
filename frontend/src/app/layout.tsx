import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import Link from "next/link";
import { createClient } from '@/utils/supabase/server'
import { logout } from './login/actions'

// Using modern fonts for a sleek look
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Fantasy F1 League",
  description: "The ultimate Fantasy Formula 1 experience.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        {/* Global Navigation Bar */}
        <header className={styles.header}>
          <div className={styles.navContainer}>
            <Link href="/" className={styles.logo}>
              Fantasy<span className="text-gradient-red">F1</span>
            </Link>
            
            <nav className={styles.navLinks}>
              <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
              <Link href="/team" className={styles.navLink}>My Team</Link>
              <Link href="/leaderboard" className={styles.navLink}>Leaderboard</Link>
            </nav>

            <div className={styles.navActions}>
              {user ? (
                <form action={logout}>
                  <button className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
                    Logout
                  </button>
                </form>
              ) : (
                <Link href="/login" className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
                  Login
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Main Page Content */}
        <main className={styles.mainContent}>
          {children}
        </main>
      </body>
    </html>
  );
}
