import GapsExplainer from '../GapsExplainer';

export default function GapsExplainerExample() {
  return (
    <div className="max-w-md">
      <GapsExplainer
        strengths={[
          'Income multiple met (3.2× monthly rent)',
          'Move-in date aligns perfectly',
          'Pets policy matches your needs',
        ]}
        gaps={[
          'Missing previous landlord reference',
          'Guarantor may be needed for higher approval chance',
        ]}
      />
    </div>
  );
}
