const USERS_STORAGE_KEY = 'prince-cinema-users'
const SESSION_STORAGE_KEY = 'prince-cinema-session'
const AUTH_EVENT_NAME = 'prince-cinema-auth-change'

const readUsers = () => {
  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY)
    return storedUsers ? JSON.parse(storedUsers) : []
  } catch {
    return []
  }
}

const writeUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

const notifyAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_EVENT_NAME))
}

export const signupUser = async ({ username, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase()
  const users = readUsers()

  const existingUser = users.find((user) => user.email === normalizedEmail)

  if (existingUser) {
    throw new Error('An account with this email already exists.')
  }

  const newUser = {
    id: crypto.randomUUID(),
    username: username.trim(),
    email: normalizedEmail,
    password,
  }

  writeUsers([...users, newUser])

  return newUser
}

export const loginUser = async ({ email, password, rememberMe }) => {
  const normalizedEmail = email.trim().toLowerCase()
  const users = readUsers()

  const matchedUser = users.find(
    (user) => user.email === normalizedEmail && user.password === password,
  )

  if (!matchedUser) {
    throw new Error('Login failed. Check credentials.')
  }

  const sessionPayload = {
    userId: matchedUser.id,
    email: matchedUser.email,
    username: matchedUser.username,
    rememberMe: Boolean(rememberMe),
  }

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionPayload))
  notifyAuthChange()

  return matchedUser
}

export const getCurrentSession = () => {
  try {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY)
    return storedSession ? JSON.parse(storedSession) : null
  } catch {
    return null
  }
}

export const logoutUser = () => {
  localStorage.removeItem(SESSION_STORAGE_KEY)
  notifyAuthChange()
}

export const authChangeEventName = AUTH_EVENT_NAME
