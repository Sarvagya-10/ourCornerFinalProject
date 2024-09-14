// Function to create a chat session
async function createChatSession(apiKey, externalUserId) {
    const url = 'https://api.on-demand.io/chat/v1/sessions';
    const headers = {
      'Content-Type': 'application/json',
      'apikey': apiKey
    };
    const body = JSON.stringify({
      pluginIds: [],
      externalUserId: externalUserId
    });
  
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    });
  
    if (!response.ok) {
      throw new Error('Failed to create chat session');
    }
  
    const data = await response.json();
    return data.data.id; // Extract session ID
  }
  
  // Function to submit a query
  async function submitQuery(apiKey, sessionId, query) {
    const url = `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': apiKey
    };
    const body = JSON.stringify({
      endpointId: 'predefined-openai-gpt4o',
      query: query,
      pluginIds: ['plugin-1726228878'],
      responseMode: 'sync'
    });
  
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    });
  
    if (!response.ok) {
      throw new Error('Failed to submit query');
    }
  
    const data = await response.json();
    return data;
  }
  
 
  