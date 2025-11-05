import { Global } from "../global"
import { Log } from "../util/log"
import path from "path"
import z from "zod"
import { data } from "./models-macro" with { type: "macro" }
import { Installation } from "../installation"

export namespace ModelsDev {
  const log = Log.create({ service: "claudinio.models" })

  export const Model = z
    .object({
      id: z.string(),
      name: z.string(),
      release_date: z.string(),
      attachment: z.boolean(),
      reasoning: z.boolean(),
      temperature: z.boolean(),
      tool_call: z.boolean(),
      cost: z.object({
        input: z.number(),
        output: z.number(),
        cache_read: z.number().optional(),
        cache_write: z.number().optional(),
      }),
      limit: z.object({
        context: z.number(),
        output: z.number(),
      }),
      modalities: z
        .object({
          input: z.array(z.enum(["text", "audio", "image", "video", "pdf"])),
          output: z.array(z.enum(["text", "audio", "image", "video", "pdf"])),
        })
        .optional(),
      experimental: z.boolean().optional(),
      status: z.enum(["alpha", "beta", "deprecated"]).optional(),
      options: z.record(z.string(), z.any()),
      headers: z.record(z.string(), z.string()).optional(),
      provider: z.object({ npm: z.string() }).optional(),
    })
    .meta({
      ref: "Model",
    })
  export type Model = z.infer<typeof Model>

  export const Provider = z
    .object({
      api: z.string().optional(),
      name: z.string(),
      env: z.array(z.string()),
      id: z.string(),
      npm: z.string().optional(),
      models: z.record(z.string(), Model),
    })
    .meta({
      ref: "Provider",
    })

  export type Provider = z.infer<typeof Provider>

  // Claudin.io configuration hardcoded
  const CLAUDINIO_CONFIG: Record<string, Provider> = {
    "claudinio": {
      id: "claudinio",
      name: "Claudin.io",
      api: "https://api.claudin.io/v1",
      env: ["CLAUDINIO_API_KEY"],
      npm: "@ai-sdk/openai-compatible",
      models: {
        "claude-sonnet-4-5": {
          id: "claude-sonnet-4-5",
          name: "Claude Sonnet 4.5",
          release_date: "2025-01-01",
          attachment: true,
          reasoning: true,
          temperature: true,
          tool_call: true,
          cost: {
            input: 3,
            output: 15,
            cache_read: 0.3,
            cache_write: 3.75,
          },
          limit: {
            context: 200000,
            output: 8192,
          },
          modalities: {
            input: ["text", "image", "pdf"],
            output: ["text"],
          },
          options: {},
        },
        "claude-3-5-sonnet-20241022": {
          id: "claude-3-5-sonnet-20241022",
          name: "Claude 3.5 Sonnet",
          release_date: "2024-10-22",
          attachment: true,
          reasoning: false,
          temperature: true,
          tool_call: true,
          cost: {
            input: 3,
            output: 15,
            cache_read: 0.3,
            cache_write: 3.75,
          },
          limit: {
            context: 200000,
            output: 8192,
          },
          modalities: {
            input: ["text", "image", "pdf"],
            output: ["text"],
          },
          options: {},
        },
        "claude-3-5-haiku-20241022": {
          id: "claude-3-5-haiku-20241022",
          name: "Claude 3.5 Haiku",
          release_date: "2024-11-01",
          attachment: true,
          reasoning: false,
          temperature: true,
          tool_call: true,
          cost: {
            input: 1,
            output: 5,
            cache_read: 0.1,
            cache_write: 1.25,
          },
          limit: {
            context: 200000,
            output: 8192,
          },
          modalities: {
            input: ["text", "image", "pdf"],
            output: ["text"],
          },
          options: {},
        },
      },
    },
  }

  export async function get() {
    log.info("Loading Claudin.io models")
    return CLAUDINIO_CONFIG
  }

  export async function refresh() {
    // No refresh needed for claudinio - configuration is hardcoded
    log.info("Claudin.io models are hardcoded, no refresh needed")
  }
}
