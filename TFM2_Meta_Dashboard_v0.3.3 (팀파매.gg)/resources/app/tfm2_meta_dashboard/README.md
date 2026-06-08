# TFM2 메타 대시보드

Teamfight Manager 2 세이브 파일과 리플레이 데이터를 읽어서 챔피언 메타, 밴픽률, 승률, 조합, 상대 지표, 리플레이 기록, 선수별 아이템 기록을 보여주는 로컬 대시보드입니다.

이 배포본은 Python 런타임을 함께 넣은 포터블 버전입니다. 사용자가 Python을 따로 설치할 필요가 없습니다.

## 빠른 실행

1. ZIP을 Teamfight Manager 2 설치 폴더에 풉니다.
   예: `C:\Program Files (x86)\Steam\steamapps\common\Teamfight Manager2`
2. 데스크톱 앱 배포본이면 압축을 푼 폴더의 `TFM2MetaDashboard.exe`를 실행합니다.
   구형 포터블 배포본이면 `tfm2_meta_dashboard\TFM2MetaDashboard.exe`를 실행합니다.
3. 앱이 열리면 상단 메뉴에서 `File > Save 선택...`을 누릅니다.
4. 분석할 `save_*.data` 파일을 선택합니다.
5. 첫 갱신이 끝나면 대시보드가 갱신됩니다.

`TFM2MetaDashboard.exe` 창은 닫지 않는 것이 좋습니다. 게임에서 자동 저장이 일어나면 이 창이 세이브 변경을 감지해서 대시보드 데이터를 자동으로 다시 만듭니다.

## 구성

- `TFM2MetaDashboard.exe`: 세이브 선택, 첫 갱신, 자동 갱신 감시, 대시보드 창 표시를 담당하는 실행 파일
- `index.html`: 대시보드 화면
- `app.js`, `styles.css`: 대시보드 UI
- `refresh_meta_dashboard.ps1`: 수동/자동 갱신 스크립트
- `tools/build_meta_data.py`: 세이브와 export 데이터를 대시보드 데이터로 변환
- `tools/tfm2_save_probe.exe`: 세이브 파일에서 DB/리플레이 데이터를 추출하는 보조 도구
- `runtime/python/python.exe`: 내장 Python 런타임
- `data/meta-data.js`: 대시보드 표시 데이터
- `data/core-item-builds.json`: 아이템 위임 모드용 코어템/빌드 방향 데이터
- `mods/tfm2_meta_item_delegate/core-item-builds.json`: 아이템 위임 모드가 직접 읽는 동일 데이터
- `mods/tfm2_meta_item_delegate/data/core-item-builds.json`: 구버전 모드 경로 호환용 동일 데이터

## 자동 갱신

런처는 처음 선택한 세이브 파일을 계속 감시합니다. Teamfight Manager 2에서 진행하기를 눌러 자동 저장이 발생하면 저장이 끝날 때까지 잠깐 기다린 뒤 데이터를 다시 생성합니다.

콘솔에는 이런 식으로 최소 로그만 표시됩니다.

```text
23:55:10 refresh #1 complete; dashboard opened
23:58:42 save changed; waiting for autosave to finish
23:58:45 refresh #2 complete
```

대시보드 우측 상단에도 자동 감시/갱신 상태가 표시됩니다.

## 수동 갱신

자동 감시 없이 한 번만 갱신하려면 `refresh_meta_dashboard.bat`를 실행합니다.

1. 세이브 목록에서 번호를 입력하거나 Enter로 최신 세이브를 선택합니다.
2. 갱신이 끝나면 `index.html`을 브라우저에서 열어 확인합니다.

중요한 규칙:

```text
게임에서 불러온 세이브 = 대시보드에서 선택한 세이브
```

세이브가 다르면 팀명, 선수명, 리플레이 목록이 섞여 보일 수 있습니다.

## 아이템 위임 모드용 데이터

갱신할 때마다 아래 파일이 생성됩니다.

```text
tfm2_meta_dashboard\data\core-item-builds.json
mods\tfm2_meta_item_delegate\core-item-builds.json
mods\tfm2_meta_item_delegate\data\core-item-builds.json
```

세 파일은 같은 내용입니다. 첫 번째는 대시보드 보관용이고, 두 번째는 아이템 위임 모드가 고정 경로로 바로 읽기 위한 파일이며, 세 번째는 구버전 모드 경로 호환용입니다. 실제 코어템 조합과 함께, 전략 화면의 개인 아이템 설정에 넣을 수 있는 빌드 방향 3칸도 포함합니다.

빌드 방향 값:

```text
AD
Magic
AttackSpeed
Defense
MagicResistance
Hp
Auto
```

예시 경로:

```text
builds.tournament["2026.1.0"]["gunner"]["top"].core3[0]
builds.tournament["2026.1.0"]["gunner"]["support"].core3[0]
```

예시 데이터:

```json
{
  "itemIds": [9, 9, 4],
  "itemCategories": ["AttackSpeed", "AttackSpeed", "AD"],
  "directions": ["AttackSpeed", "AttackSpeed", "AD"],
  "games": 105,
  "wins": 56,
  "winRate": 53.3,
  "score": 47.1
}
```

`core2`는 전략 화면의 3칸 형식에 맞춰 마지막 칸을 `Auto`로 채웁니다.

## 데이터 출처

standalone 배포본은 세이브 직접 파싱을 우선 사용합니다. Meta Exporter 진단 파일이 있으면 팀명/선수명/리플레이 이름 매칭 정확도를 보조합니다.

진단 폴더:

```text
%APPDATA%\TeamSamoyed\TeamfightManager2\diagnostics\meta_export
```

주요 보조 파일:

- `teams.debug.txt`
- `athletes.debug.txt`
- `champion_patch_statistics.tsv`
- `match_replay_summary.tsv`
- `match_replay_players.tsv`
- `match_replays.debug.txt`
- `solo_rank_matches.debug.txt`

## 오류 해결

갱신이 실패하면 먼저 아래 로그를 확인합니다.

```text
tfm2_meta_dashboard\_last_refresh_log.txt
```

자주 나는 원인:

- ZIP을 게임 설치 폴더가 아닌 다른 위치에 풀었음
- 선택한 세이브와 게임에서 실제로 불러온 세이브가 다름
- OneDrive/클라우드 placeholder 파일을 선택함
- Windows 보안/백신/권한 문제로 `%APPDATA%` 또는 대시보드 폴더 쓰기가 막힘
- `runtime/python` 폴더를 삭제해서 내장 Python을 찾지 못함
- 게임 업데이트로 `save_probe`와 SDK 버전이 맞지 않음

0.4.11 대응판은 0.4.11 SDK 기반 `tools/tfm2_save_probe.exe`가 최신 세이브를 정상 디코드하는지 검증했습니다. 선택한 최신 세이브 디코드가 실패하면 기본적으로 갱신을 실패 처리해서 다른 세이브로 조용히 바뀌지 않게 했습니다. 구버전처럼 최근 정상 세이브 fallback을 강제로 쓰려면 `TFM2_ALLOW_SAVE_PROBE_FALLBACK=1` 환경변수를 켠 뒤 실행하세요.

이전 데이터가 보이면 브라우저에서 `Ctrl + F5`로 강력 새로고침하세요. 우측 상단 생성 시간이 방금 갱신한 시간인지 확인하면 됩니다.

## 주의

이 도구는 비공식 로컬 분석 도구입니다. 원본 게임 파일과 세이브 파일을 수정하지 않습니다. 게임 업데이트로 세이브 구조나 SDK 구조가 바뀌면 다시 수정이 필요할 수 있습니다.
