import { PersonStanding } from "lucide-react";

const Onboarding = () => {
  return (
    <div className="onboarding-container">
      {/* header */}
      <div className="p-6 pt-12 onboarding-wrapper">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
            <PersonStanding className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Skip Fit</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400">Let's personalize your experience</p>
      </div>


    </div>
  );
};

export default Onboarding;
