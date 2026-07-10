import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"

export interface QueriesState {
  ids: string
}

const queriesSlice = createSlice({
  name: "queries",
  initialState: { ids: '""' },
  reducers: {
    addQueries: (state, action : PayloadAction<string>) => {
      console.log({payload: action.payload})
      state.ids = action.payload
    },
    removeQueries: (state) => {
      state.ids = ""
    }
  }
})

export const { addQueries, removeQueries } = queriesSlice.actions
export const queriesSelector = (state: RootState) => state.queries.ids

export default queriesSlice.reducer