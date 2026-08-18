export interface SystemLibrary {
  systemName: string;
  slug: string;
  version: string;
  description: string;
  mappings: {
    approaches: {
      userExplanation: string;
      logic: any;
    };
    powerScale: {
      userExplanation: string;
      logic: any;
    };
    slotTaxes: {
      userExplanation: string;
      logic: any;
    };
    pathTagDefinitions?: {
      userExplanation: string;
      logic: any;
    };
  };
}
