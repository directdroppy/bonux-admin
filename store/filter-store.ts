import { create } from 'zustand'

interface FilterState {
  // User filters
  userSegment: string | null
  userStatus: string | null
  userDateRange: { from: Date | null; to: Date | null } | null

  // Business filters
  businessCategory: string | null
  businessSubscription: string | null
  businessStatus: string | null

  // Campaign filters
  campaignType: string | null
  campaignStatus: string | null
  campaignSegment: string | null

  // Actions
  setUserSegment: (segment: string | null) => void
  setUserStatus: (status: string | null) => void
  setUserDateRange: (range: { from: Date | null; to: Date | null } | null) => void
  setBusinessCategory: (category: string | null) => void
  setBusinessSubscription: (subscription: string | null) => void
  setBusinessStatus: (status: string | null) => void
  setCampaignType: (type: string | null) => void
  setCampaignStatus: (status: string | null) => void
  setCampaignSegment: (segment: string | null) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  // Initial states
  userSegment: null,
  userStatus: null,
  userDateRange: null,
  businessCategory: null,
  businessSubscription: null,
  businessStatus: null,
  campaignType: null,
  campaignStatus: null,
  campaignSegment: null,

  // Actions
  setUserSegment: (segment) => set({ userSegment: segment }),
  setUserStatus: (status) => set({ userStatus: status }),
  setUserDateRange: (range) => set({ userDateRange: range }),
  setBusinessCategory: (category) => set({ businessCategory: category }),
  setBusinessSubscription: (subscription) => set({ businessSubscription: subscription }),
  setBusinessStatus: (status) => set({ businessStatus: status }),
  setCampaignType: (type) => set({ campaignType: type }),
  setCampaignStatus: (status) => set({ campaignStatus: status }),
  setCampaignSegment: (segment) => set({ campaignSegment: segment }),
  resetFilters: () => set({
    userSegment: null,
    userStatus: null,
    userDateRange: null,
    businessCategory: null,
    businessSubscription: null,
    businessStatus: null,
    campaignType: null,
    campaignStatus: null,
    campaignSegment: null,
  }),
}))
