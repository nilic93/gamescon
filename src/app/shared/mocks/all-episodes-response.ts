import { EpisodeInfo } from "../models/episode-info.model";

export const episodesMock: EpisodeInfo[] = [
  {
    id: '22341',
    type: 'events',
    attributes: {
      uuid: 'a73d8e94-e25b-4544-ae3b-511ebb1be8f0',
      name: 'SPEL 143',
      duration: 1019,
      original_duration: 2400,
      start_mode: 'manual',
      repeat: false,
      repeat_in: null,
      feed_uuid: 'e0124324-9211-4f50-b0ce-ad91d3c12e6b',
      live_stats_uuid: null,
      extra_time: 61,
      start_at: 1537202654,
      start_at_iso: '2018-09-17T16:44:14Z',
      end_at: 1537203673,
      end_at_iso: '2018-09-17T17:01:13Z',
      settings: [
        {
          key: 'episode_number',
          values: {
            all: '1',
          },
        },
        {
          key: 'number',
          values: {
            all: 2000,
          },
        },
        {
          key: 'winner_prize',
          values: {
            all: 2.84,
          },
        },
        {
          key: 'sent_payout',
          values: {
            all: true,
          },
        },
      ],
      state: 'past',
      actions: [],
    },
    relationships: {
      elements: {
        links: {
          related: 'https://v22.lvis.io/api/v1/events/22341/elements',
        },
      },
      pause_markers: {
        links: {
          related: 'https://v22.lvis.io/api/v1/events/22341/pause_markers',
        },
      },
      stats: {
        data: [],
      },
      project: {
        data: {
          id: '84',
          type: 'projects',
        },
      },
    },
    links: {
      self: 'https://v22.lvis.io/api/v1/events/22341',
    },
  },
  {
    id: '12269',
    type: 'events',
    attributes: {
      uuid: 'e687da8f-c113-4120-b6f9-df1e51f09f60',
      name: 'Episode 1, spel 1 (10 sec timings)',
      duration: 1235,
      original_duration: 2400,
      start_mode: 'manual',
      repeat: false,
      repeat_in: null,
      feed_uuid: 'c45dc6fc-536d-4743-b5f4-b0aef8c6eb72',
      live_stats_uuid: 'a1949fbd98443211',
      extra_time: 70,
      start_at: 1528736160,
      start_at_iso: '2018-06-11T16:56:00Z',
      end_at: 1528737395,
      end_at_iso: '2018-06-11T17:16:35Z',
      settings: [
        {
          key: 'episode_number',
          values: {
            all: '2',
          },
        },
        {
          key: 'number',
          values: {
            all: 1000,
          },
        },
      ],
      state: 'past',
      actions: [],
    },
    relationships: {
      elements: {
        links: {
          related: 'https://v22.lvis.io/api/v1/events/12269/elements',
        },
      },
      pause_markers: {
        links: {
          related: 'https://v22.lvis.io/api/v1/events/12269/pause_markers',
        },
      },
      stats: {
        data: [],
      },
      project: {
        data: {
          id: '84',
          type: 'projects',
        },
      },
    },
    links: {
      self: 'https://v22.lvis.io/api/v1/events/12269',
    },
  },
  {
    id: '12271',
    type: 'events',
    attributes: {
      uuid: '3969bb33-4703-49e1-91fd-aafdc135643b',
      name: 'Episode 1, spel 2 (10 sec. timings)',
      duration: 1144,
      original_duration: 2400,
      start_mode: 'manual',
      repeat: false,
      repeat_in: null,
      feed_uuid: 'a3f3b2bf-fad1-44bf-b0df-6d468edf350d',
      live_stats_uuid: '61604ca00699a847',
      extra_time: 70,
      start_at: 1528737474,
      start_at_iso: '2018-06-11T17:17:54Z',
      end_at: 1528738618,
      end_at_iso: '2018-06-11T17:36:58Z',
      settings: [
        {
          key: 'episode_number',
          values: {
            all: '3',
          },
        }
      ],
      state: 'past',
      actions: [],
    },
    relationships: {
      elements: {
        links: {
          related: 'https://v22.lvis.io/api/v1/events/12271/elements',
        },
      },
      pause_markers: {
        links: {
          related: 'https://v22.lvis.io/api/v1/events/12271/pause_markers',
        },
      },
      stats: {
        data: [],
      },
      project: {
        data: {
          id: '84',
          type: 'projects',
        },
      },
    },
    links: {
      self: 'https://v22.lvis.io/api/v1/events/12271',
    },
  }
];
