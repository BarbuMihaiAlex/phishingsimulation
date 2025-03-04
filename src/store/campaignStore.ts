
import { create } from 'zustand';
import { CampaignData } from '@/types';

interface CampaignStore {
  currentCampaign: CampaignData | null;
  setCurrentCampaign: (campaign: CampaignData | null) => void;
}

export const useCampaignStore = create<CampaignStore>((set) => ({
  currentCampaign: null,
  setCurrentCampaign: (campaign) => set({ currentCampaign: campaign }),
}));
