"use client";

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { CertificateTemplate } from './CertificateTemplate';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

interface CertificateDownloadProps {
  certificate: {
    _id: string;
    certificateId: string;
    course: { title: string };
    student: { name: string };
    instructor?: { name: string };
    grade?: string;
    issuedAt: string;
  };
}

export function CertificateDownload({ certificate }: CertificateDownloadProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!certRef.current) return;
    setIsDownloading(true);

    try {
      // Small timeout to ensure fonts and styles are fully loaded
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(certRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#FEFCF8',
        logging: false,
        windowWidth: 1123,
        windowHeight: 794,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const cleanCourseName = certificate.course.title.replace(/[^a-z0-9]/gi, '_');
      const dateStr = format(new Date(), 'yyyy-MM-dd');
      pdf.save(`CodeLoom-Certificate-${cleanCourseName}-${dateStr}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const formattedDate = format(new Date(certificate.issuedAt), 'MMMM d, yyyy');

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-4xl overflow-hidden rounded-xl shadow-2xl bg-[#FEFCF8]">
        <div className="w-full" style={{ aspectRatio: '1123/794' }}>
          {/* We scale the template via CSS transform to fit its container while maintaining 1123x794 native resolution for html2canvas */}
          <div className="relative w-full h-full">
            <div className="absolute top-0 left-0 origin-top-left" style={{ transform: 'scale(var(--scale-factor, 0.5))', width: '1123px', height: '794px' }}>
               <CertificateTemplate
                ref={certRef}
                studentName={certificate.student.name || 'Student'}
                courseName={certificate.course.title}
                issueDate={formattedDate}
                certificateId={certificate.certificateId || certificate._id}
                instructorName={certificate.instructor?.name || 'CodeLoom Instructor'}
                grade={certificate.grade || 'C'}
              />
            </div>
            {/* Inline script hack to auto-scale the fixed size certificate to container width, avoiding ResizeObserver complex setups for this simple usecase */}
            <style dangerouslySetInnerHTML={{__html: `
              .w-full > .relative > .origin-top-left {
                --scale-factor: min(1, calc(100vw / 1200));
              }
              @media (min-width: 896px) {
                .w-full > .relative > .origin-top-left {
                  --scale-factor: calc(896 / 1123);
                }
              }
            `}} />
          </div>
        </div>
      </div>
      
      <Button 
        size="lg" 
        onClick={handleDownload} 
        disabled={isDownloading}
        className="w-full sm:w-auto min-w-[250px]"
      >
        {isDownloading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
        {isDownloading ? 'Generating High-Res PDF...' : 'Download PDF Certificate'}
      </Button>
    </div>
  );
}
