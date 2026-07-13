import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"

export interface MainModalState {
  display: boolean
}

const mainModalSlice = createSlice({
  name: "main-modal",
  initialState: { display: false},
  reducers: {
     toggleModal: (state, action : PayloadAction<boolean>) => {
      state.display = action.payload
    },
     closeModal: (state) => {
      state.display = false
    },
     openModal: (state) => {
      state.display = true
    },
 
  }
})

export const { toggleModal, openModal, closeModal } = mainModalSlice.actions
export const mainModalSelector = (state: RootState) => state.mainModal.display

export default mainModalSlice.reducer