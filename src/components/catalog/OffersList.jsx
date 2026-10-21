import { Loader } from '../Loader'
import styles from './OffersList.module.css'

const currency = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 2,
})

export function OffersList({ article, brand, error, offers, onRetry, status }) {
  return (
    <section className={styles.section} aria-live="polite">
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>АРТИКУЛ {article}</span>
          <h2>Предложения: {brand}</h2>
        </div>
        {status === 'succeeded' && offers.length > 0 && (
          <span className={styles.count}>
            {offers.length}{' '}
            {offers.length === 1
              ? 'предложение'
              : offers.length < 5
                ? 'предложения'
                : 'предложений'}
          </span>
        )}
      </div>

      {status === 'loading' && <Loader label="Загружаем аналоги и предложения…" />}

      {status === 'failed' && (
        <div className={styles.error}>
          <p>{error}</p>
          <button
            className={styles.retry}
            onClick={onRetry}
            type="button"
          >
            Повторить загрузку
          </button>
        </div>
      )}

      {status === 'succeeded' && offers.length === 0 && (
        <p className={styles.empty}>
          Для выбранного производителя предложений пока нет.
        </p>
      )}

      {status === 'succeeded' && offers.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Деталь</th>
                <th scope="col">Производитель</th>
                <th scope="col">Склад</th>
                <th scope="col">Цена</th>
                <th scope="col">Остаток</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id}>
                  <td className={styles.part}>{offer.name}</td>
                  <td>{offer.brand}</td>
                  <td>{offer.warehouse || '—'}</td>
                  <td className={styles.price}>
                    {offer.price === null ? '—' : currency.format(offer.price)}
                  </td>
                  <td>
                    {offer.stock > 0 ? (
                      <span className={styles.stock}>{offer.stock} шт.</span>
                    ) : (
                      <span className={styles.outOfStock}>Нет в наличии</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
