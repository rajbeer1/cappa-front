"use client"

import { Button } from "@/components/ui/button"
import Cookies from 'js-cookie';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosClient from "@/helpers/axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
export default function LoginAccount() {
  const router = useRouter()
  const [data, setdata] = useState({
    email: "",
    password:""
  })
  const [remember,setremember]= useState(0)
  const [isloading, setisloading] = useState(false)
  const submit = async () => {
    try {
      setisloading(true)
      const user = await axiosClient.post('/api/auth/login', data)
      toast.success("successfully logged in")
       Cookies.set('user', user.data.token, { expires: 365 });
      
      router.push('/home')
      setisloading(true)
    } catch (error: any) {
      const erro = error.response.data.message || error?.message || 'error';
      toast.error(erro);
      setisloading(false)
    } finally {
      setisloading(false);
    }
 }
  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
      <div className="w-full m-auto bg-white lg:max-w-lg">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
          }}
        ></Toaster>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Log in</CardTitle>
            <CardDescription className="text-center font-bold text-black">
              Welcome to HelmetTech
            </CardDescription>
            <CardDescription className="text-center">
              Enter your email and password to login
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                placeholder=""
                onChange={(e) => {
                  setdata({ ...data, email: e.target.value });
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => {
                  setdata({ ...data, password: e.target.value });
                }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                onCheckedChange={(checked) => {
                  if (checked === false) {
                    setremember(0);
                  } else if (checked === true) {
                    setremember(1);
                  }
                  console.log(remember);
                }}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            <div className="flex items-center">
              <span className="mr-2">New to the website?</span>
              <Button
                onClick={() => router.push('/sign-up')}

              >
                Sign Up
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button disabled={isloading} className="w-full" onClick={submit}>
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
