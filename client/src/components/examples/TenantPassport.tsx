import TenantPassport from '../TenantPassport';

export default function TenantPassportExample() {
  const mockData = {
    salaryAnnual: 48000,
    salaryBand: "£40k-£50k",
    employer: "Tech Corp Ltd",
    householdSize: 2,
    hasPets: true,
    petDetails: "1 small dog",
    moveInFrom: "2025-02-01",
    moveInTo: "2025-03-01",
    maxBudget: 2000,
    mustHaves: ["Pets allowed", "Furnished", "Near tube station"],
    redFlags: ["No students", "Ground floor only"],
    visible: true,
    shareFields: {
      salaryBand: true,
      moveIn: true,
      pets: true,
      docsStatus: true,
    },
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <TenantPassport
        data={mockData}
        onSave={(data) => console.log('Saved:', data)}
      />
    </div>
  );
}
