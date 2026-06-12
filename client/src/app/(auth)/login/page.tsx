"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, Mail, Lock } from "lucide-react"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import api from "@/lib/api"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, user, isLoading: authLoading } = useAuth()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
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

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitting(true)
    try {
      const response = await api.post("/auth/login", values)
      
      if (response.data?.success && response.data?.data) {
        const { token, user: userData } = response.data.data
        login(token, userData)
        toast.success("Successfully logged in!")
        
        if (userData.role === "instructor") {
          router.push("/instructor/dashboard")
        } else if (userData.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/dashboard")
        }
      } else {
        toast.error(response.data?.message || "Failed to log in")
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Something went wrong. Please check your credentials."
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card variant="extruded" density="comfortable" className="w-full animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-display font-bold text-foreground">Welcome back</CardTitle>
        <CardDescription className="text-muted mt-2">
          Enter your credentials to access your workspace
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <div className="flex justify-between items-center pl-1">
              <label htmlFor="password" className="text-sm font-medium text-foreground/80">
                Password
              </label>
            </div>
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

          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full mt-4 font-semibold shadow-extruded transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-center pt-8 border-t border-muted/10">
        <p className="text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-accent hover:underline focus-visible:outline-none"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
