"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Award, Code2, Calendar, User, BookOpen } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface VerifiedCertificate {
  _id: string;
  certificateId: string;
  course: { title: string; category: string; difficulty: string };
  student: { name: string; email: string };
  grade: string;
  issuedAt: string;
}

export default function CertificateVerificationPage() {
  const { id } = useParams();
  const [certificate, setCertificate] = useState<VerifiedCertificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // We use a direct axios call to bypass the api interceptor which might require auth/tokens
    const verifyCertificate = async () => {
      try {
        const response = await axios.get(`${API_URL}/certificates/verify/${id}`);
        if (response.data?.success && response.data?.data) {
          setCertificate(response.data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Verification failed", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) verifyCertificate();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent mb-4" />
        <p className="text-muted font-mono tracking-widest uppercase text-sm">Verifying Record...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      
      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-2 mb-12 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 bg-foreground text-background rounded-lg flex items-center justify-center">
          <Code2 size={20} />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">CodeLoom</span>
      </Link>

      {error || !certificate ? (
        <Card variant="surface" className="w-full max-w-lg border-red-500/20 bg-red-500/5 animate-in slide-in-from-bottom-4 duration-500">
          <CardContent className="pt-12 pb-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <XCircle size={40} />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">Certificate Not Found</h1>
            <p className="text-muted text-lg max-w-sm mb-8">
              This certificate ID does not match any records in our system. The ID may be invalid or the certificate may have been revoked.
            </p>
            <div className="font-mono text-xs text-muted bg-background p-3 rounded-md w-full border">
              Queried ID: {id}
            </div>
            <Link href="/" className="mt-8 w-full">
              <Button variant="outline" className="w-full">Return to Homepage</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card variant="extruded" className="w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-700 overflow-hidden">
          <div className="bg-green-500/10 border-b border-green-500/20 p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-5 text-green-600 pointer-events-none">
              <CheckCircle2 size={200} />
            </div>
            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/30 z-10">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground z-10">Verified Certificate</h1>
            <p className="text-green-700 font-medium z-10">This is a valid CodeLoom official record.</p>
          </div>
          
          <CardContent className="p-8 space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold font-serif mb-2">{certificate.student.name}</h2>
              <p className="text-muted">Successfully completed the requirements for:</p>
            </div>

            <div className="bg-muted/5 rounded-xl p-6 border border-muted/10">
              <h3 className="text-2xl font-bold font-display text-center mb-6">{certificate.course.title}</h3>
              
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="flex flex-col">
                  <span className="text-xs text-muted font-mono uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar size={12} /> Issue Date
                  </span>
                  <span className="font-medium">{format(new Date(certificate.issuedAt), 'MMMM d, yyyy')}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-muted font-mono uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Award size={12} /> Grade
                  </span>
                  <span className="font-bold text-lg">{certificate.grade || 'C'}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-muted font-mono uppercase tracking-wider mb-1 flex items-center gap-1">
                    <BookOpen size={12} /> Category
                  </span>
                  <span className="font-medium">{certificate.course.category || 'General'}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-muted font-mono uppercase tracking-wider mb-1 flex items-center gap-1">
                    <User size={12} /> Account
                  </span>
                  <span className="font-medium text-sm truncate" title={certificate.student.email}>{certificate.student.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-muted/10">
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted font-mono uppercase tracking-wider mb-2">Official Certificate ID</span>
                <span className="font-mono text-sm bg-muted/10 px-4 py-2 rounded-md font-medium tracking-widest">{certificate.certificateId}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="mt-12 text-center text-sm text-muted max-w-md">
        CodeLoom certificates verify that a learner has completed all required coursework and passed all assessments for a specific curriculum.
      </div>
    </div>
  );
}
