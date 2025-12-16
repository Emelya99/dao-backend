import { syncPastEvents } from "./syncPastEvents";
import { startPolling } from "./startPolling";
import { provider } from "../services/provider";
import { storage } from "../storage/proposalsStorage";

export async function startEventListener() {
  if (process.env.LOAD_ARCHIVE_ON_START === "true") {
    await syncPastEvents();
  } else {
    console.log("⏭️ Skipping archive load");
    
    const currentBlock = await provider.getBlockNumber();
    storage.lastBlockProcessed = currentBlock;
    console.log(`📌 Starting from latest block: ${currentBlock}`);
  }

  startPolling();
}