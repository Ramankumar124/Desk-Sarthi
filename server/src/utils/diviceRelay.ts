import { eq } from "drizzle-orm";
import { db } from "../database";
import { NewRelayData, relaySwitches } from "../database/schema";

export const RELAY_STATE_ROW_ID = 1;
export async function updateRelayState(
  relayNumber: number,
  state: "ON" | "OFF"
) {
  const relayColumn = `relay${relayNumber}` as keyof NewRelayData;

 const response= await db
    ?.update(relaySwitches)
    .set({ [relayColumn]: state })
    .where(eq(relaySwitches.id, RELAY_STATE_ROW_ID));
    console.log(response);
    
  return { success: true };
}
