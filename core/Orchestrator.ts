import { PerplexityLLM } from '../llm/perplexity';
import { BaseLLM } from '../llm/llm';
import { APIClient } from '../api/apiclient.ts';
import { UserInputCollector } from '../input/inputCollector';

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

  async process(query: string): Promise<any> {
    const searchResults = await this.perplexity.generate(query);

    const output = await this.llm.updateVariables(searchResults);

    // Collect user inputs based on search results
    const userInputs = await this.inputCollector.collect(output);

    const apiResponse = await this.apiClient.makeRequest(userInputs);

    return apiResponse;
  }
}
