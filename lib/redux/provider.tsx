"use client"

import type React from "react"

import { store } from "./store"
import { Provider } from "react-redux"
import { useEffect } from "react"
import { setCredentials, setLoading } from "./slices/authSlice"
import axios from "axios"

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const response = await axios.get("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.data.user) {
            store.dispatch(
              setCredentials({
                user: response.data.user,
                token,
              }),
            )
          }
        }
      } catch (error) {
        localStorage.removeItem("token")
      } finally {
        store.dispatch(setLoading(false))
      }
    }

    checkAuth()
  }, [])

  return <Provider store={store}>{children}</Provider>
}
