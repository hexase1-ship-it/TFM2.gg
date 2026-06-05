# TFM2 Meta Champion Tiers

팀파매.gg 대시보드가 만든 최신 패치 전세계 대회 메타 티어표를 읽어서 게임 안의 팀별 챔피언 티어표(`Team.champion_tiers`)에 반영하는 전용 모드입니다.

AI 밴픽 점수에 가산점을 주는 모드가 아닙니다. 챔피언 티어 데이터만 바꿉니다.

기본 반영 기준:

```text
범위: 최신 패치 전세계 대회 전체
지역: 전체
역할: 전체
솔랭: 제외
```

## 설치

1. 압축 파일 안의 `tfm2_meta_champion_tiers` 폴더를 게임 설치 폴더의 `mods` 폴더에 넣습니다.
2. 폴더 안에 아래 파일들이 있어야 합니다.
   - `mod.mod_info`
   - `tfm2_meta_champion_tiers.dll`
   - `champion_tier_policy.tsv`
   - `config.ini`
   - `README.md`
3. 게임을 실행한 뒤 모드 목록에서 `TFM2 Meta Champion Tiers`를 활성화합니다.

## 정책 파일

기본 파일:

```text
Teamfight Manager2\mods\tfm2_meta_champion_tiers\champion_tier_policy.tsv
```

형식:

```text
champion_id<TAB>tier<TAB>overall
```

`overall` 값이 있으면 모드는 이 값으로 티어를 다시 계산합니다.
그래서 팀파매.gg는 실제 메타 스코어를 그대로 넣지 않고, 인게임 티어 표시용 앵커 점수를 내보냅니다.

```text
S: overall >= 85
A: overall >= 72
B: overall >= 60
C: overall >= 48
D: overall < 48
```

팀파매.gg가 생성하는 기본 앵커:

```text
OP -> S -> 90.0
1티어 -> A -> 75.0
2티어 -> B -> 62.0
3티어 -> C -> 50.0
4티어 -> D -> 35.0
- -> No -> overall 비움
```

즉 대시보드 메타 스코어가 55점대여도, 대시보드에서 1티어로 계산된 챔피언은 정책 파일에 `A / 75.0`으로 기록되어 인게임에서 A 티어로 표시됩니다.

대시보드에서 `-`로 계산된 챔피언은 정책 파일에 `No`로 기록하고 `overall` 칸을 비웁니다. `overall` 값이 없거나 파싱할 수 없으면 모드는 `tier` 컬럼을 그대로 사용합니다.

## 경로 설정

v0.1.3부터는 같은 폴더의 `config.ini`를 먼저 읽습니다. 창작마당 구독 경로처럼 모드 폴더가 `steamapps\workshop\content\3009300\...` 아래에 있어도 DLL 옆의 `config.ini`와 `champion_tier_policy.tsv`를 우선 탐색합니다.

v0.1.4는 Teamfight Manager 2 Mod SDK 0.4.9 기준으로 다시 빌드한 호환성 업데이트입니다.

경로를 직접 지정하려면 `config.ini`에 아래 값 중 하나를 설정하면 됩니다.

```ini
policy_path=C:\Path\To\champion_tier_policy.tsv
policy_dir=C:\Path\To\MetadataExport
policy_file=champion_tier_policy.tsv
```

## 팀파매.gg 연동

`tfm2_meta_dashboard\tools\build_meta_data.py`는 대시보드 메타 갱신 시 이 모드의 `champion_tier_policy.tsv`도 같이 생성합니다. 챔피언 티어 정책은 대시보드의 최신 패치 전세계 대회 메타 티어 기준으로 생성됩니다.

모드는 게임 로드 후 한 번 적용하고, 이후에는 `champion_tier_policy.tsv`의 수정 시간이 바뀐 경우에만 다시 적용합니다. 그래서 메타 점수표를 바꿀 때마다 DLL을 다시 빌드할 필요는 없습니다.

## 확인

적용 후 아래 파일을 확인합니다.

```text
Teamfight Manager2\mods\tfm2_meta_champion_tiers\tier-policy-latest.txt
Teamfight Manager2\mods\tfm2_meta_champion_tiers\debug.log
```

`changed`가 0보다 크면 게임 DB의 챔피언 티어가 정책표에 맞게 갱신된 것입니다.

## TFM2.gg Installer Integration

When installed through `TFM2GGInstaller.exe`, this addon is copied to `Teamfight Manager2\mods\tfm2_meta_champion_tiers`.
The installer rewrites `config.ini` so the addon reads `champion_tier_policy.tsv` from the dashboard's generated `data\policy_exports` folder.
Refresh the dashboard after changing saves or patch filters, then restart the game so the addon reloads the latest policy file.

## Dashboard Rule Preset Sync

TFM2.gg dashboard can regenerate `champion_tier_policy.tsv` for the same rule preset used by the dashboard tier view.

- `classic`: default balanced policy.
- `fearless`: raises draft-pressure weight for fearless play.
- `hardFearless`: raises draft-pressure weight further for hard fearless play.

Use the dashboard toolbar's in-game addon policy selector, then click the apply button. The addon will reload the TSV when the file modification time changes; if the in-game champion info screen is already open, reload the save or restart the game once.
