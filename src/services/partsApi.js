import {
  articleSchema,
  apiErrorSchema,
  partsResponseSchema,
} from '../features/catalog/catalogSchemas'

const apiBaseUrl = 'https://api.favorit-parts.ru/hs/hsprice'
const apiKey = '00000000-0000-0000-0000-000000000001'

async function getJson(path, signal) {
  let response

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      headers: { Accept: 'application/json' },
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error(
      'Не удалось подключиться к серверу. Проверьте соединение и попробуйте ещё раз.',
      { cause: error },
    )
  }

  let data
  try {
    data = await response.json()
  } catch {
    if (!response.ok) {
      throw new Error(
        `Сервер вернул ошибку (${response.status}). Попробуйте повторить запрос позже.`,
      )
    }
    throw new Error('Сервер вернул некорректный ответ.')
  }

  const apiError = apiErrorSchema.safeParse(data)
  if (apiError.success) {
    throw new Error(getApiErrorMessage(apiError.data.error))
  }

  if (!response.ok) {
    throw new Error(
      `Сервер вернул ошибку (${response.status}). Попробуйте повторить запрос позже.`,
    )
  }

  return data
}

function getApiErrorMessage(message) {
  if (message === 'Empty key!') {
    return 'Не задан ключ доступа к API.'
  }
  if (message === 'Invalid key client!') {
    return 'Ключ доступа к API недействителен.'
  }
  if (message === 'Empty number goods!') {
    return 'Введите артикул детали.'
  }
  if (message === 'Request quota exceeded!') {
    return 'Превышен лимит запросов к API. Попробуйте позже.'
  }
  return `Ошибка API: ${message}`
}

function parsePartsResponse(data) {
  const result = partsResponseSchema.safeParse(data)
  if (!result.success) {
    throw new Error('Сервер вернул данные автозапчастей в неизвестном формате.')
  }
  return result.data
}

function isRealPart(part) {
  return (
    part.brand.trim().length > 0 &&
    part.name.trim().length > 0 &&
    part.goodsID !== '00000000-0000-0000-0000-000000000000'
  )
}

async function searchParts(number, brand, signal) {
  const validatedNumber = articleSchema.parse(number)
  const params = new URLSearchParams({
    key: apiKey,
    number: validatedNumber,
  })

  if (brand) {
    params.set('brand', brand)
    params.set('analogues', 'on')
  }

  const data = await getJson(`/?${params}`, signal)
  return parsePartsResponse(data).goods
}

export async function fetchParts(number, signal) {
  const goods = await searchParts(number, undefined, signal)

  return goods.filter(isRealPart)
}

export async function fetchOffers(number, brand, signal) {
  const goods = await searchParts(number, brand, signal)

  return goods
    .flatMap((good) => [good, ...(good.analogues || [])])
    .filter(isRealPart)
    .flatMap((part) => {
      if (part.warehouses.length === 0) {
        return [
          {
            id: `${part.goodsID}-no-stock`,
            name: part.name,
            brand: part.brand,
            price: null,
            stock: 0,
            warehouse: null,
          },
        ]
      }

      return part.warehouses.map((warehouse, index) => ({
        id: `${part.goodsID}-${warehouse.id || index}`,
        name: part.name,
        brand: part.brand,
        price: warehouse.price,
        stock: warehouse.stock,
        warehouse: warehouse.code || null,
      }))
    })
}
