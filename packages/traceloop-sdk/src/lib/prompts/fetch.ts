import { InitializeOptions } from "../interfaces";
import { _configuration } from "../configuration";
import fetch from "node-fetch";
const fetchRetry = require("fetch-retry")(fetch);

export const fetchPrompts = async (options: InitializeOptions) => {
  const { apiKey, baseUrl, traceloopSyncMaxRetries } = options;

  const response = await fetchRetry(`${baseUrl}/v1/prompts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    retries: traceloopSyncMaxRetries,
    retryOn: function (attempt: any, error: any, response: any) {
      if (attempt >= traceloopSyncMaxRetries!) return false;
      if (response?.status && response.status >= 500) {
        console.log(`Retrying ${attempt} time(s)`);
        return true;
      }
      return false;
    },
    retryDelay: function (attempt: any) {
      return Math.pow(2, attempt) * 1000; // 1000, 2000, 4000
    },
  });

  return await response.json();
};