import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { articleSchema } from '../../features/catalog/catalogSchemas'
import { searchParts, setArticle } from '../../features/catalog/catalogSlice'
import styles from './PartSearchForm.module.css'

export function PartSearchForm() {
  const dispatch = useDispatch()
  const article = useSelector((state) => state.catalog.article)
  const timeoutRef = useRef(null)
  const requestRef = useRef(null)
  const validation = articleSchema.safeParse(article)
  const validationError =
    article && !validation.success ? validation.error.issues[0].message : ''

  useEffect(() => {
    const result = articleSchema.safeParse(article)
    if (!result.success) return undefined

    timeoutRef.current = window.setTimeout(() => {
      requestRef.current = dispatch(searchParts({ number: result.data }))
    }, 350)

    return () => {
      window.clearTimeout(timeoutRef.current)
      requestRef.current?.abort()
    }
  }, [article, dispatch])

  function handleChange(event) {
    dispatch(setArticle(event.target.value))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const result = articleSchema.safeParse(article)
    if (!result.success) return

    window.clearTimeout(timeoutRef.current)
    requestRef.current?.abort()
    requestRef.current = dispatch(searchParts({ number: result.data }))
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor="part-article">
        Артикул детали
      </label>
      <div className={styles.controls}>
        <input
          id="part-article"
          className={styles.input}
          type="search"
          value={article}
          onChange={handleChange}
          placeholder="Например, 0 986 479 358"
          autoComplete="off"
          aria-invalid={Boolean(validationError)}
          aria-describedby={validationError ? 'article-error' : 'article-hint'}
        />
        <span className={styles.hint} id={validationError ? 'article-error' : 'article-hint'}>
          {validationError || 'Начните вводить номер детали'}
        </span>
      </div>
      <button
        className={styles.submit}
        type="submit"
        disabled={!validation.success}
      >
        Найти
      </button>
    </form>
  )
}
