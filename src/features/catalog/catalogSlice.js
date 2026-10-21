import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchOffers, fetchParts } from '../../services/partsApi'

const createRequestState = () => ({
  items: [],
  status: 'idle',
  error: null,
  requestId: null,
})

const initialState = {
  article: '',
  parts: createRequestState(),
  selectedPart: null,
  offers: createRequestState(),
}

export const searchParts = createAsyncThunk(
  'catalog/searchParts',
  ({ number }, { signal }) => fetchParts(number, signal),
)

export const searchOffers = createAsyncThunk(
  'catalog/searchOffers',
  ({ number, brand }, { signal }) => fetchOffers(number, brand, signal),
)

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setArticle(state, action) {
      state.article = action.payload
      state.parts = createRequestState()
      state.selectedPart = null
      state.offers = createRequestState()
    },
    selectPart(state, action) {
      state.selectedPart = action.payload
      state.offers = createRequestState()
    },
  },
  extraReducers(builder) {
    builder
      .addCase(searchParts.pending, (state, action) => {
        state.parts.status = 'loading'
        state.parts.error = null
        state.parts.requestId = action.meta.requestId
      })
      .addCase(searchParts.fulfilled, (state, action) => {
        if (state.parts.requestId !== action.meta.requestId) return
        state.parts.items = action.payload
        state.parts.status = 'succeeded'
        state.parts.requestId = null
      })
      .addCase(searchParts.rejected, (state, action) => {
        if (state.parts.requestId !== action.meta.requestId) return
        state.parts.requestId = null
        if (action.meta.aborted) {
          state.parts.status = 'idle'
          return
        }
        state.parts.status = 'failed'
        state.parts.error = action.error.message || 'Не удалось найти детали.'
      })
      .addCase(searchOffers.pending, (state, action) => {
        state.offers.status = 'loading'
        state.offers.error = null
        state.offers.requestId = action.meta.requestId
      })
      .addCase(searchOffers.fulfilled, (state, action) => {
        if (state.offers.requestId !== action.meta.requestId) return
        state.offers.items = action.payload
        state.offers.status = 'succeeded'
        state.offers.requestId = null
      })
      .addCase(searchOffers.rejected, (state, action) => {
        if (state.offers.requestId !== action.meta.requestId) return
        state.offers.requestId = null
        if (action.meta.aborted) {
          state.offers.status = 'idle'
          return
        }
        state.offers.status = 'failed'
        state.offers.error =
          action.error.message || 'Не удалось загрузить аналоги.'
      })
  },
})

export const { selectPart, setArticle } = catalogSlice.actions
export default catalogSlice.reducer
