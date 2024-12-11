import { PerplexityLLM } from '../llm/perplexity';
import { BaseLLM } from '../llm/llm';
import { APIClient } from '../api/apiclient.ts';
import { UserInputCollector } from '../input/inputCollector';

interface query {
  apiServiceTool: string;
  specificEndpoint: string;
  requiredParams: string;
}

interface apiResponse {
  endpoint: string;
  headers: string;
  body: string;
  method: string;
}

let searchPrompt =  function(toolSpecs: query) {
  return `

You are a helpful assistant that can help with API requests. Your goal is to navigate the internet and find the information you need to make an API request.

Here are the details of the API request:
API Service Tool: ${toolSpecs.apiServiceTool}
Specific Endpoint: ${toolSpecs.specificEndpoint}
Required Params: ${toolSpecs.requiredParams}

Navigate the internet to find the information you need to make an API request. If there are multiple params, return all of them.
`
}

let organizePrompt = function(searchResults: string) {
  const fs = require('fs');
  const path = require('path');

  const promptPath = path.join(__dirname, '../prompts/organize_prompt_from_perplexity.md');
  const promptTemplate = fs.readFileSync(promptPath, 'utf8');
  
  return promptTemplate.replace('{{searchResults}}', searchResults);
}

export class Orchestrator {
  private perplexity: PerplexityLLM;
  private llm: BaseLLM;
  private inputCollector: UserInputCollector;
  private apiClient: APIClient;

  constructor() {
    this.perplexity = new PerplexityLLM();
    this.llm = new BaseLLM(process.env.ANTHROPIC_API_KEY ?? "");
    this.apiClient = new APIClient();
  }

  async process(query: query): Promise<any> {
    const searchResults = await this.perplexity.generate(searchPrompt(query));

    const output = await this.llm.generate(organizePrompt(searchResults));
    const apiResponse: apiResponse = JSON.parse(output);
    return apiResponse;    
  }
}
