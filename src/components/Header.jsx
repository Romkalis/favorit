import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <a className={styles.brand} href="/" aria-label="Фаворит — главная">
        <img src="/favicon.svg" alt="" />
        <span>Фаворит</span>
      </a>
      <span className={styles.caption}>Каталог запчастей</span>
    </header>
  )
}
