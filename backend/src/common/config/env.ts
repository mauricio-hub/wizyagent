export const getEnv = (): { openaiApiKey: string | undefined; port: string } => ({
  openaiApiKey: process.env.OPENAI_API_KEY,
  port: process.env.PORT || '3000',
});