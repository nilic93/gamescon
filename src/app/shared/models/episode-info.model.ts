export interface EpisodeInfo {
  id: string;
  type: string;
  attributes: {
    uuid: string;
    name: string;
    duration: number;
    original_duration: number;
    start_mode: string;
    repeat: boolean;
    repeat_in?: any;
    feed_uuid: string;
    live_stats_uuid: string;
    extra_time: number;
    start_at: number;
    start_at_iso: string;
    end_at: number;
    end_at_iso: string;
    settings: { key: string; values: { all: any } }[];
    state: string;
    actions: any[];
  };
  relationships: {
    elements: {
      links: {
        related: string;
      };
    };
    pause_markers: {
      links: {
        related: string;
      };
    };
    stats: {
      data: any[];
    };
    project: {
      data: {
        id: string;
        type: string;
      };
    };
  };
  links: {
    self: string;
  };
}
