import { MultiSelectItemType } from "types/types";

export interface Player {
  id: string;
  name: string;
  rank: number;
  rating: number;
  countryCode: string;
}

export interface Country {
  id: string;
  country_name: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface ResultsPanelProps {
  data: Player[];
  isLoading: boolean;
}

export interface PlayersListState {
  items: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  filters: {
    playersSelected: MultiSelectItemType[];
    countriesSelected: string[];
    playdekSelected: MultiSelectItemType[];
  };
  currentPage: number;
  totalPages: number;
}

export interface CardColumnProps {
  header: string;
  value: string | number;
  countryCode?: string;
}

export interface PlayerRowProps {
  index: number;
  player: Player;
} 