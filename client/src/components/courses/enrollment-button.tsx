"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useEnroll, useMyEnrollments } from "@/hooks/useCourses"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface EnrollmentButtonProps {
  courseId: string
  price?: number
}

export function EnrollmentButton({ courseId, price = 0 }: EnrollmentButtonProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { data: enrollments, isLoading: enrollmentsLoading } = useMyEnrollments()
  const { mutate: enroll, isPending } = useEnroll()

  const isEnrolled = enrollments?.some((e: any) => e.course._id === courseId || e.course === courseId)

  const handleEnroll = () => {
    if (!user) {
      toast.error("Please log in to enroll in this course")
      router.push(`/login?redirect=/courses/${courseId}`)
      return
    }

    enroll(courseId, {
      onSuccess: () => {
        toast.success("Successfully enrolled! Welcome to the course.")
        router.push(`/courses/${courseId}/learn`)
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to enroll in course. Please try again.")
      }
    })
  }

  const handleContinue = () => {
    router.push(`/courses/${courseId}/learn`)
  }

  if (isEnrolled) {
    return (
      <Button 
        variant="primary" 
        size="lg" 
        className="w-full text-lg h-14" 
        onClick={handleContinue}
      >
        Continue Learning
      </Button>
    )
  }

  return (
    <Button 
      variant="accent" 
      size="lg" 
      className="w-full text-lg h-14 relative overflow-hidden" 
      onClick={handleEnroll}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        <>
          Enroll Now {price === 0 ? "(Free)" : `($${price})`}
        </>
      )}
    </Button>
  )
}
