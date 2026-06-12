"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CertificateCard } from "@/components/certificates/CertificateCard";
import dynamic from "next/dynamic";

const CertificateDownload = dynamic(
  () => import("@/components/certificates/CertificateDownload").then((mod) => mod.CertificateDownload),
  { ssr: false, loading: () => <div className="p-8 text-center"><div className="w-8 h-8 mx-auto animate-spin rounded-full border-4 border-accent border-t-transparent" /></div> }
);
import { Award, ArrowLeft, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Certificate {
  _id: string;
  certificateId: string;
  course: { _id: string; title: string; category: string };
  student: { _id: string; name: string; email: string };
  grade: string;
  issuedAt: string;
  completionPercentage: number;
}

export default function StudentCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCertForDownload, setSelectedCertForDownload] = useState<Certificate | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await (api.get('/certificates') as any);
        if (res) {
          setCertificates(res);
        }
      } catch (error) {
        console.error("Failed to fetch certificates", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-4xl font-display font-bold text-foreground">My Certificates</h1>
        <p className="text-muted text-lg">Your earned achievements and course completions.</p>
      </div>

      {certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-muted/20 rounded-2xl bg-muted/5">
          <div className="w-24 h-24 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
            <Award size={48} />
          </div>
          <h2 className="text-2xl font-bold font-display mb-2">No Certificates Yet</h2>
          <p className="text-muted max-w-md mb-8">
            Complete a course to earn your first certificate. It will automatically appear here once you reach 100% completion.
          </p>
          <Link href="/courses">
            <Button size="lg" variant="primary">
              Browse Courses
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map(cert => (
            <CertificateCard 
              key={cert._id} 
              certificate={cert} 
              onDownload={() => setSelectedCertForDownload(cert)} 
            />
          ))}
        </div>
      )}

      {/* Download Modal Overlay */}
      {selectedCertForDownload && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-muted/20 my-8 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-muted/10 shrink-0">
              <h3 className="text-xl font-bold font-display">Download Certificate</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedCertForDownload(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 flex justify-center bg-muted/5">
              <CertificateDownload certificate={selectedCertForDownload} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
