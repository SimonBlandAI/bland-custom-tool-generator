import { APIClient } from '../api/apiclient';
import { UserInputCollector } from '../input/inputCollector';
import { Orchestrator } from './Orchestrator';

async function main() {
  const inputCollector = new UserInputCollector();
  
  const questions = [
    "API Service Tool:",
    "Specfic Endpoint:", 
    "Required Params"
  ];

  const inputs: Record<string, string> = {};
  try {
    for (const question of questions) {
      const answer = await inputCollector.collect(question);
      const key = Object.keys(answer)[0];
      inputs[key] = answer[key];      
    }

      const query = {
        apiServiceTool: inputs["API Service Tool"],
        specificEndpoint: inputs["Specfic Endpoint"],
        requiredParams: inputs["Required Params"]
      };

      const orchestrator = new Orchestrator();
      const apiResponse = await orchestrator.process(query);
      
      const apiClient = new APIClient('https://us.api.bland.ai/v1');
      
      try {
        const response = await apiClient.makeRequest({
          method: 'POST',
          endpoint: '/createTools',
          data: apiResponse,
          additionalHeaders: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Tool created successfully:', response);
      } catch (error) {
        console.error('Failed to create tool:', error);
      }
  } finally {
    inputCollector.close();
  }
}

main().catch(console.error);
