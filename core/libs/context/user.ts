import { createContext, Dispatch, SetStateAction } from 'react'

export type UserContext = {
  id: string
  name: string
  phoneNumber: string
  isLoading: boolean
}

export const userContextInitialValue = {
  id: '',
  name: '',
  phoneNumber: '',
  isLoading: true,
}

export const userContext = createContext<{
  user: typeof userContextInitialValue
  setUser?: Dispatch<
    SetStateAction<{
      id: string
      name: string
      phoneNumber: string
      isLoading: boolean
    }>
  >
}>({ user: userContextInitialValue })
