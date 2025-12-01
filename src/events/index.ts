import { syncPastEvents } from "./syncPastEvents";
import { startPolling } from "./startPolling";

export async function startEventListener() {
  if (process.env.LOAD_ARCHIVE_ON_START === "true") {
    await syncPastEvents();
  } else {
    console.log("⏭️ Skipping archive load");
  }

  startPolling();
}