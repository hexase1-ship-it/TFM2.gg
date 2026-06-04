# TFM2 AI Banpick Policy

팀파매.gg 대시보드에서 정리한 챔피언 메타 점수를 Teamfight Manager 2의 네이티브 AI 밴픽 점수에 더해 주는 모드입니다.

## 설치

1. 압축 파일 안의 `tfm2_ai_banpick_probe` 폴더를 게임 설치 폴더의 `mods` 폴더에 넣습니다.
   - 예: `Teamfight Manager2\mods\tfm2_ai_banpick_probe`
2. 폴더 안에 아래 파일들이 있어야 합니다.
   - `mod.mod_info`
   - `tfm2_ai_banpick_probe.dll`
   - `ai_champion_policy.tsv`
   - `config.ini`
   - `ai_banpick_config.ini`
   - `README.md`
3. 게임을 실행한 뒤 모드 목록에서 `TFM2 AI Banpick Policy`를 활성화합니다.
4. 정책 파일을 바꿨다면 게임을 완전히 껐다가 다시 켭니다.

## 팀파매.gg 변경 여부

현재 버전에서는 팀파매.gg 앱을 수정할 필요가 없습니다.

모드는 팀파매.gg를 직접 호출하지 않고, 모드 폴더의 `ai_champion_policy.tsv`만 읽습니다. 팀파매.gg에서 새 메타 점수를 계산했다면 같은 형식으로 이 파일만 교체하면 됩니다.

자동 내보내기 버튼이나 실시간 동기화를 만들고 싶을 때만 팀파매.gg 쪽 변경이 필요합니다.

## 정책 파일 형식

파일 경로:

```text
Teamfight Manager2\mods\tfm2_ai_banpick_probe\ai_champion_policy.tsv
```

형식:

```text
champion_id<TAB>tier<TAB>overall
```

예시:

```text
vampire	S	77.2
monk	S	74.1
circus_blade	A	68.2
ogre	D	33.7
```

- `champion_id`: 게임 내부 챔피언 ID입니다.
- `tier`: `S`, `A`, `B`, `C`, `D` 중 하나입니다.
- `overall`: 팀파매.gg 메타 점수입니다. 숫자가 높을수록 AI가 밴/픽에서 더 높게 평가합니다.

## 적용 방식

AI가 챔피언 후보를 평가할 때 다음 보정을 더합니다.

```text
최종 점수 = 게임 기본 AI 점수 + clamp((overall - 50) / 20, -1.5, +1.5)
```

예를 들어 `overall=70`이면 기본 점수에 `+1.0`, `overall=30`이면 `-1.0`이 더해집니다. `overall=80` 이상처럼 높은 값도 최대 `+1.5`까지만 더해집니다.

이 방식은 기존 AI의 포지션, 조합, 밴픽 문맥 판단을 완전히 덮어쓰지 않고 메타 점수만 밀어주는 방식입니다.

v0.2.8 배포판에서는 실험용 클라이언트/서버 probe 런타임을 비활성화했습니다. 따라서 1초 주기 DB/UI dump, 이벤트 파일 생성, 상대 팀 티어/preference 반복 주입은 실행되지 않고, 네이티브 AI 밴픽 점수 훅만 동작합니다.

v0.2.7부터는 Steam Workshop 업로더의 Cargo 빌드와 맞추기 위해 `game_core`를 직접 import하지 않습니다. 정책 티어는 모드 내부 타입으로 계산하고, AI 점수 훅은 `mod_api`가 제공하는 draft hook만 사용합니다.

## 보정값 조정

`ai_banpick_config.ini`에서 보정 강도를 바꿀 수 있습니다.

```ini
enabled=true
overall_neutral=50
overall_divisor=20
min_bias=-1.5
max_bias=1.5
```

v0.2.8부터는 같은 폴더의 `config.ini`를 먼저 읽고, 없으면 `ai_banpick_config.ini`를 읽습니다. 창작마당 구독 경로처럼 모드 폴더가 `steamapps\workshop\content\3009300\...` 아래에 있어도 DLL 옆의 `config.ini`와 `ai_champion_policy.tsv`를 우선 탐색합니다.

v0.2.9는 Teamfight Manager 2 Mod SDK 0.4.9 기준으로 다시 빌드한 호환성 업데이트입니다.

경로를 직접 지정하려면 `config.ini`에 아래 값 중 하나를 설정하면 됩니다.

```ini
policy_path=C:\Path\To\ai_champion_policy.tsv
policy_dir=C:\Path\To\MetadataExport
policy_file=ai_champion_policy.tsv
```

- `overall_divisor`: 낮을수록 메타 점수 영향이 강해집니다.
- `min_bias`, `max_bias`: 메타 보정의 최소/최대 한계입니다.
- 파일을 바꾼 뒤에는 게임을 완전히 껐다가 다시 켭니다.

## 적용 확인

밴픽을 한 번 진행한 뒤 아래 파일을 확인합니다.

```text
Teamfight Manager2\mods\tfm2_ai_banpick_probe\debug.log
```

아래 같은 줄이 있으면 네이티브 AI 밴픽 점수 훅이 호출된 것입니다.

```text
draft_score_hook pick: candidate=...
draft_score_hook ban: candidate=...
```

`replacement` 값이 `base` 값보다 메타 점수만큼 바뀌어 있으면 정책이 적용된 상태입니다.

## 주의사항

- 사람이 직접 고르는 챔피언 선택을 강제로 바꾸는 모드가 아닙니다.
- AI가 밴픽 후보를 점수화할 때 영향을 주는 모드입니다.
- 실험용 probe 코드는 삭제하지 않고 비활성화만 해 두었습니다.
- 정책 파일은 게임 실행 중 한 번만 읽히므로, 파일을 바꾼 뒤에는 게임을 재시작하는 것이 안전합니다.
- 현재 버전의 기본 정책표는 2026년 6월 3일 테스트 당시 팀파매.gg 대시보드 점수 기준입니다.
