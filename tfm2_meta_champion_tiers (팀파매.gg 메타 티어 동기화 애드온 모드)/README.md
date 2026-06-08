# TFM2 Meta Champion Tiers

팀파매.gg 대시보드가 생성한 최신 패치 전세계 대회 기준 메타 티어를 게임 안의 팀 챔피언 티어표(`Team.champion_tiers`)에 반영하는 애드온입니다.

## 기준

대시보드의 메타 티어를 인게임 티어 체계로 변환합니다.

```text
OP -> S
1  -> A
2  -> B
3  -> C
4  -> D
-  -> No-Tier
```

정책 파일은 기본적으로 대시보드의 `data/policy_exports/champion_tier_policy.tsv`를 우선 사용합니다. 이 파일은 최신 패치 전세계 대회 기준으로 생성됩니다.

## 동작 방식

- 게임 로드 후 `champion_tier_policy.tsv`를 읽습니다.
- 모든 팀의 챔피언 티어 맵에 정책을 적용합니다.
- `No` 행은 게임 내부의 `ChampionTier::NoTier`로 적용합니다.
- 정책 파일이 바뀌면 다음 적용 주기에서 다시 읽습니다.
- 같은 정책 파일 revision은 서버/클라이언트 각각 한 번만 반영합니다. 이후 인게임에서 수동으로 바꾼 티어는 대시보드에서 정책을 다시 생성하기 전까지 덮어쓰지 않습니다.
- 적용 결과는 `debug.log`와 `tier-policy-latest.txt`에 남깁니다.

## 정책 파일 형식

```text
champion_id<TAB>tier<TAB>overall
```

예:

```text
hunter    S     90.0
android   A     75.0
guardian_spirit B 62.0
hammerer  No
```

`overall`은 인게임 티어 표시가 다시 계산될 때도 의도한 S/A/B/C/D가 유지되도록 넣는 앵커값입니다. `No` 티어는 `overall`을 비워 둡니다.

## 경로 설정

`config.ini`에서 직접 정책 파일 경로를 지정할 수 있습니다.

```ini
policy_path=C:\Path\To\champion_tier_policy.tsv
policy_dir=C:\Path\To\policy_exports
policy_file=champion_tier_policy.tsv
```

직접 지정하지 않으면 다음 순서로 찾습니다.

1. 게임 폴더의 `TFM2.gg\resources\app\tfm2_meta_dashboard\data\policy_exports`
2. 모드 폴더의 `champion_tier_policy.tsv`

## 버전

- 애드온 버전: 0.2.5
- 대상 게임/SDK: Teamfight Manager 2 0.4.11
- 구현 방식: 팀파매.gg 소스 기반 Rust 재구현
