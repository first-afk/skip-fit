/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { ActivityEntry } from "../types";
import { ActivityIcon, Dumbbell, Plus, Timer, Trash2 } from "lucide-react";
import Card from "../components/ui/Card";
import { quickActivities } from "../assets/assets";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";
import mockApi from "../assets/mockApi";

const Activity = () => {
  const { allActivityLogs, setAllActivityLogs } = useAppContext();
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [scheduleButton, setScheduleButton] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    duration: 0,
    calories: 0,
  });
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const loadActivities = () => {
    const todaysActivities = allActivityLogs.filter(
      (e: ActivityEntry) => e.createdAt?.split("T")[0] === today,
    );
    setActivities(todaysActivities);
  };

  useEffect(() => {
    (() => {
      loadActivities();
    })();
  }, [allActivityLogs]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.duration <= 0) {
      return toast("Please enter valid data");
    }
    try {
      const { data } = await mockApi.activityLogs.create({ data: formData });
      setAllActivityLogs((prev) => [...prev, data]);
      setFormData({
        name: "",
        duration: 0,
        calories: 0,
      });
      setShowForm(false);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "Failed to log activities");
    }
  };

  const handleSetReminder = (activityName: string) => {
    if (!reminderTime) {
      toast("Please select time");
    }
    const date = new Date(reminderTime);
    const now = new Date();
    const formatIcsDate = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const startTime = formatIcsDate(date);
    const endTime = formatIcsDate(new Date(date.getTime() + 30 * 60 * 1000));
    const stampTime = formatIcsDate(now);
    const randomToken = Math.random().toString(36).substring(2, 11);
    const uniqueNumber = `${stampTime}-${randomToken}@http://localhost:5173`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Skip Fit//Activity Tracker//EN",
      "BEGIN:VEVENT",
      `SUMMARY:Skip Fit: Time to ${activityName}!`,
      `DTSTART:${startTime}`,
      `DTEND:${endTime}`,
      `DTSTAMP: ${stampTime}`,
      "DESCRIPTION:Your scheduled workout reminder from Skip Fit.",
      `UID: ${uniqueNumber}`,
      "SEQUENCE:0",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${activityName}-reminder.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteActivity = async (id: string) => {
    try {
      await mockApi.activityLogs.delete(id);
      setAllActivityLogs((prev: ActivityEntry[]) =>
        prev.filter((a) => a.documentId !== id),
      );
      toast.success("Deleted Activity");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "Failed to delete Actvity");
    }
  };

  const handleQuickAdd = (activity: { name: string; rate: number }) => {
    setFormData({
      name: activity.name,
      duration: 30,
      calories: 30 * activity.rate,
    });
    setShowForm(true);
  };

  const handleDurationChange = (v: string | number) => {
    const duration = Number(v);
    const activity = quickActivities.find((a) => a.name === formData.name);
    let calories = formData.calories;
    if (activity) {
      calories = duration * activity.rate;
    }
    setFormData({ ...formData, duration, calories });
  };

  const totalActiveMins: number = activities.reduce(
    (sum, item) => sum + item.duration,
    0,
  );
  return (
    <div className="page-container">
      {/* header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Actvity Log
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Track your activities
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Today's Total
            </p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {totalActiveMins} min
            </p>
          </div>
        </div>
      </div>
      <div className="page-content-grid">
        {/* quick add section */}
        {!showForm && (
          <div className="space-y-4">
            <Card>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">
                Quick Add
              </h3>
              <div className="flex flex-wrap gap-2">
                {quickActivities.map((activity) => (
                  <button
                    onClick={() => handleQuickAdd(activity)}
                    key={activity.name}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sms font-medium text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    {activity.emoji} {activity.name}
                  </button>
                ))}
              </div>
            </Card>
            <Button className="w-full" onClick={() => setShowForm(true)}>
              <Plus size="15" />
              Add Custom Actvity
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                setShowForm(true);
                setScheduleButton(true);
              }}
            >
              <Plus size="15" />
              Add Scheduled Actvity
            </Button>
          </div>
        )}
        {/* custom form */}
        {showForm && (
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
              New Actvity
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Activity name"
                placeholder="e.g., Morning run"
                required
                value={formData.name}
                onChange={(v) =>
                  setFormData({ ...formData, name: v.toString() })
                }
              />
              <div className="flex flex-col gap-4">
                <Input
                  label="Duration (mins)"
                  type="number"
                  placeholder="30"
                  min={1}
                  max={300}
                  required
                  value={formData.duration}
                  onChange={handleDurationChange}
                />

                <Input
                  label="Calories burned"
                  type="number"
                  placeholder="200"
                  max={2000}
                  required
                  value={formData.calories}
                  onChange={(v) =>
                    setFormData({ ...formData, calories: Number(v) })
                  }
                />
                {scheduleButton && (
                  <input
                    // label="Schedule Time"
                    type="datetime-local"
                    placeholder="200"
                    required
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                  />
                )}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                    setFormData({ name: "", duration: 0, calories: 0 });
                  }}
                >
                  Cancel
                </Button>
                {scheduleButton ? (
                  <Button
                    type="submit"
                    onClick={() => handleSetReminder(formData.name)}
                    variant="secondary"
                  >
                    Set Reminder
                  </Button>
                ) : (
                  <Button type="submit" variant="secondary">
                    Add Activity
                  </Button>
                )}
              </div>
            </form>
          </Card>
        )}

        {/* activities */}
        {activities.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">
              No activities logged today
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Start moving and track your progress
            </p>
          </Card>
        ) : (
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <ActivityIcon className="size-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  Today's Activities
                </h3>
                <p>{activities.length} logged</p>
              </div>
            </div>
            <div className="space-y-2">
              {activities.map((activity) => (
                <div key={activity.id} className="activity-entry-item">
                  <div className="flex items-center gap-3">
                    <div>
                      <Timer className="size-5 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-200">
                        {activity.name}
                      </p>
                      <p className="text-sm text-slate-400">
                        {new Date(activity?.createdAt || "").toLocaleTimeString(
                          "en-us",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibod text-slate-700 dark:text-slate-200">
                        {activity.duration} min
                      </p>
                      <p className="text-xs text-slate-400">
                        {activity.calories} kcal
                      </p>
                    </div>
                    <button
                      onClick={() => deleteActivity(activity.documentId)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* total summary */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">
                Total Active Time
              </span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {totalActiveMins} minutes
              </span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Activity;
