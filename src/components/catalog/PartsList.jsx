import { Loader } from '../Loader'
import { OffersList } from './OffersList'
import styles from './PartsList.module.css'

const currency = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 2,
})

export function PartsList({
  article,
  error,
  offers,
  offersError,
  offersStatus,
  onRetryOffers,
  onRetry,
  onSelectPart,
  parts,
  selectedPart,
  status,
}) {
  return (
    <section className={styles.section} aria-live="polite">
      {status === 'loading' && <Loader label="Ищем детали и предложения…" />}

      {status === 'failed' && (
        <div className={styles.messageError}>
          <p>{error}</p>
          <button
            className={styles.retry}
            onClick={onRetry}
            type="button"
          >
            Повторить поиск
          </button>
        </div>
      )}

      {status === 'succeeded' && parts.length === 0 && (
        <p className={styles.empty}>
          По артикулу «{article}» детали не найдены. Проверьте номер и
          попробуйте ещё раз.
        </p>
      )}

      {status === 'succeeded' && parts.length > 0 && (
        <>
          <div className={styles.heading}>
            <div>
              <h2>Найденные детали</h2>
              <p>Выберите нужную позицию, чтобы посмотреть аналоги.</p>
            </div>
            <span className={styles.count}>
              {parts.length}{' '}
              {parts.length === 1
                ? 'деталь'
                : parts.length < 5
                  ? 'детали'
                  : 'деталей'}
            </span>
          </div>

          <ul className={styles.list}>
            {parts.map((part) => {
              const isSelected = selectedPart?.goodsID === part.goodsID
              const offersId = `offers-${part.goodsID}`

              return (
                <li className={styles.listItem} key={part.goodsID}>
                  <article className={styles.part}>
                    <div className={styles.partInfo}>
                      <div>
                        <h3>{part.name}</h3>
                        <p>
                          {part.brand} <span>·</span> Артикул {part.number}
                        </p>
                      </div>
                      <button
                        aria-controls={isSelected ? offersId : undefined}
                        aria-expanded={isSelected}
                        className={styles.select}
                        onClick={() => onSelectPart(part)}
                        type="button"
                      >
                        {isSelected ? 'Скрыть аналоги' : 'Аналоги'}
                        <span aria-hidden="true">→</span>
                      </button>
                    </div>

                    {part.warehouses.length > 0 ? (
                      <ul className={styles.warehouses}>
                        {part.warehouses.map((warehouse, index) => (
                          <li
                            className={styles.warehouse}
                            key={warehouse.id || `${part.goodsID}-${index}`}
                          >
                            <span className={styles.warehouseName}>
                              {warehouse.code || 'Склад'}
                            </span>
                            <span className={styles.price}>
                              {currency.format(warehouse.price)}
                            </span>
                            <span className={styles.stock}>
                              {warehouse.stock > 0
                                ? `${warehouse.stock} шт.`
                                : 'Нет в наличии'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={styles.noStock}>
                        Нет предложений по складам
                      </p>
                    )}

                    {isSelected && (
                      <div className={styles.offers} id={offersId}>
                        <OffersList
                          article={part.number}
                          brand={part.brand}
                          error={offersError}
                          offers={offers}
                          onRetry={onRetryOffers}
                          status={offersStatus}
                        />
                      </div>
                    )}
                  </article>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </section>
  )
}
