//
//  notificationSetup.js
//  
//
//  Created by Emmanuel Babalola on 3/10/26.
//

import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function registerNotificationResponseListener(notificationEventsRepo) {
  return Notifications.addNotificationResponseReceivedListener(async (response) => {
    const content = response?.notification?.request?.content;
    const identifier = response?.notification?.request?.identifier;

    if (!identifier || !notificationEventsRepo) return;

    try {
      await notificationEventsRepo.markScheduledNotificationOpened(identifier);
    } catch (err) {
      console.log("Failed to mark notification as opened", err);
    }
  });
}
