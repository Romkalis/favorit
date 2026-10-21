import { useDispatch, useSelector } from 'react-redux'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { PartsList } from './components/catalog/PartsList'
import { PartSearchForm } from './components/catalog/PartSearchForm'
import {
  searchOffers,
  searchParts,
  selectPart,
} from './features/catalog/catalogSlice'
import styles from './App.module.css'

function App() {
  const dispatch = useDispatch()
  const { article, parts, selectedPart, offers } = useSelector(
    (state) => state.catalog,
  )

  function handleSelectPart(part) {
    dispatch(selectPart(selectedPart?.goodsID === part.goodsID ? null : part))
    if (selectedPart?.goodsID !== part.goodsID) {
      dispatch(searchOffers({ number: part.number, brand: part.brand }))
    }
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <section className={styles.intro}>
          <span className={styles.eyebrow}>ПОИСК АВТОЗАПЧАСТЕЙ</span>
          <h1>
            Нужная деталь.
            <br />
            <span>Без лишнего поиска.</span>
          </h1>
          <p>
            Введите артикул, чтобы увидеть найденные детали и предложения
            поставщиков. Для каждой позиции можно посмотреть аналоги.
          </p>
        </section>
        <div className={styles.searchCard}>
          <PartSearchForm />
          <PartsList
            article={article}
            error={parts.error}
            offers={offers.items}
            offersError={offers.error}
            offersStatus={offers.status}
            parts={parts.items}
            selectedPart={selectedPart}
            onSelectPart={handleSelectPart}
            onRetry={() => dispatch(searchParts({ number: article.trim() }))}
            onRetryOffers={() => {
              if (selectedPart) {
                dispatch(
                  searchOffers({
                    number: selectedPart.number,
                    brand: selectedPart.brand,
                  }),
                )
              }
            }}
            status={parts.status}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
