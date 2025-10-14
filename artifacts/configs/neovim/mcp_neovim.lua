-- mcphub.nvim setup snippet
require('mcphub').setup({ servers = {
  { id='mcp-core-agent', cmd='node', args={'./servers/core/dist/index.js'} },
  { id='mcp-aws-helper', cmd='python', args={'-m','mcp_aws_helper'} },
  { id='mcp-local-knowledge', cmd='node', args={'./servers/knowledge/dist/index.js','--port','8001'} },
} })


