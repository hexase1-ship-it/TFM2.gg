window.TFM2_META_DATA = {
  "generatedAt": "2026-06-08T21:11:33",
  "scoreModelSpec": {
    "modelVersion": "tfm2gg-meta-v1",
    "posterior": {
      "z": 0.84,
      "fallbackPriorMean": 0.5,
      "kappa": {
        "early": [
          8,
          50
        ],
        "normal": [
          12,
          80
        ],
        "role": [
          18,
          100
        ]
      },
      "ratePriorKappa": 20
    },
    "strength": {
      "meanWeight": 0.7,
      "lowerWeight": 0.3
    },
    "pressure": {
      "eps": 0.001,
      "scale": 16
    },
    "presets": {
      "classic": {
        "label": "classic",
        "metaStrengthWeight": 0.84,
        "metaPressureWeight": 0.16,
        "lowerStrengthWeight": 0.88,
        "lowerPressureWeight": 0.12
      },
      "fearless": {
        "label": "fearless",
        "metaStrengthWeight": 0.78,
        "metaPressureWeight": 0.22,
        "lowerStrengthWeight": 0.82,
        "lowerPressureWeight": 0.18
      },
      "hardFearless": {
        "label": "hardFearless",
        "metaStrengthWeight": 0.72,
        "metaPressureWeight": 0.28,
        "lowerStrengthWeight": 0.78,
        "lowerPressureWeight": 0.22
      }
    },
    "tiers": [
      {
        "tier": "OP",
        "minLower": 56,
        "maxPercentile": 0.08
      },
      {
        "tier": "1",
        "minLower": 51,
        "maxPercentile": 0.22
      },
      {
        "tier": "2",
        "minLower": 48,
        "maxPercentile": 0.45
      },
      {
        "tier": "3",
        "minLower": 44,
        "maxPercentile": 0.7
      }
    ],
    "honey": {
      "residualDivisor": 20,
      "adaptiveResidualMinDivisor": 3,
      "adaptiveResidualQuantile": 0.75,
      "adaptiveResidualScale": 1.25,
      "rankGapWeight": 0.72,
      "residualGapWeight": 0.28
    }
  },
  "save": {
    "path": null,
    "lastModified": null,
    "searchRoots": [
      "C:\\Users\\hexas\\AppData\\Roaming\\TeamSamoyed\\TeamfightManager2\\data",
      "C:\\Users\\hexas\\AppData\\Roaming\\TeamSamoyed\\Teamfight Manager2\\data"
    ]
  },
  "sources": {
    "championInfo": "bundled dashboard champion data",
    "championCurrentInfo": 0,
    "externalChampionGameRoot": "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Teamfight Manager2",
    "externalChampionMods": [],
    "externalChampionCount": 0,
    "championCandidateIndexSource": "bundled base candidate order",
    "championCandidateIndexes": 60,
    "saveNewsStats": 0,
    "draftLikeGroups": 0,
    "metaExporter": false,
    "saveProbe": false,
    "metaExportSource": "unavailable",
    "metaExportUsable": false,
    "metaExportReason": "no_export_data",
    "replaySummaries": 0,
    "matchAnalysis": 0,
    "matchAnalysisTotal": 0,
    "tournamentMatchAnalysis": 0,
    "soloMatchAnalysis": 0,
    "replayDateInference": {
      "enabled": false,
      "source": "disabled",
      "sets": 0,
      "tournamentSets": 0,
      "soloSets": 0,
      "series": 0,
      "assigned": 0,
      "tournamentAssigned": 0,
      "soloAssigned": 0,
      "unknown": 0,
      "latestKnownDate": null,
      "latestPatchDate": null,
      "daysSincePatch": null,
      "confidence": "none",
      "confidenceCounts": {},
      "assignedBySource": {},
      "patchEvents": []
    },
    "soloRankMatches": 0,
    "tournamentRelationshipMatches": 0,
    "soloReplayIds": 0,
    "excludedSoloReplayIds": 0,
    "metaExportLastModified": null,
    "metaExportSaveDeltaSeconds": null,
    "metaExportMismatched": false,
    "teamLookupSource": "save_fallback",
    "athleteLookupSource": "unavailable",
    "exactReplayAthleteNames": false,
    "matchAnalysisSource": "disabled: current Meta Exporter snapshot is incompatible, so stale replay debug files were ignored",
    "matchAnalysisDateSource": "disabled",
    "itemCatalogSource": "C:\\팀파매2 모딩\\1_모딩\\타 모드\\TFM2.gg-installer-ssl-worktree\\TFM2_Meta_Dashboard_v0.3.3 (팀파매.gg)\\resources\\app\\tfm2_meta_dashboard\\data\\item_setting.item_setting",
    "itemCatalogItems": 30,
    "coreItemBuilds": "C:\\팀파매2 모딩\\1_모딩\\타 모드\\TFM2.gg-installer-ssl-worktree\\TFM2_Meta_Dashboard_v0.3.3 (팀파매.gg)\\resources\\app\\tfm2_meta_dashboard\\data\\core-item-builds.json",
    "coreItemBuildsMod": "C:\\팀파매2 모딩\\1_모딩\\타 모드\\TFM2.gg-installer-ssl-worktree\\TFM2_Meta_Dashboard_v0.3.3 (팀파매.gg)\\resources\\app\\mods\\tfm2_meta_item_delegate\\core-item-builds.json",
    "coreItemBuildsTournamentMatches": 0,
    "policyExports": {
      "championTierPolicy": {
        "written": [
          "C:\\팀파매2 모딩\\1_모딩\\타 모드\\TFM2.gg-installer-ssl-worktree\\TFM2_Meta_Dashboard_v0.3.3 (팀파매.gg)\\resources\\app\\tfm2_meta_dashboard\\data\\policy_exports\\champion_tier_policy.tsv",
          "C:\\팀파매2 모딩\\1_모딩\\타 모드\\TFM2.gg-installer-ssl-worktree\\tfm2_meta_champion_tiers (팀파매.gg 메타 티어 동기화 애드온 모드)\\champion_tier_policy.tsv",
          "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Teamfight Manager2\\mods\\tfm2_meta_champion_tiers\\champion_tier_policy.tsv"
        ],
        "skipped": [
          {
            "path": "C:\\팀파매2 모딩\\1_모딩\\타 모드\\TFM2.gg-installer-ssl-worktree\\TFM2_Meta_Dashboard_v0.3.3 (팀파매.gg)\\resources\\app\\mods\\tfm2_meta_champion_tiers\\champion_tier_policy.tsv",
            "reason": "parent missing"
          }
        ]
      },
      "aiChampionPolicy": {
        "written": [
          "C:\\팀파매2 모딩\\1_모딩\\타 모드\\TFM2.gg-installer-ssl-worktree\\TFM2_Meta_Dashboard_v0.3.3 (팀파매.gg)\\resources\\app\\tfm2_meta_dashboard\\data\\policy_exports\\ai_champion_policy.tsv",
          "C:\\팀파매2 모딩\\1_모딩\\타 모드\\TFM2.gg-installer-ssl-worktree\\tfm2_ai_banpick_probe (팀파매.gg AI 밴픽 보정 애드온 모드)\\ai_champion_policy.tsv"
        ],
        "skipped": [
          {
            "path": "C:\\팀파매2 모딩\\1_모딩\\타 모드\\TFM2.gg-installer-ssl-worktree\\TFM2_Meta_Dashboard_v0.3.3 (팀파매.gg)\\resources\\app\\mods\\tfm2_ai_banpick_probe\\ai_champion_policy.tsv",
            "reason": "parent missing"
          },
          {
            "path": "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Teamfight Manager2\\mods\\tfm2_ai_banpick_probe\\ai_champion_policy.tsv",
            "reason": "parent missing"
          }
        ]
      },
      "aiCandidateMap": {
        "written": [
          "C:\\팀파매2 모딩\\1_모딩\\타 모드\\TFM2.gg-installer-ssl-worktree\\TFM2_Meta_Dashboard_v0.3.3 (팀파매.gg)\\resources\\app\\tfm2_meta_dashboard\\data\\policy_exports\\candidate_map.tsv",
          "C:\\팀파매2 모딩\\1_모딩\\타 모드\\TFM2.gg-installer-ssl-worktree\\tfm2_ai_banpick_probe (팀파매.gg AI 밴픽 보정 애드온 모드)\\candidate_map.tsv"
        ],
        "skipped": [
          {
            "path": "C:\\팀파매2 모딩\\1_모딩\\타 모드\\TFM2.gg-installer-ssl-worktree\\TFM2_Meta_Dashboard_v0.3.3 (팀파매.gg)\\resources\\app\\mods\\tfm2_ai_banpick_probe\\candidate_map.tsv",
            "reason": "parent missing"
          },
          {
            "path": "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Teamfight Manager2\\mods\\tfm2_ai_banpick_probe\\candidate_map.tsv",
            "reason": "parent missing"
          }
        ]
      }
    },
    "policyExportSource": {
      "championTier": {
        "generatedAt": "2026-06-08T21:11:33",
        "save": null,
        "source": "tournament all patches",
        "patch": "all",
        "scope": "tournament",
        "region": "all",
        "role": "all",
        "modelVersion": "tfm2gg-meta-v1",
        "preset": "classic",
        "presetSource": "dashboard setting",
        "weights": {
          "strength": 0.84,
          "draftPressure": 0.16,
          "lowerStrength": 0.88,
          "lowerPressure": 0.12
        },
        "sample": {
          "minSample": 5,
          "mode": "early",
          "reason": "0 matches"
        },
        "sampleVolume": 0.0,
        "winPrior": {
          "mean": 50.0,
          "kappa": 24.0
        },
        "baselinePresence": 0.1,
        "eligibleCount": 0,
        "rowCount": 60,
        "activeRowCount": 60,
        "cleanupRowCount": 12,
        "policyProfiles": {
          "championTier": {
            "tierField": "tier",
            "overallField": "tierOverall",
            "semantic": "dashboard_meta_tier_for_in_game_sabcd_no",
            "anchors": {
              "S": 90.0,
              "A": 75.0,
              "B": 62.0,
              "C": 50.0,
              "D": 35.0
            },
            "note": "overall is an S/A/B/C/D anchor for the native tier addon; No leaves overall blank and is applied as explicit NoTier for active champions."
          },
          "aiChampion": {
            "tierField": "aiTier",
            "overallField": "aiOverall",
            "candidateIndexField": "candidateIndex",
            "semantic": "ai_bias_scaled_from_meta_tier",
            "anchors": {
              "S": 80.0,
              "A": 70.0,
              "B": 60.0,
              "C": 50.0,
              "D": 40.0
            },
            "nativeBiasFormula": "clamp((overall - 50) / 20, -1.5, 1.5)",
            "note": "overall is scaled for AI draft bias so the native addon has a visible but capped effect."
          }
        },
        "activeExternalChampionCount": 0,
        "inactiveExternalCleanupCount": 12,
        "heldPolicyReason": "sample 0/100, eligible 0/27; no mature tournament policy source exists",
        "heldPolicySourceKind": "candidate_no_sample",
        "gate": {
          "mode": "sampleGate",
          "decision": "awaiting_sample",
          "sourceKind": "candidate_no_sample",
          "reason": "sample 0/100, eligible 0/27; no mature tournament policy source exists",
          "requestedPatch": "all",
          "requestedSource": "tournament all patches",
          "effectivePatch": "all",
          "effectiveSource": "tournament all patches",
          "sampleVolume": 0.0,
          "eligibleCount": 0,
          "activeRowCount": 60,
          "eligibleRatio": 0.0,
          "requiredEligibleCount": 27,
          "minMatches": 100,
          "fallbackMatches": 50,
          "minEligibleRatio": 45.0,
          "mature": false
        }
      },
      "aiChampion": {
        "generatedAt": "2026-06-08T21:11:33",
        "save": null,
        "source": "overall all patches",
        "patch": "all",
        "scope": "overall",
        "region": "all",
        "role": "all",
        "modelVersion": "tfm2gg-meta-v1",
        "preset": "classic",
        "presetSource": "dashboard setting",
        "weights": {
          "strength": 0.84,
          "draftPressure": 0.16,
          "lowerStrength": 0.88,
          "lowerPressure": 0.12
        },
        "sample": {
          "minSample": 5,
          "mode": "early",
          "reason": "0 matches"
        },
        "sampleVolume": 0.0,
        "winPrior": {
          "mean": 50.0,
          "kappa": 24.0
        },
        "baselinePresence": 0.1,
        "eligibleCount": 0,
        "rowCount": 60,
        "activeRowCount": 60,
        "cleanupRowCount": 0,
        "policyProfiles": {
          "championTier": {
            "tierField": "tier",
            "overallField": "tierOverall",
            "semantic": "dashboard_meta_tier_for_in_game_sabcd_no",
            "anchors": {
              "S": 90.0,
              "A": 75.0,
              "B": 62.0,
              "C": 50.0,
              "D": 35.0
            },
            "note": "overall is an S/A/B/C/D anchor for the native tier addon; No leaves overall blank and is applied as explicit NoTier for active champions."
          },
          "aiChampion": {
            "tierField": "aiTier",
            "overallField": "aiOverall",
            "candidateIndexField": "candidateIndex",
            "semantic": "ai_bias_scaled_from_meta_tier",
            "anchors": {
              "S": 80.0,
              "A": 70.0,
              "B": 60.0,
              "C": 50.0,
              "D": 40.0
            },
            "nativeBiasFormula": "clamp((overall - 50) / 20, -1.5, 1.5)",
            "note": "overall is scaled for AI draft bias so the native addon has a visible but capped effect."
          }
        },
        "activeExternalChampionCount": 0,
        "customCandidatePolicy": "candidate_map_conditional_fail_closed"
      }
    },
    "leagueSplitMatches": {},
    "soloRegionMatches": {}
  },
  "saveLookup": {
    "teams": {},
    "athletes": {}
  },
  "replayDateInference": {
    "enabled": false,
    "source": "disabled",
    "sets": 0,
    "tournamentSets": 0,
    "soloSets": 0,
    "series": 0,
    "assigned": 0,
    "tournamentAssigned": 0,
    "soloAssigned": 0,
    "unknown": 0,
    "latestKnownDate": null,
    "latestPatchDate": null,
    "daysSincePatch": null,
    "confidence": "none",
    "confidenceCounts": {},
    "assignedBySource": {},
    "patchEvents": []
  },
  "itemCatalog": {
    "source": "C:\\팀파매2 모딩\\1_모딩\\타 모드\\TFM2.gg-installer-ssl-worktree\\TFM2_Meta_Dashboard_v0.3.3 (팀파매.gg)\\resources\\app\\tfm2_meta_dashboard\\data\\item_setting.item_setting",
    "byId": {
      "0": {
        "id": 0,
        "settingId": "iron_blade",
        "key": "ironsword",
        "icon": "t1_0",
        "iconPath": "assets/items/t1_0.png",
        "name": "철검",
        "tier": 0,
        "category": "AD",
        "direction": "AD"
      },
      "1": {
        "id": 1,
        "settingId": "soldiers_longsword",
        "key": "soldiers_longsword",
        "icon": "t2_0",
        "iconPath": "assets/items/t2_0.png",
        "name": "병사의 장검",
        "tier": 1,
        "category": "AD",
        "direction": "AD"
      },
      "2": {
        "id": 2,
        "settingId": "ruinous_blade",
        "key": "ruinous_blade",
        "icon": "t3_0",
        "iconPath": "assets/items/t3_0.png",
        "name": "파멸의 검",
        "tier": 2,
        "category": "AD",
        "direction": "AD"
      },
      "3": {
        "id": 3,
        "settingId": "conquerors_greatsword",
        "key": "conquerors_greatsword",
        "icon": "t4_0",
        "iconPath": "assets/items/t4_0.png",
        "name": "정복자의 대검",
        "tier": 3,
        "category": "AD",
        "direction": "AD"
      },
      "4": {
        "id": 4,
        "settingId": "warlords_final_judgement",
        "key": "warlords_final_judgement",
        "icon": "t5_0",
        "iconPath": "assets/items/t5_0.png",
        "name": "군주의 심판검",
        "tier": 4,
        "category": "AD",
        "direction": "AD"
      },
      "5": {
        "id": 5,
        "settingId": "dagger",
        "key": "dagger",
        "icon": "t1_1",
        "iconPath": "assets/items/t1_1.png",
        "name": "단검",
        "tier": 0,
        "category": "AttackSpeed",
        "direction": "AttackSpeed"
      },
      "6": {
        "id": 6,
        "settingId": "wind_dagger",
        "key": "wind_dagger",
        "icon": "t2_1",
        "iconPath": "assets/items/t2_1.png",
        "name": "바람의 단검",
        "tier": 1,
        "category": "AttackSpeed",
        "direction": "AttackSpeed"
      },
      "7": {
        "id": 7,
        "settingId": "twin_stormblade",
        "key": "twin_stormblade",
        "icon": "t3_1",
        "iconPath": "assets/items/t3_1.png",
        "name": "폭풍의 쌍날",
        "tier": 2,
        "category": "AttackSpeed",
        "direction": "AttackSpeed"
      },
      "8": {
        "id": 8,
        "settingId": "thunderclaw",
        "key": "thunderclaw",
        "icon": "t4_1",
        "iconPath": "assets/items/t4_1.png",
        "name": "번개발톱",
        "tier": 3,
        "category": "AttackSpeed",
        "direction": "AttackSpeed"
      },
      "9": {
        "id": 9,
        "settingId": "storm_sovereign",
        "key": "storm_sovereign",
        "icon": "t5_1",
        "iconPath": "assets/items/t5_1.png",
        "name": "폭풍의 군주",
        "tier": 4,
        "category": "AttackSpeed",
        "direction": "AttackSpeed"
      },
      "10": {
        "id": 10,
        "settingId": "steel_armor",
        "key": "steel_armor",
        "icon": "t1_2",
        "iconPath": "assets/items/t1_2.png",
        "name": "강철 갑옷",
        "tier": 0,
        "category": "Defense",
        "direction": "Defense"
      },
      "11": {
        "id": 11,
        "settingId": "gatekeepers_armor",
        "key": "gatekeepers_armor",
        "icon": "t2_2",
        "iconPath": "assets/items/t2_2.png",
        "name": "문지기의 갑옷",
        "tier": 1,
        "category": "Defense",
        "direction": "Defense"
      },
      "12": {
        "id": 12,
        "settingId": "black_knights_heavy_plate",
        "key": "black_knights_heavy_plate",
        "icon": "t3_2",
        "iconPath": "assets/items/t3_2.png",
        "name": "흑기사의 중갑",
        "tier": 2,
        "category": "Defense",
        "direction": "Defense"
      },
      "13": {
        "id": 13,
        "settingId": "eternal_iron_plate",
        "key": "eternal_iron_plate",
        "icon": "t4_2",
        "iconPath": "assets/items/t4_2.png",
        "name": "영원의 철갑",
        "tier": 3,
        "category": "Defense",
        "direction": "Defense"
      },
      "14": {
        "id": 14,
        "settingId": "impregnable_fortress",
        "key": "impregnable_fortress",
        "icon": "t5_2",
        "iconPath": "assets/items/t5_2.png",
        "name": "난공불락의 요새",
        "tier": 4,
        "category": "Defense",
        "direction": "Defense"
      },
      "15": {
        "id": 15,
        "settingId": "mystic_cloak",
        "key": "mystic_cloak",
        "icon": "t1_3",
        "iconPath": "assets/items/t1_3.png",
        "name": "마법의 망토",
        "tier": 0,
        "category": "MagicResistance",
        "direction": "MagicResistance"
      },
      "16": {
        "id": 16,
        "settingId": "night_hood",
        "key": "night_hood",
        "icon": "t2_3",
        "iconPath": "assets/items/t2_3.png",
        "name": "밤의 두건",
        "tier": 1,
        "category": "MagicResistance",
        "direction": "MagicResistance"
      },
      "17": {
        "id": 17,
        "settingId": "dusk_raven",
        "key": "dusk_raven",
        "icon": "t3_3",
        "iconPath": "assets/items/t3_3.png",
        "name": "어스름 까마귀",
        "tier": 2,
        "category": "MagicResistance",
        "direction": "MagicResistance"
      },
      "18": {
        "id": 18,
        "settingId": "souls_edge",
        "key": "souls_edge",
        "icon": "t4_3",
        "iconPath": "assets/items/t4_3.png",
        "name": "영혼의 경계",
        "tier": 3,
        "category": "MagicResistance",
        "direction": "MagicResistance"
      },
      "19": {
        "id": 19,
        "settingId": "veil_of_annihilation",
        "key": "veil_of_annihilation",
        "icon": "t5_3",
        "iconPath": "assets/items/t5_3.png",
        "name": "절멸의 장막",
        "tier": 4,
        "category": "MagicResistance",
        "direction": "MagicResistance"
      },
      "20": {
        "id": 20,
        "settingId": "arcane_crystal",
        "key": "arcane_crystal",
        "icon": "t1_4",
        "iconPath": "assets/items/t1_4.png",
        "name": "마력의 수정",
        "tier": 0,
        "category": "Magic",
        "direction": "Magic"
      },
      "21": {
        "id": 21,
        "settingId": "spirit_crystal",
        "key": "spirit_crystal",
        "icon": "t2_4",
        "iconPath": "assets/items/t2_4.png",
        "name": "정령의 결정",
        "tier": 1,
        "category": "Magic",
        "direction": "Magic"
      },
      "22": {
        "id": 22,
        "settingId": "staff_of_rapture",
        "key": "staff_of_rapture",
        "icon": "t3_4",
        "iconPath": "assets/items/t3_4.png",
        "name": "도취의 지팡이",
        "tier": 2,
        "category": "Magic",
        "direction": "Magic"
      },
      "23": {
        "id": 23,
        "settingId": "angels_fang",
        "key": "angels_fang",
        "icon": "t4_4",
        "iconPath": "assets/items/t4_4.png",
        "name": "천사의 송곳니",
        "tier": 3,
        "category": "Magic",
        "direction": "Magic"
      },
      "24": {
        "id": 24,
        "settingId": "prophet_of_the_abyss",
        "key": "prophet_of_the_abyss",
        "icon": "t5_4",
        "iconPath": "assets/items/t5_4.png",
        "name": "심연의 예언자",
        "tier": 4,
        "category": "Magic",
        "direction": "Magic"
      },
      "25": {
        "id": 25,
        "settingId": "vital_orb",
        "key": "vital_orb",
        "icon": "t1_5",
        "iconPath": "assets/items/t1_5.png",
        "name": "생명의 구슬",
        "tier": 0,
        "category": "Hp",
        "direction": "Hp"
      },
      "26": {
        "id": 26,
        "settingId": "hardened_heart",
        "key": "hardened_heart",
        "icon": "t2_5",
        "iconPath": "assets/items/t2_5.png",
        "name": "굳은 심장",
        "tier": 1,
        "category": "Hp",
        "direction": "Hp"
      },
      "27": {
        "id": 27,
        "settingId": "ring_of_reincarnation",
        "key": "ring_of_reincarnation",
        "icon": "t3_5",
        "iconPath": "assets/items/t3_5.png",
        "name": "윤회의 고리",
        "tier": 2,
        "category": "Hp",
        "direction": "Hp"
      },
      "28": {
        "id": 28,
        "settingId": "hourglass_of_eternity",
        "key": "hourglass_of_eternity",
        "icon": "t4_5",
        "iconPath": "assets/items/t4_5.png",
        "name": "억겁의 모래시계",
        "tier": 3,
        "category": "Hp",
        "direction": "Hp"
      },
      "29": {
        "id": 29,
        "settingId": "giants_horn_shard",
        "key": "giants_horn_shard",
        "icon": "t5_5",
        "iconPath": "assets/items/t5_5.png",
        "name": "거인의 뿔조각",
        "tier": 4,
        "category": "Hp",
        "direction": "Hp"
      }
    },
    "byIcon": {
      "t1_0": {
        "id": 0,
        "settingId": "iron_blade",
        "key": "ironsword",
        "icon": "t1_0",
        "iconPath": "assets/items/t1_0.png",
        "name": "철검",
        "tier": 0,
        "category": "AD",
        "direction": "AD"
      },
      "t2_0": {
        "id": 1,
        "settingId": "soldiers_longsword",
        "key": "soldiers_longsword",
        "icon": "t2_0",
        "iconPath": "assets/items/t2_0.png",
        "name": "병사의 장검",
        "tier": 1,
        "category": "AD",
        "direction": "AD"
      },
      "t3_0": {
        "id": 2,
        "settingId": "ruinous_blade",
        "key": "ruinous_blade",
        "icon": "t3_0",
        "iconPath": "assets/items/t3_0.png",
        "name": "파멸의 검",
        "tier": 2,
        "category": "AD",
        "direction": "AD"
      },
      "t4_0": {
        "id": 3,
        "settingId": "conquerors_greatsword",
        "key": "conquerors_greatsword",
        "icon": "t4_0",
        "iconPath": "assets/items/t4_0.png",
        "name": "정복자의 대검",
        "tier": 3,
        "category": "AD",
        "direction": "AD"
      },
      "t5_0": {
        "id": 4,
        "settingId": "warlords_final_judgement",
        "key": "warlords_final_judgement",
        "icon": "t5_0",
        "iconPath": "assets/items/t5_0.png",
        "name": "군주의 심판검",
        "tier": 4,
        "category": "AD",
        "direction": "AD"
      },
      "t1_1": {
        "id": 5,
        "settingId": "dagger",
        "key": "dagger",
        "icon": "t1_1",
        "iconPath": "assets/items/t1_1.png",
        "name": "단검",
        "tier": 0,
        "category": "AttackSpeed",
        "direction": "AttackSpeed"
      },
      "t2_1": {
        "id": 6,
        "settingId": "wind_dagger",
        "key": "wind_dagger",
        "icon": "t2_1",
        "iconPath": "assets/items/t2_1.png",
        "name": "바람의 단검",
        "tier": 1,
        "category": "AttackSpeed",
        "direction": "AttackSpeed"
      },
      "t3_1": {
        "id": 7,
        "settingId": "twin_stormblade",
        "key": "twin_stormblade",
        "icon": "t3_1",
        "iconPath": "assets/items/t3_1.png",
        "name": "폭풍의 쌍날",
        "tier": 2,
        "category": "AttackSpeed",
        "direction": "AttackSpeed"
      },
      "t4_1": {
        "id": 8,
        "settingId": "thunderclaw",
        "key": "thunderclaw",
        "icon": "t4_1",
        "iconPath": "assets/items/t4_1.png",
        "name": "번개발톱",
        "tier": 3,
        "category": "AttackSpeed",
        "direction": "AttackSpeed"
      },
      "t5_1": {
        "id": 9,
        "settingId": "storm_sovereign",
        "key": "storm_sovereign",
        "icon": "t5_1",
        "iconPath": "assets/items/t5_1.png",
        "name": "폭풍의 군주",
        "tier": 4,
        "category": "AttackSpeed",
        "direction": "AttackSpeed"
      },
      "t1_2": {
        "id": 10,
        "settingId": "steel_armor",
        "key": "steel_armor",
        "icon": "t1_2",
        "iconPath": "assets/items/t1_2.png",
        "name": "강철 갑옷",
        "tier": 0,
        "category": "Defense",
        "direction": "Defense"
      },
      "t2_2": {
        "id": 11,
        "settingId": "gatekeepers_armor",
        "key": "gatekeepers_armor",
        "icon": "t2_2",
        "iconPath": "assets/items/t2_2.png",
        "name": "문지기의 갑옷",
        "tier": 1,
        "category": "Defense",
        "direction": "Defense"
      },
      "t3_2": {
        "id": 12,
        "settingId": "black_knights_heavy_plate",
        "key": "black_knights_heavy_plate",
        "icon": "t3_2",
        "iconPath": "assets/items/t3_2.png",
        "name": "흑기사의 중갑",
        "tier": 2,
        "category": "Defense",
        "direction": "Defense"
      },
      "t4_2": {
        "id": 13,
        "settingId": "eternal_iron_plate",
        "key": "eternal_iron_plate",
        "icon": "t4_2",
        "iconPath": "assets/items/t4_2.png",
        "name": "영원의 철갑",
        "tier": 3,
        "category": "Defense",
        "direction": "Defense"
      },
      "t5_2": {
        "id": 14,
        "settingId": "impregnable_fortress",
        "key": "impregnable_fortress",
        "icon": "t5_2",
        "iconPath": "assets/items/t5_2.png",
        "name": "난공불락의 요새",
        "tier": 4,
        "category": "Defense",
        "direction": "Defense"
      },
      "t1_3": {
        "id": 15,
        "settingId": "mystic_cloak",
        "key": "mystic_cloak",
        "icon": "t1_3",
        "iconPath": "assets/items/t1_3.png",
        "name": "마법의 망토",
        "tier": 0,
        "category": "MagicResistance",
        "direction": "MagicResistance"
      },
      "t2_3": {
        "id": 16,
        "settingId": "night_hood",
        "key": "night_hood",
        "icon": "t2_3",
        "iconPath": "assets/items/t2_3.png",
        "name": "밤의 두건",
        "tier": 1,
        "category": "MagicResistance",
        "direction": "MagicResistance"
      },
      "t3_3": {
        "id": 17,
        "settingId": "dusk_raven",
        "key": "dusk_raven",
        "icon": "t3_3",
        "iconPath": "assets/items/t3_3.png",
        "name": "어스름 까마귀",
        "tier": 2,
        "category": "MagicResistance",
        "direction": "MagicResistance"
      },
      "t4_3": {
        "id": 18,
        "settingId": "souls_edge",
        "key": "souls_edge",
        "icon": "t4_3",
        "iconPath": "assets/items/t4_3.png",
        "name": "영혼의 경계",
        "tier": 3,
        "category": "MagicResistance",
        "direction": "MagicResistance"
      },
      "t5_3": {
        "id": 19,
        "settingId": "veil_of_annihilation",
        "key": "veil_of_annihilation",
        "icon": "t5_3",
        "iconPath": "assets/items/t5_3.png",
        "name": "절멸의 장막",
        "tier": 4,
        "category": "MagicResistance",
        "direction": "MagicResistance"
      },
      "t1_4": {
        "id": 20,
        "settingId": "arcane_crystal",
        "key": "arcane_crystal",
        "icon": "t1_4",
        "iconPath": "assets/items/t1_4.png",
        "name": "마력의 수정",
        "tier": 0,
        "category": "Magic",
        "direction": "Magic"
      },
      "t2_4": {
        "id": 21,
        "settingId": "spirit_crystal",
        "key": "spirit_crystal",
        "icon": "t2_4",
        "iconPath": "assets/items/t2_4.png",
        "name": "정령의 결정",
        "tier": 1,
        "category": "Magic",
        "direction": "Magic"
      },
      "t3_4": {
        "id": 22,
        "settingId": "staff_of_rapture",
        "key": "staff_of_rapture",
        "icon": "t3_4",
        "iconPath": "assets/items/t3_4.png",
        "name": "도취의 지팡이",
        "tier": 2,
        "category": "Magic",
        "direction": "Magic"
      },
      "t4_4": {
        "id": 23,
        "settingId": "angels_fang",
        "key": "angels_fang",
        "icon": "t4_4",
        "iconPath": "assets/items/t4_4.png",
        "name": "천사의 송곳니",
        "tier": 3,
        "category": "Magic",
        "direction": "Magic"
      },
      "t5_4": {
        "id": 24,
        "settingId": "prophet_of_the_abyss",
        "key": "prophet_of_the_abyss",
        "icon": "t5_4",
        "iconPath": "assets/items/t5_4.png",
        "name": "심연의 예언자",
        "tier": 4,
        "category": "Magic",
        "direction": "Magic"
      },
      "t1_5": {
        "id": 25,
        "settingId": "vital_orb",
        "key": "vital_orb",
        "icon": "t1_5",
        "iconPath": "assets/items/t1_5.png",
        "name": "생명의 구슬",
        "tier": 0,
        "category": "Hp",
        "direction": "Hp"
      },
      "t2_5": {
        "id": 26,
        "settingId": "hardened_heart",
        "key": "hardened_heart",
        "icon": "t2_5",
        "iconPath": "assets/items/t2_5.png",
        "name": "굳은 심장",
        "tier": 1,
        "category": "Hp",
        "direction": "Hp"
      },
      "t3_5": {
        "id": 27,
        "settingId": "ring_of_reincarnation",
        "key": "ring_of_reincarnation",
        "icon": "t3_5",
        "iconPath": "assets/items/t3_5.png",
        "name": "윤회의 고리",
        "tier": 2,
        "category": "Hp",
        "direction": "Hp"
      },
      "t4_5": {
        "id": 28,
        "settingId": "hourglass_of_eternity",
        "key": "hourglass_of_eternity",
        "icon": "t4_5",
        "iconPath": "assets/items/t4_5.png",
        "name": "억겁의 모래시계",
        "tier": 3,
        "category": "Hp",
        "direction": "Hp"
      },
      "t5_5": {
        "id": 29,
        "settingId": "giants_horn_shard",
        "key": "giants_horn_shard",
        "icon": "t5_5",
        "iconPath": "assets/items/t5_5.png",
        "name": "거인의 뿔조각",
        "tier": 4,
        "category": "Hp",
        "direction": "Hp"
      }
    }
  },
  "leagueMeta": {
    "leagues": [],
    "regions": [],
    "divisions": [
      {
        "key": "1",
        "label": "1부"
      },
      {
        "key": "2",
        "label": "2부"
      }
    ],
    "competitions": [
      {
        "key": "league_regular",
        "label": "리그전"
      },
      {
        "key": "league_playoff",
        "label": "플레이오프"
      },
      {
        "key": "international",
        "label": "국제전"
      },
      {
        "key": "solo_rank",
        "label": "솔로랭크"
      },
      {
        "key": "unknown",
        "label": "미확인"
      }
    ],
    "counts": {
      "league": {},
      "region": {},
      "division": {},
      "regionDivision": {},
      "competition": {}
    }
  },
  "patches": [],
  "currentPatch": {
    "meta": {
      "source": null,
      "versions": [],
      "changeCount": 0
    },
    "patches": {},
    "changes": []
  },
  "champions": [
    {
      "id": "vampire",
      "name": "흡혈귀",
      "category": "Magician",
      "tags": [
        "AP",
        "Heal",
        "Magic",
        "Magician",
        "Mobility",
        "Shield"
      ],
      "rawTags": [
        "AP",
        "Heal",
        "Magic"
      ],
      "description": {
        "skill": "적의 피를 흡수하여 50 + 주문력의 {Coef}% 만큼의 마법 피해를 입히고 체력을 60 회복하며 스택을 쌓는다. 매 스택당 체력 회복량이 {Stack} 증가한다.",
        "skill2": "자신의 체력을 {Value}% 소모하여 전방 부채꼴 범위에 피를 내뿜어 50 + 주문력의 4% 만큼의 마법 피해를 입힌다. 매 스택당 피해량이 {Stack}만큼 증가한다.",
        "ult": "대상 지정 불가 상태가 되어 120 거리를 돌진하며 돌진하는 궤적 내에 있는 각 적으로부터 300 + 주문력의 {Coef}% 만큼 체력을 흡수하고, 200 + 주문력의 {DamageCoef}% 만큼의 마법 피해를 입힌다."
      },
      "stats": {
        "attack": 100,
        "magicPower": 10,
        "hp": 1000,
        "defence": 30,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.86,
        "range": 25
      },
      "growth": {
        "attack": 20,
        "magicPower": 5,
        "hp": 100,
        "defence": 9,
        "magicResistance": 4,
        "moveSpeedDisplay": 0.72,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "vampire_1",
          "cooltime": "2.00",
          "description": "적의 피를 흡수하여 50 + 주문력의 {Coef}% 만큼의 마법 피해를 입히고 체력을 60 회복하며 스택을 쌓는다. 매 스택당 체력 회복량이 {Stack} 증가한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "vampire_2",
          "cooltime": "4.00",
          "description": "자신의 체력을 {Value}% 소모하여 전방 부채꼴 범위에 피를 내뿜어 50 + 주문력의 4% 만큼의 마법 피해를 입힌다. 매 스택당 피해량이 {Stack}만큼 증가한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "vampire_4",
          "cooltime": "40.00",
          "description": "대상 지정 불가 상태가 되어 120 거리를 돌진하며 돌진하는 궤적 내에 있는 각 적으로부터 300 + 주문력의 {Coef}% 만큼 체력을 흡수하고, 200 + 주문력의 {DamageCoef}% 만큼의 마법 피해를 입힌다."
        }
      ],
      "metrics": {
        "damage": 146.9,
        "durability": 162.0,
        "utility": 35.2,
        "scaling": 69.5,
        "mobility": 40.0,
        "cc": 0.0,
        "heal": 440.0,
        "shield": 0.0,
        "damageNorm": 71.6,
        "durabilityNorm": 45.4,
        "utilityNorm": 73.3,
        "scalingNorm": 87.2,
        "mobilityNorm": 89.8
      },
      "roleFit": {
        "top": 34.8,
        "jungle": 24.2,
        "mid": 100,
        "bot": 42.1,
        "support": 49.0
      },
      "bestRole": "mid",
      "asset": {
        "sheet": "assets/champions/vampire.png",
        "sheetWidth": 2624,
        "sheetHeight": 90,
        "frame": {
          "x": 30,
          "y": 0,
          "w": 25,
          "h": 51
        }
      },
      "overall": 77.2,
      "tier": "A",
      "candidateIndex": 24
    },
    {
      "id": "monk",
      "name": "몽크",
      "category": "Util",
      "tags": [
        "AOE",
        "AP",
        "CC",
        "Frontline",
        "Heal",
        "Magic",
        "Mobility",
        "Shield",
        "Tank",
        "Util"
      ],
      "rawTags": [
        "AP",
        "Heal",
        "Shield",
        "Tank",
        "CC",
        "Magic"
      ],
      "description": {
        "skill": "주변 80 범위 내 아군을 100 + 주문력의 50% 만큼 회복시킨다. 자신만 회복할 경우 회복량이 200 + 주문력의 50%로 상승한다.",
        "skill2": "손바닥을 내리쳐 80 범위 내의 상대에게 30 + 주문력의 100% 만큼의 마법 피해를 입히고 1.00초 동안 기절시킨다.",
        "ult": "주변 76 범위 내의 아군에게 500 + 주문력의 50% 만큼의 보호막을 부여한다. 보호막을 부여받은 아군은 이동속도가 30% 증가한다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 20,
        "hp": 1100,
        "defence": 40,
        "magicResistance": 30,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.67,
        "range": 23
      },
      "growth": {
        "attack": 6,
        "magicPower": 10,
        "hp": 120,
        "defence": 7,
        "magicResistance": 5,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "monk_1",
          "cooltime": null,
          "description": "주변 80 범위 내 아군을 100 + 주문력의 50% 만큼 회복시킨다. 자신만 회복할 경우 회복량이 200 + 주문력의 50%로 상승한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "monk_2",
          "cooltime": "4.00",
          "description": "손바닥을 내리쳐 80 범위 내의 상대에게 30 + 주문력의 100% 만큼의 마법 피해를 입히고 1.00초 동안 기절시킨다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "monk_4",
          "cooltime": "60.00",
          "description": "주변 76 범위 내의 아군에게 500 + 주문력의 50% 만큼의 보호막을 부여한다. 보호막을 부여받은 아군은 이동속도가 30% 증가한다."
        }
      ],
      "metrics": {
        "damage": 102.88,
        "durability": 226.0,
        "utility": 48.0,
        "scaling": 53.5,
        "mobility": 40.0,
        "cc": 0.0,
        "heal": 100.0,
        "shield": 500.0,
        "damageNorm": 32.9,
        "durabilityNorm": 100.0,
        "utilityNorm": 100.0,
        "scalingNorm": 40.9,
        "mobilityNorm": 89.8
      },
      "roleFit": {
        "top": 34,
        "jungle": 20.2,
        "mid": 34.8,
        "bot": 30.0,
        "support": 100
      },
      "bestRole": "support",
      "asset": {
        "sheet": "assets/champions/monk.png",
        "sheetWidth": 2532,
        "sheetHeight": 164,
        "frame": {
          "x": 26,
          "y": 0,
          "w": 27,
          "h": 51
        }
      },
      "overall": 74.1,
      "tier": "A",
      "candidateIndex": 7
    },
    {
      "id": "circus_blade",
      "name": "곡예사",
      "category": "Assassin",
      "tags": [
        "AD",
        "AOE",
        "Assassin",
        "CC",
        "Mobility",
        "Poke"
      ],
      "rawTags": [
        "AD"
      ],
      "description": {
        "skill": "지정 방향으로 칼날을 발사하여 적에게 60 + 공격력의 80% 만큼의 물리 피해를 입히고 0.50초 동안 30% 둔화시킨다. 최대 2회 충전되며, 적 챔피언에게 기본 공격 적중 시 1회 충전된다.",
        "skill2": "0.07초 동안 이동속도 30%, 공격속도 30% 증가 및 벽 통과 효과를 얻는다.",
        "ult": "지정한 적에게 돌진하여 200 + 공격력의 150% 만큼의 물리 피해를 입힌다. 주변 적에게 {SplashDamage} + 공격력의 {SplashCoef}% 만큼의 범위 피해와 넉백을 부여하고 사라진다."
      },
      "stats": {
        "attack": 120,
        "magicPower": 0,
        "hp": 900,
        "defence": 25,
        "magicResistance": 15,
        "moveSpeed": 1100,
        "moveSpeedDisplay": 66.0,
        "attackSpeed": 1.2,
        "range": 23
      },
      "growth": {
        "attack": 30,
        "magicPower": 0,
        "hp": 80,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.84,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "circus_blade_1",
          "cooltime": "6.00",
          "description": "지정 방향으로 칼날을 발사하여 적에게 60 + 공격력의 80% 만큼의 물리 피해를 입히고 0.50초 동안 30% 둔화시킨다. 최대 2회 충전되며, 적 챔피언에게 기본 공격 적중 시 1회 충전된다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "circus_blade_2",
          "cooltime": "8.00",
          "description": "0.07초 동안 이동속도 30%, 공격속도 30% 증가 및 벽 통과 효과를 얻는다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "circus_blade_4",
          "cooltime": "50.00",
          "description": "지정한 적에게 돌진하여 200 + 공격력의 150% 만큼의 물리 피해를 입힌다. 주변 적에게 {SplashDamage} + 공격력의 {SplashCoef}% 만큼의 범위 피해와 넉백을 부여하고 사라진다."
        }
      ],
      "metrics": {
        "damage": 171.6,
        "durability": 117.75,
        "utility": 10.6,
        "scaling": 73.1,
        "mobility": 41.5,
        "cc": 30.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 93.3,
        "durabilityNorm": 7.7,
        "utilityNorm": 22.1,
        "scalingNorm": 97.7,
        "mobilityNorm": 94.9
      },
      "roleFit": {
        "top": 38.3,
        "jungle": 96.9,
        "mid": 90.7,
        "bot": 30.1,
        "support": 15.5
      },
      "bestRole": "jungle",
      "asset": {
        "sheet": "assets/champions/circus_blade.png",
        "sheetWidth": 2346,
        "sheetHeight": 78,
        "frame": {
          "x": 28,
          "y": 0,
          "w": 27,
          "h": 47
        }
      },
      "overall": 68.2,
      "tier": "B",
      "candidateIndex": 59
    },
    {
      "id": "android",
      "name": "안드로이드",
      "category": "Melee",
      "tags": [
        "AD",
        "AOE",
        "CC",
        "Frontline",
        "Melee",
        "Mobility",
        "Poke",
        "Shield",
        "Tank"
      ],
      "rawTags": [
        "AD",
        "Tank",
        "CC"
      ],
      "description": {
        "skill": "일직선으로 충격파를 발사한다. 충격파는 적에게 적중하거나 사거리 끝에 도달시 원형으로 폭발하며, 범위 내의 적에게 100 + 공격력의 100% 만큼의 물리 피해를 입히며 1.00초 동안 30% 둔화를 부여한다.",
        "skill2": "1.00초 동안 유지되는 300 + 최대 체력의 {Coef}% 만큼의 보호막을 자신에게 부여한다. 보호막은 없어질 때 주변 35 범위 내에 있는 적을 1.00초 동안 기절시킨다.",
        "ult": "960 범위 내에 있는 지정된 아군에게 500 + 최대 체력의 {Coef}% 만큼의 보호막을 부여하며, {Time}초 후 지정된 아군에게로 순간이동한다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 0,
        "hp": 1100,
        "defence": 40,
        "magicResistance": 30,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.86,
        "range": 25
      },
      "growth": {
        "attack": 6,
        "magicPower": 0,
        "hp": 120,
        "defence": 10,
        "magicResistance": 5,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "android_1",
          "cooltime": "4.00",
          "description": "일직선으로 충격파를 발사한다. 충격파는 적에게 적중하거나 사거리 끝에 도달시 원형으로 폭발하며, 범위 내의 적에게 100 + 공격력의 100% 만큼의 물리 피해를 입히며 1.00초 동안 30% 둔화를 부여한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "android_2",
          "cooltime": "4.00",
          "description": "1.00초 동안 유지되는 300 + 최대 체력의 {Coef}% 만큼의 보호막을 자신에게 부여한다. 보호막은 없어질 때 주변 35 범위 내에 있는 적을 1.00초 동안 기절시킨다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "android_4",
          "cooltime": "50.00",
          "description": "960 범위 내에 있는 지정된 아군에게 500 + 최대 체력의 {Coef}% 만큼의 보호막을 부여하며, {Time}초 후 지정된 아군에게로 순간이동한다."
        }
      ],
      "metrics": {
        "damage": 101.48,
        "durability": 221.0,
        "utility": 47.0,
        "scaling": 39.4,
        "mobility": 40.0,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 500.0,
        "damageNorm": 31.7,
        "durabilityNorm": 95.7,
        "utilityNorm": 97.9,
        "scalingNorm": 0.0,
        "mobilityNorm": 89.8
      },
      "roleFit": {
        "top": 98.7,
        "jungle": 62.2,
        "mid": 29.9,
        "bot": 23.1,
        "support": 61.2
      },
      "bestRole": "top",
      "asset": {
        "sheet": "assets/champions/android.png",
        "sheetWidth": 2022,
        "sheetHeight": 97,
        "frame": {
          "x": 24,
          "y": 0,
          "w": 23,
          "h": 47
        }
      },
      "overall": 65.8,
      "tier": "B",
      "candidateIndex": 48
    },
    {
      "id": "inquisitor",
      "name": "이단심문관",
      "category": "Assassin",
      "tags": [
        "AD",
        "AOE",
        "Assassin",
        "Mobility"
      ],
      "rawTags": [
        "AD"
      ],
      "description": {
        "skill": "짧은 거리를 돌진하여 처음으로 적중한 적에게 50 + 공격력의 70% 만큼의 물리 피해를 입히고 출혈 효과를 적용한다.",
        "skill2": "지정한 적을 베어 50 + 공격력의 100% 만큼의 물리 피해를 입힌다. 적이 출혈 중인 경우 기술1의 재사용 대기시간이 초기화된다.",
        "ult": "전방의 적 챔피언에게 돌진하여, 도착 지점 주변의 모든 적에게 150 + 공격력의 100% 만큼의 물리 피해를 입힌다. 피해를 입은 후 체력이 최대 체력의 {Threshold}% 이하인 적은 처형당하며, 처형에 성공하면 해당 적 주변의 적들이 1.00초 동안 공포에 빠진다."
      },
      "stats": {
        "attack": 120,
        "magicPower": 0,
        "hp": 900,
        "defence": 25,
        "magicResistance": 15,
        "moveSpeed": 1100,
        "moveSpeedDisplay": 66.0,
        "attackSpeed": 1.2,
        "range": 25
      },
      "growth": {
        "attack": 30,
        "magicPower": 0,
        "hp": 80,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.84,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "inquisitor_1",
          "cooltime": "8.00",
          "description": "짧은 거리를 돌진하여 처음으로 적중한 적에게 50 + 공격력의 70% 만큼의 물리 피해를 입히고 출혈 효과를 적용한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "inquisitor_2",
          "cooltime": "5.00",
          "description": "지정한 적을 베어 50 + 공격력의 100% 만큼의 물리 피해를 입힌다. 적이 출혈 중인 경우 기술1의 재사용 대기시간이 초기화된다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "inquisitor_4",
          "cooltime": "40.00",
          "description": "전방의 적 챔피언에게 돌진하여, 도착 지점 주변의 모든 적에게 150 + 공격력의 100% 만큼의 물리 피해를 입힌다. 피해를 입은 후 체력이 최대 체력의 {Threshold}% 이하인 적은 처형당하며, 처형에 성공하면 해당 적 주변의 적들이 1.00초 동안 공포에 빠진다."
        }
      ],
      "metrics": {
        "damage": 172.2,
        "durability": 117.75,
        "utility": 0.0,
        "scaling": 73.1,
        "mobility": 41.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 93.8,
        "durabilityNorm": 7.7,
        "utilityNorm": 0.0,
        "scalingNorm": 97.7,
        "mobilityNorm": 94.9
      },
      "roleFit": {
        "top": 38.3,
        "jungle": 96.6,
        "mid": 90.4,
        "bot": 30.1,
        "support": 10.0
      },
      "bestRole": "jungle",
      "asset": {
        "sheet": "assets/champions/inquisitor.png",
        "sheetWidth": 2070,
        "sheetHeight": 70,
        "frame": {
          "x": 34,
          "y": 0,
          "w": 33,
          "h": 47
        }
      },
      "overall": 63.9,
      "tier": "B",
      "candidateIndex": 27
    },
    {
      "id": "lancer",
      "name": "창술사",
      "category": "Melee",
      "tags": [
        "AD",
        "AOE",
        "CC",
        "Frontline",
        "Melee",
        "Mobility"
      ],
      "rawTags": [
        "AD"
      ],
      "description": {
        "skill": "주변 35 범위의 적들을 밀쳐내며 120 + 공격력의 90% 만큼의 물리 피해를 입힌다.",
        "skill2": "짧은 거리를 돌진하여 적에게 100 + 공격력의 {Value}% 만큼의 물리 피해를 입히며 적을 관통하여 등 뒤로 이동한다.",
        "ult": "120 거리를 돌진하며, 돌진하면서 부딪치는 모든 적에게 150 + 공격력의 100% 만큼의 물리 피해를 입히고, 0.67초 동안 에어본시킨다."
      },
      "stats": {
        "attack": 100,
        "magicPower": 0,
        "hp": 1000,
        "defence": 30,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 1.0,
        "range": 30
      },
      "growth": {
        "attack": 20,
        "magicPower": 0,
        "hp": 100,
        "defence": 7,
        "magicResistance": 4,
        "moveSpeedDisplay": 0.72,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "lancer_1",
          "cooltime": "4.00",
          "description": "주변 35 범위의 적들을 밀쳐내며 120 + 공격력의 90% 만큼의 물리 피해를 입힌다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "lancer_2",
          "cooltime": "5.00",
          "description": "짧은 거리를 돌진하여 적에게 100 + 공격력의 {Value}% 만큼의 물리 피해를 입히며 적을 관통하여 등 뒤로 이동한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "lancer_4",
          "cooltime": "50.00",
          "description": "120 거리를 돌진하며, 돌진하면서 부딪치는 모든 적에게 150 + 공격력의 100% 만큼의 물리 피해를 입히고, 0.67초 동안 에어본시킨다."
        }
      ],
      "metrics": {
        "damage": 179.2,
        "durability": 152.0,
        "utility": 4.8,
        "scaling": 57.9,
        "mobility": 40.0,
        "cc": 40.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 100.0,
        "durabilityNorm": 36.9,
        "utilityNorm": 10.0,
        "scalingNorm": 53.6,
        "mobilityNorm": 89.8
      },
      "roleFit": {
        "top": 89.3,
        "jungle": 66.1,
        "mid": 34.1,
        "bot": 29.6,
        "support": 35.2
      },
      "bestRole": "top",
      "asset": {
        "sheet": "assets/champions/lancer.png",
        "sheetWidth": 3523,
        "sheetHeight": 74,
        "frame": {
          "x": 22,
          "y": 0,
          "w": 51,
          "h": 47
        }
      },
      "overall": 62.6,
      "tier": "B",
      "candidateIndex": 14
    },
    {
      "id": "ninja",
      "name": "닌자",
      "category": "Assassin",
      "tags": [
        "AD",
        "Assassin",
        "Mobility",
        "Poke"
      ],
      "rawTags": [
        "AD"
      ],
      "description": {
        "skill": "그림자 구체를 발사하여 적중한 적에게 돌진하며 40 + 공격력의 100% 만큼의 물리 피해를 입힌다.",
        "skill2": "지정된 적을 향해 짧은 거리를 돌진하며 대상 지정 불가 상태가 되어 연달아 세 번 공격한다. 매 공격당 50 + 공격력의 70% 만큼의 물리 피해를 입힌다.",
        "ult": "350 거리 내에 있는 적에게 돌진하여 80 + 공격력의 150% 만큼의 물리 피해를 입힌다."
      },
      "stats": {
        "attack": 120,
        "magicPower": 0,
        "hp": 900,
        "defence": 25,
        "magicResistance": 15,
        "moveSpeed": 1100,
        "moveSpeedDisplay": 66.0,
        "attackSpeed": 1.2,
        "range": 23
      },
      "growth": {
        "attack": 30,
        "magicPower": 0,
        "hp": 80,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.84,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "ninja_1",
          "cooltime": "5.00",
          "description": "그림자 구체를 발사하여 적중한 적에게 돌진하며 40 + 공격력의 100% 만큼의 물리 피해를 입힌다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "ninja_2",
          "cooltime": "5.00",
          "description": "지정된 적을 향해 짧은 거리를 돌진하며 대상 지정 불가 상태가 되어 연달아 세 번 공격한다. 매 공격당 50 + 공격력의 70% 만큼의 물리 피해를 입힌다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "ninja_4",
          "cooltime": "50.00",
          "description": "350 거리 내에 있는 적에게 돌진하여 80 + 공격력의 150% 만큼의 물리 피해를 입힌다."
        }
      ],
      "metrics": {
        "damage": 148.8,
        "durability": 117.75,
        "utility": 7.0,
        "scaling": 73.1,
        "mobility": 41.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 73.3,
        "durabilityNorm": 7.7,
        "utilityNorm": 14.6,
        "scalingNorm": 97.7,
        "mobilityNorm": 94.9
      },
      "roleFit": {
        "top": 37.4,
        "jungle": 95.5,
        "mid": 89.2,
        "bot": 28.5,
        "support": 10.6
      },
      "bestRole": "jungle",
      "asset": {
        "sheet": "assets/champions/ninja.png",
        "sheetWidth": 4096,
        "sheetHeight": 125,
        "frame": {
          "x": 42,
          "y": 0,
          "w": 41,
          "h": 41
        }
      },
      "overall": 61.8,
      "tier": "B",
      "candidateIndex": 10
    },
    {
      "id": "fighter",
      "name": "격투가",
      "category": "Melee",
      "tags": [
        "AD",
        "AOE",
        "CC",
        "Frontline",
        "Melee",
        "Mobility",
        "Tank"
      ],
      "rawTags": [
        "AD",
        "Tank",
        "CC"
      ],
      "description": {
        "skill": "80 거리 내 대상에게 3200 속도로 돌진하여 50 + 공격력의 70% 만큼의 물리 피해를 입힌 후 1.00초 동안 기절시킨다.",
        "skill2": "발로 바닥을 강하게 내려찍어 주변 45 범위 내 모든 적에게 40 + 공격력의 60% 만큼의 물리 피해를 입힌 후 1.00초 동안 60% 둔화를 부여한다.",
        "ult": "바닥을 내리찍어 주변 70 범위 내의 모든 적에게 120 + 공격력의 80% 만큼의 물리 피해를 입히고 1.00초 동안 에어본시킨다."
      },
      "stats": {
        "attack": 100,
        "magicPower": 0,
        "hp": 950,
        "defence": 30,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.86,
        "range": 23
      },
      "growth": {
        "attack": 20,
        "magicPower": 0,
        "hp": 90,
        "defence": 9,
        "magicResistance": 4,
        "moveSpeedDisplay": 0.72,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "fighter_1",
          "cooltime": "5.00",
          "description": "80 거리 내 대상에게 3200 속도로 돌진하여 50 + 공격력의 70% 만큼의 물리 피해를 입힌 후 1.00초 동안 기절시킨다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "fighter_2",
          "cooltime": "5.00",
          "description": "발로 바닥을 강하게 내려찍어 주변 45 범위 내 모든 적에게 40 + 공격력의 60% 만큼의 물리 피해를 입힌 후 1.00초 동안 60% 둔화를 부여한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "fighter_4",
          "cooltime": "60.00",
          "description": "바닥을 내리찍어 주변 70 범위 내의 모든 적에게 120 + 공격력의 80% 만큼의 물리 피해를 입히고 1.00초 동안 에어본시킨다."
        }
      ],
      "metrics": {
        "damage": 145.0,
        "durability": 149.25,
        "utility": 14.4,
        "scaling": 59.7,
        "mobility": 40.0,
        "cc": 120.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 69.9,
        "durabilityNorm": 34.5,
        "utilityNorm": 30.0,
        "scalingNorm": 58.8,
        "mobilityNorm": 89.8
      },
      "roleFit": {
        "top": 94.7,
        "jungle": 65.6,
        "mid": 32.5,
        "bot": 27.3,
        "support": 41.5
      },
      "bestRole": "top",
      "asset": {
        "sheet": "assets/champions/fighter.png",
        "sheetWidth": 3048,
        "sheetHeight": 120,
        "frame": {
          "x": 26,
          "y": 0,
          "w": 25,
          "h": 47
        }
      },
      "overall": 61.1,
      "tier": "B",
      "candidateIndex": 0
    },
    {
      "id": "ice_mage",
      "name": "얼음술사",
      "category": "Magician",
      "tags": [
        "AOE",
        "AP",
        "CC",
        "DOT",
        "Dot",
        "Magic",
        "Magician",
        "Mobility",
        "Summon"
      ],
      "rawTags": [
        "AP",
        "Dot",
        "CC",
        "Magic"
      ],
      "description": {
        "skill": "상대를 얼려 60 + 주문력의 30% 만큼의 마법 피해를 입히고 0.50초 동안 기절시킨다.",
        "skill2": "지정한 영역에 0.47초 동안 지속되는 얼음 장판을 소환하여 60 범위 내의 적들의 이동속도를 {MoveSpeed}% 둔화시키며 {Tick}초마다 40 + 주문력의 20% 만큼의 마법 피해를 입힌다. 장판이 사라질 때 범위 내 적들을 얼려 1.00초 동안 기절시킨다.",
        "ult": "전방 부채꼴 범위의 적에게 80 + 주문력의 50% 만큼의 마법 피해를 입히고 뒤로 밀쳐낸다. 180초 동안 60% 둔화시키고 {BlockDuration}초 동안 이동기 사용 불가 상태로 만든다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 40,
        "hp": 900,
        "defence": 20,
        "magicResistance": 20,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 0.67,
        "range": 60
      },
      "growth": {
        "attack": 6,
        "magicPower": 20,
        "hp": 100,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "ice_mage_1",
          "cooltime": "5.00",
          "description": "상대를 얼려 60 + 주문력의 30% 만큼의 마법 피해를 입히고 0.50초 동안 기절시킨다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "ice_mage_2",
          "cooltime": "8.00",
          "description": "지정한 영역에 0.47초 동안 지속되는 얼음 장판을 소환하여 60 범위 내의 적들의 이동속도를 {MoveSpeed}% 둔화시키며 {Tick}초마다 40 + 주문력의 20% 만큼의 마법 피해를 입힌다. 장판이 사라질 때 범위 내 적들을 얼려 1.00초 동안 기절시킨다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "ice_mage_4",
          "cooltime": "40.00",
          "description": "전방 부채꼴 범위의 적에게 80 + 주문력의 50% 만큼의 마법 피해를 입히고 뒤로 밀쳐낸다. 180초 동안 60% 둔화시키고 {BlockDuration}초 동안 이동기 사용 불가 상태로 만든다."
        }
      ],
      "metrics": {
        "damage": 136.68,
        "durability": 116.5,
        "utility": 18.0,
        "scaling": 67.5,
        "mobility": 38.5,
        "cc": 150.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 62.6,
        "durabilityNorm": 6.6,
        "utilityNorm": 37.5,
        "scalingNorm": 81.4,
        "mobilityNorm": 84.7
      },
      "roleFit": {
        "top": 30.8,
        "jungle": 25.3,
        "mid": 100,
        "bot": 41.2,
        "support": 36.3
      },
      "bestRole": "mid",
      "asset": {
        "sheet": "assets/champions/ice_mage.png",
        "sheetWidth": 1910,
        "sheetHeight": 74,
        "frame": {
          "x": 30,
          "y": 0,
          "w": 29,
          "h": 51
        }
      },
      "overall": 61.0,
      "tier": "B",
      "candidateIndex": 9
    },
    {
      "id": "wind_mage",
      "name": "바람술사",
      "category": "Magician",
      "tags": [
        "AOE",
        "AP",
        "CC",
        "DOT",
        "Magic",
        "Magician",
        "Mobility",
        "Poke",
        "Summon"
      ],
      "rawTags": [
        "AP",
        "CC",
        "Magic"
      ],
      "description": {
        "skill": "0.40초 동안 소용돌이를 소환하여 70 범위 내의 적에게 {Tick}초마다 15 + 주문력의 5% 만큼의 마법 피해를 입힌다. 소용돌이 내에 있는 아군은 이동속도가 25% 상승한다.",
        "skill2": "전방으로 다섯갈래의 소용돌이를 쏘아내어 범위 내의 적에게 100 + 주문력의 70% 만큼의 마법 피해를 입힌다.",
        "ult": "가장 가까운 적 챔피언을 향해 느리게 이동하는 거대한 회오리를 발사한다. 회오리에 적중한 적은 150 + 주문력의 60% 만큼의 마법 피해를 입고 0.40초 동안 에어본된다. 적중할 때마다 회오리의 크기와 피해량, 공중에 뜨는 시간이 감소하며, 다른 적 챔피언을 향해 방향을 바꾼다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 40,
        "hp": 900,
        "defence": 20,
        "magicResistance": 20,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 0.67,
        "range": 60
      },
      "growth": {
        "attack": 6,
        "magicPower": 20,
        "hp": 100,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "wind_mage_1",
          "cooltime": "8.00",
          "description": "0.40초 동안 소용돌이를 소환하여 70 범위 내의 적에게 {Tick}초마다 15 + 주문력의 5% 만큼의 마법 피해를 입힌다. 소용돌이 내에 있는 아군은 이동속도가 25% 상승한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "wind_mage_2",
          "cooltime": "6.00",
          "description": "전방으로 다섯갈래의 소용돌이를 쏘아내어 범위 내의 적에게 100 + 주문력의 70% 만큼의 마법 피해를 입힌다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "wind_mage_4",
          "cooltime": "60.00",
          "description": "가장 가까운 적 챔피언을 향해 느리게 이동하는 거대한 회오리를 발사한다. 회오리에 적중한 적은 150 + 주문력의 60% 만큼의 마법 피해를 입고 0.40초 동안 에어본된다. 적중할 때마다 회오리의 크기와 피해량, 공중에 뜨는 시간이 감소하며, 다른 적 챔피언을 향해 방향을 바꾼다."
        }
      ],
      "metrics": {
        "damage": 155.28,
        "durability": 116.5,
        "utility": 7.0,
        "scaling": 67.5,
        "mobility": 38.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 79.0,
        "durabilityNorm": 6.6,
        "utilityNorm": 14.6,
        "scalingNorm": 81.4,
        "mobilityNorm": 84.7
      },
      "roleFit": {
        "top": 31.5,
        "jungle": 24.4,
        "mid": 100,
        "bot": 42.5,
        "support": 32.6
      },
      "bestRole": "mid",
      "asset": {
        "sheet": "assets/champions/wind_mage.png",
        "sheetWidth": 1846,
        "sheetHeight": 78,
        "frame": {
          "x": 26,
          "y": 0,
          "w": 23,
          "h": 61
        }
      },
      "overall": 60.3,
      "tier": "B",
      "candidateIndex": 54
    },
    {
      "id": "exorcist",
      "name": "엑소시스트",
      "category": "Util",
      "tags": [
        "AD",
        "AOE",
        "Frontline",
        "Heal",
        "Tank",
        "Util"
      ],
      "rawTags": [
        "AD",
        "Tank"
      ],
      "description": {
        "skill": "아군 1명의 상태이상을 무효화하고 체력을 200 + 주문력의 100% 만큼 회복시킨다.",
        "skill2": "아군 1명에게 신의 가호를 내려 0.37초 동안 공격력 100, 공격속도 100% 증가시킨다. 유지되는 동안 군중제어 스킬에 맞을 경우 군중제어 효과를 반사하여 상대에게 적용시킨다.",
        "ult": "지정한 위치에 폭발을 일으켜 범위 내의 적에게 150 + 주문력의 80% 만큼의 마법 피해를 입힌다. 적에게 걸린 버프 하나당 100 + 주문력의 10% 만큼의 추가 피해를 입힌다."
      },
      "stats": {
        "attack": 100,
        "magicPower": 0,
        "hp": 1400,
        "defence": 30,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.86,
        "range": 25
      },
      "growth": {
        "attack": 20,
        "magicPower": 0,
        "hp": 100,
        "defence": 8,
        "magicResistance": 4,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "exorcist_1",
          "cooltime": "2.00",
          "description": "아군 1명의 상태이상을 무효화하고 체력을 200 + 주문력의 100% 만큼 회복시킨다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "exorcist_2",
          "cooltime": "5.00",
          "description": "아군 1명에게 신의 가호를 내려 0.37초 동안 공격력 100, 공격속도 100% 증가시킨다. 유지되는 동안 군중제어 스킬에 맞을 경우 군중제어 효과를 반사하여 상대에게 적용시킨다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "exorcist_4",
          "cooltime": "30.00",
          "description": "지정한 위치에 폭발을 일으켜 범위 내의 적에게 150 + 주문력의 80% 만큼의 마법 피해를 입힌다. 적에게 걸린 버프 하나당 100 + 주문력의 10% 만큼의 추가 피해를 입힌다."
        }
      ],
      "metrics": {
        "damage": 144.4,
        "durability": 184.0,
        "utility": 16.0,
        "scaling": 59.2,
        "mobility": 15.0,
        "cc": 0.0,
        "heal": 200.0,
        "shield": 0.0,
        "damageNorm": 69.4,
        "durabilityNorm": 64.2,
        "utilityNorm": 33.3,
        "scalingNorm": 57.4,
        "mobilityNorm": 5.1
      },
      "roleFit": {
        "top": 32.5,
        "jungle": 18.6,
        "mid": 36.5,
        "bot": 32.3,
        "support": 100
      },
      "bestRole": "support",
      "asset": {
        "sheet": "assets/champions/exorcist.png",
        "sheetWidth": 3260,
        "sheetHeight": 140,
        "frame": {
          "x": 22,
          "y": 0,
          "w": 21,
          "h": 49
        }
      },
      "overall": 59.8,
      "tier": "B",
      "candidateIndex": 39
    },
    {
      "id": "ghost",
      "name": "유령",
      "category": "Assassin",
      "tags": [
        "AD",
        "Assassin",
        "Heal",
        "Mobility"
      ],
      "rawTags": [
        "AD"
      ],
      "description": {
        "skill": "대상 지정 불가 상태가 되어 일직선으로 돌진한다. 적 처치에 관여할 때마다 공격력이 {Attack}, 공격속도가 {AttackSpeed}% 상승하며 체력이 {Heal} 회복된다.",
        "skill2": "짧은 거리를 돌진하며 처음으로 부딪힌 대상에게 60 + 공격력의 80% 만큼의 물리 피해를 입힌다. 최대 {Time}번까지 연속으로 사용할 수 있다.",
        "ult": "5.00초 동안 이동 제어 불가 상태에 면역이 된다. 적 처치에 관여할 때마다 기본 스킬의 재사용 대기시간이 초기화된다."
      },
      "stats": {
        "attack": 120,
        "magicPower": 0,
        "hp": 900,
        "defence": 25,
        "magicResistance": 15,
        "moveSpeed": 1100,
        "moveSpeedDisplay": 66.0,
        "attackSpeed": 1.2,
        "range": 23
      },
      "growth": {
        "attack": 30,
        "magicPower": 0,
        "hp": 80,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.84,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "ghost_1",
          "cooltime": null,
          "description": "대상 지정 불가 상태가 되어 일직선으로 돌진한다. 적 처치에 관여할 때마다 공격력이 {Attack}, 공격속도가 {AttackSpeed}% 상승하며 체력이 {Heal} 회복된다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "ghost_2",
          "cooltime": "15.00",
          "description": "짧은 거리를 돌진하며 처음으로 부딪힌 대상에게 60 + 공격력의 80% 만큼의 물리 피해를 입힌다. 최대 {Time}번까지 연속으로 사용할 수 있다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "ghost_4",
          "cooltime": "50.00",
          "description": "5.00초 동안 이동 제어 불가 상태에 면역이 된다. 적 처치에 관여할 때마다 기본 스킬의 재사용 대기시간이 초기화된다."
        }
      ],
      "metrics": {
        "damage": 114.6,
        "durability": 127.75,
        "utility": 16.0,
        "scaling": 73.1,
        "mobility": 41.5,
        "cc": 0.0,
        "heal": 200.0,
        "shield": 0.0,
        "damageNorm": 43.2,
        "durabilityNorm": 16.2,
        "utilityNorm": 33.3,
        "scalingNorm": 97.7,
        "mobilityNorm": 94.9
      },
      "roleFit": {
        "top": 36.8,
        "jungle": 94.0,
        "mid": 87.5,
        "bot": 26.1,
        "support": 24.4
      },
      "bestRole": "jungle",
      "asset": {
        "sheet": "assets/champions/ghost.png",
        "sheetWidth": 1266,
        "sheetHeight": 68,
        "frame": {
          "x": 30,
          "y": 0,
          "w": 29,
          "h": 51
        }
      },
      "overall": 59.6,
      "tier": "B",
      "candidateIndex": 40
    },
    {
      "id": "pole_warrior",
      "name": "봉술사",
      "category": "Melee",
      "tags": [
        "AD",
        "AOE",
        "CC",
        "Frontline",
        "Melee",
        "Mobility"
      ],
      "rawTags": [
        "AD",
        "CC"
      ],
      "description": {
        "skill": "적에게 점프하여 봉으로 내려찍어 60 + 공격력의 100% 만큼의 물리 피해를 입힌다.",
        "skill2": "짧은 거리를 이동하며 봉을 밟고 올라서서 {Time}초 동안 대상 지정 불가 상태가 되었다가 봉을 휘둘러 주변 32 범위 내 모든 적에게 60 + 공격력의 100% 만큼의 물리 피해를 입힌다.",
        "ult": "120 범위 내에 있는 지정된 적에게 돌진하여 적에게 100 + 공격력의 100% 만큼의 물리 피해를 입히고, 대상을 1.00초 동안 에어본시킨다."
      },
      "stats": {
        "attack": 100,
        "magicPower": 0,
        "hp": 1000,
        "defence": 30,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 1.2,
        "range": 30
      },
      "growth": {
        "attack": 20,
        "magicPower": 0,
        "hp": 100,
        "defence": 9,
        "magicResistance": 4,
        "moveSpeedDisplay": 0.72,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "pole_warrior_1",
          "cooltime": null,
          "description": "적에게 점프하여 봉으로 내려찍어 60 + 공격력의 100% 만큼의 물리 피해를 입힌다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "pole_warrior_2",
          "cooltime": "6.00",
          "description": "짧은 거리를 이동하며 봉을 밟고 올라서서 {Time}초 동안 대상 지정 불가 상태가 되었다가 봉을 휘둘러 주변 32 범위 내 모든 적에게 60 + 공격력의 100% 만큼의 물리 피해를 입힌다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "pole_warrior_4",
          "cooltime": "50.00",
          "description": "120 범위 내에 있는 지정된 적에게 돌진하여 적에게 100 + 공격력의 100% 만큼의 물리 피해를 입히고, 대상을 1.00초 동안 에어본시킨다."
        }
      ],
      "metrics": {
        "damage": 152.2,
        "durability": 152.0,
        "utility": 7.2,
        "scaling": 60.5,
        "mobility": 40.0,
        "cc": 60.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 76.3,
        "durabilityNorm": 36.9,
        "utilityNorm": 15.0,
        "scalingNorm": 61.2,
        "mobilityNorm": 89.8
      },
      "roleFit": {
        "top": 88.2,
        "jungle": 65.2,
        "mid": 32.7,
        "bot": 27.9,
        "support": 35.7
      },
      "bestRole": "top",
      "asset": {
        "sheet": "assets/champions/pole_warrior.png",
        "sheetWidth": 1884,
        "sheetHeight": 96,
        "frame": {
          "x": 20,
          "y": 0,
          "w": 19,
          "h": 49
        }
      },
      "overall": 59.2,
      "tier": "B",
      "candidateIndex": 19
    },
    {
      "id": "dual_blader",
      "name": "듀얼 블레이더",
      "category": "Melee",
      "tags": [
        "AD",
        "AOE",
        "CC",
        "Frontline",
        "Melee",
        "Mobility",
        "Poke"
      ],
      "rawTags": [
        "AD",
        "CC"
      ],
      "description": {
        "skill": "일직선으로 검기를 발사해 적중한 적에게 20 + 공격력의 70% 만큼의 물리 피해를 입히며, {Time}초 동안 속박한다.",
        "skill2": "이동 불가 상태에 있는 90 범위 내의 적에게 돌진하여 적중한 적을 1.00초 동안 에어본시키며 40 + 공격력의 100% 만큼의 물리 피해를 입힌다.",
        "ult": "지정된 40 범위 내의 적 한명을 검으로 난도질하여 {Count}번 30 + 공격력의 30% 만큼의 고정 피해를 입힌다."
      },
      "stats": {
        "attack": 120,
        "magicPower": 0,
        "hp": 900,
        "defence": 25,
        "magicResistance": 15,
        "moveSpeed": 1100,
        "moveSpeedDisplay": 66.0,
        "attackSpeed": 1.2,
        "range": 25
      },
      "growth": {
        "attack": 25,
        "magicPower": 0,
        "hp": 100,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.72,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "dual_blader_1",
          "cooltime": "5.00",
          "description": "일직선으로 검기를 발사해 적중한 적에게 20 + 공격력의 70% 만큼의 물리 피해를 입히며, {Time}초 동안 속박한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "dual_blader_2",
          "cooltime": "4.00",
          "description": "이동 불가 상태에 있는 90 범위 내의 적에게 돌진하여 적중한 적을 1.00초 동안 에어본시키며 40 + 공격력의 100% 만큼의 물리 피해를 입힌다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "dual_blader_4",
          "cooltime": "60.00",
          "description": "지정된 40 범위 내의 적 한명을 검으로 난도질하여 {Count}번 30 + 공격력의 30% 만큼의 고정 피해를 입힌다."
        }
      ],
      "metrics": {
        "damage": 138.3,
        "durability": 129.75,
        "utility": 14.2,
        "scaling": 65.7,
        "mobility": 41.5,
        "cc": 60.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 64.0,
        "durabilityNorm": 17.9,
        "utilityNorm": 29.6,
        "scalingNorm": 76.2,
        "mobilityNorm": 94.9
      },
      "roleFit": {
        "top": 85.9,
        "jungle": 64.8,
        "mid": 32.4,
        "bot": 27.3,
        "support": 36.4
      },
      "bestRole": "top",
      "asset": {
        "sheet": "assets/champions/dual_blader.png",
        "sheetWidth": 3502,
        "sheetHeight": 88,
        "frame": {
          "x": 44,
          "y": 0,
          "w": 43,
          "h": 55
        }
      },
      "overall": 58.9,
      "tier": "B",
      "candidateIndex": 16
    },
    {
      "id": "demon",
      "name": "악마",
      "category": "Assassin",
      "tags": [
        "AD",
        "AOE",
        "Assassin",
        "CC",
        "Mobility"
      ],
      "rawTags": [
        "AD",
        "CC"
      ],
      "description": {
        "skill": "바닥에서 지옥의 손아귀가 솟아나와 적을 붙든다. 적중시 50 + 공격력의 70% 만큼의 물리 피해를 입히며 적과 자신의 위치를 바꾼다.",
        "skill2": "4.00초 동안 대악마로 변신한다. 대악마로 변신한 동안 공격력이 50, 방어력이 50, 공격속도가 50%, 이동속도가 10% 증가한다.",
        "ult": "주변 48 범위 내의 모든 적에게 60 + 공격력의 100% 만큼의 물리 피해를 입히며, {Time}초 동안 공포를 부여한다."
      },
      "stats": {
        "attack": 120,
        "magicPower": 0,
        "hp": 900,
        "defence": 25,
        "magicResistance": 15,
        "moveSpeed": 1100,
        "moveSpeedDisplay": 66.0,
        "attackSpeed": 1.2,
        "range": 23
      },
      "growth": {
        "attack": 30,
        "magicPower": 0,
        "hp": 80,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.84,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "demon_1",
          "cooltime": "4.00",
          "description": "바닥에서 지옥의 손아귀가 솟아나와 적을 붙든다. 적중시 50 + 공격력의 70% 만큼의 물리 피해를 입히며 적과 자신의 위치를 바꾼다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "demon_2",
          "cooltime": "10.00",
          "description": "4.00초 동안 대악마로 변신한다. 대악마로 변신한 동안 공격력이 50, 방어력이 50, 공격속도가 50%, 이동속도가 10% 증가한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "demon_4",
          "cooltime": "40.00",
          "description": "주변 48 범위 내의 모든 적에게 60 + 공격력의 100% 만큼의 물리 피해를 입히며, {Time}초 동안 공포를 부여한다."
        }
      ],
      "metrics": {
        "damage": 144.0,
        "durability": 117.75,
        "utility": 0.0,
        "scaling": 73.1,
        "mobility": 41.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 69.0,
        "durabilityNorm": 7.7,
        "utilityNorm": 0.0,
        "scalingNorm": 97.7,
        "mobilityNorm": 94.9
      },
      "roleFit": {
        "top": 37.2,
        "jungle": 95.3,
        "mid": 88.7,
        "bot": 28.1,
        "support": 14.0
      },
      "bestRole": "jungle",
      "asset": {
        "sheet": "assets/champions/demon.png",
        "sheetWidth": 4028,
        "sheetHeight": 112,
        "frame": {
          "x": 88,
          "y": 0,
          "w": 31,
          "h": 43
        }
      },
      "overall": 57.9,
      "tier": "C",
      "candidateIndex": 23
    },
    {
      "id": "swordman",
      "name": "검사",
      "category": "Melee",
      "tags": [
        "AD",
        "AOE",
        "Assassin",
        "Frontline",
        "Melee",
        "Mobility",
        "Poke"
      ],
      "rawTags": [
        "AD"
      ],
      "description": {
        "skill": "검기를 발사하여 적중한 적들에게 40 + 공격력의 70%의 물리 피해를 입힌다(검기 사거리 100)",
        "skill2": "단일 대상을 연속으로 세 번 베어 큰 물리 피해를 입힌다. 타격당 20 + 공격력의 30% 대미지.",
        "ult": "일직선으로 150 거리를 돌진하여 돌진 범위 내의 적에게 50 + 공격력의 200% 만큼의 물리 피해를 입힌다. 피해량은 적중한 적의 수만큼 분산된다. 궁극기로 적을 처치했을 경우, 궁극기의 재사용 대기시간이 초기화된다."
      },
      "stats": {
        "attack": 120,
        "magicPower": 0,
        "hp": 900,
        "defence": 25,
        "magicResistance": 15,
        "moveSpeed": 1100,
        "moveSpeedDisplay": 66.0,
        "attackSpeed": 1.0,
        "range": 25
      },
      "growth": {
        "attack": 25,
        "magicPower": 0,
        "hp": 90,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.72,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "swordman_1",
          "cooltime": "7.00",
          "description": "검기를 발사하여 적중한 적들에게 40 + 공격력의 70%의 물리 피해를 입힌다(검기 사거리 100)"
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "swordman_2",
          "cooltime": "6.00",
          "description": "단일 대상을 연속으로 세 번 베어 큰 물리 피해를 입힌다. 타격당 20 + 공격력의 30% 대미지."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "swordman_4",
          "cooltime": "60.00",
          "description": "일직선으로 150 거리를 돌진하여 돌진 범위 내의 적에게 50 + 공격력의 200% 만큼의 물리 피해를 입힌다. 피해량은 적중한 적의 수만큼 분산된다. 궁극기로 적을 처치했을 경우, 궁극기의 재사용 대기시간이 초기화된다."
        }
      ],
      "metrics": {
        "damage": 147.9,
        "durability": 129.75,
        "utility": 7.0,
        "scaling": 64.9,
        "mobility": 41.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 72.5,
        "durabilityNorm": 17.9,
        "utilityNorm": 14.6,
        "scalingNorm": 73.9,
        "mobilityNorm": 94.9
      },
      "roleFit": {
        "top": 86.3,
        "jungle": 64.5,
        "mid": 32.7,
        "bot": 27.9,
        "support": 30.6
      },
      "bestRole": "top",
      "asset": {
        "sheet": "assets/champions/swordman.png",
        "sheetWidth": 2562,
        "sheetHeight": 64,
        "frame": {
          "x": 48,
          "y": 0,
          "w": 49,
          "h": 51
        }
      },
      "overall": 57.6,
      "tier": "C",
      "candidateIndex": 2
    },
    {
      "id": "white_mage",
      "name": "백마술사",
      "category": "Magician",
      "tags": [
        "AOE",
        "AP",
        "CC",
        "Dot",
        "Magic",
        "Magician",
        "Poke",
        "Summon"
      ],
      "rawTags": [
        "AP",
        "Dot",
        "Magic"
      ],
      "description": {
        "skill": "일직선의 광선이 잠시 후 폭발하며 범위 내의 모든 적들에게 130 + 주문력의 50% 만큼의 마법 피해를 입힌다.",
        "skill2": "원형의 범위에 광선을 소환하여 5번 공격하고 범위 내의 적에게 40 + 주문력의 10% 만큼의 마법 피해를 입히며 0.50초 동안 20% 둔화시킨다.",
        "ult": "일직선으로 관통하는 광선을 발사하여 적중한 적에게 150 + 주문력의 80% 만큼의 마법 피해를 입히고 {Time}초 동안 속박시킨다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 40,
        "hp": 900,
        "defence": 20,
        "magicResistance": 20,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 0.67,
        "range": 60
      },
      "growth": {
        "attack": 6,
        "magicPower": 20,
        "hp": 100,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "white_mage_1",
          "cooltime": "5.00",
          "description": "일직선의 광선이 잠시 후 폭발하며 범위 내의 모든 적들에게 130 + 주문력의 50% 만큼의 마법 피해를 입힌다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "white_mage_2",
          "cooltime": "8.00",
          "description": "원형의 범위에 광선을 소환하여 5번 공격하고 범위 내의 적에게 40 + 주문력의 10% 만큼의 마법 피해를 입히며 0.50초 동안 20% 둔화시킨다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "white_mage_4",
          "cooltime": "60.00",
          "description": "일직선으로 관통하는 광선을 발사하여 적중한 적에게 150 + 주문력의 80% 만큼의 마법 피해를 입히고 {Time}초 동안 속박시킨다."
        }
      ],
      "metrics": {
        "damage": 165.48,
        "durability": 116.5,
        "utility": 9.4,
        "scaling": 67.5,
        "mobility": 13.5,
        "cc": 20.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 87.9,
        "durabilityNorm": 6.6,
        "utilityNorm": 19.6,
        "scalingNorm": 81.4,
        "mobilityNorm": 0.0
      },
      "roleFit": {
        "top": 31.9,
        "jungle": 21.6,
        "mid": 100,
        "bot": 42.2,
        "support": 33.2
      },
      "bestRole": "mid",
      "asset": {
        "sheet": "assets/champions/white_mage.png",
        "sheetWidth": 4096,
        "sheetHeight": 156,
        "frame": {
          "x": 28,
          "y": 0,
          "w": 27,
          "h": 51
        }
      },
      "overall": 56.4,
      "tier": "C",
      "candidateIndex": 53
    },
    {
      "id": "shadowmancer",
      "name": "그림자술사",
      "category": "Magician",
      "tags": [
        "AOE",
        "AP",
        "CC",
        "Magic",
        "Magician",
        "Poke"
      ],
      "rawTags": [
        "AP",
        "CC",
        "Magic"
      ],
      "description": {
        "skill": "바닥에서 검은 그림자가 나타나 범위 내의 적들에게 80 + 주문력의 80% 만큼의 마법 피해를 입히고 {Time}초간 속박시킨다.",
        "skill2": "이동이 불가능한 상태의 적의 그림자를 폭발시켜 100 + 주문력의 60% 만큼의 마법 피해를 입힌다.",
        "ult": "일직선으로 관통하는 그림자 투사체를 발사하여 적중한 적 챔피언에게 150 + 주문력의 100% 만큼의 마법 피해를 입히고 {BanishTime}초 동안 추방시킨다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 40,
        "hp": 900,
        "defence": 20,
        "magicResistance": 20,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 0.67,
        "range": 60
      },
      "growth": {
        "attack": 6,
        "magicPower": 20,
        "hp": 100,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "shadowmancer_1",
          "cooltime": "6.00",
          "description": "바닥에서 검은 그림자가 나타나 범위 내의 적들에게 80 + 주문력의 80% 만큼의 마법 피해를 입히고 {Time}초간 속박시킨다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "shadowmancer_2",
          "cooltime": "4.00",
          "description": "이동이 불가능한 상태의 적의 그림자를 폭발시켜 100 + 주문력의 60% 만큼의 마법 피해를 입힌다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "shadowmancer_4",
          "cooltime": "50.00",
          "description": "일직선으로 관통하는 그림자 투사체를 발사하여 적중한 적 챔피언에게 150 + 주문력의 100% 만큼의 마법 피해를 입히고 {BanishTime}초 동안 추방시킨다."
        }
      ],
      "metrics": {
        "damage": 169.68,
        "durability": 116.5,
        "utility": 7.0,
        "scaling": 67.5,
        "mobility": 13.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 91.6,
        "durabilityNorm": 6.6,
        "utilityNorm": 14.6,
        "scalingNorm": 81.4,
        "mobilityNorm": 0.0
      },
      "roleFit": {
        "top": 32.1,
        "jungle": 21.5,
        "mid": 100,
        "bot": 42.5,
        "support": 32.6
      },
      "bestRole": "mid",
      "asset": {
        "sheet": "assets/champions/shadowmancer.png",
        "sheetWidth": 2821,
        "sheetHeight": 97,
        "frame": {
          "x": 22,
          "y": 0,
          "w": 21,
          "h": 51
        }
      },
      "overall": 56.2,
      "tier": "C",
      "candidateIndex": 45
    },
    {
      "id": "pythoness",
      "name": "무녀",
      "category": "Util",
      "tags": [
        "AOE",
        "AP",
        "Heal",
        "Magic",
        "Poke",
        "Range",
        "Summon",
        "Util"
      ],
      "rawTags": [
        "Heal",
        "Range",
        "AP",
        "Magic"
      ],
      "description": {
        "skill": "아군 1명의 체력을 30 + 주문력의 60% 만큼 회복시킨다.",
        "skill2": "아군 1명의 체력을 50 + 주문력의 80% 만큼 회복시키며, 해당 아군 주변 75 범위의 적들에게 200 + 주문력의 80% 만큼의 마법 피해를 입힌다.",
        "ult": "귀문을 소환한다. 귀문은 귀문으로부터 120 범위 내 아군의 체력을 30 + 주문력의 15% 만큼 회복시키는 탄환 혹은 적군에게 30 + 주문력의 15% 만큼의 마법 피해를 입히는 탄환을 발사한다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 30,
        "hp": 900,
        "defence": 20,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.67,
        "range": 60
      },
      "growth": {
        "attack": 6,
        "magicPower": 15,
        "hp": 100,
        "defence": 8,
        "magicResistance": 4,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "pythoness_1",
          "cooltime": "4.00",
          "description": "아군 1명의 체력을 30 + 주문력의 60% 만큼 회복시킨다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "pythoness_2",
          "cooltime": "4.00",
          "description": "아군 1명의 체력을 50 + 주문력의 80% 만큼 회복시키며, 해당 아군 주변 75 범위의 적들에게 200 + 주문력의 80% 만큼의 마법 피해를 입힌다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "pythoness_4",
          "cooltime": "40.00",
          "description": "귀문을 소환한다. 귀문은 귀문으로부터 120 범위 내 아군의 체력을 30 + 주문력의 15% 만큼 회복시키는 탄환 혹은 적군에게 30 + 주문력의 15% 만큼의 마법 피해를 입히는 탄환을 발사한다."
        }
      ],
      "metrics": {
        "damage": 144.98,
        "durability": 125.75,
        "utility": 21.8,
        "scaling": 61.0,
        "mobility": 15.0,
        "cc": 0.0,
        "heal": 185.0,
        "shield": 0.0,
        "damageNorm": 69.9,
        "durabilityNorm": 14.5,
        "utilityNorm": 45.4,
        "scalingNorm": 62.6,
        "mobilityNorm": 5.1
      },
      "roleFit": {
        "top": 27.9,
        "jungle": 18.6,
        "mid": 36.8,
        "bot": 32.4,
        "support": 100
      },
      "bestRole": "support",
      "asset": {
        "sheet": "assets/champions/pythoness.png",
        "sheetWidth": 4096,
        "sheetHeight": 257,
        "frame": {
          "x": 28,
          "y": 0,
          "w": 27,
          "h": 41
        }
      },
      "overall": 55.8,
      "tier": "C",
      "candidateIndex": 6
    },
    {
      "id": "hunter",
      "name": "사냥꾼",
      "category": "Assassin",
      "tags": [
        "AD",
        "Assassin",
        "CC",
        "Mobility"
      ],
      "rawTags": [
        "AD"
      ],
      "description": {
        "skill": "적에게 순간이동하며 원거리 공격 모드로 전환한다. 사거리가 {RangeIncrease} 증가한다.",
        "skill2": "표식이 3개 쌓인 적에게 돌진하여 60 + 공격력의 100% 만큼의 물리 피해를 입히고 1.00초 동안 침묵시킨다.",
        "ult": "전방으로 돌진하며 궤적 내의 적에게 50 + 공격력의 120% 만큼의 물리 피해를 입힌다. 적 처치 관여 시 재사용 가능하다."
      },
      "stats": {
        "attack": 120,
        "magicPower": 0,
        "hp": 900,
        "defence": 25,
        "magicResistance": 15,
        "moveSpeed": 1100,
        "moveSpeedDisplay": 66.0,
        "attackSpeed": 1.2,
        "range": 23
      },
      "growth": {
        "attack": 30,
        "magicPower": 0,
        "hp": 80,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.84,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "hunter_1",
          "cooltime": "8.00",
          "description": "적에게 순간이동하며 원거리 공격 모드로 전환한다. 사거리가 {RangeIncrease} 증가한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "hunter_2",
          "cooltime": "8.00",
          "description": "표식이 3개 쌓인 적에게 돌진하여 60 + 공격력의 100% 만큼의 물리 피해를 입히고 1.00초 동안 침묵시킨다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "hunter_4",
          "cooltime": "50.00",
          "description": "전방으로 돌진하며 궤적 내의 적에게 50 + 공격력의 120% 만큼의 물리 피해를 입힌다. 적 처치 관여 시 재사용 가능하다."
        }
      ],
      "metrics": {
        "damage": 132.0,
        "durability": 117.75,
        "utility": 0.0,
        "scaling": 73.1,
        "mobility": 41.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 58.5,
        "durabilityNorm": 7.7,
        "utilityNorm": 0.0,
        "scalingNorm": 97.7,
        "mobilityNorm": 94.9
      },
      "roleFit": {
        "top": 36.7,
        "jungle": 94.8,
        "mid": 87.9,
        "bot": 27.3,
        "support": 14.0
      },
      "bestRole": "jungle",
      "asset": {
        "sheet": "assets/champions/hunter.png",
        "sheetWidth": 2978,
        "sheetHeight": 74,
        "frame": {
          "x": 28,
          "y": 0,
          "w": 27,
          "h": 47
        }
      },
      "overall": 55.4,
      "tier": "C",
      "candidateIndex": 58
    },
    {
      "id": "jiangshi",
      "name": "강시",
      "category": "Melee",
      "tags": [
        "AD",
        "AOE",
        "CC",
        "Frontline",
        "Heal",
        "Melee",
        "Summon",
        "Tank"
      ],
      "rawTags": [
        "AD",
        "CC",
        "Tank"
      ],
      "description": {
        "skill": "작은 강시를 소환해 적에게 달려들어 피해를 입히도록 한다. 작은 강시는 3번의 공격 후 사라지며, 공격당 30 + 공격력의 100% 만큼의 물리 피해를 입힌다.",
        "skill2": "상대를 내려쳐 1.00초 동안 기절시키며 80 + 공격력의 100% 만큼의 물리 피해를 입히고 체력을 200 회복한다.",
        "ult": "0.03초 동안 주변 48 범위 내의 적으로부터 50 + 주문력의 30% 만큼의 체력을 흡수하며, 60 + 주문력의 30% 만큼의 마법 피해를 입힌다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 0,
        "hp": 1100,
        "defence": 40,
        "magicResistance": 30,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.86,
        "range": 25
      },
      "growth": {
        "attack": 6,
        "magicPower": 0,
        "hp": 120,
        "defence": 10,
        "magicResistance": 5,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "jiangshi_1",
          "cooltime": "4.00",
          "description": "작은 강시를 소환해 적에게 달려들어 피해를 입히도록 한다. 작은 강시는 3번의 공격 후 사라지며, 공격당 30 + 공격력의 100% 만큼의 물리 피해를 입힌다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "jiangshi_2",
          "cooltime": null,
          "description": "상대를 내려쳐 1.00초 동안 기절시키며 80 + 공격력의 100% 만큼의 물리 피해를 입히고 체력을 200 회복한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "jiangshi_4",
          "cooltime": "40.00",
          "description": "0.03초 동안 주변 48 범위 내의 적으로부터 50 + 주문력의 30% 만큼의 체력을 흡수하며, 60 + 주문력의 30% 만큼의 마법 피해를 입힌다."
        }
      ],
      "metrics": {
        "damage": 126.08,
        "durability": 205.0,
        "utility": 29.6,
        "scaling": 39.4,
        "mobility": 15.0,
        "cc": 60.0,
        "heal": 280.0,
        "shield": 0.0,
        "damageNorm": 53.3,
        "durabilityNorm": 82.1,
        "utilityNorm": 61.7,
        "scalingNorm": 0.0,
        "mobilityNorm": 5.1
      },
      "roleFit": {
        "top": 98.4,
        "jungle": 60.5,
        "mid": 30.8,
        "bot": 23.8,
        "support": 56.3
      },
      "bestRole": "top",
      "asset": {
        "sheet": "assets/champions/jiangshi.png",
        "sheetWidth": 4096,
        "sheetHeight": 155,
        "frame": {
          "x": 50,
          "y": 0,
          "w": 27,
          "h": 51
        }
      },
      "overall": 54.6,
      "tier": "C",
      "candidateIndex": 20
    },
    {
      "id": "guardian_spirit",
      "name": "수호령",
      "category": "Util",
      "tags": [
        "AOE",
        "AP",
        "Heal",
        "Mobility",
        "Range",
        "Shield",
        "Util"
      ],
      "rawTags": [
        "Shield",
        "Heal",
        "Range",
        "AP"
      ],
      "description": {
        "skill": "주변 범위 내 아군의 체력을 100 + 주문력의 {Coef}% 만큼 회복시킨다.",
        "skill2": "아군에게 150 + 주문력의 40% 만큼의 보호막과 이동속도 20% 증가를 부여한다.",
        "ult": "0.40초 동안 성역을 생성하여 범위 내 아군의 체력을 30 + 주문력의 {HealCoef}% 만큼 지속적으로 회복시키며, 부활 보호막을 부여한다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 30,
        "hp": 900,
        "defence": 20,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.67,
        "range": 60
      },
      "growth": {
        "attack": 6,
        "magicPower": 15,
        "hp": 100,
        "defence": 8,
        "magicResistance": 4,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "guardian_spirit_1",
          "cooltime": "5.00",
          "description": "주변 범위 내 아군의 체력을 100 + 주문력의 {Coef}% 만큼 회복시킨다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "guardian_spirit_2",
          "cooltime": "6.00",
          "description": "아군에게 150 + 주문력의 40% 만큼의 보호막과 이동속도 20% 증가를 부여한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "guardian_spirit_4",
          "cooltime": "60.00",
          "description": "0.40초 동안 성역을 생성하여 범위 내 아군의 체력을 30 + 주문력의 {HealCoef}% 만큼 지속적으로 회복시키며, 부활 보호막을 부여한다."
        }
      ],
      "metrics": {
        "damage": 93.98,
        "durability": 132.0,
        "utility": 22.4,
        "scaling": 61.0,
        "mobility": 40.0,
        "cc": 0.0,
        "heal": 130.0,
        "shield": 150.0,
        "damageNorm": 25.1,
        "durabilityNorm": 19.8,
        "utilityNorm": 46.7,
        "scalingNorm": 62.6,
        "mobilityNorm": 89.8
      },
      "roleFit": {
        "top": 26.3,
        "jungle": 19.8,
        "mid": 33.8,
        "bot": 29.8,
        "support": 100
      },
      "bestRole": "support",
      "asset": {
        "sheet": "assets/champions/guardian_spirit.png",
        "sheetWidth": 2798,
        "sheetHeight": 162,
        "frame": {
          "x": 34,
          "y": 0,
          "w": 33,
          "h": 53
        }
      },
      "overall": 53.5,
      "tier": "C",
      "candidateIndex": 57
    },
    {
      "id": "druid",
      "name": "드루이드",
      "category": "Magician",
      "tags": [
        "AP",
        "Heal",
        "Magic",
        "Magician",
        "Mobility",
        "Poke",
        "Summon"
      ],
      "rawTags": [
        "AP",
        "Magic"
      ],
      "description": {
        "skill": "곰을 소환한다. 곰이 사망할 경우 150 + 주문력의 {DeathCoef}% 만큼의 피해를 받는다. 곰이 소환된 도중에 사용하면 곰의 체력을 {Heal} + 주문력의 30% 만큼 회복시킨다.",
        "skill2": "독수리를 소환한다. 독수리가 사망할 경우 드루이드는 피해를 입는다. 독수리가 소환되어 있는 도중에 해당 스킬을 사용할 경우 독수리가 적에게 돌진하여 40 + 주문력의 100% 만큼의 마법 피해를 입히고 피해량의 {Lifesteal}%만큼 체력을 회복한다.",
        "ult": "지정한 방향으로 곰과 독수리의 영혼을 연달아 {Count}개 발사한다. 각 투사체는 60 + 주문력의 80% 만큼의 마법 피해를 입히고 적을 뒤로 밀어낸다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 10,
        "hp": 1100,
        "defence": 40,
        "magicResistance": 30,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.67,
        "range": 60
      },
      "growth": {
        "attack": 6,
        "magicPower": 0,
        "hp": 120,
        "defence": 10,
        "magicResistance": 5,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "druid_1",
          "cooltime": "10.00",
          "description": "곰을 소환한다. 곰이 사망할 경우 150 + 주문력의 {DeathCoef}% 만큼의 피해를 받는다. 곰이 소환된 도중에 사용하면 곰의 체력을 {Heal} + 주문력의 30% 만큼 회복시킨다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "druid_2",
          "cooltime": "8.33",
          "description": "독수리를 소환한다. 독수리가 사망할 경우 드루이드는 피해를 입는다. 독수리가 소환되어 있는 도중에 해당 스킬을 사용할 경우 독수리가 적에게 돌진하여 40 + 주문력의 100% 만큼의 마법 피해를 입히고 피해량의 {Lifesteal}%만큼 체력을 회복한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "druid_4",
          "cooltime": "30.00",
          "description": "지정한 방향으로 곰과 독수리의 영혼을 연달아 {Count}개 발사한다. 각 투사체는 60 + 주문력의 80% 만큼의 마법 피해를 입히고 적을 뒤로 밀어낸다."
        }
      ],
      "metrics": {
        "damage": 134.58,
        "durability": 180.5,
        "utility": 9.4,
        "scaling": 39.4,
        "mobility": 40.0,
        "cc": 0.0,
        "heal": 30.0,
        "shield": 0.0,
        "damageNorm": 60.8,
        "durabilityNorm": 61.2,
        "utilityNorm": 19.6,
        "scalingNorm": 0.0,
        "mobilityNorm": 89.8
      },
      "roleFit": {
        "top": 35.8,
        "jungle": 23.7,
        "mid": 100,
        "bot": 39.4,
        "support": 38.4
      },
      "bestRole": "mid",
      "asset": {
        "sheet": "assets/champions/druid.png",
        "sheetWidth": 3730,
        "sheetHeight": 80,
        "frame": {
          "x": 30,
          "y": 0,
          "w": 29,
          "h": 49
        }
      },
      "overall": 52.2,
      "tier": "C",
      "candidateIndex": 49
    },
    {
      "id": "siege_breaker",
      "name": "공성병",
      "category": "Melee",
      "tags": [
        "AD",
        "AOE",
        "Frontline",
        "Melee",
        "Mobility",
        "Tank"
      ],
      "rawTags": [
        "AD",
        "Tank"
      ],
      "description": {
        "skill": "대상에게 철퇴를 강하게 내려찍어 30 + 공격력의 120% 만큼의 물리 피해를 입힌다. 구조물에는 추가로 {Bonus}%의 피해를 입힌다.",
        "skill2": "철퇴로 바닥을 내려찍어 범위 내의 구조물을 포함한 모든 적에게 60 + 공격력의 120% 만큼의 물리 피해를 입힌다.",
        "ult": "8.00초 동안 공격력이 {Attack}, 공격속도가 {AttackSpeed}%, 이동속도가 {MoveSpeed}% 상승한다."
      },
      "stats": {
        "attack": 100,
        "magicPower": 0,
        "hp": 1000,
        "defence": 30,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 1.2,
        "range": 25
      },
      "growth": {
        "attack": 20,
        "magicPower": 0,
        "hp": 100,
        "defence": 9,
        "magicResistance": 4,
        "moveSpeedDisplay": 0.72,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "siege_breaker_1",
          "cooltime": "3.00",
          "description": "대상에게 철퇴를 강하게 내려찍어 30 + 공격력의 120% 만큼의 물리 피해를 입힌다. 구조물에는 추가로 {Bonus}%의 피해를 입힌다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "siege_breaker_2",
          "cooltime": "5.00",
          "description": "철퇴로 바닥을 내려찍어 범위 내의 구조물을 포함한 모든 적에게 60 + 공격력의 120% 만큼의 물리 피해를 입힌다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "siege_breaker_4",
          "cooltime": "40.00",
          "description": "8.00초 동안 공격력이 {Attack}, 공격속도가 {AttackSpeed}%, 이동속도가 {MoveSpeed}% 상승한다."
        }
      ],
      "metrics": {
        "damage": 125.2,
        "durability": 152.0,
        "utility": 0.0,
        "scaling": 60.5,
        "mobility": 40.0,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 52.5,
        "durabilityNorm": 36.9,
        "utilityNorm": 0.0,
        "scalingNorm": 61.2,
        "mobilityNorm": 89.8
      },
      "roleFit": {
        "top": 94.2,
        "jungle": 63.2,
        "mid": 30.8,
        "bot": 26.0,
        "support": 34.0
      },
      "bestRole": "top",
      "asset": {
        "sheet": "assets/champions/siege_breaker.png",
        "sheetWidth": 1972,
        "sheetHeight": 97,
        "frame": {
          "x": 36,
          "y": 0,
          "w": 35,
          "h": 57
        }
      },
      "overall": 51.9,
      "tier": "C",
      "candidateIndex": 47
    },
    {
      "id": "knight",
      "name": "기사",
      "category": "Melee",
      "tags": [
        "AD",
        "CC",
        "Frontline",
        "Melee",
        "Shield",
        "Summon",
        "Tank"
      ],
      "rawTags": [
        "AD",
        "Tank",
        "CC",
        "Shield"
      ],
      "description": {
        "skill": "대상 하나를 지정하여 {Time}초 동안 도발을 부여한다.",
        "skill2": "{Time}초 동안 지속되는 보호막을 자신에게 부여한다(보호막 수치: 최대 체력의 {Coef}% + {Amount}). 보호막이 유지되는 동안 입은 피해량의 20%를 반사한다.",
        "ult": "지정한 위치에 {Time}초 동안 유지되는 60 범위의 방어 영역을 소환한다. 영역 내의 아군은 받는 피해량이 {Coef}% + 최대 체력의 {HpCoef}% 감소한다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 0,
        "hp": 1100,
        "defence": 40,
        "magicResistance": 30,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.75,
        "range": 25
      },
      "growth": {
        "attack": 6,
        "magicPower": 0,
        "hp": 120,
        "defence": 10,
        "magicResistance": 5,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "knight_1",
          "cooltime": "3.00",
          "description": "대상 하나를 지정하여 {Time}초 동안 도발을 부여한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "knight_2",
          "cooltime": "8.00",
          "description": "{Time}초 동안 지속되는 보호막을 자신에게 부여한다(보호막 수치: 최대 체력의 {Coef}% + {Amount}). 보호막이 유지되는 동안 입은 피해량의 20%를 반사한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "knight_4",
          "cooltime": "40.00",
          "description": "지정한 위치에 {Time}초 동안 유지되는 60 범위의 방어 영역을 소환한다. 영역 내의 아군은 받는 피해량이 {Coef}% + 최대 체력의 {HpCoef}% 감소한다."
        }
      ],
      "metrics": {
        "damage": 65.48,
        "durability": 225.2,
        "utility": 45.6,
        "scaling": 39.4,
        "mobility": 15.0,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 570.0,
        "damageNorm": 0.0,
        "durabilityNorm": 99.3,
        "utilityNorm": 95.0,
        "scalingNorm": 0.0,
        "mobilityNorm": 5.1
      },
      "roleFit": {
        "top": 97.6,
        "jungle": 57.0,
        "mid": 27.7,
        "bot": 19.5,
        "support": 62.5
      },
      "bestRole": "top",
      "asset": {
        "sheet": "assets/champions/knight.png",
        "sheetWidth": 2882,
        "sheetHeight": 200,
        "frame": {
          "x": 46,
          "y": 0,
          "w": 45,
          "h": 51
        }
      },
      "overall": 51.3,
      "tier": "C",
      "candidateIndex": 1
    },
    {
      "id": "werewolf",
      "name": "늑대인간",
      "category": "Assassin",
      "tags": [
        "AD",
        "AOE",
        "Assassin",
        "CC",
        "Heal",
        "Mobility"
      ],
      "rawTags": [
        "AD",
        "Heal",
        "CC"
      ],
      "description": {
        "skill": "전방 반달모양 범위를 할퀴며 적에게 50 + 공격력의 60% 만큼의 물리 피해를 입히고 피해량의 10%만큼 체력을 회복한다.",
        "skill2": "전방으로 돌진하여 적중한 적에게 50 + 공격력의 60% 만큼의 물리 피해를 입히고 1.00초 동안 20% 둔화시킨다.",
        "ult": "1.67초 동안 사용 방향의 부채꼴 범위 내 적들에게 반복적으로 20 + 공격력의 25% 만큼의 물리 피해를 입히고 {BleedTime}초 동안 출혈 효과를 부여한다. (출혈: {BleedDamage} + 공격력의 {BleedCoef}%)"
      },
      "stats": {
        "attack": 120,
        "magicPower": 0,
        "hp": 900,
        "defence": 25,
        "magicResistance": 15,
        "moveSpeed": 1100,
        "moveSpeedDisplay": 66.0,
        "attackSpeed": 1.2,
        "range": 25
      },
      "growth": {
        "attack": 22,
        "magicPower": 0,
        "hp": 80,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.72,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "werewolf_1",
          "cooltime": "8.00",
          "description": "전방 반달모양 범위를 할퀴며 적에게 50 + 공격력의 60% 만큼의 물리 피해를 입히고 피해량의 10%만큼 체력을 회복한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "werewolf_2",
          "cooltime": "10.00",
          "description": "전방으로 돌진하여 적중한 적에게 50 + 공격력의 60% 만큼의 물리 피해를 입히고 1.00초 동안 20% 둔화시킨다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "werewolf_4",
          "cooltime": "50.00",
          "description": "1.67초 동안 사용 방향의 부채꼴 범위 내 적들에게 반복적으로 20 + 공격력의 25% 만큼의 물리 피해를 입히고 {BleedTime}초 동안 출혈 효과를 부여한다. (출혈: {BleedDamage} + 공격력의 {BleedCoef}%)"
        }
      ],
      "metrics": {
        "damage": 140.46,
        "durability": 118.25,
        "utility": 0.8,
        "scaling": 58.7,
        "mobility": 41.5,
        "cc": 0.0,
        "heal": 10.0,
        "shield": 0.0,
        "damageNorm": 65.9,
        "durabilityNorm": 8.1,
        "utilityNorm": 1.7,
        "scalingNorm": 55.9,
        "mobilityNorm": 94.9
      },
      "roleFit": {
        "top": 37.1,
        "jungle": 95.1,
        "mid": 87.7,
        "bot": 27.0,
        "support": 23.3
      },
      "bestRole": "jungle",
      "asset": {
        "sheet": "assets/champions/werewolf.png",
        "sheetWidth": 2974,
        "sheetHeight": 114,
        "frame": {
          "x": 52,
          "y": 0,
          "w": 51,
          "h": 61
        }
      },
      "overall": 50.7,
      "tier": "C",
      "candidateIndex": 30
    },
    {
      "id": "dark_mage",
      "name": "흑마술사",
      "category": "Magician",
      "tags": [
        "AOE",
        "AP",
        "CC",
        "Magic",
        "Magician",
        "Poke"
      ],
      "rawTags": [
        "AP",
        "CC",
        "Magic"
      ],
      "description": {
        "skill": "일직선으로 암흑 화살을 발사해 적중한 적에게 60 + 주문력의 100% 만큼의 마법 피해를 입히며 {Time}초 동안 속박시킨다.",
        "skill2": "일정 범위를 잠시 후 암흑으로 뒤덮으며 해당 범위 내에 있는 적에게 80 + 주문력의 100% 만큼의 마법 피해를 입힌다.",
        "ult": "80 범위 내의 적 챔피언을 저주하여 0.60초 동안 가장 가까운 아군 챔피언과 연결한다. 연결된 대상이 피해를 받으면 {ShareRatio}%가 연결된 상대에게도 전이된다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 40,
        "hp": 900,
        "defence": 20,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.67,
        "range": 60
      },
      "growth": {
        "attack": 6,
        "magicPower": 20,
        "hp": 100,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "dark_mage_1",
          "cooltime": "4.67",
          "description": "일직선으로 암흑 화살을 발사해 적중한 적에게 60 + 주문력의 100% 만큼의 마법 피해를 입히며 {Time}초 동안 속박시킨다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "dark_mage_2",
          "cooltime": "6.00",
          "description": "일정 범위를 잠시 후 암흑으로 뒤덮으며 해당 범위 내에 있는 적에게 80 + 주문력의 100% 만큼의 마법 피해를 입힌다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "dark_mage_4",
          "cooltime": "50.00",
          "description": "80 범위 내의 적 챔피언을 저주하여 0.60초 동안 가장 가까운 아군 챔피언과 연결한다. 연결된 대상이 피해를 받으면 {ShareRatio}%가 연결된 상대에게도 전이된다."
        }
      ],
      "metrics": {
        "damage": 136.68,
        "durability": 116.5,
        "utility": 7.0,
        "scaling": 67.5,
        "mobility": 15.0,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 62.6,
        "durabilityNorm": 6.6,
        "utilityNorm": 14.6,
        "scalingNorm": 81.4,
        "mobilityNorm": 5.1
      },
      "roleFit": {
        "top": 30.8,
        "jungle": 20.3,
        "mid": 100,
        "bot": 40.2,
        "support": 32.6
      },
      "bestRole": "mid",
      "asset": {
        "sheet": "assets/champions/dark_mage.png",
        "sheetWidth": 2452,
        "sheetHeight": 186,
        "frame": {
          "x": 26,
          "y": 0,
          "w": 27,
          "h": 51
        }
      },
      "overall": 50.0,
      "tier": "C",
      "candidateIndex": 38
    },
    {
      "id": "magic_knight",
      "name": "마검사",
      "category": "Melee",
      "tags": [
        "AD",
        "AOE",
        "AP",
        "CC",
        "DOT",
        "Frontline",
        "Magic",
        "Melee"
      ],
      "rawTags": [
        "AD",
        "AP",
        "CC",
        "Magic"
      ],
      "description": {
        "skill": "일직선의 길고 좁은 범위에 마력을 폭발시켜 80 + 주문력의 80% 만큼의 마법 피해를 입힌다.",
        "skill2": "좁은 범위에 0.57초 동안 유지되는 마력 핵을 생성하여 35 범위 내 적들을 2.00초마다 조금씩 중심 방향으로 당겨오며 10 + 주문력의 20% 만큼의 마법 피해를 입힌다.",
        "ult": "{Time}초 동안 사거리가 {Range} 증가하고 공격속도가 {AttackSpeed}% + 주문력의 {AttackSpeedCoef}% 증가하며, 일반 공격을 할 때마다 첫 번째 스킬이 발동된다."
      },
      "stats": {
        "attack": 120,
        "magicPower": 10,
        "hp": 900,
        "defence": 25,
        "magicResistance": 15,
        "moveSpeed": 1100,
        "moveSpeedDisplay": 66.0,
        "attackSpeed": 1.2,
        "range": 26
      },
      "growth": {
        "attack": 25,
        "magicPower": 5,
        "hp": 90,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.72,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "magic_knight_1",
          "cooltime": "5.00",
          "description": "일직선의 길고 좁은 범위에 마력을 폭발시켜 80 + 주문력의 80% 만큼의 마법 피해를 입힌다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "magic_knight_2",
          "cooltime": "8.33",
          "description": "좁은 범위에 0.57초 동안 유지되는 마력 핵을 생성하여 35 범위 내 적들을 2.00초마다 조금씩 중심 방향으로 당겨오며 10 + 주문력의 20% 만큼의 마법 피해를 입힌다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "magic_knight_4",
          "cooltime": "40.00",
          "description": "{Time}초 동안 사거리가 {Range} 증가하고 공격속도가 {AttackSpeed}% + 주문력의 {AttackSpeedCoef}% 증가하며, 일반 공격을 할 때마다 첫 번째 스킬이 발동된다."
        }
      ],
      "metrics": {
        "damage": 137.8,
        "durability": 129.75,
        "utility": 0.0,
        "scaling": 73.9,
        "mobility": 16.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 63.6,
        "durabilityNorm": 17.9,
        "utilityNorm": 0.0,
        "scalingNorm": 100.0,
        "mobilityNorm": 10.2
      },
      "roleFit": {
        "top": 85.9,
        "jungle": 60.5,
        "mid": 32.3,
        "bot": 26.7,
        "support": 34.0
      },
      "bestRole": "top",
      "asset": {
        "sheet": "assets/champions/magic_knight.png",
        "sheetWidth": 2798,
        "sheetHeight": 97,
        "frame": {
          "x": 30,
          "y": 0,
          "w": 33,
          "h": 57
        }
      },
      "overall": 49.9,
      "tier": "C",
      "candidateIndex": 11
    },
    {
      "id": "illusionist",
      "name": "환영술사",
      "category": "Magician",
      "tags": [
        "AOE",
        "AP",
        "CC",
        "Magic",
        "Magician",
        "Poke",
        "Summon"
      ],
      "rawTags": [
        "AP",
        "CC",
        "Magic"
      ],
      "description": {
        "skill": "적을 교란시키는 투사체를 발사하여 60 + 주문력의 100% 만큼의 마법 피해를 입히고, 적 앞에 환영술사의 분신을 소환하여 {Time}초간 도발한다.",
        "skill2": "60 범위 내의 적들에게 120 + 주문력의 100% 만큼의 마법 피해를 입히며 {Time}초 동안 공포를 부여한다.",
        "ult": "근처의 아군 챔피언 한 명의 환영을 만들어 0.57초간 유지한다. 환영은 일반 공격만 가능하며, 복제한 챔피언과 동등한 능력치를 가진다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 40,
        "hp": 900,
        "defence": 20,
        "magicResistance": 20,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 0.67,
        "range": 60
      },
      "growth": {
        "attack": 6,
        "magicPower": 20,
        "hp": 100,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "illusionist_1",
          "cooltime": "5.00",
          "description": "적을 교란시키는 투사체를 발사하여 60 + 주문력의 100% 만큼의 마법 피해를 입히고, 적 앞에 환영술사의 분신을 소환하여 {Time}초간 도발한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "illusionist_2",
          "cooltime": "5.00",
          "description": "60 범위 내의 적들에게 120 + 주문력의 100% 만큼의 마법 피해를 입히며 {Time}초 동안 공포를 부여한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "illusionist_4",
          "cooltime": "50.00",
          "description": "근처의 아군 챔피언 한 명의 환영을 만들어 0.57초간 유지한다. 환영은 일반 공격만 가능하며, 복제한 챔피언과 동등한 능력치를 가진다."
        }
      ],
      "metrics": {
        "damage": 137.88,
        "durability": 116.5,
        "utility": 7.0,
        "scaling": 67.5,
        "mobility": 13.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 63.7,
        "durabilityNorm": 6.6,
        "utilityNorm": 14.6,
        "scalingNorm": 81.4,
        "mobilityNorm": 0.0
      },
      "roleFit": {
        "top": 30.8,
        "jungle": 20.1,
        "mid": 100,
        "bot": 40.2,
        "support": 32.6
      },
      "bestRole": "mid",
      "asset": {
        "sheet": "assets/champions/illusionist.png",
        "sheetWidth": 2226,
        "sheetHeight": 116,
        "frame": {
          "x": 24,
          "y": 0,
          "w": 23,
          "h": 57
        }
      },
      "overall": 49.8,
      "tier": "C",
      "candidateIndex": 41
    },
    {
      "id": "berserker",
      "name": "광전사",
      "category": "Melee",
      "tags": [
        "AD",
        "CC",
        "Frontline",
        "Heal",
        "Melee",
        "Mobility"
      ],
      "rawTags": [
        "AD"
      ],
      "description": {
        "skill": "0.17초 동안 분노하여 공격속도가 50% 상승하고 30%의 흡혈을 획득한다.",
        "skill2": "양손으로 바닥을 내려찍어 좁은 범위의 적을 0.50초 동안 에어본시키고 80 + 공격력의 70% 만큼의 물리 피해를 입힌다.",
        "ult": "60 거리 내의 지정한 적에게 돌진하여 적을 내려찍으며 100 + 공격력의 60% 만큼의 물리 피해를 입힌다. 잃은 체력에 비례하여 재사용 대기시간이 감소한다."
      },
      "stats": {
        "attack": 120,
        "magicPower": 0,
        "hp": 900,
        "defence": 25,
        "magicResistance": 15,
        "moveSpeed": 1100,
        "moveSpeedDisplay": 66.0,
        "attackSpeed": 1.2,
        "range": 25
      },
      "growth": {
        "attack": 20,
        "magicPower": 0,
        "hp": 90,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.72,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "berserker_1",
          "cooltime": "6.00",
          "description": "0.17초 동안 분노하여 공격속도가 50% 상승하고 30%의 흡혈을 획득한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "berserker_2",
          "cooltime": "7.00",
          "description": "양손으로 바닥을 내려찍어 좁은 범위의 적을 0.50초 동안 에어본시키고 80 + 공격력의 70% 만큼의 물리 피해를 입힌다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "berserker_4",
          "cooltime": "60.00",
          "description": "60 거리 내의 지정한 적에게 돌진하여 적을 내려찍으며 100 + 공격력의 60% 만큼의 물리 피해를 입힌다. 잃은 체력에 비례하여 재사용 대기시간이 감소한다."
        }
      ],
      "metrics": {
        "damage": 137.4,
        "durability": 131.25,
        "utility": 2.4,
        "scaling": 55.9,
        "mobility": 41.5,
        "cc": 0.0,
        "heal": 30.0,
        "shield": 0.0,
        "damageNorm": 63.2,
        "durabilityNorm": 19.2,
        "utilityNorm": 5.0,
        "scalingNorm": 47.8,
        "mobilityNorm": 94.9
      },
      "roleFit": {
        "top": 86.0,
        "jungle": 64.0,
        "mid": 31.4,
        "bot": 26.6,
        "support": 43.8
      },
      "bestRole": "top",
      "asset": {
        "sheet": "assets/champions/berserker.png",
        "sheetWidth": 4096,
        "sheetHeight": 259,
        "frame": {
          "x": 44,
          "y": 0,
          "w": 43,
          "h": 57
        }
      },
      "overall": 49.4,
      "tier": "C",
      "candidateIndex": 12
    },
    {
      "id": "pyromancer",
      "name": "화염술사",
      "category": "Magician",
      "tags": [
        "AOE",
        "AP",
        "DOT",
        "Dot",
        "Magic",
        "Magician",
        "Summon"
      ],
      "rawTags": [
        "AP",
        "Dot",
        "Magic"
      ],
      "description": {
        "skill": "화염구를 떨어트려 90 범위 내 적에게 60 + 주문력의 70% 만큼의 마법 피해를 입힌다.",
        "skill2": "지정한 영역에 0.50초 동안 지속되는 화염 장판을 소환하여 90 범위 내의 적들에게 {Tick}초마다 20 + 주문력의 5% 만큼의 마법 피해를 입힌다.",
        "ult": "90 범위 내에 거대한 폭발을 일으켜 폭발 범위 내의 모든 적에게 150 + 주문력의 70% 만큼의 마법 피해를 입힌다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 40,
        "hp": 900,
        "defence": 20,
        "magicResistance": 20,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 0.67,
        "range": 60
      },
      "growth": {
        "attack": 6,
        "magicPower": 20,
        "hp": 100,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "pyromancer_1",
          "cooltime": "3.33",
          "description": "화염구를 떨어트려 90 범위 내 적에게 60 + 주문력의 70% 만큼의 마법 피해를 입힌다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "pyromancer_2",
          "cooltime": "8.33",
          "description": "지정한 영역에 0.50초 동안 지속되는 화염 장판을 소환하여 90 범위 내의 적들에게 {Tick}초마다 20 + 주문력의 5% 만큼의 마법 피해를 입힌다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "pyromancer_4",
          "cooltime": "50.00",
          "description": "90 범위 내에 거대한 폭발을 일으켜 폭발 범위 내의 모든 적에게 150 + 주문력의 70% 만큼의 마법 피해를 입힌다."
        }
      ],
      "metrics": {
        "damage": 149.58,
        "durability": 116.5,
        "utility": 0.0,
        "scaling": 67.5,
        "mobility": 13.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 74.0,
        "durabilityNorm": 6.6,
        "utilityNorm": 0.0,
        "scalingNorm": 81.4,
        "mobilityNorm": 0.0
      },
      "roleFit": {
        "top": 31.3,
        "jungle": 20.6,
        "mid": 100,
        "bot": 41.1,
        "support": 28.0
      },
      "bestRole": "mid",
      "asset": {
        "sheet": "assets/champions/pyromancer.png",
        "sheetWidth": 4096,
        "sheetHeight": 324,
        "frame": {
          "x": 30,
          "y": 0,
          "w": 27,
          "h": 51
        }
      },
      "overall": 49.3,
      "tier": "C",
      "candidateIndex": 8
    },
    {
      "id": "bomber",
      "name": "폭탄병",
      "category": "Range",
      "tags": [
        "AD",
        "AOE",
        "Backline",
        "CC",
        "Range"
      ],
      "rawTags": [
        "AD"
      ],
      "description": {
        "skill": "폭탄을 던져 범위 내의 모든 적에게 100 + 공격력의 100% 만큼의 물리 피해를 입힌다.",
        "skill2": "적에게 보이지 않는 지뢰를 설치하여 적이 밟았을 경우 80 + 공격력의 100% 만큼의 물리 피해를 입히고 {Time}초 동안 속박시킨다. 지뢰는 미니언에게 발동되지 않는다.",
        "ult": "지정한 위치에 대형 폭탄을 투척하여 범위 내 모든 적에게 150 + 공격력의 100% 만큼의 물리 피해를 입히고 2.00초 동안 30% 둔화시킨다."
      },
      "stats": {
        "attack": 100,
        "magicPower": 0,
        "hp": 900,
        "defence": 20,
        "magicResistance": 15,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 0.67,
        "range": 60
      },
      "growth": {
        "attack": 20,
        "magicPower": 0,
        "hp": 90,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "bomber_1",
          "cooltime": "2.67",
          "description": "폭탄을 던져 범위 내의 모든 적에게 100 + 공격력의 100% 만큼의 물리 피해를 입힌다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "bomber_2",
          "cooltime": "8.00",
          "description": "적에게 보이지 않는 지뢰를 설치하여 적이 밟았을 경우 80 + 공격력의 100% 만큼의 물리 피해를 입히고 {Time}초 동안 속박시킨다. 지뢰는 미니언에게 발동되지 않는다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "bomber_4",
          "cooltime": "60.00",
          "description": "지정한 위치에 대형 폭탄을 투척하여 범위 내 모든 적에게 150 + 공격력의 100% 만큼의 물리 피해를 입히고 2.00초 동안 30% 둔화시킨다."
        }
      ],
      "metrics": {
        "damage": 172.0,
        "durability": 108.75,
        "utility": 3.6,
        "scaling": 55.9,
        "mobility": 13.5,
        "cc": 30.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 93.7,
        "durabilityNorm": 0.0,
        "utilityNorm": 7.5,
        "scalingNorm": 47.8,
        "mobilityNorm": 0.0
      },
      "roleFit": {
        "top": 33.6,
        "jungle": 24.0,
        "mid": 39.5,
        "bot": 100,
        "support": 22.9
      },
      "bestRole": "bot",
      "asset": {
        "sheet": "assets/champions/bomber.png",
        "sheetWidth": 4096,
        "sheetHeight": 371,
        "frame": {
          "x": 22,
          "y": 0,
          "w": 21,
          "h": 51
        }
      },
      "overall": 48.8,
      "tier": "C",
      "candidateIndex": 51
    },
    {
      "id": "necromancer",
      "name": "네크로맨서",
      "category": "Magician",
      "tags": [
        "AP",
        "Magician",
        "Mobility",
        "Summon"
      ],
      "rawTags": [
        "AP"
      ],
      "description": {
        "skill": "구울을 소환하여 0.57(+주문력의 {DurationCoef}%)초 동안 수하로 부린다. 레벨에 비례하여 스킬의 재사용 대기시간이 감소하며 구울의 지속시간이 {DurationPerLevel}초씩 증가한다.",
        "skill2": "적 하나를 3.00초 동안 공격대상으로 지정하여 구울을 광폭화시킨다. 구울의 공격속도가 50% + 주문력의 {AttackSpeedCoef}%, 이동속도가 30% + 주문력의 {MoveSpeedCoef}% 증가한다.",
        "ult": "사망한 아군 챔피언을 되살려 망령으로 소환한다. 소환 유지 중 매초 체력이 {HpDrain}씩 소모된다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 40,
        "hp": 900,
        "defence": 20,
        "magicResistance": 20,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 0.67,
        "range": 60
      },
      "growth": {
        "attack": 6,
        "magicPower": 20,
        "hp": 100,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "necromancer_1",
          "cooltime": "5.00",
          "description": "구울을 소환하여 0.57(+주문력의 {DurationCoef}%)초 동안 수하로 부린다. 레벨에 비례하여 스킬의 재사용 대기시간이 감소하며 구울의 지속시간이 {DurationPerLevel}초씩 증가한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "necromancer_2",
          "cooltime": "5.00",
          "description": "적 하나를 3.00초 동안 공격대상으로 지정하여 구울을 광폭화시킨다. 구울의 공격속도가 50% + 주문력의 {AttackSpeedCoef}%, 이동속도가 30% + 주문력의 {MoveSpeedCoef}% 증가한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "necromancer_4",
          "cooltime": "60.00",
          "description": "사망한 아군 챔피언을 되살려 망령으로 소환한다. 소환 유지 중 매초 체력이 {HpDrain}씩 소모된다."
        }
      ],
      "metrics": {
        "damage": 106.08,
        "durability": 116.5,
        "utility": 0.0,
        "scaling": 67.5,
        "mobility": 38.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 35.7,
        "durabilityNorm": 6.6,
        "utilityNorm": 0.0,
        "scalingNorm": 81.4,
        "mobilityNorm": 84.7
      },
      "roleFit": {
        "top": 29.6,
        "jungle": 22.2,
        "mid": 100,
        "bot": 39.0,
        "support": 28.0
      },
      "bestRole": "mid",
      "asset": {
        "sheet": "assets/champions/necromancer.png",
        "sheetWidth": 2396,
        "sheetHeight": 168,
        "frame": {
          "x": 44,
          "y": 0,
          "w": 43,
          "h": 63
        }
      },
      "overall": 47.5,
      "tier": "C",
      "candidateIndex": 32
    },
    {
      "id": "priest",
      "name": "성직자",
      "category": "Util",
      "tags": [
        "AOE",
        "AP",
        "DOT",
        "Heal",
        "Poke",
        "Range",
        "Shield",
        "Util"
      ],
      "rawTags": [
        "Shield",
        "Heal",
        "Range",
        "AP"
      ],
      "description": {
        "skill": "0.33초 동안 유지되는 70 범위의 회복 장판을 설치하여 {Tick}초마다 장판 위의 아군 체력을 8 + 주문력의 20% 만큼 회복시킨다.",
        "skill2": "아군 1명에게 {Time}초 동안 {Value} + 주문력의 {Coef}% 만큼의 보호막을 부여한다. 보호막이 유지되는 동안 아군의 공격속도가 30% 증가한다.",
        "ult": "{Time}초 동안 공중에 날아올라 고정되어, 궁극기 사거리 범위 내 체력이 가장 낮은 아군에게 매 5.00초마다 체력을 20 + 주문력의 {Coef}% 만큼 회복시키는 탄환을 발사한다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 30,
        "hp": 900,
        "defence": 20,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.67,
        "range": 60
      },
      "growth": {
        "attack": 6,
        "magicPower": 15,
        "hp": 80,
        "defence": 8,
        "magicResistance": 4,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "priest_1",
          "cooltime": "5.00",
          "description": "0.33초 동안 유지되는 70 범위의 회복 장판을 설치하여 {Tick}초마다 장판 위의 아군 체력을 8 + 주문력의 20% 만큼 회복시킨다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "priest_2",
          "cooltime": "6.00",
          "description": "아군 1명에게 {Time}초 동안 {Value} + 주문력의 {Coef}% 만큼의 보호막을 부여한다. 보호막이 유지되는 동안 아군의 공격속도가 30% 증가한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "priest_4",
          "cooltime": "40.00",
          "description": "{Time}초 동안 공중에 날아올라 고정되어, 궁극기 사거리 범위 내 체력이 가장 낮은 아군에게 매 5.00초마다 체력을 20 + 주문력의 {Coef}% 만큼 회복시키는 탄환을 발사한다."
        }
      ],
      "metrics": {
        "damage": 99.38,
        "durability": 128.6,
        "utility": 24.44,
        "scaling": 59.4,
        "mobility": 15.0,
        "cc": 0.0,
        "heal": 98.0,
        "shield": 120.0,
        "damageNorm": 29.8,
        "durabilityNorm": 16.9,
        "utilityNorm": 50.9,
        "scalingNorm": 58.0,
        "mobilityNorm": 5.1
      },
      "roleFit": {
        "top": 26.3,
        "jungle": 16.6,
        "mid": 34.1,
        "bot": 29.1,
        "support": 100
      },
      "bestRole": "support",
      "asset": {
        "sheet": "assets/champions/priest.png",
        "sheetWidth": 4096,
        "sheetHeight": 463,
        "frame": {
          "x": 26,
          "y": 0,
          "w": 25,
          "h": 51
        }
      },
      "overall": 47.3,
      "tier": "C",
      "candidateIndex": 5
    },
    {
      "id": "lightning_mage",
      "name": "번개술사",
      "category": "Magician",
      "tags": [
        "AOE",
        "AP",
        "CC",
        "Magic",
        "Magician",
        "Poke"
      ],
      "rawTags": [
        "AP",
        "CC",
        "Magic"
      ],
      "description": {
        "skill": "지정한 적에게 번개를 발사하여 20 + 주문력의 40% 만큼의 마법 피해를 입힌다. 번개는 범위 내에 대상이 있으면 계속해서 퍼져 나가며, 중복 대상에게 적용되지 않는다.",
        "skill2": "지정한 범위에 번개를 내려쳐 적중한 적들에게 60 + 주문력의 80% 만큼의 마법 피해를 입히고 0.50초 동안 기절시킨다.",
        "ult": "적 챔피언에게 0.47초 동안 채널링하며 번개 광선을 발사한다. 채널링 동안 대상을 기절시키고 주변 적에게 15 + 주문력의 20% 만큼의 마법 피해를 지속적으로 입힌다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 40,
        "hp": 900,
        "defence": 20,
        "magicResistance": 20,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 0.67,
        "range": 60
      },
      "growth": {
        "attack": 6,
        "magicPower": 20,
        "hp": 100,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "lightning_mage_1",
          "cooltime": null,
          "description": "지정한 적에게 번개를 발사하여 20 + 주문력의 40% 만큼의 마법 피해를 입힌다. 번개는 범위 내에 대상이 있으면 계속해서 퍼져 나가며, 중복 대상에게 적용되지 않는다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "lightning_mage_2",
          "cooltime": "6.00",
          "description": "지정한 범위에 번개를 내려쳐 적중한 적들에게 60 + 주문력의 80% 만큼의 마법 피해를 입히고 0.50초 동안 기절시킨다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "lightning_mage_4",
          "cooltime": "50.00",
          "description": "적 챔피언에게 0.47초 동안 채널링하며 번개 광선을 발사한다. 채널링 동안 대상을 기절시키고 주변 적에게 15 + 주문력의 20% 만큼의 마법 피해를 지속적으로 입힌다."
        }
      ],
      "metrics": {
        "damage": 124.98,
        "durability": 116.5,
        "utility": 7.0,
        "scaling": 67.5,
        "mobility": 13.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 52.3,
        "durabilityNorm": 6.6,
        "utilityNorm": 14.6,
        "scalingNorm": 81.4,
        "mobilityNorm": 0.0
      },
      "roleFit": {
        "top": 30.3,
        "jungle": 19.5,
        "mid": 100,
        "bot": 39.3,
        "support": 32.6
      },
      "bestRole": "mid",
      "asset": {
        "sheet": "assets/champions/lightning_mage.png",
        "sheetWidth": 2128,
        "sheetHeight": 106,
        "frame": {
          "x": 30,
          "y": 0,
          "w": 29,
          "h": 57
        }
      },
      "overall": 47.2,
      "tier": "C",
      "candidateIndex": 42
    },
    {
      "id": "prisoner",
      "name": "죄수",
      "category": "Melee",
      "tags": [
        "AD",
        "AOE",
        "CC",
        "Frontline",
        "Melee",
        "Mobility",
        "Shield",
        "Tank"
      ],
      "rawTags": [
        "AD",
        "Tank",
        "CC"
      ],
      "description": {
        "skill": "일직선으로 철구를 던져 범위 내의 모든 적에게 80 + 공격력의 100% 만큼의 물리 피해를 입힌다.",
        "skill2": "괴성을 질러 {Time}초 동안 200 + 최대 체력의 {Coef}% 만큼의 보호막을 획득하며 주변 범위 내의 모든 적에게 도발 효과를 부여한다.",
        "ult": "지정한 적에게 돌진하여 착지 지점 주변의 모든 적에게 100 + 공격력의 100%만큼의 물리 피해를 입히고 1.00초 동안 기절시킨다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 0,
        "hp": 1100,
        "defence": 40,
        "magicResistance": 30,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.86,
        "range": 28
      },
      "growth": {
        "attack": 6,
        "magicPower": 0,
        "hp": 120,
        "defence": 10,
        "magicResistance": 5,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "prisoner_1",
          "cooltime": "4.00",
          "description": "일직선으로 철구를 던져 범위 내의 모든 적에게 80 + 공격력의 100% 만큼의 물리 피해를 입힌다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "prisoner_2",
          "cooltime": "5.00",
          "description": "괴성을 질러 {Time}초 동안 200 + 최대 체력의 {Coef}% 만큼의 보호막을 획득하며 주변 범위 내의 모든 적에게 도발 효과를 부여한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "prisoner_4",
          "cooltime": "30.00",
          "description": "지정한 적에게 돌진하여 착지 지점 주변의 모든 적에게 100 + 공격력의 100%만큼의 물리 피해를 입히고 1.00초 동안 기절시킨다."
        }
      ],
      "metrics": {
        "damage": 121.88,
        "durability": 191.0,
        "utility": 0.0,
        "scaling": 39.4,
        "mobility": 40.0,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 49.6,
        "durabilityNorm": 70.1,
        "utilityNorm": 0.0,
        "scalingNorm": 0.0,
        "mobilityNorm": 89.8
      },
      "roleFit": {
        "top": 97.2,
        "jungle": 63.1,
        "mid": 29.5,
        "bot": 24.5,
        "support": 47.0
      },
      "bestRole": "top",
      "asset": {
        "sheet": "assets/champions/prisoner.png",
        "sheetWidth": 2430,
        "sheetHeight": 128,
        "frame": {
          "x": 28,
          "y": 0,
          "w": 27,
          "h": 49
        }
      },
      "overall": 46.6,
      "tier": "C",
      "candidateIndex": 50
    },
    {
      "id": "dokkaebi",
      "name": "도깨비",
      "category": "Melee",
      "tags": [
        "AD",
        "AOE",
        "CC",
        "Frontline",
        "Melee",
        "Mobility",
        "Shield",
        "Tank"
      ],
      "rawTags": [
        "AD",
        "Tank",
        "Shield"
      ],
      "description": {
        "skill": "0.20초 동안 방망이를 강화하여 적을 공격할 때 부채꼴로 퍼지는 충격파를 발생시킨다. 충격파는 {Damage} + 공격력의 {Coef}% 만큼의 물리 피해를 입힌다.",
        "skill2": "0.20초 동안 피부를 강화하여 200 + 공격력의 {Coef}% 만큼의 보호막과 피해감소 40% 효과를 부여한다.",
        "ult": "일직선으로 투사체를 날려 적중한 적의 이동속도를 {SlowTime}초에 걸쳐 점점 둔화시킨 뒤 0.47초간 속박한다. 속박 시 주변에 150 + 공격력의 100%만큼 물리 피해를 입히며, 피해를 입은 적에게도 동일 효과가 번진다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 0,
        "hp": 1100,
        "defence": 40,
        "magicResistance": 30,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 1.0,
        "range": 25
      },
      "growth": {
        "attack": 6,
        "magicPower": 0,
        "hp": 100,
        "defence": 10,
        "magicResistance": 10,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "dokkaebi_1",
          "cooltime": null,
          "description": "0.20초 동안 방망이를 강화하여 적을 공격할 때 부채꼴로 퍼지는 충격파를 발생시킨다. 충격파는 {Damage} + 공격력의 {Coef}% 만큼의 물리 피해를 입힌다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "dokkaebi_2",
          "cooltime": "5.00",
          "description": "0.20초 동안 피부를 강화하여 200 + 공격력의 {Coef}% 만큼의 보호막과 피해감소 40% 효과를 부여한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "dokkaebi_4",
          "cooltime": "30.00",
          "description": "일직선으로 투사체를 날려 적중한 적의 이동속도를 {SlowTime}초에 걸쳐 점점 둔화시킨 뒤 0.47초간 속박한다. 속박 시 주변에 150 + 공격력의 100%만큼 물리 피해를 입히며, 피해를 입은 적에게도 동일 효과가 번진다."
        }
      ],
      "metrics": {
        "damage": 110.48,
        "durability": 191.0,
        "utility": 0.0,
        "scaling": 43.8,
        "mobility": 40.0,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 39.6,
        "durabilityNorm": 70.1,
        "utilityNorm": 0.0,
        "scalingNorm": 12.8,
        "mobilityNorm": 89.8
      },
      "roleFit": {
        "top": 96.7,
        "jungle": 62.6,
        "mid": 29.0,
        "bot": 24.0,
        "support": 47.0
      },
      "bestRole": "top",
      "asset": {
        "sheet": "assets/champions/dokkaebi.png",
        "sheetWidth": 4096,
        "sheetHeight": 193,
        "frame": {
          "x": 36,
          "y": 0,
          "w": 35,
          "h": 49
        }
      },
      "overall": 46.3,
      "tier": "C",
      "candidateIndex": 31
    },
    {
      "id": "executioner",
      "name": "처형인",
      "category": "Melee",
      "tags": [
        "AD",
        "CC",
        "DOT",
        "Frontline",
        "Heal",
        "Melee",
        "Poke",
        "Shield"
      ],
      "rawTags": [
        "AD",
        "CC"
      ],
      "description": {
        "skill": "갈고리를 발사하여 적중한 적에게 30 + 공격력의 100% 만큼의 물리 피해를 입히며 자신의 앞으로 당겨온다.",
        "skill2": "적 하나를 갈고리로 그어 50 + 공격력의 80% 만큼의 물리 피해를 입히고 0.50초 동안 출혈시킨다. 출혈 피해를 입은 적은 2.00초마다 {TickDamage} + 공격력의 {TickCoef}% 만큼의 물리 피해를 입으며, 받는 피해량이 {Debuff}% 증가한다.",
        "ult": "전방 130 범위의 반원 영역의 적을 갈고리로 휩쓸어 100 + 공격력의 50% 만큼의 물리 피해를 입히며, {Time}초 동안 회복 불가 상태로 만든다."
      },
      "stats": {
        "attack": 100,
        "magicPower": 0,
        "hp": 1000,
        "defence": 30,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.86,
        "range": 25
      },
      "growth": {
        "attack": 20,
        "magicPower": 0,
        "hp": 90,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.72,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "executioner_1",
          "cooltime": "5.00",
          "description": "갈고리를 발사하여 적중한 적에게 30 + 공격력의 100% 만큼의 물리 피해를 입히며 자신의 앞으로 당겨온다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "executioner_2",
          "cooltime": "6.00",
          "description": "적 하나를 갈고리로 그어 50 + 공격력의 80% 만큼의 물리 피해를 입히고 0.50초 동안 출혈시킨다. 출혈 피해를 입은 적은 2.00초마다 {TickDamage} + 공격력의 {TickCoef}% 만큼의 물리 피해를 입으며, 받는 피해량이 {Debuff}% 증가한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "executioner_4",
          "cooltime": "60.00",
          "description": "전방 130 범위의 반원 영역의 적을 갈고리로 휩쓸어 100 + 공격력의 50% 만큼의 물리 피해를 입히며, {Time}초 동안 회복 불가 상태로 만든다."
        }
      ],
      "metrics": {
        "damage": 128.8,
        "durability": 152.0,
        "utility": 7.0,
        "scaling": 55.9,
        "mobility": 15.0,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 55.7,
        "durabilityNorm": 36.9,
        "utilityNorm": 14.6,
        "scalingNorm": 47.8,
        "mobilityNorm": 5.1
      },
      "roleFit": {
        "top": 87.3,
        "jungle": 59.9,
        "mid": 31.0,
        "bot": 25.0,
        "support": 43.6
      },
      "bestRole": "top",
      "asset": {
        "sheet": "assets/champions/executioner.png",
        "sheetWidth": 2574,
        "sheetHeight": 82,
        "frame": {
          "x": 38,
          "y": 0,
          "w": 37,
          "h": 61
        }
      },
      "overall": 45.1,
      "tier": "D",
      "candidateIndex": 13
    },
    {
      "id": "barrier_magician",
      "name": "결계사",
      "category": "Util",
      "tags": [
        "AOE",
        "AP",
        "CC",
        "Magic",
        "Shield",
        "Summon",
        "Util"
      ],
      "rawTags": [
        "AP",
        "Shield",
        "Magic"
      ],
      "description": {
        "skill": "지정한 영역에 0.50초 동안 유지되는 결계를 설치하며 결계 내의 아군에게 100 + 주문력의 60% 만큼의 보호막을 부여하며 적군의 공격속도를 50% 감소시킨다. 3레벨부터 범위가 증가하며 결계 내의 아군에게 공격속도를 추가로 부여하고 적군을 둔화시킨다.",
        "skill2": "지정한 영역에 0.50초 동안 유지되는 결계를 소환하여 해당 결계 내의 투사체를 모두 소멸시킨다.",
        "ult": "적 챔피언 주변에 점점 줄어드는 원형 결계를 설치한다. 결계의 테두리에 닿은 적은 100 + 주문력의 {Coef}% 만큼의 마법 피해를 입고 1.00초 동안 기절한다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 30,
        "hp": 900,
        "defence": 20,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.67,
        "range": 60
      },
      "growth": {
        "attack": 6,
        "magicPower": 15,
        "hp": 80,
        "defence": 8,
        "magicResistance": 4,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "barrier_magician_1",
          "cooltime": "6.00",
          "description": "지정한 영역에 0.50초 동안 유지되는 결계를 설치하며 결계 내의 아군에게 100 + 주문력의 60% 만큼의 보호막을 부여하며 적군의 공격속도를 50% 감소시킨다. 3레벨부터 범위가 증가하며 결계 내의 아군에게 공격속도를 추가로 부여하고 적군을 둔화시킨다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "barrier_magician_2",
          "cooltime": "8.00",
          "description": "지정한 영역에 0.50초 동안 유지되는 결계를 소환하여 해당 결계 내의 투사체를 모두 소멸시킨다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "barrier_magician_4",
          "cooltime": "50.00",
          "description": "적 챔피언 주변에 점점 줄어드는 원형 결계를 설치한다. 결계의 테두리에 닿은 적은 100 + 주문력의 {Coef}% 만큼의 마법 피해를 입고 1.00초 동안 기절한다."
        }
      ],
      "metrics": {
        "damage": 111.98,
        "durability": 126.1,
        "utility": 12.8,
        "scaling": 59.4,
        "mobility": 15.0,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 160.0,
        "damageNorm": 40.9,
        "durabilityNorm": 14.8,
        "utilityNorm": 26.7,
        "scalingNorm": 58.0,
        "mobilityNorm": 5.1
      },
      "roleFit": {
        "top": 26.6,
        "jungle": 17.1,
        "mid": 34.4,
        "bot": 30.0,
        "support": 100
      },
      "bestRole": "support",
      "asset": {
        "sheet": "assets/champions/barrier_magician.png",
        "sheetWidth": 1830,
        "sheetHeight": 86,
        "frame": {
          "x": 32,
          "y": 0,
          "w": 31,
          "h": 47
        }
      },
      "overall": 44.8,
      "tier": "D",
      "candidateIndex": 34
    },
    {
      "id": "shield_bearer",
      "name": "방패병",
      "category": "Melee",
      "tags": [
        "AD",
        "AOE",
        "CC",
        "Frontline",
        "Melee",
        "Shield",
        "Tank"
      ],
      "rawTags": [
        "AD",
        "Tank",
        "Shield",
        "CC"
      ],
      "description": {
        "skill": "일정 범위 내의 지정한 아군 한 명과 자신에게 300 + 최대 체력의 {Coef}% 만큼의 보호막을 부여한다. (0.48초 지속)",
        "skill2": "일정 시간 동안 주변 범위 내의 아군이 입는 피해의 {Damage}%를 대신 입고, 아군을 공격한 적을 {Coef}% + 방어력의 {DefCoef}% 둔화시킨다. (0.33초 지속)",
        "ult": "사용 시 0.50초 동안 피해 감소 40% + 마법저항력의 {MrCoef}% 효과와 방해 면역을 얻으며, 주변 넓은 범위의 모든 적을 120초간 도발한다. 도발 중에는 이동할 수 없다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 0,
        "hp": 1100,
        "defence": 40,
        "magicResistance": 30,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.86,
        "range": 25
      },
      "growth": {
        "attack": 6,
        "magicPower": 0,
        "hp": 120,
        "defence": 10,
        "magicResistance": 5,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "shield_bearer_1",
          "cooltime": "8.00",
          "description": "일정 범위 내의 지정한 아군 한 명과 자신에게 300 + 최대 체력의 {Coef}% 만큼의 보호막을 부여한다. (0.48초 지속)"
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "shield_bearer_2",
          "cooltime": "6.00",
          "description": "일정 시간 동안 주변 범위 내의 아군이 입는 피해의 {Damage}%를 대신 입고, 아군을 공격한 적을 {Coef}% + 방어력의 {DefCoef}% 둔화시킨다. (0.33초 지속)"
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "shield_bearer_4",
          "cooltime": "50.00",
          "description": "사용 시 0.50초 동안 피해 감소 40% + 마법저항력의 {MrCoef}% 효과와 방해 면역을 얻으며, 주변 넓은 범위의 모든 적을 120초간 도발한다. 도발 중에는 이동할 수 없다."
        }
      ],
      "metrics": {
        "damage": 77.48,
        "durability": 212.0,
        "utility": 28.0,
        "scaling": 39.4,
        "mobility": 15.0,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 350.0,
        "damageNorm": 10.6,
        "durabilityNorm": 88.1,
        "utilityNorm": 58.3,
        "scalingNorm": 0.0,
        "mobilityNorm": 5.1
      },
      "roleFit": {
        "top": 97.1,
        "jungle": 57.6,
        "mid": 27.8,
        "bot": 20.4,
        "support": 56.5
      },
      "bestRole": "top",
      "asset": {
        "sheet": "assets/champions/shield_bearer.png",
        "sheetWidth": 2904,
        "sheetHeight": 132,
        "frame": {
          "x": 56,
          "y": 0,
          "w": 55,
          "h": 69
        }
      },
      "overall": 44.8,
      "tier": "D",
      "candidateIndex": 28
    },
    {
      "id": "archer",
      "name": "궁수",
      "category": "Range",
      "tags": [
        "AD",
        "AOE",
        "Backline",
        "CC",
        "Mobility",
        "Poke",
        "Range"
      ],
      "rawTags": [
        "AD"
      ],
      "description": {
        "skill": "지정 방향으로 도약하며 최근에 공격한 적에게 40 + 공격력의 80% 만큼의 물리 피해를 입힌다.",
        "skill2": "가까운 적 한명에게 화살을 발사하여 60 + 공격력의 80% 만큼의 물리 피해를 입히고 잠깐 경직시키며 뒤로 점프하여 물러난다.",
        "ult": "제자리에 멈춰서서 총 {Count}개의 화살을 발사한다. 화살은 근처 120 범위 내 무작위 적을 대상으로 날아가며, 30 + 공격력의 50% 만큼의 물리 피해를 입힌다."
      },
      "stats": {
        "attack": 100,
        "magicPower": 0,
        "hp": 900,
        "defence": 20,
        "magicResistance": 15,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 1.0,
        "range": 70
      },
      "growth": {
        "attack": 15,
        "magicPower": 0,
        "hp": 90,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "archer_1",
          "cooltime": "4.00",
          "description": "지정 방향으로 도약하며 최근에 공격한 적에게 40 + 공격력의 80% 만큼의 물리 피해를 입힌다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "archer_2",
          "cooltime": "6.00",
          "description": "가까운 적 한명에게 화살을 발사하여 60 + 공격력의 80% 만큼의 물리 피해를 입히고 잠깐 경직시키며 뒤로 점프하여 물러난다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "archer_4",
          "cooltime": "60.00",
          "description": "제자리에 멈춰서서 총 {Count}개의 화살을 발사한다. 화살은 근처 120 범위 내 무작위 적을 대상으로 날아가며, 30 + 공격력의 50% 만큼의 물리 피해를 입힌다."
        }
      ],
      "metrics": {
        "damage": 129.7,
        "durability": 108.75,
        "utility": 7.0,
        "scaling": 46.9,
        "mobility": 38.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 56.5,
        "durabilityNorm": 0.0,
        "utilityNorm": 14.6,
        "scalingNorm": 21.7,
        "mobilityNorm": 84.7
      },
      "roleFit": {
        "top": 31.9,
        "jungle": 25.2,
        "mid": 36.6,
        "bot": 100,
        "support": 22.6
      },
      "bestRole": "bot",
      "asset": {
        "sheet": "assets/champions/archer.png",
        "sheetWidth": 2970,
        "sheetHeight": 88,
        "frame": {
          "x": 66,
          "y": 0,
          "w": 33,
          "h": 45
        }
      },
      "overall": 44.3,
      "tier": "D",
      "candidateIndex": 3
    },
    {
      "id": "gambler",
      "name": "도박사",
      "category": "Range",
      "tags": [
        "AD",
        "AOE",
        "Backline",
        "CC",
        "Poke",
        "Range"
      ],
      "rawTags": [
        "AD"
      ],
      "description": {
        "skill": "주사위를 굴려 주사위 눈과 동일한 횟수만큼 80 범위 내의 적을 공격한다. 각 공격은 30 + 공격력의 30% 만큼의 물리 피해를 입힌다.",
        "skill2": "칩을 던져 75 사거리 내에 1.00초 동안 35000 크기의 30% 둔화 영역을 생성한다. 영역은 없어질 때 폭발하며 범위 내의 적에게 100 + 공격력의 50% 만큼의 물리 피해를 입힌다.",
        "ult": "일직선으로 적을 매혹시키는 돈 더미를 발사한다. 피격된 적은 50 + 공격력의 60% 만큼의 물리 피해를 입으며, {Time}초 동안 매혹된다."
      },
      "stats": {
        "attack": 100,
        "magicPower": 0,
        "hp": 900,
        "defence": 20,
        "magicResistance": 15,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 1.0,
        "range": 70
      },
      "growth": {
        "attack": 20,
        "magicPower": 0,
        "hp": 90,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "gambler_1",
          "cooltime": null,
          "description": "주사위를 굴려 주사위 눈과 동일한 횟수만큼 80 범위 내의 적을 공격한다. 각 공격은 30 + 공격력의 30% 만큼의 물리 피해를 입힌다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "gambler_2",
          "cooltime": "5.00",
          "description": "칩을 던져 75 사거리 내에 1.00초 동안 35000 크기의 30% 둔화 영역을 생성한다. 영역은 없어질 때 폭발하며 범위 내의 적에게 100 + 공격력의 50% 만큼의 물리 피해를 입힌다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "gambler_4",
          "cooltime": "60.00",
          "description": "일직선으로 적을 매혹시키는 돈 더미를 발사한다. 피격된 적은 50 + 공격력의 60% 만큼의 물리 피해를 입으며, {Time}초 동안 매혹된다."
        }
      ],
      "metrics": {
        "damage": 135.4,
        "durability": 108.75,
        "utility": 10.6,
        "scaling": 55.9,
        "mobility": 13.5,
        "cc": 30.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 61.5,
        "durabilityNorm": 0.0,
        "utilityNorm": 22.1,
        "scalingNorm": 47.8,
        "mobilityNorm": 0.0
      },
      "roleFit": {
        "top": 32.1,
        "jungle": 22.3,
        "mid": 37.6,
        "bot": 100,
        "support": 23.5
      },
      "bestRole": "bot",
      "asset": {
        "sheet": "assets/champions/gambler.png",
        "sheetWidth": 3398,
        "sheetHeight": 180,
        "frame": {
          "x": 70,
          "y": 0,
          "w": 27,
          "h": 51
        }
      },
      "overall": 44.3,
      "tier": "D",
      "candidateIndex": 21
    },
    {
      "id": "whip_master",
      "name": "채찍술사",
      "category": "Range",
      "tags": [
        "AD",
        "AOE",
        "Backline",
        "Poke",
        "Range"
      ],
      "rawTags": [
        "AD"
      ],
      "description": {
        "skill": "적에게 채찍을 강하게 휘둘러 60 + 공격력의 100% 만큼의 물리 피해 + 대상 체력의 {HpRatio}% 만큼의 피해를 입힌다.",
        "skill2": "채찍을 부채꼴로 휘둘러 범위 내에 있는 적에게 80 + 공격력의 80% 만큼의 물리 피해를 입히고 밀쳐낸다.",
        "ult": "0.30초 동안 채널링하며 범위 내 무작위 적 방향으로 일직선 관통 투사체를 연속으로 발사하여 50 + 공격력의 50% 만큼의 물리 피해를 입힌다."
      },
      "stats": {
        "attack": 100,
        "magicPower": 0,
        "hp": 900,
        "defence": 20,
        "magicResistance": 15,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 1.0,
        "range": 40
      },
      "growth": {
        "attack": 20,
        "magicPower": 0,
        "hp": 90,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "whip_master_1",
          "cooltime": "4.00",
          "description": "적에게 채찍을 강하게 휘둘러 60 + 공격력의 100% 만큼의 물리 피해 + 대상 체력의 {HpRatio}% 만큼의 피해를 입힌다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "whip_master_2",
          "cooltime": "6.00",
          "description": "채찍을 부채꼴로 휘둘러 범위 내에 있는 적에게 80 + 공격력의 80% 만큼의 물리 피해를 입히고 밀쳐낸다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "whip_master_4",
          "cooltime": "50.00",
          "description": "0.30초 동안 채널링하며 범위 내 무작위 적 방향으로 일직선 관통 투사체를 연속으로 발사하여 50 + 공격력의 50% 만큼의 물리 피해를 입힌다."
        }
      ],
      "metrics": {
        "damage": 142.6,
        "durability": 108.75,
        "utility": 7.0,
        "scaling": 55.9,
        "mobility": 13.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 67.8,
        "durabilityNorm": 0.0,
        "utilityNorm": 14.6,
        "scalingNorm": 47.8,
        "mobilityNorm": 0.0
      },
      "roleFit": {
        "top": 32.4,
        "jungle": 22.3,
        "mid": 37.9,
        "bot": 100,
        "support": 18.6
      },
      "bestRole": "bot",
      "asset": {
        "sheet": "assets/champions/whip_master.png",
        "sheetWidth": 3520,
        "sheetHeight": 88,
        "frame": {
          "x": 28,
          "y": 0,
          "w": 27,
          "h": 47
        }
      },
      "overall": 44.3,
      "tier": "D",
      "candidateIndex": 29
    },
    {
      "id": "hitman",
      "name": "히트맨",
      "category": "Assassin",
      "tags": [
        "AD",
        "Assassin",
        "CC",
        "Mobility",
        "Poke"
      ],
      "rawTags": [
        "AD",
        "CC"
      ],
      "description": {
        "skill": "세 발의 연속 사격을 발사한다. 첫 발은 적에게 40 + 공격력의 70% 만큼의 물리 피해와 0.75초 기절을 부여한다.",
        "skill2": "250 거리 내 최근 공격한 적 챔피언의 뒤로 순간이동한다.",
        "ult": "적 챔피언을 표식하여 0.33초 후 50 + 표식 동안 받은 피해량의 50% 만큼의 물리 피해를 입힌다. 대상 처치 시 120초 동안 은신한다."
      },
      "stats": {
        "attack": 100,
        "magicPower": 0,
        "hp": 900,
        "defence": 20,
        "magicResistance": 15,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 1.0,
        "range": 40
      },
      "growth": {
        "attack": 20,
        "magicPower": 0,
        "hp": 90,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "hitman_1",
          "cooltime": "7.00",
          "description": "세 발의 연속 사격을 발사한다. 첫 발은 적에게 40 + 공격력의 70% 만큼의 물리 피해와 0.75초 기절을 부여한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "hitman_2",
          "cooltime": "10.00",
          "description": "250 거리 내 최근 공격한 적 챔피언의 뒤로 순간이동한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "hitman_4",
          "cooltime": "50.00",
          "description": "적 챔피언을 표식하여 0.33초 후 50 + 표식 동안 받은 피해량의 50% 만큼의 물리 피해를 입힌다. 대상 처치 시 120초 동안 은신한다."
        }
      ],
      "metrics": {
        "damage": 103.0,
        "durability": 108.75,
        "utility": 12.4,
        "scaling": 55.9,
        "mobility": 38.5,
        "cc": 45.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 33.0,
        "durabilityNorm": 0.0,
        "utilityNorm": 25.8,
        "scalingNorm": 47.8,
        "mobilityNorm": 84.7
      },
      "roleFit": {
        "top": 34.8,
        "jungle": 93.6,
        "mid": 85.7,
        "bot": 24.1,
        "support": 15.9
      },
      "bestRole": "jungle",
      "asset": {
        "sheet": "assets/champions/hitman.png",
        "sheetWidth": 2362,
        "sheetHeight": 82,
        "frame": {
          "x": 24,
          "y": 0,
          "w": 23,
          "h": 49
        }
      },
      "overall": 44.3,
      "tier": "D",
      "candidateIndex": 56
    },
    {
      "id": "chef",
      "name": "요리사",
      "category": "Util",
      "tags": [
        "AOE",
        "AP",
        "CC",
        "Frontline",
        "Heal",
        "Magic",
        "Tank",
        "Util"
      ],
      "rawTags": [
        "AP",
        "Heal",
        "Tank",
        "Magic"
      ],
      "description": {
        "skill": "일직선으로 식칼을 던져 100 + 주문력의 60% 만큼의 마법 피해를 입히고 2.00초 동안 50% 둔화시킨다.",
        "skill2": "주변 아군에게 요리를 나눠주어 50 + 주문력의 5% 만큼 지속적으로 체력을 회복시킨다. 자기 자신만 회복할 경우 회복량이 {SelfHeal} + 주문력의 {SelfHealCoef}%로 증가한다.",
        "ult": "아군 챔피언에게 특제 요리를 던져 0.33초 동안 최대 체력이 {HpRatio}% 증가한다. 받는 피해의 {SpreadRatio}%가 지속 피해로 분산된다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 10,
        "hp": 1000,
        "defence": 30,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.86,
        "range": 25
      },
      "growth": {
        "attack": 6,
        "magicPower": 15,
        "hp": 100,
        "defence": 8,
        "magicResistance": 4,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "chef_1",
          "cooltime": "4.00",
          "description": "일직선으로 식칼을 던져 100 + 주문력의 60% 만큼의 마법 피해를 입히고 2.00초 동안 50% 둔화시킨다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "chef_2",
          "cooltime": "8.00",
          "description": "주변 아군에게 요리를 나눠주어 50 + 주문력의 5% 만큼 지속적으로 체력을 회복시킨다. 자기 자신만 회복할 경우 회복량이 {SelfHeal} + 주문력의 {SelfHealCoef}%로 증가한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "chef_4",
          "cooltime": "40.00",
          "description": "아군 챔피언에게 특제 요리를 던져 0.33초 동안 최대 체력이 {HpRatio}% 증가한다. 받는 피해의 {SpreadRatio}%가 지속 피해로 분산된다."
        }
      ],
      "metrics": {
        "damage": 104.88,
        "durability": 154.75,
        "utility": 4.4,
        "scaling": 61.0,
        "mobility": 15.0,
        "cc": 0.0,
        "heal": 55.0,
        "shield": 0.0,
        "damageNorm": 34.6,
        "durabilityNorm": 39.2,
        "utilityNorm": 9.2,
        "scalingNorm": 62.6,
        "mobilityNorm": 5.1
      },
      "roleFit": {
        "top": 28.6,
        "jungle": 16.8,
        "mid": 33.8,
        "bot": 29.6,
        "support": 100
      },
      "bestRole": "support",
      "asset": {
        "sheet": "assets/champions/chef.png",
        "sheetWidth": 1628,
        "sheetHeight": 56,
        "frame": {
          "x": 20,
          "y": 0,
          "w": 19,
          "h": 49
        }
      },
      "overall": 44.2,
      "tier": "D",
      "candidateIndex": 35
    },
    {
      "id": "spirit_caller",
      "name": "정령사",
      "category": "Util",
      "tags": [
        "AP",
        "CC",
        "Heal",
        "Magic",
        "Mobility",
        "Shield",
        "Util"
      ],
      "rawTags": [
        "AP",
        "Heal",
        "Magic"
      ],
      "description": {
        "skill": "아군에게 정령을 부착하여 0.33초 동안 20 + 주문력의 5% 만큼 체력을 회복시키고 이동속도를 15% 상승시킨다.",
        "skill2": "적에게 정령을 부착하여 0.33초 동안 방어력 {DefDown} + 주문력의 {DefCoef}%, 마법저항력 {MrDown} + 주문력의 {MrCoef}% 감소시키고 {Slow}% 둔화시킨다.",
        "ult": "부착된 정령을 폭발시킨다. 아군의 정령은 100 + 주문력의 30% 만큼의 보호막과 공격속도 {AttackSpeed}% 증가를 부여한다. 적의 정령은 100 + 주문력의 {DamageCoef}% 만큼의 마법 피해와 0.75초 기절을 부여한다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 30,
        "hp": 900,
        "defence": 20,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0,
        "range": 0
      },
      "growth": {
        "attack": 6,
        "magicPower": 15,
        "hp": 100,
        "defence": 7,
        "magicResistance": 4,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "spirit_caller_1",
          "cooltime": "4.00",
          "description": "아군에게 정령을 부착하여 0.33초 동안 20 + 주문력의 5% 만큼 체력을 회복시키고 이동속도를 15% 상승시킨다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "spirit_caller_2",
          "cooltime": "4.00",
          "description": "적에게 정령을 부착하여 0.33초 동안 방어력 {DefDown} + 주문력의 {DefCoef}%, 마법저항력 {MrDown} + 주문력의 {MrCoef}% 감소시키고 {Slow}% 둔화시킨다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "spirit_caller_4",
          "cooltime": "60.00",
          "description": "부착된 정령을 폭발시킨다. 아군의 정령은 100 + 주문력의 30% 만큼의 보호막과 공격속도 {AttackSpeed}% 증가를 부여한다. 적의 정령은 100 + 주문력의 {DamageCoef}% 만큼의 마법 피해와 0.75초 기절을 부여한다."
        }
      ],
      "metrics": {
        "damage": 100.28,
        "durability": 117.75,
        "utility": 2.0,
        "scaling": 59.7,
        "mobility": 40.0,
        "cc": 0.0,
        "heal": 25.0,
        "shield": 0.0,
        "damageNorm": 30.6,
        "durabilityNorm": 7.7,
        "utilityNorm": 4.2,
        "scalingNorm": 58.8,
        "mobilityNorm": 89.8
      },
      "roleFit": {
        "top": 25.4,
        "jungle": 20.1,
        "mid": 33.4,
        "bot": 30.2,
        "support": 100
      },
      "bestRole": "support",
      "asset": {
        "sheet": "assets/champions/spirit_caller.png",
        "sheetWidth": 3076,
        "sheetHeight": 100,
        "frame": {
          "x": 44,
          "y": 0,
          "w": 21,
          "h": 55
        }
      },
      "overall": 44.0,
      "tier": "D",
      "candidateIndex": 25
    },
    {
      "id": "taoist",
      "name": "도사",
      "category": "Util",
      "tags": [
        "AOE",
        "AP",
        "CC",
        "Magic",
        "Util"
      ],
      "rawTags": [
        "AP",
        "CC",
        "Magic"
      ],
      "description": {
        "skill": "부적으로 적을 봉인하여 {Time}(+주문력의 {TimeCoef}%)초 동안 일반 공격을 할 수 없도록 한다.",
        "skill2": "적에게 부적을 붙여 {Time}(+주문력의 {TimeCoef}%)초 동안 스킬을 사용할 수 없도록 한다.",
        "ult": "일직선으로 부적 투사체를 날려 적중한 적에게 100 + 주문력의 100%만큼 마법 피해를 입히고 {Time}초간 행동 불능 및 대상 지정 불가 상태로 만든다. 효과가 끝나면 주변 적에게 동일 효과가 번진다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 30,
        "hp": 900,
        "defence": 20,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.67,
        "range": 60
      },
      "growth": {
        "attack": 6,
        "magicPower": 15,
        "hp": 100,
        "defence": 8,
        "magicResistance": 4,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "taoist_1",
          "cooltime": "5.00",
          "description": "부적으로 적을 봉인하여 {Time}(+주문력의 {TimeCoef}%)초 동안 일반 공격을 할 수 없도록 한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "taoist_2",
          "cooltime": "5.00",
          "description": "적에게 부적을 붙여 {Time}(+주문력의 {TimeCoef}%)초 동안 스킬을 사용할 수 없도록 한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "taoist_4",
          "cooltime": "30.00",
          "description": "일직선으로 부적 투사체를 날려 적중한 적에게 100 + 주문력의 100%만큼 마법 피해를 입히고 {Time}초간 행동 불능 및 대상 지정 불가 상태로 만든다. 효과가 끝나면 주변 적에게 동일 효과가 번진다."
        }
      ],
      "metrics": {
        "damage": 137.18,
        "durability": 116.5,
        "utility": 0.0,
        "scaling": 61.0,
        "mobility": 15.0,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 63.0,
        "durabilityNorm": 6.6,
        "utilityNorm": 0.0,
        "scalingNorm": 62.6,
        "mobilityNorm": 5.1
      },
      "roleFit": {
        "top": 26.8,
        "jungle": 18.3,
        "mid": 35.6,
        "bot": 31.9,
        "support": 98.0
      },
      "bestRole": "support",
      "asset": {
        "sheet": "assets/champions/taoist.png",
        "sheetWidth": 3918,
        "sheetHeight": 116,
        "frame": {
          "x": 28,
          "y": 0,
          "w": 25,
          "h": 49
        }
      },
      "overall": 43.8,
      "tier": "D",
      "candidateIndex": 46
    },
    {
      "id": "gunner",
      "name": "총잡이",
      "category": "Range",
      "tags": [
        "AD",
        "AOE",
        "Backline",
        "CC",
        "Mobility",
        "Poke",
        "Range"
      ],
      "rawTags": [
        "AD"
      ],
      "description": {
        "skill": "이동 중에 적을 공격할 수 있다. 레벨3부터 적을 공격할 때마다 0.50초 동안 이동속도가 1% 상승한다.",
        "skill2": "3.00초 동안 공격을 강화하여 공격력이 10 상승하며, 3회 공격시마다 탄환이 적에게 {SlowTime}초 동안 {Slow}% 둔화를 부여한다.",
        "ult": "10.00초 동안 공격이 강화되어 공격력이 30 상승하며, 공격 대상 주변 2명의 적에게 추가로 탄환을 발사한다. 추가 탄환은 30 + 공격력의 30% 만큼의 물리 피해를 입힌다."
      },
      "stats": {
        "attack": 100,
        "magicPower": 0,
        "hp": 900,
        "defence": 30,
        "magicResistance": 15,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 1.5,
        "range": 50
      },
      "growth": {
        "attack": 20,
        "magicPower": 0,
        "hp": 90,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "gunner_1",
          "cooltime": null,
          "description": "이동 중에 적을 공격할 수 있다. 레벨3부터 적을 공격할 때마다 0.50초 동안 이동속도가 1% 상승한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "gunner_2",
          "cooltime": "6.00",
          "description": "3.00초 동안 공격을 강화하여 공격력이 10 상승하며, 3회 공격시마다 탄환이 적에게 {SlowTime}초 동안 {Slow}% 둔화를 부여한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "gunner_4",
          "cooltime": "60.00",
          "description": "10.00초 동안 공격이 강화되어 공격력이 30 상승하며, 공격 대상 주변 2명의 적에게 추가로 탄환을 발사한다. 추가 탄환은 30 + 공격력의 30% 만큼의 물리 피해를 입힌다."
        }
      ],
      "metrics": {
        "damage": 94.6,
        "durability": 126.75,
        "utility": 7.0,
        "scaling": 55.9,
        "mobility": 38.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 25.6,
        "durabilityNorm": 15.4,
        "utilityNorm": 14.6,
        "scalingNorm": 47.8,
        "mobilityNorm": 84.7
      },
      "roleFit": {
        "top": 31.9,
        "jungle": 23.6,
        "mid": 35.0,
        "bot": 100,
        "support": 22.6
      },
      "bestRole": "bot",
      "asset": {
        "sheet": "assets/champions/gunner.png",
        "sheetWidth": 2334,
        "sheetHeight": 98,
        "frame": {
          "x": 24,
          "y": 0,
          "w": 23,
          "h": 53
        }
      },
      "overall": 43.8,
      "tier": "D",
      "candidateIndex": 18
    },
    {
      "id": "hammerer",
      "name": "중보병",
      "category": "Melee",
      "tags": [
        "AD",
        "AOE",
        "CC",
        "Frontline",
        "Melee",
        "Tank"
      ],
      "rawTags": [
        "AD",
        "Tank",
        "CC"
      ],
      "description": {
        "skill": "가까운 적 하나에게 망치를 휘둘러 50 + 공격력의 100% 만큼의 물리 피해를 입히고 1.00초 동안 에어본시킨다.",
        "skill2": "망치를 들어올려 일정 시간동안 정신을 집중하고 바닥을 내리쳐 주변 60 범위 내에 있는 적들에게 50 + 공격력의 120% 만큼의 물리 피해를 입히고 2.00초간 50% 둔화 효과를 부여한다.",
        "ult": "망치를 크게 휘둘러, 전방 80 범위 내 반원 영역에 있는 모든 적에게 120 + 공격력의 70% 만큼의 물리 피해를 입힌다. 망치에 맞은 적은 1.50초 동안 뒤로 밀려나며, 밀려나는 적에게 부딪히는 적 챔피언은 1.50초 동안 에어본된다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 0,
        "hp": 1100,
        "defence": 40,
        "magicResistance": 30,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.86,
        "range": 25
      },
      "growth": {
        "attack": 6,
        "magicPower": 0,
        "hp": 120,
        "defence": 10,
        "magicResistance": 5,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "hammerer_1",
          "cooltime": "4.00",
          "description": "가까운 적 하나에게 망치를 휘둘러 50 + 공격력의 100% 만큼의 물리 피해를 입히고 1.00초 동안 에어본시킨다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "hammerer_2",
          "cooltime": "4.00",
          "description": "망치를 들어올려 일정 시간동안 정신을 집중하고 바닥을 내리쳐 주변 60 범위 내에 있는 적들에게 50 + 공격력의 120% 만큼의 물리 피해를 입히고 2.00초간 50% 둔화 효과를 부여한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "hammerer_4",
          "cooltime": "50.00",
          "description": "망치를 크게 휘둘러, 전방 80 범위 내 반원 영역에 있는 모든 적에게 120 + 공격력의 70% 만큼의 물리 피해를 입힌다. 망치에 맞은 적은 1.50초 동안 뒤로 밀려나며, 밀려나는 적에게 부딪히는 적 챔피언은 1.50초 동안 에어본된다."
        }
      ],
      "metrics": {
        "damage": 134.48,
        "durability": 191.0,
        "utility": 0.0,
        "scaling": 39.4,
        "mobility": 15.0,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 60.7,
        "durabilityNorm": 70.1,
        "utilityNorm": 0.0,
        "scalingNorm": 0.0,
        "mobilityNorm": 5.1
      },
      "roleFit": {
        "top": 97.7,
        "jungle": 60.2,
        "mid": 30.2,
        "bot": 24.4,
        "support": 38.0
      },
      "bestRole": "top",
      "asset": {
        "sheet": "assets/champions/hammerer.png",
        "sheetWidth": 3256,
        "sheetHeight": 166,
        "frame": {
          "x": 42,
          "y": 0,
          "w": 41,
          "h": 49
        }
      },
      "overall": 42.3,
      "tier": "D",
      "candidateIndex": 22
    },
    {
      "id": "clown",
      "name": "광대",
      "category": "Assassin",
      "tags": [
        "AD",
        "AOE",
        "Assassin",
        "Mobility"
      ],
      "rawTags": [
        "AD"
      ],
      "description": {
        "skill": "지정한 대상의 옆으로 순간이동하며 대상이 적군일 경우 60 + 공격력의 100% 만큼의 물리 피해를 입히고 0.30초 동안 이동속도가 30% 상승한다.",
        "skill2": "주변에 수많은 단검을 흩뿌리며 범위 내의 적에게 20 + 공격력의 10% 만큼의 물리 피해를 입힌다. (스킬 사용 중 이동 가능)",
        "ult": "5.00초 동안 광기 상태가 되어 모든 단검이 적에게 튕기는 특수 단검으로 변한다."
      },
      "stats": {
        "attack": 100,
        "magicPower": 0,
        "hp": 900,
        "defence": 20,
        "magicResistance": 15,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 1.0,
        "range": 40
      },
      "growth": {
        "attack": 20,
        "magicPower": 0,
        "hp": 90,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "clown_1",
          "cooltime": "10.00",
          "description": "지정한 대상의 옆으로 순간이동하며 대상이 적군일 경우 60 + 공격력의 100% 만큼의 물리 피해를 입히고 0.30초 동안 이동속도가 30% 상승한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "clown_2",
          "cooltime": "8.00",
          "description": "주변에 수많은 단검을 흩뿌리며 범위 내의 적에게 20 + 공격력의 10% 만큼의 물리 피해를 입힌다. (스킬 사용 중 이동 가능)"
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "clown_4",
          "cooltime": "40.00",
          "description": "5.00초 동안 광기 상태가 되어 모든 단검이 적에게 튕기는 특수 단검으로 변한다."
        }
      ],
      "metrics": {
        "damage": 115.6,
        "durability": 108.75,
        "utility": 0.0,
        "scaling": 55.9,
        "mobility": 38.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 44.1,
        "durabilityNorm": 0.0,
        "utilityNorm": 0.0,
        "scalingNorm": 47.8,
        "mobilityNorm": 84.7
      },
      "roleFit": {
        "top": 35.3,
        "jungle": 93.6,
        "mid": 86.0,
        "bot": 25.0,
        "support": 10.0
      },
      "bestRole": "jungle",
      "asset": {
        "sheet": "assets/champions/clown.png",
        "sheetWidth": 1854,
        "sheetHeight": 88,
        "frame": {
          "x": 30,
          "y": 0,
          "w": 27,
          "h": 53
        }
      },
      "overall": 41.8,
      "tier": "D",
      "candidateIndex": 36
    },
    {
      "id": "cavalry_knight",
      "name": "기병",
      "category": "Melee",
      "tags": [
        "AD",
        "AOE",
        "CC",
        "Frontline",
        "Melee",
        "Mobility"
      ],
      "rawTags": [
        "AD",
        "CC"
      ],
      "description": {
        "skill": "일직선으로 돌진하여 처음으로 적중한 적을 창에 꿰어 {Time}초간 속박시키고 30 + 공격력의 120% 만큼의 물리 피해를 입힌다. 돌진 속도는 이동속도에 비례한다.",
        "skill2": "4.00초 동안 이동속도가 20% 상승하며 무기를 화염 창으로 강화하여 공격 시 {BurnTime}초 동안 {BurnDamage} + 공격력의 {BurnCoef}% 만큼의 화상 피해를 추가로 입힌다.",
        "ult": "4.00초 동안 이동속도가 50% + 공격력의 {SpeedCoef}% 상승하며, 자신의 위치로 향하는 장판을 생성한다. 장판 위에 있는 아군은 기병이 있는 방향으로 이동할 때 이동속도가 {Buff}% + 공격력의 {SpeedCoef}% 증가한다."
      },
      "stats": {
        "attack": 90,
        "magicPower": 0,
        "hp": 900,
        "defence": 25,
        "magicResistance": 15,
        "moveSpeed": 1200,
        "moveSpeedDisplay": 72.0,
        "attackSpeed": 1.2,
        "range": 27
      },
      "growth": {
        "attack": 20,
        "magicPower": 0,
        "hp": 90,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.9,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "cavalry_knight_1",
          "cooltime": "6.00",
          "description": "일직선으로 돌진하여 처음으로 적중한 적을 창에 꿰어 {Time}초간 속박시키고 30 + 공격력의 120% 만큼의 물리 피해를 입힌다. 돌진 속도는 이동속도에 비례한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "cavalry_knight_2",
          "cooltime": "8.00",
          "description": "4.00초 동안 이동속도가 20% 상승하며 무기를 화염 창으로 강화하여 공격 시 {BurnTime}초 동안 {BurnDamage} + 공격력의 {BurnCoef}% 만큼의 화상 피해를 추가로 입힌다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "cavalry_knight_4",
          "cooltime": "60.00",
          "description": "4.00초 동안 이동속도가 50% + 공격력의 {SpeedCoef}% 상승하며, 자신의 위치로 향하는 장판을 생성한다. 장판 위에 있는 아군은 기병이 있는 방향으로 이동할 때 이동속도가 {Buff}% + 공격력의 {SpeedCoef}% 증가한다."
        }
      ],
      "metrics": {
        "damage": 99.9,
        "durability": 129.75,
        "utility": 0.0,
        "scaling": 55.9,
        "mobility": 43.0,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 30.3,
        "durabilityNorm": 17.9,
        "utilityNorm": 0.0,
        "scalingNorm": 47.8,
        "mobilityNorm": 100.0
      },
      "roleFit": {
        "top": 84.4,
        "jungle": 62.5,
        "mid": 29.1,
        "bot": 24.1,
        "support": 34.0
      },
      "bestRole": "top",
      "asset": {
        "sheet": "assets/champions/cavalry_knight.png",
        "sheetWidth": 4096,
        "sheetHeight": 189,
        "frame": {
          "x": 46,
          "y": 0,
          "w": 45,
          "h": 61
        }
      },
      "overall": 40.8,
      "tier": "D",
      "candidateIndex": 17
    },
    {
      "id": "enchanter",
      "name": "인챈터",
      "category": "Util",
      "tags": [
        "AP",
        "Mobility",
        "Util"
      ],
      "rawTags": [
        "AP"
      ],
      "description": {
        "skill": "0.33초 동안 아군을 강화하여 사거리를 {Increase} 증가시킨다.",
        "skill2": "0.33초 동안 아군의 장비를 강화하여 아이템으로부터 얻는 능력치를 30% 증가시킨다.",
        "ult": "0.40초 동안 아군 챔피언을 강화하여 공격력 {Attack}(+주문력의 70%), 공격속도 {AttackSpeed}%, 이동속도 {MoveSpeed}% 증가 및 군중 제어 면역 효과를 부여한다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 30,
        "hp": 900,
        "defence": 20,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.67,
        "range": 60
      },
      "growth": {
        "attack": 6,
        "magicPower": 15,
        "hp": 100,
        "defence": 8,
        "magicResistance": 4,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "enchanter_1",
          "cooltime": "10.00",
          "description": "0.33초 동안 아군을 강화하여 사거리를 {Increase} 증가시킨다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "enchanter_2",
          "cooltime": "12.00",
          "description": "0.33초 동안 아군의 장비를 강화하여 아이템으로부터 얻는 능력치를 30% 증가시킨다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "enchanter_4",
          "cooltime": "50.00",
          "description": "0.40초 동안 아군 챔피언을 강화하여 공격력 {Attack}(+주문력의 70%), 공격속도 {AttackSpeed}%, 이동속도 {MoveSpeed}% 증가 및 군중 제어 면역 효과를 부여한다."
        }
      ],
      "metrics": {
        "damage": 86.18,
        "durability": 116.5,
        "utility": 0.0,
        "scaling": 61.0,
        "mobility": 40.0,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 18.2,
        "durabilityNorm": 6.6,
        "utilityNorm": 0.0,
        "scalingNorm": 62.6,
        "mobilityNorm": 89.8
      },
      "roleFit": {
        "top": 24.8,
        "jungle": 19.5,
        "mid": 32.5,
        "bot": 29.3,
        "support": 94.0
      },
      "bestRole": "support",
      "asset": {
        "sheet": "assets/champions/enchanter.png",
        "sheetWidth": 1838,
        "sheetHeight": 97,
        "frame": {
          "x": 32,
          "y": 0,
          "w": 31,
          "h": 49
        }
      },
      "overall": 39.7,
      "tier": "D",
      "candidateIndex": 55
    },
    {
      "id": "soldier",
      "name": "소총수",
      "category": "Range",
      "tags": [
        "AD",
        "AOE",
        "Backline",
        "Poke",
        "Range",
        "Shield"
      ],
      "rawTags": [
        "AD"
      ],
      "description": {
        "skill": "레벨이 오를 때마다 사거리가 3000 증가한다.",
        "skill2": "적 한명에게 총을 세 발 연사하여 큰 물리 피해를 입힌다(한 발당 100 + 공격력의 60% 피해). 평타 사거리에 비례하여 스킬 사거리가 증가한다.",
        "ult": "300 거리 내의 적을 저격하는 일직선으로 날아가는 거대한 탄환을 발사한다. 탄환은 지나가는 궤적 내의 모든 적에게 200 + 공격력의 150% 만큼의 물리 피해를 입히며, 적에게 적중될때마다 피해량이 {Decay}% 만큼 감소한다."
      },
      "stats": {
        "attack": 100,
        "magicPower": 0,
        "hp": 900,
        "defence": 20,
        "magicResistance": 15,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 1.0,
        "range": 60
      },
      "growth": {
        "attack": 15,
        "magicPower": 0,
        "hp": 90,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "soldier_1",
          "cooltime": "4.00",
          "description": "레벨이 오를 때마다 사거리가 3000 증가한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "soldier_2",
          "cooltime": null,
          "description": "적 한명에게 총을 세 발 연사하여 큰 물리 피해를 입힌다(한 발당 100 + 공격력의 60% 피해). 평타 사거리에 비례하여 스킬 사거리가 증가한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "soldier_4",
          "cooltime": "60.00",
          "description": "300 거리 내의 적을 저격하는 일직선으로 날아가는 거대한 탄환을 발사한다. 탄환은 지나가는 궤적 내의 모든 적에게 200 + 공격력의 150% 만큼의 물리 피해를 입히며, 적에게 적중될때마다 피해량이 {Decay}% 만큼 감소한다."
        }
      ],
      "metrics": {
        "damage": 139.9,
        "durability": 108.75,
        "utility": 7.0,
        "scaling": 46.9,
        "mobility": 13.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 65.4,
        "durabilityNorm": 0.0,
        "utilityNorm": 14.6,
        "scalingNorm": 21.7,
        "mobilityNorm": 0.0
      },
      "roleFit": {
        "top": 32.3,
        "jungle": 22.2,
        "mid": 37.2,
        "bot": 100,
        "support": 27.6
      },
      "bestRole": "bot",
      "asset": {
        "sheet": "assets/champions/soldier.png",
        "sheetWidth": 4007,
        "sheetHeight": 88,
        "frame": {
          "x": 52,
          "y": 0,
          "w": 51,
          "h": 41
        }
      },
      "overall": 39.4,
      "tier": "D",
      "candidateIndex": 4
    },
    {
      "id": "plague_doctor",
      "name": "역병의사",
      "category": "Util",
      "tags": [
        "AD",
        "Frontline",
        "Mobility",
        "Tank",
        "Util"
      ],
      "rawTags": [
        "AD",
        "Tank"
      ],
      "description": {
        "skill": "아군 한 명과 자신에게 주사를 놓아 0.25초 동안 공격속도가 100% + 주문력의 {AttackSpeedCoef}%, 이동속도가 50% 상승한다.",
        "skill2": "아군 한 명에게 의식을 진행하여 0.30초 동안 사거리가 80 + 주문력의 {RangeCoef}% 증가하고 공격에 돌진 효과가 부여된다.",
        "ult": "아군 한 명에게 금단의 비약을 투여하여 체력을 1로 만드는 대신, 0.40초 동안 체력이 1 아래로 떨어지지 않으며 공격력이 {Attack}, 공격속도가 {AttackSpeed}% + 주문력의 {AttackSpeedCoef}%, 이동속도가 {MoveSpeed}% 증가한다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 0,
        "hp": 1000,
        "defence": 30,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 1.2,
        "range": 25
      },
      "growth": {
        "attack": 20,
        "magicPower": 0,
        "hp": 100,
        "defence": 7,
        "magicResistance": 4,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "plague_doctor_1",
          "cooltime": null,
          "description": "아군 한 명과 자신에게 주사를 놓아 0.25초 동안 공격속도가 100% + 주문력의 {AttackSpeedCoef}%, 이동속도가 50% 상승한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "plague_doctor_2",
          "cooltime": "5.00",
          "description": "아군 한 명에게 의식을 진행하여 0.30초 동안 사거리가 80 + 주문력의 {RangeCoef}% 증가하고 공격에 돌진 효과가 부여된다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "plague_doctor_4",
          "cooltime": "40.00",
          "description": "아군 한 명에게 금단의 비약을 투여하여 체력을 1로 만드는 대신, 0.40초 동안 체력이 1 아래로 떨어지지 않으며 공격력이 {Attack}, 공격속도가 {AttackSpeed}% + 주문력의 {AttackSpeedCoef}%, 이동속도가 {MoveSpeed}% 증가한다."
        }
      ],
      "metrics": {
        "damage": 68.0,
        "durability": 152.0,
        "utility": 0.0,
        "scaling": 57.9,
        "mobility": 40.0,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 2.2,
        "durabilityNorm": 36.9,
        "utilityNorm": 0.0,
        "scalingNorm": 53.6,
        "mobilityNorm": 89.8
      },
      "roleFit": {
        "top": 26.9,
        "jungle": 18.7,
        "mid": 31.3,
        "bot": 27.8,
        "support": 94.0
      },
      "bestRole": "support",
      "asset": {
        "sheet": "assets/champions/plague_doctor.png",
        "sheetWidth": 1576,
        "sheetHeight": 106,
        "frame": {
          "x": 26,
          "y": 0,
          "w": 25,
          "h": 53
        }
      },
      "overall": 39.0,
      "tier": "D",
      "candidateIndex": 43
    },
    {
      "id": "dancer",
      "name": "무희",
      "category": "Range",
      "tags": [
        "AD",
        "Assassin",
        "Backline",
        "Poke",
        "Range",
        "Shield"
      ],
      "rawTags": [
        "AD"
      ],
      "description": {
        "skill": "적에게 차크람을 던져 60 + 공격력의 100% 만큼의 물리 피해를 입힌다. 추가된 차크람 1개당 이 스킬의 피해량이 {StackCoef}% 증가한다.",
        "skill2": "적을 처치할 때마다 일반 공격에 차크람이 1개씩 추가된다. (최대 10개, 추가된 차크람으로 연속 공격 시 피해량이 {Reduce}%씩 감소)",
        "ult": "부채꼴 방향으로 {Count}(+스택)개의 관통 차크람을 발사하여 20 + 공격력의 30% 만큼의 물리 피해를 입힌다. 차크람은 끝에서 돌아오며 {ReturnDamage} + 공격력의 {ReturnCoef}% 만큼의 물리 피해를 추가로 입힌다. (최대 10개)"
      },
      "stats": {
        "attack": 100,
        "magicPower": 0,
        "hp": 900,
        "defence": 20,
        "magicResistance": 15,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 1.0,
        "range": 60
      },
      "growth": {
        "attack": 20,
        "magicPower": 0,
        "hp": 90,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "dancer_1",
          "cooltime": null,
          "description": "적에게 차크람을 던져 60 + 공격력의 100% 만큼의 물리 피해를 입힌다. 추가된 차크람 1개당 이 스킬의 피해량이 {StackCoef}% 증가한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "dancer_2",
          "cooltime": null,
          "description": "적을 처치할 때마다 일반 공격에 차크람이 1개씩 추가된다. (최대 10개, 추가된 차크람으로 연속 공격 시 피해량이 {Reduce}%씩 감소)"
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "dancer_4",
          "cooltime": "60.00",
          "description": "부채꼴 방향으로 {Count}(+스택)개의 관통 차크람을 발사하여 20 + 공격력의 30% 만큼의 물리 피해를 입힌다. 차크람은 끝에서 돌아오며 {ReturnDamage} + 공격력의 {ReturnCoef}% 만큼의 물리 피해를 추가로 입힌다. (최대 10개)"
        }
      ],
      "metrics": {
        "damage": 104.8,
        "durability": 109.25,
        "utility": 7.8,
        "scaling": 55.9,
        "mobility": 13.5,
        "cc": 0.0,
        "heal": 10.0,
        "shield": 0.0,
        "damageNorm": 34.6,
        "durabilityNorm": 0.4,
        "utilityNorm": 16.2,
        "scalingNorm": 47.8,
        "mobilityNorm": 0.0
      },
      "roleFit": {
        "top": 30.9,
        "jungle": 20.6,
        "mid": 35.6,
        "bot": 100,
        "support": 27.9
      },
      "bestRole": "bot",
      "asset": {
        "sheet": "assets/champions/dancer.png",
        "sheetWidth": 1594,
        "sheetHeight": 90,
        "frame": {
          "x": 28,
          "y": 0,
          "w": 27,
          "h": 47
        }
      },
      "overall": 37.0,
      "tier": "D",
      "candidateIndex": 37
    },
    {
      "id": "boomerang_hunter",
      "name": "부메랑 헌터",
      "category": "Range",
      "tags": [
        "AD",
        "Backline",
        "DOT",
        "Poke",
        "Range",
        "Shield"
      ],
      "rawTags": [
        "AD"
      ],
      "description": {
        "skill": "일직선 방향으로 부메랑을 던져 30 + 공격력의 10% 만큼의 물리 피해를 입힌다. 사거리의 끝 지점에서 부메랑이 일정 시간 회전하며, 닿은 적에게 0 + 공격력의 {DotCoef}% 만큼의 물리 피해를 지속적으로 입힌다.",
        "skill2": "세 갈래로 부메랑을 던진다. 부메랑은 끝까지 갔다가 돌아오며 궤적에 있는 적 모두에게 20 + 공격력의 60% 만큼의 물리 피해를 입힌다.",
        "ult": "일직선 방향으로 강력한 부메랑을 발사하여 30 + 공격력의 80% 만큼의 물리 피해를 입힌다. 적 챔피언에게 적중 시 가장 가까운 다른 적 챔피언 방향으로 튕기며, 튕길 때마다 피해량이 {Increase}%씩 증가한다. 최대 7회 튕긴다."
      },
      "stats": {
        "attack": 100,
        "magicPower": 0,
        "hp": 900,
        "defence": 20,
        "magicResistance": 15,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 1.0,
        "range": 60
      },
      "growth": {
        "attack": 20,
        "magicPower": 0,
        "hp": 90,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "boomerang_hunter_1",
          "cooltime": "6.00",
          "description": "일직선 방향으로 부메랑을 던져 30 + 공격력의 10% 만큼의 물리 피해를 입힌다. 사거리의 끝 지점에서 부메랑이 일정 시간 회전하며, 닿은 적에게 0 + 공격력의 {DotCoef}% 만큼의 물리 피해를 지속적으로 입힌다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "boomerang_hunter_2",
          "cooltime": "8.00",
          "description": "세 갈래로 부메랑을 던진다. 부메랑은 끝까지 갔다가 돌아오며 궤적에 있는 적 모두에게 20 + 공격력의 60% 만큼의 물리 피해를 입힌다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "boomerang_hunter_4",
          "cooltime": "50.00",
          "description": "일직선 방향으로 강력한 부메랑을 발사하여 30 + 공격력의 80% 만큼의 물리 피해를 입힌다. 적 챔피언에게 적중 시 가장 가까운 다른 적 챔피언 방향으로 튕기며, 튕길 때마다 피해량이 {Increase}%씩 증가한다. 최대 7회 튕긴다."
        }
      ],
      "metrics": {
        "damage": 106.0,
        "durability": 108.75,
        "utility": 7.0,
        "scaling": 55.9,
        "mobility": 13.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 35.6,
        "durabilityNorm": 0.0,
        "utilityNorm": 14.6,
        "scalingNorm": 47.8,
        "mobilityNorm": 0.0
      },
      "roleFit": {
        "top": 30.9,
        "jungle": 20.7,
        "mid": 35.7,
        "bot": 100,
        "support": 27.6
      },
      "bestRole": "bot",
      "asset": {
        "sheet": "assets/champions/boomerang_hunter.png",
        "sheetWidth": 2338,
        "sheetHeight": 92,
        "frame": {
          "x": 86,
          "y": 0,
          "w": 35,
          "h": 49
        }
      },
      "overall": 36.9,
      "tier": "D",
      "candidateIndex": 26
    },
    {
      "id": "voodoo_shaman",
      "name": "부두술사",
      "category": "Magician",
      "tags": [
        "AP",
        "CC",
        "Magic",
        "Magician",
        "Poke"
      ],
      "rawTags": [
        "AP",
        "CC",
        "Magic"
      ],
      "description": {
        "skill": "저주의 투사체를 발사하여 30 + 주문력의 80% 만큼의 마법 피해를 입히고, 2.00초 동안 60% 둔화시키며 공격속도를 {AtkSpd}% {AtkSpdTime}초 동안 감소시킨다.",
        "skill2": "적 대상을 지정하여 {Time}초 동안 저주를 걸고, {Damage} + 주문력의 60% 만큼의 마법 피해를 입힌다. 지속되는 동안 공격받은 횟수에 비례하여 {HitDmg} + 주문력의 {HitCoef}% 만큼의 추가 피해를 입힌다. (최대 {Max}회)",
        "ult": "지정한 위치에 0.50초 동안 부두 영역을 생성한다. 영역 내의 적은 최대 체력의 {HpRatio}% + 주문력의 30% 만큼의 마법 피해를 지속적으로 받으며 스킬 사용 불가 상태가 된다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 30,
        "hp": 900,
        "defence": 20,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.67,
        "range": 60
      },
      "growth": {
        "attack": 6,
        "magicPower": 15,
        "hp": 100,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "voodoo_shaman_1",
          "cooltime": "6.00",
          "description": "저주의 투사체를 발사하여 30 + 주문력의 80% 만큼의 마법 피해를 입히고, 2.00초 동안 60% 둔화시키며 공격속도를 {AtkSpd}% {AtkSpdTime}초 동안 감소시킨다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "voodoo_shaman_2",
          "cooltime": "10.00",
          "description": "적 대상을 지정하여 {Time}초 동안 저주를 걸고, {Damage} + 주문력의 60% 만큼의 마법 피해를 입힌다. 지속되는 동안 공격받은 횟수에 비례하여 {HitDmg} + 주문력의 {HitCoef}% 만큼의 추가 피해를 입힌다. (최대 {Max}회)"
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "voodoo_shaman_4",
          "cooltime": "50.00",
          "description": "지정한 위치에 0.50초 동안 부두 영역을 생성한다. 영역 내의 적은 최대 체력의 {HpRatio}% + 주문력의 30% 만큼의 마법 피해를 지속적으로 받으며 스킬 사용 불가 상태가 된다."
        }
      ],
      "metrics": {
        "damage": 92.18,
        "durability": 116.5,
        "utility": 7.0,
        "scaling": 58.5,
        "mobility": 15.0,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 23.5,
        "durabilityNorm": 6.6,
        "utilityNorm": 14.6,
        "scalingNorm": 55.4,
        "mobilityNorm": 5.1
      },
      "roleFit": {
        "top": 29.0,
        "jungle": 18.2,
        "mid": 100,
        "bot": 36.6,
        "support": 32.6
      },
      "bestRole": "mid",
      "asset": {
        "sheet": "assets/champions/voodoo_shaman.png",
        "sheetWidth": 2690,
        "sheetHeight": 170,
        "frame": {
          "x": 24,
          "y": 0,
          "w": 23,
          "h": 49
        }
      },
      "overall": 36.7,
      "tier": "D",
      "candidateIndex": 52
    },
    {
      "id": "poison_dart_hunter",
      "name": "독침술사",
      "category": "Range",
      "tags": [
        "AD",
        "AOE",
        "Backline",
        "CC",
        "Dot",
        "Mobility",
        "Range"
      ],
      "rawTags": [
        "AD",
        "Dot"
      ],
      "description": {
        "skill": "독 장판을 뿌려 범위 내 적에게 2 + 공격력의 7% 만큼의 물리 피해를 입히며 0.33초 동안 중독시키고 10% 둔화시킨다.",
        "skill2": "중독된 적을 공격할 때 사거리가 50 증가하며 중독된 적에게서 멀어질 때 이동속도가 900% 증가한다.",
        "ult": "0.50초 동안 주변 아군의 공격에 독 효과를 부여한다. 독은 180초 동안 8 + 공격력의 10% 만큼의 물리 피해를 지속적으로 입힌다."
      },
      "stats": {
        "attack": 100,
        "magicPower": 0,
        "hp": 900,
        "defence": 20,
        "magicResistance": 15,
        "moveSpeed": 900,
        "moveSpeedDisplay": 54.0,
        "attackSpeed": 1.0,
        "range": 50
      },
      "growth": {
        "attack": 15,
        "magicPower": 0,
        "hp": 90,
        "defence": 7,
        "magicResistance": 3,
        "moveSpeedDisplay": 0.54,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "poison_dart_hunter_1",
          "cooltime": null,
          "description": "독 장판을 뿌려 범위 내 적에게 2 + 공격력의 7% 만큼의 물리 피해를 입히며 0.33초 동안 중독시키고 10% 둔화시킨다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "poison_dart_hunter_2",
          "cooltime": null,
          "description": "중독된 적을 공격할 때 사거리가 50 증가하며 중독된 적에게서 멀어질 때 이동속도가 900% 증가한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "poison_dart_hunter_4",
          "cooltime": "30.00",
          "description": "0.50초 동안 주변 아군의 공격에 독 효과를 부여한다. 독은 180초 동안 8 + 공격력의 10% 만큼의 물리 피해를 지속적으로 입힌다."
        }
      ],
      "metrics": {
        "damage": 96.52,
        "durability": 108.75,
        "utility": 0.0,
        "scaling": 46.9,
        "mobility": 38.5,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 27.3,
        "durabilityNorm": 0.0,
        "utilityNorm": 0.0,
        "scalingNorm": 21.7,
        "mobilityNorm": 84.7
      },
      "roleFit": {
        "top": 30.6,
        "jungle": 23.7,
        "mid": 34.4,
        "bot": 100,
        "support": 22.0
      },
      "bestRole": "bot",
      "asset": {
        "sheet": "assets/champions/poison_dart_hunter.png",
        "sheetWidth": 1458,
        "sheetHeight": 50,
        "frame": {
          "x": 36,
          "y": 0,
          "w": 35,
          "h": 47
        }
      },
      "overall": 34.8,
      "tier": "D",
      "candidateIndex": 44
    },
    {
      "id": "bard",
      "name": "음유시인",
      "category": "Util",
      "tags": [
        "AOE",
        "AP",
        "Util"
      ],
      "rawTags": [
        "AP"
      ],
      "description": {
        "skill": "아군 1명의 공격속도를 200% + 주문력의 20%만큼 0.50초 동안 증가시킨다.",
        "skill2": "지정한 일정 범위 내의 아군들의 스킬 재사용 대기시간이 0.50초 동안 {CoolReduce}% + 주문력의 2%만큼 감소한다.",
        "ult": "0.50초 동안 채널링하며 주변 100 범위의 아군 챔피언의 공격력을 100(+주문력의 {AttackRatio}%), 주문력을 {MagicPower}, 공격속도를 {AttackSpeed}%, 스킬 재사용 대기시간을 {CoolReduce}% 감소시키지만, 방어력이 30% 감소하고 마법저항력이 30% 감소한다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 30,
        "hp": 900,
        "defence": 20,
        "magicResistance": 20,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.67,
        "range": 80
      },
      "growth": {
        "attack": 6,
        "magicPower": 15,
        "hp": 100,
        "defence": 8,
        "magicResistance": 4,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "bard_1",
          "cooltime": "6.00",
          "description": "아군 1명의 공격속도를 200% + 주문력의 20%만큼 0.50초 동안 증가시킨다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "bard_2",
          "cooltime": "6.00",
          "description": "지정한 일정 범위 내의 아군들의 스킬 재사용 대기시간이 0.50초 동안 {CoolReduce}% + 주문력의 2%만큼 감소한다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "bard_4",
          "cooltime": "40.00",
          "description": "0.50초 동안 채널링하며 주변 100 범위의 아군 챔피언의 공격력을 100(+주문력의 {AttackRatio}%), 주문력을 {MagicPower}, 공격속도를 {AttackSpeed}%, 스킬 재사용 대기시간을 {CoolReduce}% 감소시키지만, 방어력이 30% 감소하고 마법저항력이 30% 감소한다."
        }
      ],
      "metrics": {
        "damage": 93.98,
        "durability": 116.5,
        "utility": 0.0,
        "scaling": 61.0,
        "mobility": 15.0,
        "cc": 0.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 25.1,
        "durabilityNorm": 6.6,
        "utilityNorm": 0.0,
        "scalingNorm": 62.6,
        "mobilityNorm": 5.1
      },
      "roleFit": {
        "top": 25.1,
        "jungle": 16.3,
        "mid": 33.0,
        "bot": 28.8,
        "support": 94.0
      },
      "bestRole": "support",
      "asset": {
        "sheet": "assets/champions/bard.png",
        "sheetWidth": 1484,
        "sheetHeight": 54,
        "frame": {
          "x": 32,
          "y": 0,
          "w": 31,
          "h": 49
        }
      },
      "overall": 34.3,
      "tier": "D",
      "candidateIndex": 33
    },
    {
      "id": "ogre",
      "name": "오우거",
      "category": "Melee",
      "tags": [
        "AD",
        "CC",
        "Frontline",
        "Melee",
        "Tank"
      ],
      "rawTags": [
        "AD",
        "Tank",
        "CC"
      ],
      "description": {
        "skill": "상대 챔피언에게 피해를 입을 때마다 최대 체력이 {Value} 증가한다.",
        "skill2": "단일 대상을 몽둥이로 내리쳐 1.00초 동안 기절시키며 50 + 공격력의 80% + 최대 체력의 {HpCoef}% 만큼의 물리 피해를 입힌다.",
        "ult": "6.00초 동안 몸이 거대화하여, 최대 체력이 {Buff}% + 최대 체력의 {HpCoef}% 증가한다."
      },
      "stats": {
        "attack": 80,
        "magicPower": 0,
        "hp": 1100,
        "defence": 40,
        "magicResistance": 30,
        "moveSpeed": 1000,
        "moveSpeedDisplay": 60.0,
        "attackSpeed": 0.86,
        "range": 28
      },
      "growth": {
        "attack": 6,
        "magicPower": 0,
        "hp": 120,
        "defence": 10,
        "magicResistance": 5,
        "moveSpeedDisplay": 0.6,
        "attackSpeed": 0,
        "range": 0
      },
      "skills": [
        {
          "id": "skill",
          "level": 1,
          "iconKey": "ogre_1",
          "cooltime": null,
          "description": "상대 챔피언에게 피해를 입을 때마다 최대 체력이 {Value} 증가한다."
        },
        {
          "id": "skill2",
          "level": 3,
          "iconKey": "ogre_2",
          "cooltime": "3.00",
          "description": "단일 대상을 몽둥이로 내리쳐 1.00초 동안 기절시키며 50 + 공격력의 80% + 최대 체력의 {HpCoef}% 만큼의 물리 피해를 입힌다."
        },
        {
          "id": "ult",
          "level": 5,
          "iconKey": "ogre_4",
          "cooltime": "50.00",
          "description": "6.00초 동안 몸이 거대화하여, 최대 체력이 {Buff}% + 최대 체력의 {HpCoef}% 증가한다."
        }
      ],
      "metrics": {
        "damage": 79.28,
        "durability": 191.0,
        "utility": 7.2,
        "scaling": 39.4,
        "mobility": 15.0,
        "cc": 60.0,
        "heal": 0.0,
        "shield": 0.0,
        "damageNorm": 12.1,
        "durabilityNorm": 70.1,
        "utilityNorm": 15.0,
        "scalingNorm": 0.0,
        "mobilityNorm": 5.1
      },
      "roleFit": {
        "top": 95.5,
        "jungle": 58.4,
        "mid": 27.2,
        "bot": 20.5,
        "support": 39.7
      },
      "bestRole": "top",
      "asset": {
        "sheet": "assets/champions/ogre.png",
        "sheetWidth": 2746,
        "sheetHeight": 148,
        "frame": {
          "x": 50,
          "y": 0,
          "w": 51,
          "h": 67
        }
      },
      "overall": 33.7,
      "tier": "D",
      "candidateIndex": 15
    }
  ],
  "skillIconAtlas": {
    "sheet": "assets/skill_icon.png",
    "sheetWidth": 4096,
    "sheetHeight": 49,
    "rects": {
      "cavalry_knight_2": {
        "x": 3325,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "hunter_3": {
        "x": 1875,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "barrier_magician_1": {
        "x": 1950,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "soldier_4": {
        "x": 2225,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "taoist_4": {
        "x": 2900,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "lancer_0": {
        "x": 675,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "dual_blader_0": {
        "x": 700,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "guardian_spirit_0": {
        "x": 1375,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "soldier_2": {
        "x": 3300,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "pyromancer_0": {
        "x": 250,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "ice_mage_1": {
        "x": 1600,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "gambler_3": {
        "x": 1075,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "knight_4": {
        "x": 2050,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "monk_2": {
        "x": 3175,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "whip_master_2": {
        "x": 125,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "cavalry_knight_4": {
        "x": 2250,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "hitman_4": {
        "x": 3350,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "enchanter_3": {
        "x": 1775,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "gunner_1": {
        "x": 2275,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "chef_0": {
        "x": 850,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "ogre_0": {
        "x": 925,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "ghost_1": {
        "x": 2125,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "voodoo_shaman_1": {
        "x": 2825,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "ninja_3": {
        "x": 625,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "pythoness_3": {
        "x": 700,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "shield_bearer_3": {
        "x": 850,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "necromancer_4": {
        "x": 2450,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "monk_1": {
        "x": 1675,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "jiangshi_2": {
        "x": 4050,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "siege_breaker_2": {
        "x": 0,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "druid_1": {
        "x": 2650,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "soldier_3": {
        "x": 725,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "white_mage_3": {
        "x": 1700,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "lightning_mage_4": {
        "x": 2475,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "dancer_4": {
        "x": 2925,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "wind_mage_4": {
        "x": 3150,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "circus_blade_4": {
        "x": 3400,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "barrier_magician_4": {
        "x": 2375,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "gunner_3": {
        "x": 1200,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "wind_mage_0": {
        "x": 1225,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "swordman_2": {
        "x": 3000,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "circus_blade_1": {
        "x": 2975,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "taoist_2": {
        "x": 3975,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "barrier_magician_3": {
        "x": 875,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "ice_mage_0": {
        "x": 100,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "ogre_1": {
        "x": 2425,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "jiangshi_1": {
        "x": 2550,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "inquisitor_2": {
        "x": 325,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "chef_3": {
        "x": 1275,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "hunter_1": {
        "x": 2950,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "chef_1": {
        "x": 2350,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "pythoness_2": {
        "x": 3275,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "boomerang_hunter_1": {
        "x": 1900,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "clown_2": {
        "x": 3900,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "exorcist_1": {
        "x": 2375,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "werewolf_2": {
        "x": 3950,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "dark_mage_3": {
        "x": 1450,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "executioner_4": {
        "x": 2650,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "spirit_caller_1": {
        "x": 2800,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "cavalry_knight_0": {
        "x": 325,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "vampire_1": {
        "x": 2000,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "lightning_mage_2": {
        "x": 3550,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "berserker_3": {
        "x": 475,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "pyromancer_3": {
        "x": 675,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "enchanter_4": {
        "x": 3275,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "voodoo_shaman_0": {
        "x": 1325,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "fighter_1": {
        "x": 1575,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "pyromancer_2": {
        "x": 3250,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "gunner_2": {
        "x": 3775,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "illusionist_2": {
        "x": 3800,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "android_2": {
        "x": 50,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "priest_2": {
        "x": 3225,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "spirit_caller_2": {
        "x": 225,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "taoist_0": {
        "x": 975,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "demon_2": {
        "x": 3475,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "hunter_2": {
        "x": 375,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "hammerer_1": {
        "x": 1875,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "archer_1": {
        "x": 1525,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "swordman_0": {
        "x": 0,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "jiangshi_4": {
        "x": 2975,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "pole_warrior_4": {
        "x": 2275,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "gambler_0": {
        "x": 650,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "necromancer_0": {
        "x": 525,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "wind_mage_3": {
        "x": 1650,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "dark_mage_4": {
        "x": 2950,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "dual_blader_3": {
        "x": 1125,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "inquisitor_0": {
        "x": 1400,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "whip_master_3": {
        "x": 1625,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "pyromancer_4": {
        "x": 2175,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "hitman_1": {
        "x": 2925,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "chef_2": {
        "x": 3850,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "enchanter_1": {
        "x": 2850,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "lancer_4": {
        "x": 2600,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "android_0": {
        "x": 1125,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "inquisitor_1": {
        "x": 2900,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "lancer_1": {
        "x": 2175,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "white_mage_1": {
        "x": 2775,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "dancer_1": {
        "x": 2500,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "poison_dart_hunter_2": {
        "x": 3575,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "boomerang_hunter_2": {
        "x": 3400,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "illusionist_1": {
        "x": 2300,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "boomerang_hunter_3": {
        "x": 825,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "ogre_3": {
        "x": 1350,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "vampire_4": {
        "x": 2425,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "shadowmancer_1": {
        "x": 2325,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "guardian_spirit_2": {
        "x": 300,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "lancer_3": {
        "x": 1100,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "lightning_mage_1": {
        "x": 2050,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "shadowmancer_0": {
        "x": 825,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "pythoness_1": {
        "x": 1775,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "exorcist_0": {
        "x": 875,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "clown_0": {
        "x": 900,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "siege_breaker_1": {
        "x": 2575,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "prisoner_1": {
        "x": 2675,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "circus_blade_3": {
        "x": 1900,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "chef_4": {
        "x": 2775,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "guardian_spirit_3": {
        "x": 1800,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "shield_bearer_1": {
        "x": 1925,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "demon_3": {
        "x": 900,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "dancer_3": {
        "x": 1425,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "dokkaebi_2": {
        "x": 25,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "enchanter_0": {
        "x": 1350,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "enchanter_2": {
        "x": 275,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "jiangshi_3": {
        "x": 1475,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "ice_mage_4": {
        "x": 2025,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "berserker_4": {
        "x": 1975,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "executioner_1": {
        "x": 2225,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "wind_mage_2": {
        "x": 150,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "shadowmancer_3": {
        "x": 1250,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "ninja_4": {
        "x": 2125,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "white_mage_0": {
        "x": 1275,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "necromancer_3": {
        "x": 950,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "archer_4": {
        "x": 1950,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "plague_doctor_2": {
        "x": 3600,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "jiangshi_0": {
        "x": 1050,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "hitman_3": {
        "x": 1850,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "voodoo_shaman_4": {
        "x": 3250,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "exorcist_4": {
        "x": 2800,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "bard_0": {
        "x": 750,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "whip_master_0": {
        "x": 1200,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "pole_warrior_1": {
        "x": 1850,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "magic_knight_3": {
        "x": 575,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "swordman_4": {
        "x": 1925,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "fighter_3": {
        "x": 500,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "spirit_caller_0": {
        "x": 1300,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "berserker_1": {
        "x": 1550,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "bomber_3": {
        "x": 1675,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "clown_4": {
        "x": 2825,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "fighter_4": {
        "x": 2000,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "bard_1": {
        "x": 2250,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "prisoner_4": {
        "x": 3100,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "bomber_0": {
        "x": 1250,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "berserker_0": {
        "x": 50,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "magic_knight_0": {
        "x": 150,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "hunter_0": {
        "x": 1450,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "whip_master_1": {
        "x": 2700,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "pole_warrior_3": {
        "x": 775,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "priest_4": {
        "x": 2150,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "executioner_2": {
        "x": 3725,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "pythoness_0": {
        "x": 275,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "ninja_1": {
        "x": 1700,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "hammerer_0": {
        "x": 375,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "shadowmancer_4": {
        "x": 2750,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "ogre_4": {
        "x": 2850,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "werewolf_1": {
        "x": 2450,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "dual_blader_2": {
        "x": 3700,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "clown_3": {
        "x": 1325,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "ghost_4": {
        "x": 2550,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "necromancer_1": {
        "x": 2025,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "dual_blader_4": {
        "x": 2625,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "soldier_0": {
        "x": 300,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "lightning_mage_3": {
        "x": 975,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "siege_breaker_4": {
        "x": 3000,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "bard_2": {
        "x": 3750,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "priest_3": {
        "x": 650,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "demon_0": {
        "x": 475,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "hammerer_3": {
        "x": 800,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "prisoner_0": {
        "x": 1175,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "lancer_2": {
        "x": 3675,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "inquisitor_4": {
        "x": 3325,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "druid_0": {
        "x": 1150,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "werewolf_3": {
        "x": 1375,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "voodoo_shaman_2": {
        "x": 250,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "ghost_3": {
        "x": 1050,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "dual_blader_1": {
        "x": 2200,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "exorcist_3": {
        "x": 1300,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "necromancer_2": {
        "x": 3525,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "gambler_1": {
        "x": 2150,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "exorcist_2": {
        "x": 3875,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "knight_3": {
        "x": 550,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "poison_dart_hunter_3": {
        "x": 1000,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "hammerer_4": {
        "x": 2300,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "werewolf_4": {
        "x": 2875,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "dokkaebi_4": {
        "x": 3025,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "druid_3": {
        "x": 1575,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "pole_warrior_2": {
        "x": 3350,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "dokkaebi_1": {
        "x": 2600,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "hunter_4": {
        "x": 3375,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "android_4": {
        "x": 3050,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "dokkaebi_0": {
        "x": 1100,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "android_3": {
        "x": 1550,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "soldier_1": {
        "x": 1800,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "gambler_2": {
        "x": 3650,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "circus_blade_0": {
        "x": 1475,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "swordman_3": {
        "x": 425,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "magic_knight_4": {
        "x": 2075,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "magic_knight_1": {
        "x": 1650,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "boomerang_hunter_0": {
        "x": 400,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "wind_mage_1": {
        "x": 2725,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "ninja_2": {
        "x": 3200,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "cavalry_knight_1": {
        "x": 1825,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "cavalry_knight_3": {
        "x": 750,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "white_mage_4": {
        "x": 3200,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "archer_2": {
        "x": 3025,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "vampire_3": {
        "x": 925,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "barrier_magician_0": {
        "x": 450,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "knight_0": {
        "x": 125,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "boomerang_hunter_4": {
        "x": 2325,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "monk_0": {
        "x": 175,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "dark_mage_0": {
        "x": 1025,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "plague_doctor_4": {
        "x": 2525,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "bomber_4": {
        "x": 3175,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "pythoness_4": {
        "x": 2200,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "shield_bearer_0": {
        "x": 425,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "circus_blade_2": {
        "x": 400,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "bard_3": {
        "x": 1175,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "knight_1": {
        "x": 1625,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "berserker_2": {
        "x": 3050,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "vampire_0": {
        "x": 500,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "android_1": {
        "x": 2625,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "druid_2": {
        "x": 75,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "demon_1": {
        "x": 1975,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "ogre_2": {
        "x": 3925,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "bomber_2": {
        "x": 175,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "ice_mage_2": {
        "x": 3100,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "whip_master_4": {
        "x": 3125,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "ice_mage_3": {
        "x": 525,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "gambler_4": {
        "x": 2575,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "illusionist_3": {
        "x": 1225,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "shadowmancer_2": {
        "x": 3825,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "monk_3": {
        "x": 600,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "clown_1": {
        "x": 2400,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "priest_0": {
        "x": 225,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "ghost_0": {
        "x": 625,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "poison_dart_hunter_4": {
        "x": 2500,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "hammerer_2": {
        "x": 3375,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "plague_doctor_1": {
        "x": 2100,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "knight_2": {
        "x": 3125,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "lightning_mage_0": {
        "x": 550,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "taoist_3": {
        "x": 1400,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "inquisitor_3": {
        "x": 1825,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "priest_1": {
        "x": 1725,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "pole_warrior_0": {
        "x": 350,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "taoist_1": {
        "x": 2475,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "guardian_spirit_4": {
        "x": 3300,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "dark_mage_2": {
        "x": 4025,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "dancer_0": {
        "x": 1000,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "ghost_2": {
        "x": 3625,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "hitman_2": {
        "x": 350,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "siege_breaker_3": {
        "x": 1500,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "guardian_spirit_1": {
        "x": 2875,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "white_mage_2": {
        "x": 200,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "hitman_0": {
        "x": 1425,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "illusionist_4": {
        "x": 2725,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "prisoner_2": {
        "x": 100,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "bomber_1": {
        "x": 2750,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "plague_doctor_0": {
        "x": 600,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "druid_4": {
        "x": 3075,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "executioner_0": {
        "x": 725,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "monk_4": {
        "x": 2100,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "pyromancer_1": {
        "x": 1750,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "vampire_2": {
        "x": 3500,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "swordman_1": {
        "x": 1500,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "gunner_4": {
        "x": 2700,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "barrier_magician_2": {
        "x": 3450,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "siege_breaker_0": {
        "x": 1075,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "dokkaebi_3": {
        "x": 1525,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "shield_bearer_4": {
        "x": 2350,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "ninja_0": {
        "x": 200,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "werewolf_0": {
        "x": 950,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "spirit_caller_4": {
        "x": 3225,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "voodoo_shaman_3": {
        "x": 1750,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "prisoner_3": {
        "x": 1600,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "demon_4": {
        "x": 2400,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "poison_dart_hunter_0": {
        "x": 575,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "dancer_2": {
        "x": 4000,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "illusionist_0": {
        "x": 800,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "executioner_3": {
        "x": 1150,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "spirit_caller_3": {
        "x": 1725,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "gunner_0": {
        "x": 775,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "fighter_0": {
        "x": 75,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "shield_bearer_2": {
        "x": 3425,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "magic_knight_2": {
        "x": 3150,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "poison_dart_hunter_1": {
        "x": 2075,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "archer_0": {
        "x": 25,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "fighter_2": {
        "x": 3075,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "dark_mage_1": {
        "x": 2525,
        "y": 0,
        "w": 24,
        "h": 24
      },
      "bard_4": {
        "x": 2675,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "archer_3": {
        "x": 450,
        "y": 24,
        "w": 24,
        "h": 24
      },
      "plague_doctor_3": {
        "x": 1025,
        "y": 24,
        "w": 24,
        "h": 24
      }
    }
  },
  "stats": {
    "vampire": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "monk": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "circus_blade": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "android": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "inquisitor": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "lancer": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "ninja": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "fighter": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "ice_mage": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "wind_mage": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "exorcist": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "ghost": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "pole_warrior": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "dual_blader": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "demon": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "swordman": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "white_mage": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "shadowmancer": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "pythoness": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "hunter": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "jiangshi": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "guardian_spirit": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "druid": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "siege_breaker": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "knight": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "werewolf": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "dark_mage": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "magic_knight": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "illusionist": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "berserker": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "pyromancer": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "bomber": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "necromancer": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "priest": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "lightning_mage": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "prisoner": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "dokkaebi": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "executioner": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "barrier_magician": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "shield_bearer": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "archer": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "gambler": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "whip_master": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "hitman": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "chef": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "spirit_caller": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "taoist": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "gunner": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "hammerer": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "clown": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "cavalry_knight": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "enchanter": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "soldier": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "plague_doctor": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "dancer": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "boomerang_hunter": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "voodoo_shaman": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "poison_dart_hunter": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "bard": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    },
    "ogre": {
      "pickCount": null,
      "wins": null,
      "losses": null,
      "winRate": null,
      "pickRate": null,
      "banCount": null,
      "banRate": null,
      "banPickRate": null,
      "dealt": null,
      "taken": null,
      "healing": null,
      "kills": null,
      "deaths": null,
      "assists": null,
      "cs": null,
      "gold": null,
      "itemCounts": null,
      "topItems": [],
      "linePhase": null,
      "byPosition": null,
      "sourceMatchCounts": null,
      "sourcePickCounts": null,
      "sourceBanCounts": null,
      "draftMentions": 0,
      "source": "not_collected",
      "confidence": "none",
      "tier": "-"
    }
  },
  "statsByScope": {
    "overall": {
      "vampire": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "monk": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "circus_blade": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "android": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "inquisitor": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "lancer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "ninja": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "fighter": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "ice_mage": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "wind_mage": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "exorcist": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "ghost": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "pole_warrior": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "dual_blader": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "demon": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "swordman": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "white_mage": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "shadowmancer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "pythoness": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "hunter": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "jiangshi": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "guardian_spirit": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "druid": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "siege_breaker": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "knight": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "werewolf": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "dark_mage": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "magic_knight": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "illusionist": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "berserker": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "pyromancer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "bomber": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "necromancer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "priest": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "lightning_mage": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "prisoner": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "dokkaebi": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "executioner": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "barrier_magician": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "shield_bearer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "archer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "gambler": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "whip_master": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "hitman": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "chef": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "spirit_caller": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "taoist": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "gunner": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "hammerer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "clown": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "cavalry_knight": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "enchanter": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "soldier": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "plague_doctor": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "dancer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "boomerang_hunter": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "voodoo_shaman": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "poison_dart_hunter": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "bard": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "ogre": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      }
    },
    "tournament": {
      "vampire": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "monk": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "circus_blade": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "android": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "inquisitor": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "lancer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "ninja": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "fighter": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "ice_mage": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "wind_mage": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "exorcist": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "ghost": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "pole_warrior": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "dual_blader": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "demon": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "swordman": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "white_mage": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "shadowmancer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "pythoness": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "hunter": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "jiangshi": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "guardian_spirit": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "druid": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "siege_breaker": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "knight": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "werewolf": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "dark_mage": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "magic_knight": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "illusionist": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "berserker": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "pyromancer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "bomber": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "necromancer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "priest": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "lightning_mage": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "prisoner": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "dokkaebi": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "executioner": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "barrier_magician": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "shield_bearer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "archer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "gambler": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "whip_master": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "hitman": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "chef": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "spirit_caller": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "taoist": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "gunner": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "hammerer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "clown": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "cavalry_knight": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "enchanter": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "soldier": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "plague_doctor": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "dancer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "boomerang_hunter": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "voodoo_shaman": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "poison_dart_hunter": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "bard": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "ogre": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "itemCounts": null,
        "topItems": [],
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      }
    },
    "solo": {
      "vampire": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "monk": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "circus_blade": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "android": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "inquisitor": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "lancer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "ninja": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "fighter": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "ice_mage": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "wind_mage": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "exorcist": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "ghost": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "pole_warrior": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "dual_blader": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "demon": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "swordman": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "white_mage": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "shadowmancer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "pythoness": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "hunter": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "jiangshi": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "guardian_spirit": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "druid": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "siege_breaker": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "knight": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "werewolf": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "dark_mage": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "magic_knight": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "illusionist": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "berserker": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "pyromancer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "bomber": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "necromancer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "priest": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "lightning_mage": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "prisoner": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "dokkaebi": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "executioner": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "barrier_magician": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "shield_bearer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "archer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "gambler": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "whip_master": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "hitman": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "chef": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "spirit_caller": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "taoist": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "gunner": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "hammerer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "clown": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "cavalry_knight": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "enchanter": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "soldier": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "plague_doctor": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "dancer": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "boomerang_hunter": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "voodoo_shaman": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "poison_dart_hunter": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "bard": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      },
      "ogre": {
        "pickCount": null,
        "wins": null,
        "losses": null,
        "winRate": null,
        "pickRate": null,
        "banCount": null,
        "banRate": null,
        "banPickRate": null,
        "dealt": null,
        "taken": null,
        "healing": null,
        "kills": null,
        "deaths": null,
        "assists": null,
        "cs": null,
        "gold": null,
        "itemCounts": null,
        "topItems": [],
        "linePhase": null,
        "byPosition": null,
        "sourceMatchCounts": null,
        "sourcePickCounts": null,
        "sourceBanCounts": null,
        "draftMentions": 0,
        "source": "not_collected",
        "confidence": "none",
        "tier": "-"
      }
    }
  },
  "statsByPatch": {},
  "tournamentSplits": {
    "stats": {
      "league": {},
      "region": {},
      "division": {},
      "regionDivision": {},
      "competition": {}
    },
    "statsByPatch": {
      "league": {},
      "region": {},
      "division": {},
      "regionDivision": {},
      "competition": {}
    },
    "relationships": {
      "league": {},
      "region": {},
      "division": {},
      "regionDivision": {},
      "competition": {}
    },
    "relationshipsByPatch": {
      "league": {},
      "region": {},
      "division": {},
      "regionDivision": {},
      "competition": {}
    },
    "laneSynergies": {
      "league": {},
      "region": {},
      "division": {},
      "regionDivision": {},
      "competition": {}
    },
    "laneSynergiesByPatch": {
      "league": {},
      "region": {},
      "division": {},
      "regionDivision": {},
      "competition": {}
    },
    "counts": {
      "league": {},
      "region": {},
      "division": {},
      "regionDivision": {},
      "competition": {}
    }
  },
  "soloSplits": {
    "stats": {
      "region": {}
    },
    "statsByPatch": {
      "region": {}
    },
    "relationships": {
      "region": {}
    },
    "relationshipsByPatch": {
      "region": {}
    },
    "laneSynergies": {
      "region": {}
    },
    "laneSynergiesByPatch": {
      "region": {}
    },
    "counts": {
      "region": {},
      "regionByPatch": {}
    }
  },
  "combinedSplits": {
    "stats": {
      "region": {}
    },
    "statsByPatch": {
      "region": {}
    },
    "relationships": {
      "region": {}
    },
    "relationshipsByPatch": {
      "region": {}
    },
    "laneSynergies": {
      "region": {}
    },
    "laneSynergiesByPatch": {
      "region": {}
    },
    "counts": {
      "region": {},
      "regionByPatch": {}
    }
  },
  "relationships": {},
  "relationshipsByScope": {
    "overall": {
      "groups": 0,
      "pairs": {},
      "counters": {}
    },
    "tournament": {
      "groups": 0,
      "pairs": {},
      "counters": {}
    },
    "solo": {
      "groups": 0,
      "pairs": {},
      "counters": {}
    }
  },
  "relationshipsByPatch": {},
  "laneSynergiesByScope": {
    "overall": {
      "bot_support": [],
      "top_jungle": [],
      "mid_jungle": []
    },
    "tournament": {
      "bot_support": [],
      "top_jungle": [],
      "mid_jungle": []
    },
    "solo": {
      "bot_support": [],
      "top_jungle": [],
      "mid_jungle": []
    }
  },
  "laneSynergiesByPatch": {},
  "matchAnalysis": [],
  "notes": [
    "챔피언 이름, 아이콘, 스킬, 기본 스탯은 게임 번들에서 직접 추출했습니다.",
    "대회 승률, 픽률, 밴률은 champion_patch_statistics를 사용합니다.",
    "솔랭 승률과 챔피언별 성과는 solo_rank_matches를 합산합니다.",
    "시너지와 상대 지표는 실제 리플레이/솔랭 경기에서 같은 팀 또는 상대 팀으로 만난 표본을 집계합니다."
  ]
};
