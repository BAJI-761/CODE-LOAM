"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Award } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface CertificateCardProps {
  certificate: {
    _id: string;
    certificateId: string;
    course: { title: string; category?: string };
    grade?: string;
    issuedAt: string;
  };
  onDownload: () => void;
}

export function CertificateCard({ certificate, onDownload }: CertificateCardProps) {
  const gradeColors: Record<string, string> = {
    A: 'bg-[#D4AF37] text-black',
    B: 'bg-[#C0C0C0] text-black',
    C: 'bg-[#CD7F32] text-white',
    D: 'bg-[#6B7280] text-white',
  };
  
  const badgeColor = gradeColors[certificate.grade || 'C'] || gradeColors['C'];

  return (
    <Card variant="extruded" className="overflow-hidden flex flex-col group">
      <div className="bg-[#FEFCF8] dark:bg-card p-6 border-b border-muted/10 relative overflow-hidden flex-1">
        {/* Subtle background ornament */}
        <div className="absolute -right-6 -top-6 opacity-5 pointer-events-none">
          <Award size={120} />
        </div>
        
        <div className="flex justify-between items-start mb-4">
          <div className="text-xs font-mono text-muted tracking-widest uppercase">
            {certificate.course.category || 'Course Completion'}
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${badgeColor}`}>
            {certificate.grade || 'C'}
          </div>
        </div>
        
        <h3 className="text-xl font-bold font-display text-slate-900 dark:text-foreground leading-tight mb-2 pr-8 group-hover:text-accent transition-colors">
          {certificate.course.title}
        </h3>
        
        <p className="text-sm text-muted">
          Issued {format(new Date(certificate.issuedAt), 'MMM d, yyyy')}
        </p>
      </div>
      
      <CardContent className="p-4 bg-muted/5 flex items-center justify-between gap-2 border-t border-muted/10">
        <div className="text-[10px] font-mono text-muted truncate max-w-[120px]" title={certificate.certificateId || certificate._id}>
          ID: {certificate.certificateId || certificate._id}
        </div>
        <div className="flex gap-2">
          <Link href={`/certificates/verify/${certificate.certificateId || certificate._id}`} target="_blank">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" title="Verify Online">
              <ExternalLink className="w-4 h-4 mr-1" /> Verify
            </Button>
          </Link>
          <Button variant="inset" size="sm" className="h-8 px-3 text-xs" onClick={onDownload}>
            <Download className="w-4 h-4 mr-1" /> PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
