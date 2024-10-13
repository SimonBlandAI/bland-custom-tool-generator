import { PerplexitySearch } from './perplexity';
import { LLMFormatter } from './llm';
import { UserInputCollector } from './userInput';
import { APIClient } from './api';

class Orchestrator {
  private perplexity: PerplexitySearch;
  private llm: LLMFormatter;
  private inputCollector: UserInputCollector;
  private apiClient: APIClient;

  constructor() {
    this.perplexity = new PerplexitySearch();
    this.llm = new LLMFormatter();
    this.inputCollector = new UserInputCollector();
    this.apiClient = new APIClient();
  }

  async process(query: string): Promise<any> {
    // Step 1: Perform Perplexity search
    const searchResults = await this.perplexity.search(query);

    // Step 2: Use LLM to format search results and determine required inputs
    const { formattedResults, requiredInputs } = await this.llm.formatAndAnalyze(searchResults);

    // Step 3: Collect user inputs based on LLM analysis
    const userInputs = await this.inputCollector.collectInputs(requiredInputs);

    // Step 4: Make API call with collected inputs
    const apiResponse = await this.apiClient.makeRequest(userInputs);

    return apiResponse;
  }
}
