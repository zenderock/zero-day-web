export type Locale = 'fr' | 'en';

export const translations = {
  fr: {
    app: {
      title: "ZERO_DAY // Architecture GitHub",
      description: "Visualisez votre année GitHub en 3D. Une expérience immersive.",
      tagline: "GITHUB_ARCHITECT_PROTOCOL",
      subtitle: "Visualisez votre année GitHub en 3D. Une expérience immersive inspirée de Spotify Wrapped.",
      features: {
        visualization: "3D_VISUALIZATION",
        audio: "AUDIO_REACTIVE",
        data: "DATA_DRIVEN"
      },
      initialize: "INITIALIZE_LINK",
      connect: "CONNECT_GITHUB",
      version: "Github_Architecture // v2.0"
    },
    header: {
      netlink_established: "CONNEXION_ÉTABLIE",
      disconnect: "Déconnecter",
      connect: "Connecter_GitHub"
    },
    idle: {
      enter: "ENTER_THE_VOID",
      duration: "DURÉE: ~60 SECONDES"
    },
    intro: {
      analyzing: "ANALYSE_EN_COURS"
    },
    profile: {
      detected: "PROFIL_DÉTECTÉ",
      years_active: "ANS_ACTIF",
      followers: "FOLLOWERS",
      repos: "REPOS"
    },
    flux: {
      contributions: "CONTRIBUTIONS",
      message: "Chaque commit est une brique. Tu as posé {count} briques cette année."
    },
    breakdown: {
      title: "DÉCOMPOSITION",
      commits: "COMMITS",
      pull_requests: "PULL_REQUESTS",
      reviews: "REVIEWS",
      issues: "ISSUES"
    },
    chrono: {
      title: "PATTERN_TEMPOREL",
      streak_max: "JOURS_STREAK_MAX",
      weekend_ops: "WEEKEND_OPS",
      distribution: "DISTRIBUTION",
      best_month: "MEILLEUR_MOIS",
      record_day: "JOUR_RECORD"
    },
    languages: {
      title: "STACK_TECHNIQUE",
      none: "AUCUN_LANGAGE_DÉTECTÉ"
    },
    repos: {
      title: "TOP_REPOSITORIES"
    },
    spire: {
      classification: "CLASSIFICATION",
      consistency: "CONSISTANCE",
      avg_day: "MOY/JOUR",
      intro: {
        title: "ARCHITECTURE",
        floor: "CHAQUE_ÉTAGE_=_1_SEMAINE",
        floor_desc: "La structure temporelle de ton année.",
        height: "HAUTEUR_=_VOLUME",
        height_desc: "Plus tu codes, plus la tour s'élève.",
        gaps: "VIDES_=_SILENCE",
        gaps_desc: "Les moments de respiration."
      }
    },
    outro: {
      title: "RAPPORT_FINAL",
      replay: "REJOUER",
      share: "PARTAGER",
      heatmap: "HEATMAP",
      active_days: "JOURS_ACTIFS",
      system_online: "SYSTEM_ONLINE",
      activity_matrix: "ACTIVITY_MATRIX",
      classification_label: "Classification",
      replay_simulation: "REPLAY_SIMULATION",
      save_img: "SAVE_IMG",
      share_protocol: "SHARE_PROTOCOL",
      report_complete: "// REPORT: COMPLETE"
    },
    floor: {
      week: "SEMAINE",
      contributions: "CONTRIBUTIONS",
      active_days: "JOURS_ACTIFS",
      metrics: "MÉTRIQUES",
      height: "HAUTEUR",
      width: "LARGEUR",
      click_close: "CLIC POUR FERMER",
      click_lock: "CLIC POUR VERROUILLER",
      types: {
        solid: "HAUTE_ACTIVITÉ",
        wireframe: "ACTIVITÉ_MODÉRÉE",
        void: "ZONE_SILENCIEUSE"
      },
      remarkable: {
        peak: "SURGE_DÉTECTÉ",
        drought: "VOID_PERIOD",
        streak: "STREAK_ZONE"
      }
    },
    controls: {
      paused: "EN_PAUSE",
      playing: "LECTURE_AUTO",
      next: "SUIVANT"
    },
    footer: {
      coords: "COORDS: [ENCRYPTED // SECURE_SECTOR]",
      status_idle: "IDLE // AWAITING_LINK",
      status_analyzing: "ANALYZING // {count} FLUX",
      system_ready: "SYSTEM READY"
    },
    rankings: {
      NEXUS_ARCHITECT: "Tu as transcendé le code. Tu ES le système.",
      CONSTRUCT: "Une entité numérique. Tu ne codes plus, tu manifestes.",
      PRIME_ARCHITECT: "Maître bâtisseur. Chaque commit est une brique de ton empire.",
      ARCHITECT: "Tu construis des cathédrales de logique.",
      CYBERMANCER: "Le code coule dans tes veines. Magie digitale.",
      NETRUNNER: "Tu navigues la matrice avec aisance.",
      SCRIPTER: "Tu maîtrises les incantations de base.",
      NEOPHYTE: "L'éveil commence. Continue.",
      GHOST: "Une présence à peine perceptible dans le réseau."
    },
    events: {
      peak_description: "Semaine explosive: {count} contributions",
      drought_description: "Semaine silencieuse après une période active",
      milestone_description: "Cap des {count} contributions atteint"
    },
    common: {
      connect_data: "Connectez-vous pour voir vos données."
    }
  },
  en: {
    app: {
      title: "ZERO_DAY // GitHub Architecture",
      description: "Visualize your GitHub year in 3D. An immersive experience.",
      tagline: "GITHUB_ARCHITECT_PROTOCOL",
      subtitle: "Visualize your GitHub year in 3D. An immersive experience inspired by Spotify Wrapped.",
      features: {
        visualization: "3D_VISUALIZATION",
        audio: "AUDIO_REACTIVE",
        data: "DATA_DRIVEN"
      },
      initialize: "INITIALIZE_LINK",
      connect: "CONNECT_GITHUB",
      version: "Github_Architecture // v2.0"
    },
    header: {
      netlink_established: "NETLINK_ESTABLISHED",
      disconnect: "Disconnect",
      connect: "Connect_GitHub"
    },
    idle: {
      enter: "ENTER_THE_VOID",
      duration: "DURATION: ~60 SECONDS"
    },
    intro: {
      analyzing: "ANALYZING"
    },
    profile: {
      detected: "PROFILE_DETECTED",
      years_active: "YEARS_ACTIVE",
      followers: "FOLLOWERS",
      repos: "REPOS"
    },
    flux: {
      contributions: "CONTRIBUTIONS",
      message: "Every commit is a brick. You laid {count} bricks this year."
    },
    breakdown: {
      title: "BREAKDOWN",
      commits: "COMMITS",
      pull_requests: "PULL_REQUESTS",
      reviews: "REVIEWS",
      issues: "ISSUES"
    },
    chrono: {
      title: "TEMPORAL_PATTERN",
      streak_max: "MAX_STREAK_DAYS",
      weekend_ops: "WEEKEND_OPS",
      distribution: "DISTRIBUTION",
      best_month: "BEST_MONTH",
      record_day: "RECORD_DAY"
    },
    languages: {
      title: "TECH_STACK",
      none: "NO_LANGUAGE_DETECTED"
    },
    repos: {
      title: "TOP_REPOSITORIES"
    },
    spire: {
      classification: "CLASSIFICATION",
      consistency: "CONSISTENCY",
      avg_day: "AVG/DAY",
      intro: {
        title: "ARCHITECTURE",
        floor: "EACH_FLOOR_=_1_WEEK",
        floor_desc: "The temporal structure of your year.",
        height: "HEIGHT_=_VOLUME",
        height_desc: "The more you code, the higher the tower rises.",
        gaps: "GAPS_=_SILENCE",
        gaps_desc: "The moments of rest."
      }
    },
    outro: {
      title: "FINAL_REPORT",
      replay: "REPLAY",
      share: "SHARE",
      heatmap: "HEATMAP",
      active_days: "ACTIVE_DAYS",
      system_online: "SYSTEM_ONLINE",
      activity_matrix: "ACTIVITY_MATRIX",
      classification_label: "Classification",
      replay_simulation: "REPLAY_SIMULATION",
      save_img: "SAVE_IMG",
      share_protocol: "SHARE_PROTOCOL",
      report_complete: "// REPORT: COMPLETE"
    },
    floor: {
      week: "WEEK",
      contributions: "CONTRIBUTIONS",
      active_days: "ACTIVE_DAYS",
      metrics: "METRICS",
      height: "HEIGHT",
      width: "WIDTH",
      click_close: "CLICK TO CLOSE",
      click_lock: "CLICK TO LOCK",
      types: {
        solid: "HIGH_ACTIVITY",
        wireframe: "MODERATE_ACTIVITY",
        void: "SILENT_ZONE"
      },
      remarkable: {
        peak: "SURGE_DETECTED",
        drought: "VOID_PERIOD",
        streak: "STREAK_ZONE"
      }
    },
    controls: {
      paused: "PAUSED",
      playing: "AUTO_PLAY",
      next: "NEXT"
    },
    footer: {
      coords: "COORDS: [ENCRYPTED // SECURE_SECTOR]",
      status_idle: "IDLE // AWAITING_LINK",
      status_analyzing: "ANALYZING // {count} FLUX",
      system_ready: "SYSTEM READY"
    },
    rankings: {
      NEXUS_ARCHITECT: "You have transcended code. You ARE the system.",
      CONSTRUCT: "A digital entity. You no longer code, you manifest.",
      PRIME_ARCHITECT: "Master builder. Each commit is a brick of your empire.",
      ARCHITECT: "You build cathedrals of logic.",
      CYBERMANCER: "Code flows through your veins. Digital magic.",
      NETRUNNER: "You navigate the matrix with ease.",
      SCRIPTER: "You master the basic incantations.",
      NEOPHYTE: "The awakening begins. Continue.",
      GHOST: "A barely perceptible presence in the network."
    },
    events: {
      peak_description: "Explosive week: {count} contributions",
      drought_description: "Silent week after an active period",
      milestone_description: "Milestone of {count} contributions reached"
    },
    common: {
      connect_data: "Connect to see your data."
    }
  }
} as const;

type DeepReplaceString<T> = {
  [K in keyof T]: T[K] extends object ? DeepReplaceString<T[K]> : string;
};

export type TranslationKeys = DeepReplaceString<typeof translations.fr>;

export function getTranslation(locale: Locale = 'en'): TranslationKeys {
  return translations[locale];
}

export function t(locale: Locale, path: string, params?: Record<string, string | number>): string {
  const keys = path.split('.');
  let value: any = translations[locale];
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  if (typeof value !== 'string') return path;
  
  if (params) {
    return Object.entries(params).reduce(
      (str, [key, val]) => str.replace(`{${key}}`, String(val)),
      value
    );
  }
  
  return value;
}
