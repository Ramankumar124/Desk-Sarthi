import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import { z } from "zod";
// import { getOutDoorWeather } from "./Tools.js";

const server = new McpServer({
  name: "Desk-Sarthi-mcp",
  version: "1.0.0",
});

const getOutDoorWeather = async () => {
  const response = await axios.get(
    "http://localhost:3000/api/v1/weather/outdoor-climate"
  );
  return response?.data?.data;
};
const ToggleSwitch = async (switchId: number, state: boolean) => {
  
  const response = await axios.post(
    "http://localhost:3000/api/v1/device/relayToggle",
    { switchId, state }
  );
};

server.tool(
  "get-outdoor-weather",
  "Whenever user ask get outdoor weather return the temp humiditidy only ",
  async () => ({
    content: [
      { type: "text", text: JSON.stringify(await getOutDoorWeather()) },
    ],
  })
);
server.tool(
  "toggle-switch",
  "Toggle a switch on or off. Use this when users ask to turn devices on/off.",
  {
    switchId: z.number().int().min(1).describe("The switch ID (1-4)"),
    state: z.boolean().describe("true for ON and false for OFF"),
  },
  async ({ switchId, state }) => {
    await ToggleSwitch(switchId, state);
    return {
      content: [
        {
          type: "text",
          text: `Switch ${switchId} has been turned ${state ? "ON" : "OFF"}`,
        },
      ],
    };
  }
);

async function init() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

init();
