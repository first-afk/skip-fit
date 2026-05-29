import { useEffect, useState } from "react";
import { getMotivationalMessage } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import type { ActivityEntry } from "../types";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";
import { Activity, Flame, Ruler, Scale, TrendingUp, Zap } from "lucide-react";

const Dashboard = () => {
  const { user, allActivityLogs } = useAppContext();
  // const motivation = getMotivationalMessage()
  const [todayActivities, setTodayActivities] = useState<ActivityEntry[]>([]);
  const loadUserData = () => {
    const today = new Date().toISOString().split("T")[0];
    const activityData = allActivityLogs.filter(
      (a: ActivityEntry) => a.createdAt?.split("T")[0] === today,
    );
    setTodayActivities(activityData);
  };

  useEffect(() => {
    (() => {
      loadUserData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allActivityLogs]);

  const totalActiveMins: number = todayActivities.reduce(
    (sum, item) => sum + item.duration,
    0,
  );
  const totalBurned: number = todayActivities.reduce(
    (sum, item) => sum + (item.calories || 0),
    0,
  );

  const motivationalMessage = getMotivationalMessage(
    totalActiveMins,
    totalBurned,
    0,
  );

  return (
    <div className="page-container">
      {/* header */}
      <div className="dashboard-header">
        <p className="text-emerald-100 text-sm font-medium">Welcome back</p>
        <h1 className="text-2xl font-bold mt-1">
          Hi there, <span className="capitalize"> {user?.username} </span> sweetie!
        </h1>
        {/* motivation card */}
        <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{motivationalMessage.emoji}</span>
            <p className="text-white font-medium">{motivationalMessage.text}</p>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="dashboard-grid">
        <Card className="shadow-lg col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                {" "}
                <Flame className="h-6 w-6 text-orange-500" />{" "}
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Calories Burned
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {totalBurned}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Goal</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {user?.dailyCalorieBurn || 400}
              </p>
            </div>
          </div>
          <ProgressBar
            value={totalBurned}
            max={user?.dailyCalorieBurn || 400}
          />
        </Card>
        {/* stats row */}

        <div className="dashboard-card-grid">
          {/*active minutes  */}
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                {" "}
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-sm text-slate-500">Active</p>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {totalActiveMins}
            </p>
            <p className="text-sm text-slate-400">minutes today</p>
          </Card>
          {/*active count  */}
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                {" "}
                <Zap className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-sm text-slate-500">Workout</p>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {todayActivities.length}
            </p>
            <p className="text-sm text-slate-400">activities logged</p>
          </Card>
        </div>

        {/* goal card */}
        {user && (
          <Card className="bg-linear-to-r from-slate-800 to-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Your Goal</p>
                <p>
                  {user.goal === "lose" && "🔥 Lose weight"}
                  {user.goal === "gain" && "🔥 Gain muscle"}
                  {user.goal === "maintain" && "🔥 Maintain weight"}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* body metrics card */}
        {user && user.weight && (
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-100">
                <Scale className="w-6  h-6 text-indigo-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  Body Metrics
                </h3>
                <p className="text-slate-500 text-sm">Your Stats</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Scale className="w-4 h-4 text-slate-500" />
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Weight
                  </span>
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {user.weight} kg
                </span>
              </div>
              {user.height && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <Ruler className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Height
                    </span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {user.height} cm
                  </span>
                </div>
              )}

              {user.height && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      BMI
                    </span>
                    {(() => {
                      const bmi = (
                        user.weight / Math.pow(user.height / 100, 2)
                      ).toFixed(1);

                      const getStatus = (b: number) => {
                        if (b < 18.5)
                          return { color: "text-blue-500", bg: "bg-blue-500" };
                        if (b < 25)
                          return {
                            color: "text-emerald-500",
                            bg: "bg-emerald-500",
                          };
                        if (b < 30)
                          return {
                            color: "text-orange-500",
                            bg: "bg-orange-500",
                          };
                        return {
                          color: "text-red-500",
                          bg: "bg-red-500",
                        };
                      };
                      const status = getStatus(Number(bmi));
                      return (
                        <span className={`text-lg font-bold ${status.color}`}>
                          {bmi}
                        </span>
                      );
                    })()}
                  </div>
                  {/* bmi scale */}
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="flex-1 bg-blue-400 opacity-30"></div>
                    <div className="flex-1 bg-emerald-400 opacity-30"></div>
                    <div className="flex-1 bg-orange-400 opacity-30"></div>
                    <div className="flex-1 bg-red-400 opacity-30"></div>
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
