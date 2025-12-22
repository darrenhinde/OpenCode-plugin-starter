import { getPluginName, getPluginVersion, getWelcomeMessage } from "../plugin-info";
import { OpencodeClient } from "@opencode-ai/sdk";
import { createArtisticBanner } from "../components/banner";
import { OPENAGENT_BANNER } from "../components/banners";

/**
 * On Session Created Handler
 */

export const handleSessionCreated = async (
  directory: string,
  client: OpencodeClient
) => {
  const logDir = `${directory}/.tmp/my-little-plugin`;
  
  // 1. Display the main OpenAgents banner on startup
  const welcomeBanner = createArtisticBanner(
    OPENAGENT_BANNER,
    `${getPluginName()} v${getPluginVersion()}`,
    `Logs: ${logDir}`
  );
 
  const sessions = await client.session.list();
  const currentSession = sessions.data?.[0]; // Most recent session

  if (currentSession) {
    // 🎯 Inject banner as a system message BEFORE AI responds
    await client.session.prompt({
      path: { id: currentSession.id },
      body: {
        parts: [{ type: "text", text: createArtisticBanner(OPENAGENT_BANNER) }],
        noReply: true,  // ⭐ KEY: Don't wait for AI response
      },
    }).catch((e) => {
      console.error("Failed to inject banner:", e);
    });
  }

 
  
  // 2. Show a welcoming toast
  // await client.tui
  //   .showToast({
  //     body: {
  //       title: `🤖 ${getPluginName()} Active`,
  //       message: "Session initialized with OpenAgents UI",
  //       variant: "info",
  //     },
  //   })
  //   .catch(() => {});

  // 3. Append a hint to the prompt
  await client.tui.appendPrompt({
    body: {
      text: "OpenAgents UI plugin is active. How can I help?",
    },
  }).catch(() => {});
};