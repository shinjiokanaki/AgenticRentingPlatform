import DocumentUploadZone from '../DocumentUploadZone';

export default function DocumentUploadZoneExample() {
  const mockDocs = [
    { id: '1', kind: 'id' as const, name: 'passport.pdf', size: 2048576, status: 'uploaded' as const },
    { id: '2', kind: 'payslip' as const, name: 'payslip_march.pdf', size: 512000, status: 'uploaded' as const },
  ];

  return (
    <div className="max-w-2xl">
      <DocumentUploadZone
        documents={mockDocs}
        onUpload={(files) => console.log('Upload:', files)}
        onRemove={(id) => console.log('Remove:', id)}
      />
    </div>
  );
}
