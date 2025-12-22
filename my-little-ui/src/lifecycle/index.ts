import { handleSessionCreated } from "./on-session-created";
import { OpencodeClient } from "@opencode-ai/sdk";
import { createArtisticBanner } from "../components/banner";
import { GO_BANNER, ERROR_BANNER } from "../components/banners";

/**
 * Lifecycle Module
 * 
 * Purpose: Manages OpenCode lifecycle event handlers
 */

export const setupLifecycleHandlers = (directory: string, client: OpencodeClient) => {
  let firstMessageResponded = false;

  return async ({ event }: { event: any }) => {
    // Route lifecycle events to appropriate handlers
    if (event.type === "session.created") {
      await handleSessionCreated(directory, client);
    }

    // Handle first AI response
    if (event.type === "message.updated" && !firstMessageResponded) {
      const message = event.data;
      // Check if it's an AI message and has content
     
        firstMessageResponded = true;
        
        const goBanner = createArtisticBanner(GO_BANNER, "AI Responded!", "The agent is ready to help.");

        
        await client.tui.showToast({
          body: {
            title: "🚀 GO! AI is active",
            message: goBanner,
            variant: "success",
          },
        }).catch(() => {});
      
    }

    // Handle session errors
    if (event.type === "session.error") {
      const errorBanner = createArtisticBanner(ERROR_BANNER, "Session Error", event.data?.message || "Unknown error");
      console.log(errorBanner);
      
      await client.tui.showToast({
        body: {
          title: "❌ Session Error",
          message: event.data?.message || "Check logs for details",
          variant: "error",
        },
      }).catch(() => {});
    }
  };
};
