import useSWR, { Fetcher } from 'swr'
import { UserClaim } from '../auth'

const fetchUserHandler: Fetcher<
  UserClaim | { message: string },
  string
> = async () => {
  return fetch('/api/auth/me', { credentials: 'include' }).then(async (res) => {
    if (!res.ok) {
      throw new Error((await res.json()).message)
    }
    return res.json()
  })
}

export default function useAuth() {
  const {
    data: authResponse,
    mutate,
    error,
  } = useSWR('/api/auth/me', fetchUserHandler)
  const loading = !authResponse && !error
  const loggedOut = !!error
  return { authResponse, mutate, loading, loggedOut }
}
