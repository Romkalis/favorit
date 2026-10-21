import styles from './Loader.module.css'

export function Loader({ label = 'Загрузка…' }) {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <img src="/favicon.svg" alt="" />
      <span>{label}</span>
    </div>
  )
}
