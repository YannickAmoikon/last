export type ExportType = 'Pas_rapproche' | 'Rapprochement_Match' | null;

export const getExportFileName = (type: ExportType): string => {
  const date = new Date().toISOString().split('T')[0];
  const typeLabel = type === 'Pas_rapproche' ? 'non-rapproche' : 'rapprochement-match';
  return `rapport-${typeLabel}-${date}.xlsx`;
};