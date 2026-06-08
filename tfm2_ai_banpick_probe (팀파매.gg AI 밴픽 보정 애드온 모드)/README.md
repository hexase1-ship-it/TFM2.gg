# TFM2 AI Banpick Policy

팀파매.gg 대시보드가 계산한 메타 기반 정책 점수를 게임의 AI 밴픽 후보 점수에 더해 주는 애드온입니다.

## 기능

AI가 밴/픽 후보를 평가할 때 게임 기본 점수에 아래 보정치를 더합니다.

```text
최종 점수 = 게임 기본 AI 점수 + clamp((overall - overall_neutral) / overall_divisor, min_bias, max_bias)
```

기본값:

```ini
overall_neutral=50
overall_divisor=20
min_bias=-1.5
max_bias=1.5
```

예:

```text
overall=80 -> +1.5 근처
overall=70 -> +1.0 근처
overall=60 -> +0.5 근처
overall=50 -> 0
overall=40 -> -0.5 근처
```

## 정책 기준

`ai_champion_policy.tsv`는 대시보드의 메타 티어와 메타 스코어를 AI 밴픽용 점수로 변환한 파일입니다. 인게임 표시용 티어 파일(`champion_tier_policy.tsv`)과는 의미가 다릅니다.

## 정책 파일 형식

기본 형식:

```text
champion_id<TAB>tier<TAB>overall<TAB>candidate_index
```

예:

```text
fighter   A   71.6   0
knight    C   50.0   1
swordman  A   71.1   2
```

`candidate_index`는 게임 내부 밴픽 후보 번호입니다. 새 팀파매.gg 대시보드는 이 값을 자동으로 출력합니다. 값이 없는 구형 정책 파일은 기본 60챔피언 순서로 fallback합니다.

## 경로 설정

`config.ini` 또는 `ai_banpick_config.ini`에서 직접 설정할 수 있습니다.

```ini
policy_path=C:\Path\To\ai_champion_policy.tsv
policy_dir=C:\Path\To\policy_exports
policy_file=ai_champion_policy.tsv
enabled=true
overall_neutral=50
overall_divisor=20
min_bias=-1.5
max_bias=1.5
```

직접 지정하지 않으면 다음 순서로 찾습니다.

1. 게임 폴더의 `TFM2.gg\resources\app\tfm2_meta_dashboard\data\policy_exports`
2. 모드 폴더의 `ai_champion_policy.tsv`

## 로그

작동 확인은 모드 폴더의 `debug.log`에서 할 수 있습니다.

```text
policy: loaded ...
draft_score_hook ban: ...
draft_score_hook pick: ...
```

로그가 너무 커지지 않도록 밴픽 후보 상세 로그는 실행당 일정 수량만 남깁니다.

## 버전

- 애드온 버전: 0.3.0
- 대상 게임/SDK: Teamfight Manager 2 0.4.11
- 구현 방식: 팀파매.gg 소스 기반 Rust 재구현
