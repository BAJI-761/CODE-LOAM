"use client";

import React, { forwardRef } from 'react';
import { GradeBadge } from './GradeBadge';
import { Code2 } from 'lucide-react';

interface CertificateTemplateProps {
  studentName: string;
  courseName: string;
  issueDate: string;
  certificateId: string;
  instructorName?: string;
  grade?: string;
}

export const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(
  ({ studentName, courseName, issueDate, certificateId, instructorName = "CodeLoom Instructor", grade = "C" }, ref) => {
    return (
      <div 
        ref={ref}
        id="certificate-template" 
        className="w-[1123px] h-[794px] bg-[#FEFCF8] relative overflow-hidden"
        style={{ fontFamily: 'var(--font-display), sans-serif' }}
      >
        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Code2 size={400} />
        </div>

        {/* Decorative borders */}
        <div className="absolute inset-8 border-[3px] border-[#2D3748]" />
        <div className="absolute inset-12 border border-[#2D3748]/40" />
        
        {/* Corner ornaments (custom built with pure CSS to match NeumorphicOrnament style) */}
        <div className="absolute top-16 left-16 w-16 h-16 border-t-2 border-l-2 border-[#2D3748] rounded-tl-3xl opacity-80" />
        <div className="absolute top-16 left-16 w-12 h-12 border-t border-l border-[#2D3748] rounded-tl-2xl m-2 opacity-50" />
        
        <div className="absolute top-16 right-16 w-16 h-16 border-t-2 border-r-2 border-[#2D3748] rounded-tr-3xl opacity-80" />
        <div className="absolute top-16 right-16 w-12 h-12 border-t border-r border-[#2D3748] rounded-tr-2xl m-2 opacity-50" />
        
        <div className="absolute bottom-16 left-16 w-16 h-16 border-b-2 border-l-2 border-[#2D3748] rounded-bl-3xl opacity-80" />
        <div className="absolute bottom-16 left-16 w-12 h-12 border-b border-l border-[#2D3748] rounded-bl-2xl m-2 opacity-50" />
        
        <div className="absolute bottom-16 right-16 w-16 h-16 border-b-2 border-r-2 border-[#2D3748] rounded-br-3xl opacity-80" />
        <div className="absolute bottom-16 right-16 w-12 h-12 border-b border-r border-[#2D3748] rounded-br-2xl m-2 opacity-50" />
        
        {/* Logo top center */}
        <div className="absolute top-24 left-0 right-0 flex justify-center items-center gap-3">
          <div className="w-12 h-12 bg-[#2D3748] text-[#FEFCF8] rounded-lg flex items-center justify-center">
            <Code2 size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#2D3748]">CodeLoom</span>
        </div>
        
        {/* Main content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-24 px-24 z-10">
          <p className="text-sm tracking-[0.4em] text-[#3D4852] mb-2 uppercase font-sans">
            Certificate of Completion
          </p>
          
          <div className="w-32 h-px bg-[#3D4852] my-6" />
          
          <p className="text-lg italic text-[#3D4852] mb-8 font-serif">
            This is to certify that
          </p>
          
          {/* THE FOCAL POINT */}
          <h1 className="text-7xl font-bold text-[#000000] mb-8 text-center leading-tight">
            {studentName}
          </h1>
          
          <p className="text-lg italic text-[#3D4852] mb-4 font-serif">
            has successfully completed the course
          </p>
          
          <h2 className="text-3xl italic text-[#000000] text-center mb-12 font-serif max-w-4xl">
            "{courseName}"
          </h2>
          
          {/* Metadata row */}
          <div className="flex items-end justify-between w-full max-w-4xl mt-8">
            <div className="text-center w-64">
              <div className="w-full h-px bg-[#3D4852] mb-2" />
              <p className="text-sm font-semibold text-[#000000]">{instructorName}</p>
              <p className="text-xs text-[#6B7280] font-sans uppercase tracking-wider mt-1">Instructor</p>
            </div>
            
            <div className="-translate-y-4">
              <GradeBadge grade={grade} />
            </div>
            
            <div className="text-center w-64">
              <div className="w-full h-px bg-[#3D4852] mb-2" />
              <p className="text-sm font-semibold text-[#000000]">{issueDate}</p>
              <p className="text-xs text-[#6B7280] font-sans uppercase tracking-wider mt-1">Date Issued</p>
            </div>
          </div>
        </div>
        
        {/* Footer with verification URL */}
        <div className="absolute bottom-16 left-0 right-0 text-center z-10">
          <p className="text-xs text-[#6B7280] font-mono tracking-widest">
            ID: {certificateId}
          </p>
          <p className="text-[10px] text-[#8e97a3] mt-2 font-sans tracking-widest uppercase">
            Verify at: codeloom.com/certificates/verify/{certificateId}
          </p>
        </div>
      </div>
    );
  }
);

CertificateTemplate.displayName = 'CertificateTemplate';
