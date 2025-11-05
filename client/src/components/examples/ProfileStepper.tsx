import ProfileStepper from '../ProfileStepper';

export default function ProfileStepperExample() {
  return (
    <div className="flex justify-center p-8">
      <ProfileStepper onComplete={(data) => console.log('Profile completed:', data)} />
    </div>
  );
}
