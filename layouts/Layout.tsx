import { ReactNode } from "react";
import Head from "next/head";
import { useAuth } from "../context/AuthContext";
import styles from "./Layout.module.scss";
import Link from "next/link";
import UserMenu from "../components/UserMenu/UserMenu";

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
          <Link href="/">Dicey</Link>
        </h1>
        <div className={styles["user-menu"]}>
          <UserMenu />
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
}
