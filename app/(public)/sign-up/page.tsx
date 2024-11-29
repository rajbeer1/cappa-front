'use client';

import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axiosClient from '@/helpers/axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function SignUp() {
  const router = useRouter();
  const [data, setdata] = useState({
    email: '',
    password: '',
    name: '',
    DOB: '',
    contactNumber: '',
    fatherName: '',
    emergencyContactNumber: '',
    bloodGroup: '',
    address: '',
    height: '',
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [remember, setremember] = useState(0);
  const [isloading, setisloading] = useState(false);

  
  const submit = async () => {
    try {
      setisloading(true);
      const user = await axiosClient.post('/api/auth/signup', {
        ...data,
        height: Number(data.height),
      });
      toast.success('Successfully signed up');
      Cookies.set('user', user.data.token, { expires: 365 });

      router.push('/home');
    } catch (error: any) {
      const erro = error.response?.data?.message || error?.message || 'error';
      toast.error(erro);
    } finally {
      setisloading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
      <div className="w-full m-auto bg-white lg:max-w-lg">
        <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
            <CardDescription className="text-center font-bold text-black">
              Welcome to HelmetTech
            </CardDescription>
            <CardDescription className="text-center">
              Enter your details to create an account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setdata({ ...data, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setdata({ ...data, email: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setdata({ ...data, password: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={data.DOB}
                onChange={(e) => setdata({ ...data, DOB: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                value={data.contactNumber}
                onChange={(e) =>
                  setdata({ ...data, contactNumber: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fatherName">Fathers Name</Label>
              <Input
                id="fatherName"
                value={data.fatherName}
                onChange={(e) =>
                  setdata({ ...data, fatherName: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="emergencyContact">Emergency Contact Number</Label>
              <Input
                id="emergencyContact"
                value={data.emergencyContactNumber}
                onChange={(e) =>
                  setdata({ ...data, emergencyContactNumber: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select
                onValueChange={(value) =>
                  setdata({ ...data, bloodGroup: value })
                }
                value={data.bloodGroup}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={data.address}
                onChange={(e) => setdata({ ...data, address: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="height">Height (in cm)</Label>
              <Input
                id="height"
                type="number"
                value={data.height}
                onChange={(e) => setdata({ ...data, height: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                onCheckedChange={(checked) => {
                  setremember(checked ? 1 : 0);
                }}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
          <div className="flex items-center">
              <span className="mr-2">Revisting?</span>
              <Button
                onClick={() => router.push('/')}

              >
                Log In
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button disabled={isloading} className="w-full" onClick={submit}>
              Sign Up
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
