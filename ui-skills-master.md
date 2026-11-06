\# Take all the necessary design skills from [https\://www\.ui-skills.com/](https://www.ui-skills.com/)

\#\# CLI   
Browse and fetch UI Skills from your terminal. The CLI reads from the same registry as the website and the MCP server.  
npx ui-skills

\#\#\# Start here  
Print the routing skill. It helps an agent choose the smallest useful skill for a task.  
npx ui-skills start

\#\#\# List categories  
Print every category in the registry.  
npx ui-skills categories

\#\#\# List skills  
Print every skill with its category and description.  
npx ui-skills list

\#\#\# Filter by category  
Show only skills in one category, such as motion.  
npx ui-skills list \--category motion

\#\#\# Get a skill  
Print the full markdown for one skill.  
npx ui-skills get baseline-ui

\#\# MCP   
Connect agents to the UI Skills catalog over Model Context Protocol. The server exposes the same registry as the ui-skills CLI.

\#\#\# Endpoint  
[https\://www\.ui-skills.com/mcp](https://www.ui-skills.com/mcp)

\#\#\# Server Card  
[https\://www\.ui-skills.com/.well-known/mcp/server-card.json](https://www.ui-skills.com/.well-known/mcp/server-card.json)

\#\#\# Tools  
List skills from the registry. Optional query filter over path, name, or description.  
List\_skills

Fetch skill markdown by discovery name, slug, or pathSlug.  
get\_skill