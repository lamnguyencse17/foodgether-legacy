import useSWR, { Fetcher } from 'swr'
import { UserClaim } from '../auth'

const fetchUserHandler: Fetcher<UserClaim, string> = async () => {
  return fetch('/api/auth/me', { credentials: 'include' }).then((res) =>
    res.json()
  )
}

export default function useAuth() {
  const {
    data: fetchedUser,
    mutate,
    error,
  } = useSWR('/api/auth/me', fetchUserHandler)
  const loading = !fetchedUser && !error
  const loggedOut = !!error && (error.status === 401 || error.status === 500)
  return { fetchedUser, mutate, loading, loggedOut }
}
