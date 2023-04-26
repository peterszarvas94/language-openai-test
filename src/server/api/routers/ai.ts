import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { openai } from "~/utils/openai";

export const aiRouter = createTRPCRouter({
  getChatCompletion: publicProcedure
    .input(z.object({
      messages: z.array(z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string(),
      })),
    }))
    .mutation(async ({ input }) => {
      console.log("input", input);

      const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0301",
        messages: [
          { "role": "system", "content": "You are a helpful assistant." },
          ...input.messages,
        ]
      })

      return {
        chatCompletion: chatCompletion.data,
      }
    }),

  getModels: publicProcedure
    .mutation(async () => {
      const models = await openai.listModels();

      return {
        models: models.data,
      }
    }),

  getTextCompletion: publicProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      const textCompletion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: input.prompt,
        max_tokens: 2048
      })

      return {
        textCompletion: textCompletion.data,
      }
    }),

  getTranslation: publicProcedure
    .input(z.object({
      text: z.string(),
      source: z.string(),
      target: z.string(),
    }))
    .mutation(async ({ input }) => {
      const translation = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Translate from ${input.source} to ${input.target}:\n${input.text}`,
        max_tokens: 2048
      })

      return {
        translation: translation.data,
      }
    }),

  getResponse: publicProcedure
    .input(z.object({
      text: z.string(),
      language: z.string(),
    }))
    .mutation(async ({ input }) => {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Continue the conversation in ${input.language}:\n${input.text}`,
      })

      return {
        response: response.data,
      }
    })
})
