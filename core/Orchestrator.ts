import { PerplexityLLM } from '../llm/perplexity';
import { BaseLLM } from '../llm/llm';
import { APIClient } from '../api/apiclient.ts';
import { UserInputCollector } from '../input/inputCollector';

interface query {
  apiServiceTool: string;
  specificEndpoint: string;
  requiredParams: string;
}

let prompt =  function(toolSpecs: query) {
  return `

You are a helpful assistant that can help with API requests. Your goal is to navigate the internet and find the information you need to make an API request.

Here are the details of the API request:
API Service Tool: ${toolSpecs.apiServiceTool}
Specific Endpoint: ${toolSpecs.specificEndpoint}
Required Params: ${toolSpecs.requiredParams}

Navigate the internet to find the information you need to make an API request. If there are multiple params, return all of them.
`
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
    const searchResults = await this.perplexity.generate(prompt(query));

    const output = await this.llm.generate(prompt(searchResults));


    //return apiResponse;
  }
}
