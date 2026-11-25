type DegreeProgramme = {
  readonly department: string;
  readonly cohort: string;
  readonly overview: string;
  readonly areas: readonly {
    readonly title: string;
    readonly description: string;
  }[];
  readonly structure: readonly {
    readonly term: string;
    readonly detail: string;
  }[];
  readonly cohortUrl: string;
};

/**
 * @description Website-only programme context, keyed by the degree name in education.ts.
 * Kept out of education.ts so it does not enter the exported CV data.
 * Facts follow the official UniCT 2019/2020 cohort plan and LM-32 regulations,
 * checked on 25 November 2026. The two area titles are the author's grouping.
 */
export const degreeProgrammes: Readonly<Record<string, DegreeProgramme>> = {
  "M.Sc. in Computer Engineering · LM-32": {
    department:
      "Department of Electrical, Electronic and Computer Engineering (DIEEI)",
    cohort: "2019/2020",
    overview:
      "Within DIEEI, the programme joins software engineering and distributed systems with automatic control, industrial networks and embedded/IoT systems. It treats software together with the networks, sensors and hardware it depends on: the systems view the university uses to distinguish the computer engineer from a software-only profile.",
    areas: [
      {
        title: "Networks and Automation",
        description:
          "Automatic control with sensors and actuators, PLC-based process control and supervision, real-time wired and wireless networks for industrial automation, IP and telecommunication systems, and embedded/IoT design. Applications include the smart factory and automotive systems.",
      },
      {
        title: "Software and Applications",
        description:
          "Software engineering, distributed systems and big data, information systems security, advanced programming languages, processor architectures, artificial intelligence and machine learning.",
      },
    ],
    structure: [
      {
        term: "12 exams",
        detail:
          "Including 9 free-choice credits, which the regulations also allow to be earned through an internship.",
      },
      {
        term: "3 credits",
        detail:
          "Further skills for employment, such as seminars, scientific computing and software design laboratories.",
      },
      {
        term: "18-credit thesis",
        detail: "Documents a design or research project.",
      },
      {
        term: "Practical work",
        detail:
          "Many courses devote a significant share of hours to practical exercises and project development.",
      },
    ],
    cohortUrl:
      "https://public.smartedu.unict.it/manifesti/render.aspx?UID=66ad46d7-9e9d-4c35-bc15-e00fc3c4248e",
  },
};
