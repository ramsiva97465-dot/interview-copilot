import { TRIAL_SENTINEL_KEY } from '../config/constants';
import { CredentialsManager } from './CredentialsManager';
import { isPremiumAvailable } from '../premium/featureGate';

export function resolveCompanySearchProvider(): any | null {
  if (!isPremiumAvailable()) {
    return null;
  }

  const cm = CredentialsManager.getInstance();

  try {
    const tavilyApiKey = cm.getTavilyApiKey();
    if (tavilyApiKey) {
      const tavilyMod = '../../premium/electron/knowledge/TavilySearchProvider';
      const { TavilySearchProvider } = require(tavilyMod);
      return new TavilySearchProvider(tavilyApiKey);
    }

    const MeetFlooKey = cm.getMeetFlooApiKey();
    if (MeetFlooKey) {
      const MeetFlooMod = '../../premium/electron/knowledge/MeetFlooSearchProvider';
      const { MeetFlooSearchProvider } = require(MeetFlooMod);
      // Pass the real trial token when the key is the __trial__ sentinel so the
      // server can authenticate via x-trial-token instead of the invalid key.
      const trialToken = MeetFlooKey === TRIAL_SENTINEL_KEY ? cm.getTrialToken() : undefined;
      console.log('[CompanySearch] Using MeetFloo API search (no Tavily key configured)');
      return new MeetFlooSearchProvider(MeetFlooKey, trialToken ?? undefined);
    }
  } catch (err) {
    console.warn('[CompanySearch] Could not load premium search provider:', err);
  }

  return null;
}

