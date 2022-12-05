import { ReactNode } from "react";
import Head from "next/head";
import { useAuth } from "../context/AuthContext";
import styles from "./Layout.module.scss";
import Link from "next/link";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  return (
    <>
      <Head>
        <title>D I C E Y</title>
        <meta name="description" content="Dice game with friends" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <h1 className={styles.logo}>
          <Link href="/">DICEY</Link>
        </h1>
        <div className={styles["user-menu"]}>
          {user ? <button className={styles.button}>Logout</button> : null}
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
}
