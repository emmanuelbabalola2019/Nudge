//
//  _layout.js
//  
//
//  Created by Emmanuel Babalola on 3/8/26.
//
import { Stack } from "expo-router";
import { useEffect, useMemo } from "react";
import "../src/infra/notifications/notificationSetup";
import { createAppServices } from "../src/appstate/di";
import { registerNotificationResponseListener } from "../src/infra/notifications/notificationSetup";

export default function RootLayout() {
  const services = useMemo(() => createAppServices(), []);

  useEffect(() => {
    const sub = registerNotificationResponseListener(
      services.notificationEventsRepo
    );

    services.processIgnoredNudges.execute();

    return () => {
      if (sub?.remove) sub.remove();
    };
  }, [services]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
