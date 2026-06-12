import React from 'react';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

async function getCertificate(id: string) {
  try {
    // Need to use absolute URL for SSR fetch if api lib isn't configured for it
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${API_URL}/certificates/verify/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data.certificate;
  } catch (error) {
    return null;
  }
}

export default async function VerifyCertificatePage({ params }: { params: { id: string } }) {
  const certificate = await getCertificate(params.id);

  if (!certificate) {
    return (
      <div className="container mx-auto py-24 px-4 max-w-lg text-center">
        <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-inset-sm">
          <XCircle className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Invalid Certificate</h1>
        <p className="text-muted-foreground">
          We could not verify this certificate. The ID might be incorrect or the certificate does not exist.
        </p>
      </div>
    );
  }

  const formattedDate = new Date(certificate.issueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container mx-auto py-16 px-4 max-w-3xl">
      <Card variant="extruded" className="p-8 md:p-12 text-center">
        <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inset-sm">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        
        <h1 className="text-4xl font-bold mb-2">Verified Certificate</h1>
        <p className="text-lg text-green-600 font-medium mb-8">This is a valid CodeLoom certificate.</p>
        
        <div className="bg-muted/10 p-6 md:p-8 rounded-xl border border-border/50 text-left space-y-6 shadow-inset-sm">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Student</p>
            <p className="text-2xl font-bold">{certificate.user.name}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Course</p>
            <p className="text-xl font-semibold text-accent">{certificate.course.title}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Issue Date</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Certificate ID</p>
              <p className="font-mono text-sm">{certificate._id}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
