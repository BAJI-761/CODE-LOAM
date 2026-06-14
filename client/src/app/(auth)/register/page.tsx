"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, Mail, Lock, User as UserIcon } from "lucide-react"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"
import api from "@/lib/api"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "instructor"]),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { isAuthenticated, user, isLoading: authLoading } = useAuth()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
    },
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.role === "instructor") {
        router.push("/instructor/dashboard")
      } else if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, user, authLoading, router])

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitting(true)
    try {
      const response = await api.post("/auth/register", values)
      
      if (response?.success) {
        toast.success("Registration successful! Redirecting to login...")
        setTimeout(() => {
          router.push("/login")
        }, 1500)
      } else {
        toast.error(response?.message || "Failed to register")
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Something went wrong. Please try again."
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card variant="extruded" density="comfortable" className="w-full animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-display font-bold text-foreground">Create account</CardTitle>
        <CardDescription className="text-muted mt-2">
          Start your learning and coding journey today
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground/80 pl-1">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-3.5 h-5 w-5 text-muted/65" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="pl-12"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                disabled={submitting}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <span id="name-error" className="text-xs text-red-500 pl-1">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground/80 pl-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted/65" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-12"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                disabled={submitting}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <span id="email-error" className="text-xs text-red-500 pl-1">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground/80 pl-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted/65" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-12"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                disabled={submitting}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <span id="password-error" className="text-xs text-red-500 pl-1">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium text-foreground/80 pl-1">
              I want to join as a
            </label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={submitting}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student (Learn & Solve)</SelectItem>
                    <SelectItem value="instructor">Instructor (Teach & Review)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <span id="role-error" className="text-xs text-red-500 pl-1">
                {errors.role.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full mt-6 font-semibold shadow-extruded transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Registering...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-center pt-8 border-t border-muted/10">
        <p className="text-sm text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-accent hover:underline focus-visible:outline-none"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
