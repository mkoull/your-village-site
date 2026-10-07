import { Platform } from "react-native";
import { reconcileReminders, type MobileVillage } from "../domain/model";

export async function restoreReminders(state: MobileVillage) {
  if (Platform.OS === "web") return state;
  const N = await import("expo-notifications");
  const scheduled = await N.getAllScheduledNotificationsAsync();
  const owned = new Set(
    state.tasks.map((task) => task.notificationId).filter(Boolean),
  );
  // Recover a schedule that was interrupted before its state was saved.
  for (const notification of scheduled) {
    if (
      notification.content.data?.taskId &&
      !owned.has(notification.identifier)
    )
      await N.cancelScheduledNotificationAsync(notification.identifier);
  }
  return reconcileReminders(
    state,
    scheduled.map((notification) => notification.identifier),
  );
}

export async function scheduleReminder(id: string, date: Date) {
  if (Platform.OS === "web")
    throw new Error(
      "Phone reminders are available in the iPhone and Android app. Your next step is still saved in this preview.",
    );
  const N = await import("expo-notifications");
  if (Platform.OS === "android")
    await N.setNotificationChannelAsync("village-reminders", {
      name: "Your gentle reminders",
      importance: N.AndroidImportance.DEFAULT,
    });
  const permission = await N.requestPermissionsAsync();
  if (
    !permission.granted &&
    permission.ios?.status !== N.IosAuthorizationStatus.PROVISIONAL
  )
    throw new Error(
      "Reminders are turned off. You can enable them in your phone settings; your next step stays in your plan.",
    );
  N.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  // Keep personal support and task details off lock-screen notifications.
  return N.scheduleNotificationAsync({
    content: {
      title: "A little moment for you",
      body: "Your next step is waiting in My plan.",
      data: { taskId: id },
    },
    trigger: {
      type: N.SchedulableTriggerInputTypes.DATE,
      date,
      channelId: "village-reminders",
    },
  });
}
export async function cancelReminder(id?: string) {
  if (id && Platform.OS !== "web")
    await (
      await import("expo-notifications")
    ).cancelScheduledNotificationAsync(id);
}
export async function cancelAllReminders() {
  if (Platform.OS !== "web")
    await (
      await import("expo-notifications")
    ).cancelAllScheduledNotificationsAsync();
}
