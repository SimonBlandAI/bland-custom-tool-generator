import { PerplexityLLM } from '../llm/perplexity';
import { BaseLLM } from '../llm/llm';
import { UserInputCollector } from '../userInput/userInputCollector';
import { APIClient } from '../api/apiclient.ts';

export class Orchestrator {
  private perplexity: PerplexityLLM;
  private llm: BaseLLM;
  private inputCollector: UserInputCollector;
  private apiClient: APIClient;

  constructor() {
    this.perplexity = new PerplexityLLM();
    this.llm = new BaseLLM(process.env.ANTHROPIC_API_KEY ?? "");
    this.inputCollector = new UserInputCollector();
    this.apiClient = new APIClient();
  }

  async process(query: string): Promise<any> {
    const searchResults = await this.perplexity.generate(query);

    const output = await this.llm.updateVariables(searchResults);

    const userInputs = await this.inputCollector.collectInputs(output);

    const apiResponse = await this.apiClient.makeRequest(userInputs);

    return apiResponse;
  }
}
