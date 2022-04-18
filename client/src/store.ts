import { configureStore } from '@reduxjs/toolkit'
import walletReducer from 'src/reducers/walletSlice'

export default configureStore({
  reducer: {
    wallet: walletReducer
  },
})