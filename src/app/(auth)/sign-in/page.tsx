import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
const page = () => {
  const [userName, setUserName] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmiiting, setisSubmiiting] = useState(false)
  const debounceUsername = useDebounceValue(usernameMessage, 300)

  const { toast } = useToast()
  const router = useRouter


  // zod implementation

  const form = useForm({
    // resolver needs schema
    resolver: zodResolver(signUpSchema),

    defaultValues: {
      username: '',
      email: '',

      password: ''
    }
  })
  useEffect(() => {
    const checkUniqueUsername = async () => {
      if (debounceUsername) {
        setisCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-unique-username?username=${debounceUsername}`)
          setUsernameMessage(response.data.meesage)
        } catch (error) {

          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message ?? "Error while checking Username")
        }
        finally {
          setisCheckingUsername(false)
        }
      }
    }
    checkUniqueUsername()
  }, [debounceUsername])
  return (
    <div>
      page
    </div>
  )
}

export default page
