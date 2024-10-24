"use client"

import React from 'react';
import { RapprochementDetails } from '@/components/rapprochementDetails/RapprochementDetails';

export default function RapprochementPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 flex h-full">
      <RapprochementDetails rapprochementId={parseInt(params.id)} />
    </div>
  );
}
