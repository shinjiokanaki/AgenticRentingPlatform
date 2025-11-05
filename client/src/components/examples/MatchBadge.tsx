import MatchBadge from '../MatchBadge';

export default function MatchBadgeExample() {
  return (
    <div className="flex gap-4 items-center">
      <MatchBadge label="Likely" score={85} />
      <MatchBadge label="Maybe" score={62} />
      <MatchBadge label="Unlikely" score={42} />
    </div>
  );
}
