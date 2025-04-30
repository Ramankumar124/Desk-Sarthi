import {
  McpServer,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getOutDoorWeather } from "./Tools.js";

const server = new McpServer({
  name: "Desk-Sarthi-mcp",
  version: "1.0.0",
});

// const getOutDoorWeather= async()=>{
//  const response=await axios.get("http://localhost:3000/api/v1/weather/outdoor-climate");
//  return response?.data?.data;

// }

server.tool(
  "get-outdoor-weather",
  "Whenever user ask get outdoor weather return the temp humiditidy only ",
  async () => ({
    content: [
      { type: "text", text: JSON.stringify(await getOutDoorWeather()) },
    ],
  })
);

async function init() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

init();
