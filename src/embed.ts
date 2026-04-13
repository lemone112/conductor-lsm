import { CohereClient } from 'cohere-ai';
import { ProxyAgent, setGlobalDispatcher } from 'undici';

// Route all fetch calls through the local proxy (required on this machine).
const proxyUrl = process.env.HTTPS_PROXY || process.env.https_proxy;
if (proxyUrl) {
  setGlobalDispatcher(new ProxyAgent(proxyUrl));
}

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

export async function embedQuery(text: string): Promise<number[]> {
  const response = await cohere.v2.embed({
    texts: [text],
    model: 'embed-english-v3.0',
    inputType: 'search_query',
    embeddingTypes: ['float'],
  });
  const floats = response.embeddings.float;
  if (!floats || floats.length === 0) throw new Error('No embeddings returned');
  return floats[0];
}

export async function embedDocument(text: string): Promise<number[]> {
  const response = await cohere.v2.embed({
    texts: [text],
    model: 'embed-english-v3.0',
    inputType: 'search_document',
    embeddingTypes: ['float'],
  });
  const floats = response.embeddings.float;
  if (!floats || floats.length === 0) throw new Error('No embeddings returned');
  return floats[0];
}
