import { Diary } from "@/services/types/diary";

export type SearchNoteSchema = {
  id: string;
  title: string;
  diaryId: string;
  diary?: Diary;
  isPublic: boolean;
  content: string;
  tags: string[];
};

export type NoteSearchResult = SearchResult<SearchNoteSchema>;

export type SearchResult<T> = {
  facet_counts: any[];
  found: number;
  hits: {
    document: T;
    highlights: [
      {
        field: keyof T;
        matched_tokens: string[];
        snippet: string;
      },
    ];
    text_match: 578730089005449300;
    text_match_info: {
      best_field_score: "1108074561536";
      best_field_weight: 14;
      fields_matched: 1;
      num_tokens_dropped: 0;
      score: "578730089005449329";
      tokens_matched: 1;
      typo_prefix_score: 1;
    };
  }[];
  out_of: number;
  page: number;
  request_params: Record<string, any>;
  search_cutoff: boolean;
  search_time_ms: number;
};
