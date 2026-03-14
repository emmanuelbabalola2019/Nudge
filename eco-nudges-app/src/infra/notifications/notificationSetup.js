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
