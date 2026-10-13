const express = require('express');
const app = express();

app.use(express.json());

app.get('/openapi.json', (req, res) => {
  res.json({
    openapi: "3.0.0",
    info: { title: "MCP Vercel Gateway", version: "1.0.0" },
    servers: [{ url: `https://${process.env.VERCEL_URL || 'localhost'}` }],
    paths: {
      "/api/execute": {
        post: {
          summary: "Execute MCP Command",
          operationId: "executeMCP",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    command: { type: "string" },
                    args: { type: "object" }
                  },
                  required: ["command"]
                }
              }
            }
          },
          responses: { "200": { description: "Successful response" } }
        }
      }
    }
  });
});

app.post('/api/execute', async (req, res) => {
  const { command, args } = req.body;
  try {
    res.json({
      status: "success",
      message: `Executed MCP command: ${command}`,
      data: args || {}
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = app;
