export default {
  "phi3-medium": {
    "sources": [
      {
        "url": "https://huggingface.co/bartowski/Phi-3-mini-4k-instruct-GGUF/resolve/main/Phi-3-mini-4k-instruct-Q4_K_M.gguf",
        "filename": "Phi-3-mini-4k-instruct-Q4_K_M.gguf"
      }
    ],
    "id": "phi3-medium",
    "object": "model",
    "name": "Phi-3 Medium Instruct Q4",
    "version": "1.4",
    "description": "Phi-3 Medium is Microsoft's latest SOTA model.",
    "format": "gguf",
    "settings": {
      "ctx_len": 128000,
      "prompt_template": "<|user|> {prompt}<|end|><|assistant|>",
      "llama_model_path": "Phi-3-mini-4k-instruct-Q4_K_M.gguf",
      "ngl": 33
    },
    "parameters": {
      "max_tokens": 128000,
      "stop": [
        "<|end|>"
      ],
      "temperature": 0.7,
      "top_p": 0.95,
      "stream": true,
      "frequency_penalty": 0,
      "presence_penalty": 0
    },
    "metadata": {
      "author": "Microsoft",
      "tags": [
        "14B",
        "Finetuned"
      ],
      "size": 8366000000
    },
    "engine": "llama-cpp"
  },
  "llama3.1-8b-instruct": {
    "sources": [
      {
        "filename": "Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf",
        "url": "https://huggingface.co/bartowski/Meta-Llama-3.1-8B-Instruct-GGUF/resolve/main/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf"
      }
    ],
    "id": "llama3.1-8b-instruct",
    "object": "model",
    "name": "Llama 3.1 8B Instruct Q4",
    "version": "1.2",
    "description": "Meta's Llama 3.1 excels at general usage situations, including chat, general world knowledge, and coding.",
    "format": "gguf",
    "settings": {
      "ctx_len": 131072,
      "prompt_template": "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_message}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
      "llama_model_path": "Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf",
      "ngl": 33
    },
    "parameters": {
      "temperature": 0.7,
      "top_p": 0.95,
      "stream": true,
      "max_tokens": 8192,
      "stop": [
        "<|end_of_text|>",
        "<|eot_id|>",
        "<|eom_id|>"
      ],
      "frequency_penalty": 0,
      "presence_penalty": 0
    },
    "metadata": {
      "author": "MetaAI",
      "tags": [
        "8B",
        "Featured"
      ],
      "size": 4920000000
    },
    "engine": "llama-cpp"
  },
  "mistral-ins-7b-q4": {
    "sources": [
      {
        "filename": "Mistral-7B-Instruct-v0.3-Q4_K_M.gguf",
        "url": "https://huggingface.co/bartowski/Mistral-7B-Instruct-v0.3-GGUF/resolve/main/Mistral-7B-Instruct-v0.3-Q4_K_M.gguf"
      }
    ],
    "id": "mistral-ins-7b-q4",
    "object": "model",
    "name": "Mistral 7B Instruct Q4",
    "version": "1.5",
    "description": "Mistral 7B Instruct model, specifically designed for a comprehensive understanding of the world.",
    "format": "gguf",
    "settings": {
      "ctx_len": 32768,
      "prompt_template": "{system_message} [INST] {prompt} [/INST]",
      "llama_model_path": "Mistral-7B-Instruct-v0.3-Q4_K_M.gguf",
      "ngl": 33
    },
    "parameters": {
      "temperature": 0.7,
      "top_p": 0.95,
      "stream": true,
      "max_tokens": 32768,
      "stop": [
        "[/INST]"
      ],
      "frequency_penalty": 0,
      "presence_penalty": 0
    },
    "metadata": {
      "author": "MistralAI",
      "tags": [
        "7B",
        "Foundational Model"
      ],
      "size": 4370000000,
      "cover": "https://raw.githubusercontent.com/janhq/jan/dev/models/mistral-ins-7b-q4/cover.png"
    },
    "engine": "llama-cpp"
  },
  "llama3.2-3b-instruct": {
    "sources": [
      {
        "filename": "Llama-3.2-3B-Instruct-Q8_0.gguf",
        "url": "https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q8_0.gguf"
      }
    ],
    "id": "llama3.2-3b-instruct",
    "object": "model",
    "name": "Llama 3.2 3B Instruct Q8",
    "version": "1.0",
    "description": "Meta's Llama 3.2 excels at general usage situations, including chat, general world knowledge, and coding.",
    "format": "gguf",
    "settings": {
      "ctx_len": 131072,
      "prompt_template": "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_message}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
      "llama_model_path": "Llama-3.2-3B-Instruct-Q8_0.gguf",
      "ngl": 33
    },
    "parameters": {
      "temperature": 0.7,
      "top_p": 0.95,
      "stream": true,
      "max_tokens": 8192,
      "stop": [
        "<|end_of_text|>",
        "<|eot_id|>",
        "<|eom_id|>"
      ],
      "frequency_penalty": 0,
      "presence_penalty": 0
    },
    "metadata": {
      "author": "MetaAI",
      "tags": [
        "3B",
        "Featured"
      ],
      "size": 3420000000
    },
    "engine": "llama-cpp"
  },
  "llama3.2-1b-instruct": {
    "sources": [
      {
        "filename": "Llama-3.2-1B-Instruct-Q8_0.gguf",
        "url": "https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q8_0.gguf"
      }
    ],
    "id": "llama3.2-1b-instruct",
    "object": "model",
    "name": "Llama 3.2 1B Instruct Q8",
    "version": "1.0",
    "description": "Meta's Llama 3.2 excels at general usage situations, including chat, general world knowledge, and coding.",
    "format": "gguf",
    "settings": {
      "ctx_len": 131072,
      "prompt_template": "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_message}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
      "llama_model_path": "Llama-3.2-1B-Instruct-Q8_0.gguf",
      "ngl": 33
    },
    "parameters": {
      "temperature": 0.7,
      "top_p": 0.95,
      "stream": true,
      "max_tokens": 8192,
      "stop": [
        "<|end_of_text|>",
        "<|eot_id|>",
        "<|eom_id|>"
      ],
      "frequency_penalty": 0,
      "presence_penalty": 0
    },
    "metadata": {
      "author": "MetaAI",
      "tags": [
        "1B",
        "Featured"
      ],
      "size": 1320000000
    },
    "engine": "llama-cpp"
  },
  "llama3-hermes-8b": {
    "sources": [
      {
        "filename": "Hermes-2-Pro-Llama-3-8B-Q4_K_M.gguf",
        "url": "https://huggingface.co/NousResearch/Hermes-2-Pro-Llama-3-8B-GGUF/resolve/main/Hermes-2-Pro-Llama-3-8B-Q4_K_M.gguf"
      }
    ],
    "id": "llama3-hermes-8b",
    "object": "model",
    "name": "Hermes Pro Llama 3 8B Q4",
    "version": "1.2",
    "description": "Hermes Pro is well-designed for General chat and JSON output.",
    "format": "gguf",
    "settings": {
      "ctx_len": 8192,
      "prompt_template": "<|im_start|>system\n{system_message}<|im_end|>\n<|im_start|>user\n{prompt}<|im_end|>\n<|im_start|>assistant",
      "llama_model_path": "Hermes-2-Pro-Llama-3-8B-Q4_K_M.gguf",
      "ngl": 33
    },
    "parameters": {
      "temperature": 0.7,
      "top_p": 0.95,
      "stream": true,
      "max_tokens": 8192,
      "stop": [],
      "frequency_penalty": 0,
      "presence_penalty": 0
    },
    "metadata": {
      "author": "NousResearch",
      "tags": [
        "7B",
        "Finetuned"
      ],
      "size": 4920000000
    },
    "engine": "llama-cpp"
  }
};
