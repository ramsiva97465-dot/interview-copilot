/**
 * InterviewModelGuard.ts
 *
 * Enforces low-latency model selection for real-time interview dialogue (<1.5s TTFT).
 * If a user clicks or selects a heavy reasoning/pro model (e.g. gemini-3.1-pro, o1, claude-opus)
 * or a model without an active API key, this guard automatically switches to the
 * ultra-fast, interview-ready counterpart (Flash or Sarvam backend).
 */

export interface ModelCapabilityCheck {
  isCapable: boolean;
  reason?: string;
  recommendedModel: string;
  isAdjusted: boolean;
  originalModel: string;
}

export class InterviewModelGuard {
  /**
   * Identifies whether a model is high-latency or reasoning-heavy (unsuitable for live real-time dialogue).
   * Pro and reasoning models take 4s–10s+ before emitting the first token, which is fatal in interviews.
   */
  public static isHighLatencyModel(modelId: string): boolean {
    if (!modelId) return false;
    const lower = modelId.toLowerCase();

    // Antigravity Pro reasoning models
    if (lower.startsWith('antigravity:') && (lower.includes('pro') || lower.includes('ultra'))) {
      return true;
    }

    // Direct Gemini Pro models
    if ((lower.startsWith('gemini-') || lower.startsWith('models/')) && (lower.includes('-pro') || lower.includes('pro-'))) {
      return true;
    }

    // OpenAI Reasoning models (o1, o3, etc.)
    if (/^(o1|o3|o4)(-[a-z0-9]+)?$/i.test(lower) || lower.includes('reasoning')) {
      return true;
    }

    // Claude Opus models
    if (lower.includes('opus')) {
      return true;
    }

    // DeepSeek Reasoner
    if (lower.includes('reasoner') || lower.includes('deepseek-r1') || lower.includes('deepseek-v4-pro')) {
      return true;
    }

    return false;
  }

  /**
   * Resolves the best ultra-fast, interview-capable counterpart model.
   */
  public static resolveFastInterviewModel(modelId: string, llmHelper?: any): { model: string; reason: string } {
    const lower = (modelId || '').toLowerCase();

    // 1. Antigravity Pro model -> switch to Antigravity Flash
    if (lower.startsWith('antigravity:')) {
      let flashModel: string | null = null;
      try {
        const { AntigravityService } = require('../services/AntigravityService');
        const cached = AntigravityService.getInstance().getCachedModels();
        if (cached && Array.isArray(cached) && cached.length > 0) {
          const flash = cached.find((m: any) => m.id?.toLowerCase().includes('flash'));
          if (flash) flashModel = `antigravity:${flash.id}`;
        }
      } catch { /* ignore */ }

      return {
        model: flashModel || 'antigravity:gemini-2.5-flash',
        reason: 'Pro models take 5–10s to reason. Switched to Flash for real-time interview response (<1s).'
      };
    }

    // 2. Gemini Pro -> Gemini Flash (or Sarvam if unkeyed)
    if (lower.includes('gemini') && (lower.includes('-pro') || lower.includes('pro-') || lower.endsWith('pro'))) {
      const hasGeminiKey = llmHelper ? llmHelper.hasKeyForModel('gemini-3.8-flash') : true;
      return {
        model: hasGeminiKey ? 'gemini-3.8-flash' : 'sarvam-105b-conversations',
        reason: 'Gemini Pro has high latency. Switched to Flash for instant interview answers.'
      };
    }

    // 3. OpenAI Reasoning (o1/o3) -> gpt-4o-mini or Sarvam
    if (/^(o1|o3|o4)/i.test(lower) || lower.includes('reasoning')) {
      const hasOpenAiKey = llmHelper ? llmHelper.hasKeyForModel('gpt-4o') : true;
      return {
        model: hasOpenAiKey ? 'gpt-4o' : 'sarvam-105b-conversations',
        reason: 'Reasoning models burn seconds thinking. Switched to fast conversational model.'
      };
    }

    // 4. Claude Opus -> Claude Haiku / Sonnet or Sarvam
    if (lower.includes('opus')) {
      const hasClaudeKey = llmHelper ? llmHelper.hasKeyForModel('claude-sonnet-4-6') : true;
      return {
        model: hasClaudeKey ? 'claude-sonnet-4-6' : 'sarvam-105b-conversations',
        reason: 'Claude Opus is too slow for live interviews. Switched to fast Sonnet.'
      };
    }

    // 5. DeepSeek Reasoner -> DeepSeek Flash or Sarvam
    if (lower.includes('reasoner') || lower.includes('r1') || lower.includes('deepseek-v4-pro')) {
      const hasDeepseekKey = llmHelper ? llmHelper.hasKeyForModel('deepseek-v4-flash') : true;
      return {
        model: hasDeepseekKey ? 'deepseek-v4-flash' : 'sarvam-105b-conversations',
        reason: 'DeepSeek Reasoner has long latency. Switched to fast chat model.'
      };
    }

    // 6. Model has NO API key configured -> Fall back to backend Sarvam
    if (llmHelper && !llmHelper.hasKeyForModel(modelId)) {
      return {
        model: 'sarvam-105b-conversations',
        reason: 'No API key configured for this model. Switched to backend Sarvam for 0ms responses.'
      };
    }

    // Model is already interview-capable
    return {
      model: modelId,
      reason: 'Model is interview-ready.'
    };
  }

  /**
   * Picks the single best, ultra-fast model available given the user's
   * currently configured API keys.  Called when Fast Response Mode is ON.
   *
   * Priority order (fastest first, most likely to be already configured):
   *   1. Groq  — sub-300ms TTFT, user's Groq key
   *   2. Antigravity Flash — user's MeetFloo/Antigravity key
   *   3. Gemini Flash — user's Gemini key
   *   4. Sarvam (backend) — always available, 0ms
   */
  public static resolveBestFastModel(llmHelper?: any): { model: string; label: string } {
    if (llmHelper) {
      // 1. Groq — fastest text inference
      if (llmHelper.hasKeyForModel?.('groq') || llmHelper.hasKeyForModel?.('llama-3.3-70b-versatile')) {
        return { model: 'llama-3.3-70b-versatile', label: 'Groq – Llama 3.3 70B' };
      }
      // 2. Antigravity Flash
      if (llmHelper.hasKeyForModel?.('antigravity:gemini-2.5-flash')) {
        return { model: 'antigravity:gemini-2.5-flash', label: 'Antigravity – Gemini Flash' };
      }
      // 3. Gemini Flash
      if (llmHelper.hasKeyForModel?.('gemini-3.8-flash') || llmHelper.hasKeyForModel?.('gemini-2.5-flash')) {
        return { model: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash' };
      }
      // 4. GPT-4o
      if (llmHelper.hasKeyForModel?.('gpt-4o')) {
        return { model: 'gpt-4o', label: 'GPT-4o' };
      }
    }
    // Always-available backend Sarvam fallback
    return { model: 'sarvam-105b-conversations', label: 'Sarvam (Backend)' };
  }

  /**
   * Main inspection and resolution method.
   */
  public static inspectAndResolve(modelId: string, llmHelper?: any): ModelCapabilityCheck {
    const isHighLatency = this.isHighLatencyModel(modelId);
    const hasKey = llmHelper ? llmHelper.hasKeyForModel(modelId) : true;

    if (!isHighLatency && hasKey) {
      return {
        isCapable: true,
        recommendedModel: modelId,
        isAdjusted: false,
        originalModel: modelId
      };
    }

    const resolution = this.resolveFastInterviewModel(modelId, llmHelper);
    return {
      isCapable: false,
      reason: resolution.reason,
      recommendedModel: resolution.model,
      isAdjusted: resolution.model !== modelId,
      originalModel: modelId
    };
  }
}
