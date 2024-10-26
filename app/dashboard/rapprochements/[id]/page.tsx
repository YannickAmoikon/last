"use client"

import React, { useState, useEffect } from 'react';
import { RapprochementDetails } from '@/components/linkDetails/LinkDetails';
import { Loader2 } from 'lucide-react'; // Assurez-vous que l'import est correct
import { useSearchParams } from 'next/navigation';

export default function RapprochementPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || '';

  useEffect(() => {
    // Simulez un chargement de données
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Ajustez la durée selon vos besoins

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex h-full items-center justify-center">
        <div className="relative flex-1 h-full w-full bg-gray-200 animate-pulse">
          <Loader2 className="absolute inset-0 m-auto h-12 w-12 text-gray-900 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full">
      <RapprochementDetails
        rapprochementId={parseInt(params.id)} 
        rapprochementStatus={status} 
      />
    </div>
  );
}
