import ProfileStepper from "@/components/ProfileStepper";
import DocumentUploadZone from "@/components/DocumentUploadZone";
import { Card } from "@/components/ui/card";

export default function OnboardingPage() {
  const mockDocs = [
    { id: '1', kind: 'id' as const, name: 'passport.pdf', size: 2048576, status: 'uploaded' as const },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold mb-2">Welcome to RentMatch</h1>
          <p className="text-muted-foreground">
            Complete your profile to get personalized property matches
          </p>
        </div>

        <ProfileStepper onComplete={(data) => console.log('Profile:', data)} />

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Your Documents (Optional)</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Upload documents now to speed up the application process later. All documents are encrypted and stored securely.
          </p>
          <DocumentUploadZone
            documents={mockDocs}
            onUpload={(files) => console.log('Upload:', files)}
            onRemove={(id) => console.log('Remove:', id)}
          />
        </Card>
      </div>
    </div>
  );
}
