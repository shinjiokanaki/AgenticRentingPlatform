import RequirementsPanel from '../RequirementsPanel';

export default function RequirementsPanelExample() {
  const mockRequirements = [
    { label: 'Income 2.8× monthly rent', met: true },
    { label: 'Pets allowed', met: true },
    { label: 'Move-in window matches', met: true },
    { label: 'Previous landlord reference', met: false, critical: true },
    { label: 'Employment verification', met: false },
  ];

  return (
    <div className="max-w-md">
      <RequirementsPanel requirements={mockRequirements} />
    </div>
  );
}
