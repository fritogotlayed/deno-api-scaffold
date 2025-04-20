import { join } from '@std/path';

// NOTE: this is the more Deno way of doing things module methods. It makes it easier to
// test and mock.
export class FeatureFlagsClient {
  static async getFeatureFlagEnabled(featureFlag: string): Promise<boolean> {
    // NOTE: this is a stub implementation that reads from a file. This may be something
    // that works against a real feature flag service in the future. Think something like
    // LaunchDarkly or similar.
    const decoder = new TextDecoder('utf-8');
    const fileData = await Deno.readFile(
      join(Deno.cwd(), 'src', 'feature-flags.json'),
    );

    const featureFlags = decoder.decode(fileData);
    let featureFlagsJson: Record<string, boolean>;

    try {
      featureFlagsJson = JSON.parse(featureFlags);
    } catch (error) {
      console.error(error);
      featureFlagsJson = {};
    }

    return featureFlagsJson[featureFlag] ?? false;
  }
}
