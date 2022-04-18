import { createSlice } from '@reduxjs/toolkit'

export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    connectedWallet: 'test',
    API: 'est',
  },
  reducers: {
    connectWallet: (state) => {
      state.connectedWallet = state.connectedWallet
    }
  },
})

// Action creators are generated for each case reducer function
export const { connectWallet } = walletSlice.actions

export default walletSlice.reducer