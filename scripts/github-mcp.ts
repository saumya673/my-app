import "dotenv/config";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { createAgent } from "langchain";
import { ChatOpenAI } from "@langchain/openai";

const GITHUB_PAT = process.env.GITHUB_PAT;
if (!GITHUB_PAT) throw new Error("Missing GITHUB_PAT in environment");

async function main() {
  const mcp = new MultiServerMCPClient({
    github: {
      transport: "http",
      url: "https://api.githubcopilot.com/mcp/",
      headers: {
        Authorization: `Bearer ${GITHUB_PAT}`,
      },
    },
  });

  const tools = await mcp.getTools();

  // Optional: inspect available MCP tool names
  console.log(
    "MCP tools:",
    tools.map((t) => t.name),
  );

  const llm = new ChatOpenAI({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0,
  });

  const agent = createAgent({
    model: llm,
    tools,
  });

  const repo = process.env.GITHUB_REPO ?? "octocat/Hello-World";

  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: `In repo ${repo}, there exists a file named github-mcp.ts in the scripts folder. This is a script which runs an agent on this repository. Create a ui which takes in text and button which will execute the command given in the text and the agent will make changes to the repository."`,
      },
    ],
  });

  console.log(result);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
