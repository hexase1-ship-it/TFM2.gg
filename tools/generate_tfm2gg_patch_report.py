from __future__ import annotations

import html
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
DASHBOARD = ROOT / "TFM2_Meta_Dashboard_v0.3.3 (팀파매.gg)" / "resources" / "app" / "tfm2_meta_dashboard" / "index.html"
ASSET_DIR = ROOT / "report_assets" / "tfm2gg_patch_20260602"
DIST_DIR = ROOT / "dist"


FONT = Path("C:/Windows/Fonts/malgun.ttf")
FONT_BOLD = Path("C:/Windows/Fonts/malgunbd.ttf")


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = FONT_BOLD if bold and FONT_BOLD.exists() else FONT
    return ImageFont.truetype(str(path), size=size)


def crop_box(box: dict, pad: int = 0) -> tuple[int, int, int, int]:
    return (
        int(box["x"]) - pad,
        int(box["y"]) - pad,
        int(box["x"] + box["width"]) + pad,
        int(box["y"] + box["height"]) + pad,
    )


def clamp_box(box: tuple[int, int, int, int], width: int, height: int) -> tuple[int, int, int, int]:
    left, top, right, bottom = box
    return max(0, left), max(0, top), min(width, right), min(height, bottom)


def annotate(
    image_path: Path,
    output_path: Path,
    marks: list[dict],
    crop: tuple[int, int, int, int] | None = None,
    max_width: int = 940,
) -> None:
    image = Image.open(image_path).convert("RGB")
    offset_x = offset_y = 0
    if crop:
        crop = clamp_box(crop, image.width, image.height)
        offset_x, offset_y = crop[0], crop[1]
        image = image.crop(crop)

    draw = ImageDraw.Draw(image)
    label_font = font(16, True)
    text_font = font(14)

    for mark in marks:
        x1, y1, x2, y2 = mark["box"]
        x1 -= offset_x
        x2 -= offset_x
        y1 -= offset_y
        y2 -= offset_y
        color = mark.get("color", "#2563eb")
        label = mark["label"]
        draw.rounded_rectangle((x1, y1, x2, y2), radius=7, outline=color, width=4)
        text = label
        bbox = draw.textbbox((0, 0), text, font=label_font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        lx = max(8, min(x1, image.width - tw - 18))
        ly = max(8, y1 - th - 18)
        draw.rounded_rectangle((lx, ly, lx + tw + 14, ly + th + 10), radius=6, fill="#ffffff", outline=color, width=2)
        draw.text((lx + 7, ly + 4), text, fill="#111827", font=label_font)
        if "note" in mark:
            note = mark["note"]
            nb = draw.textbbox((0, 0), note, font=text_font)
            nw = nb[2] - nb[0]
            nh = nb[3] - nb[1]
            ny = min(image.height - nh - 16, y2 + 8)
            draw.rounded_rectangle((lx, ny, lx + nw + 14, ny + nh + 10), radius=6, fill="#f8fafc", outline="#cbd5e1", width=1)
            draw.text((lx + 7, ny + 4), note, fill="#334155", font=text_font)

    if image.width > max_width:
        ratio = max_width / image.width
        image = image.resize((max_width, int(image.height * ratio)), Image.Resampling.LANCZOS)
    image.save(output_path, optimize=True, quality=92)


def image_data_uri(path: Path) -> str:
    rel = Path("..") / "report_assets" / "tfm2gg_patch_20260602" / path.name
    return rel.as_posix()


def p(text: str) -> str:
    return html.escape(text, quote=False)


def card(label: str, title: str, body: str, img: Path | None = None, caption: str | None = None, accent: str = "#2563eb") -> str:
    image_html = ""
    if img:
        image_html = f"""
      <div style="margin-top:14px;text-align:center;">
        <img src="{image_data_uri(img)}" alt="{p(caption or title)}" style="max-width:100%;height:auto;border:1px solid #cbd5e1;display:inline-block;vertical-align:middle;">
        <div style="margin-top:8px;color:#64748b;font-size:12px;line-height:1.6;">{p(caption or "")}</div>
      </div>"""
    return f"""
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-collapse:collapse;background-color:#ffffff;border:1px solid #e5e7eb;">
  <tr>
    <td style="padding:20px;color:#222;font-family:Arial,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:15px;line-height:1.75;">
      <div style="font-size:11px;color:{accent};font-weight:bold;letter-spacing:1px;margin-bottom:5px;">{p(label)}</div>
      <div style="font-size:19px;font-weight:bold;color:#111827;margin-bottom:10px;">{p(title)}</div>
      {body}
      {image_html}
    </td>
  </tr>
</table>
"""


def main() -> None:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    DIST_DIR.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 920}, device_scale_factor=1)
        page.add_init_script(
            """
            localStorage.setItem('tfm2:tierPreset', 'fearless');
            localStorage.setItem('tfm2:sampleMode', 'auto');
            """
        )
        page.goto(DASHBOARD.resolve().as_uri())
        page.wait_for_selector("#championRows tr", timeout=15000)
        page.select_option("#sortSelect", "metaScore")
        page.wait_for_timeout(300)
        list_shot = ASSET_DIR / "raw_01_dashboard.png"
        page.screenshot(path=str(list_shot), full_page=False)

        boxes = {
            "tier": page.locator("#tierPresetSelect").bounding_box(),
            "sample": page.locator("#sampleModeSelect").bounding_box(),
            "date": page.get_by_text("날짜 추정").first.bounding_box(),
            "scoreHead": page.locator("thead th").nth(3).bounding_box(),
            "scoreCell": page.locator(".score-cell").first.bounding_box(),
        }
        annotate(
            list_shot,
            ASSET_DIR / "01_meta_controls.png",
            [
                {"box": crop_box(boxes["tier"], 5), "label": "진행 방식별 티어 기준", "color": "#2563eb"},
                {"box": crop_box(boxes["sample"], 5), "label": "자동 표본 기준", "color": "#0f9f6e"},
                {"box": crop_box(boxes["date"], 8), "label": "날짜 추정 상태", "color": "#b45309"},
                {"box": crop_box(boxes["scoreHead"], 8), "label": "종합점수 컬럼", "color": "#7c3aed"},
                {"box": crop_box(boxes["scoreCell"], 8), "label": "점수 산식 결과", "color": "#ef4444"},
            ],
            crop=(210, 70, 1260, 690),
        )

        table_box = page.locator(".table-wrap").bounding_box()
        annotate(
            list_shot,
            ASSET_DIR / "02_score_table.png",
            [
                {"box": crop_box(boxes["scoreHead"], 8), "label": "새 정렬/비교 기준", "color": "#7c3aed"},
                {"box": crop_box(page.locator(".tier").nth(0).bounding_box(), 7), "label": "티어별 색상", "color": "#ef4444"},
                {"box": crop_box(page.locator(".score-cell").nth(0).bounding_box(), 7), "label": "승률+픽률+밴률", "color": "#2563eb"},
            ],
            crop=(int(table_box["x"]) - 12, int(table_box["y"]) - 16, 1260, min(900, int(table_box["y"] + 430))),
        )

        page.locator("#championRows tr").first.click()
        page.wait_for_timeout(200)
        page.get_by_role("button", name="챔피언 정보").click()
        page.wait_for_selector("#championView:not([hidden])", timeout=10000)
        page.wait_for_timeout(300)
        detail_shot = ASSET_DIR / "raw_03_detail.png"
        page.screenshot(path=str(detail_shot), full_page=False)
        detail_box = page.locator("#championView").bounding_box()
        score_metric = page.locator("#championView .metric").filter(has_text="종합점수").first.bounding_box()
        annotate(
            detail_shot,
            ASSET_DIR / "03_champion_detail.png",
            [
                {"box": crop_box(score_metric, 12), "label": "상세 화면도 같은 점수 사용", "color": "#7c3aed"},
            ],
            crop=(210, max(0, int(detail_box["y"]) - 20), 1260, min(900, int(detail_box["y"] + 470))),
        )

        page.get_by_role("button", name="리플레이 기록").click()
        page.wait_for_selector("#matchView:not([hidden])", timeout=10000)
        page.wait_for_timeout(300)
        match_shot = ASSET_DIR / "raw_04_matches.png"
        page.screenshot(path=str(match_shot), full_page=False)
        match_box = page.locator("#matchView").bounding_box()
        date_chip = page.get_by_text("2026-").first.bounding_box()
        annotate(
            match_shot,
            ASSET_DIR / "04_replay_dates.png",
            [
                {"box": crop_box(date_chip, 10), "label": "date not exported → 일정 기반 날짜", "color": "#b45309"},
            ],
            crop=(210, max(0, int(match_box["y"]) - 20), 1260, min(900, int(match_box["y"] + 520))),
        )
        browser.close()

    html_out = build_report()
    (DIST_DIR / "TFM2.gg_patch_report.html").write_text(html_out, encoding="utf-8")


def build_report() -> str:
    images = {
        "controls": ASSET_DIR / "01_meta_controls.png",
        "table": ASSET_DIR / "02_score_table.png",
        "detail": ASSET_DIR / "03_champion_detail.png",
        "dates": ASSET_DIR / "04_replay_dates.png",
    }

    summary = """
      <b>요약:</b><br>
      이번 업데이트는 단순 UI 색상 변경이 아니라, TFM2.gg의 메타 판단 기준을 새로 잡은 패치입니다.<br>
      기존의 승률 중심 티어 계산을 <b>승률 + 픽률 + 밴률 + 표본 보정</b> 구조로 바꾸고, 대회 리플레이의 <b>date not exported</b> 문제도 일정 기반 날짜 추정으로 보강했습니다.<br>
      현재 생성 데이터 기준으로 대회 리플레이 <b>414건 전부 날짜 추정 성공</b>, unknown은 <b>0건</b>입니다.
    """

    body = f"""
<div style="font-family:Arial,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:15px;line-height:1.75;color:#222;width:100%;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f3f6fb" style="border-collapse:collapse;background-color:#f3f6fb;border:1px solid #d8dee9;">
  <tr>
    <td style="padding:22px;color:#111827;font-family:Arial,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;">
      <div style="font-size:11px;letter-spacing:1px;color:#2563eb;font-weight:bold;margin-bottom:6px;">TEAMFIGHT MANAGER 2 · TFM2.gg · PATCH REPORT</div>
      <div style="font-size:25px;line-height:1.35;font-weight:bold;color:#0f172a;">TFM2.gg 메타 계산 개선 업데이트</div>
      <div style="font-size:14px;line-height:1.6;color:#4b5563;margin-top:10px;">0.4.7 대응 대시보드의 티어 산정, 표본 기준, 리플레이 날짜 추정 기능을 정리한 변경/개선점 보고서입니다.</div>
    </td>
  </tr>
</table>

<br>

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f7f7f7" style="border-collapse:collapse;background-color:#f7f7f7;border:1px solid #d4d4d4;">
  <tr>
    <td style="padding:16px;color:#171717;font-family:Arial,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:15px;line-height:1.75;">
      {summary}
    </td>
  </tr>
</table>

<br>

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fff8ed" style="border-collapse:collapse;background-color:#fff8ed;border:1px solid #ead7b7;">
  <tr>
    <td style="padding:18px;color:#1f2937;font-family:Arial,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:15px;line-height:1.75;">
      <div style="font-size:11px;color:#b45309;font-weight:bold;letter-spacing:1px;margin-bottom:5px;">DOWNLOAD</div>
      <div style="font-size:19px;font-weight:bold;color:#111827;margin-bottom:10px;">GitHub에서 바로 다운로드</div>
      <p style="margin:0;">
        최신 배포 ZIP은 아래 링크에서 바로 받을 수 있습니다.<br>
        <a href="https://github.com/hexase1-ship-it/TFM2.gg/releases/download/latest/TFM2.gg_Distribution.zip" target="_blank" style="color:#2563eb;font-weight:bold;text-decoration:underline;">TFM2.gg_Distribution.zip 바로 다운로드</a>
      </p>
      <p style="margin:10px 0 0 0;color:#4b5563;font-size:13px;">
        릴리스 페이지에서 변경 이력과 배포 파일을 같이 확인하려면
        <a href="https://github.com/hexase1-ship-it/TFM2.gg/releases/tag/latest" target="_blank" style="color:#2563eb;font-weight:bold;text-decoration:underline;">GitHub Releases 페이지</a>를 열면 됩니다.
      </p>
    </td>
  </tr>
</table>

<br>

{card("01 · UI OVERVIEW", "대시보드에서 바로 보이는 새 옵션", """
      <p style="margin:0;">상단 필터 영역에 <b>티어 기준</b>과 <b>표본 기준</b>이 추가됐습니다. 진행 방식에 따라 클래식/피어리스/하드 피어리스 기준을 바꿀 수 있고, 표본은 자동/초반 5픽/일반 10픽 중 선택할 수 있습니다.</p>
      <p style="margin:10px 0 0 0;">자동 표본은 패치 후 경과일과 현재 데이터량을 보고 초반 데이터인지 일반 데이터인지 판단합니다. 현재 스냅샷에서는 패치 후 4일로 계산되어 <b>자동: 일반 10픽</b>으로 잡힙니다.</p>
""", images["controls"], "▲ 새 티어 기준, 자동 표본 기준, 날짜 추정 상태, 종합점수 컬럼을 한 화면에서 확인할 수 있습니다.")}

<br>

{card("02 · META SCORE", "승률 단독 줄세우기에서 종합점수 방식으로 변경", """
      <p style="margin:0;">기존 방식은 표본 5개 이상이면 승률 중심으로 OP/1/2/3/4티어를 나누는 구조였습니다. 이번 패치에서는 <b>보정 승률, 픽률, 밴률</b>을 함께 반영하는 종합점수를 사용합니다.</p>
      <p style="margin:10px 0 0 0;">점수는 0~100 스케일로 유지되며, 티어는 점수와 전체 순위를 함께 봅니다. 그래서 특정 챔피언이 밴률만 높거나 소표본 승률만 높을 때 과하게 튀는 현상을 줄였습니다.</p>
""", images["table"], "▲ 테이블에 종합점수 컬럼이 추가됐고, 티어 색상도 OP/1/2/3티어별로 구분됩니다.")}

<br>

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fff8ed" style="border-collapse:collapse;background-color:#fff8ed;border:1px solid #ead7b7;">
  <tr>
    <td style="padding:18px;color:#1f2937;font-family:Arial,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:15px;line-height:1.75;">
      <div style="font-size:11px;color:#b45309;font-weight:bold;letter-spacing:1px;margin-bottom:5px;">03 · SCORING RULE</div>
      <div style="font-size:19px;font-weight:bold;color:#111827;margin-bottom:10px;">새 티어 산식의 핵심</div>
      <p style="margin:0;"><b>종합점수 = 보정 승률 × 승률 가중치 + 픽률 × 픽률 가중치 + 밴률 × 밴률 가중치</b></p>
      <p style="margin:10px 0 0 0;">실제 계산에서는 가중치 총합으로 나눠 0~100 스케일을 유지합니다. 표본이 적은 승률은 50% 쪽으로 당겨 보정하고, 실제 승률이 45% 아래로 내려가면 낮은 승률 패널티를 적용합니다.</p>
      <p style="margin:10px 0 0 0;">프리셋은 <b>클래식</b>, <b>피어리스</b>, <b>하드 피어리스</b> 3종입니다. 하드 피어리스는 강한 픽이 자주 밴으로 묶이는 환경을 반영하기 위해 밴률 가중치를 가장 높게 둔 기준입니다.</p>
    </td>
  </tr>
</table>

<br>

{card("04 · CHAMPION DETAIL", "챔피언 상세 화면도 같은 기준으로 동기화", """
      <p style="margin:0;">목록에서 보이는 계산 티어와 종합점수는 챔피언 상세 화면에서도 같은 기준으로 표시됩니다. 범위, 패치, 역할, 프리셋, 표본 기준을 바꾸면 상세 화면의 점수도 같이 바뀝니다.</p>
      <p style="margin:10px 0 0 0;">즉 데이터 생성기에 고정 티어를 박아두는 방식이 아니라, 앱이 현재 사용자의 기준에 맞춰 다시 계산하는 구조로 바뀌었습니다.</p>
""", images["detail"], "▲ 상세 화면의 종합점수도 현재 프리셋/표본 기준과 동일하게 계산됩니다.")}

<br>

{card("05 · REPLAY DATE", "리플레이 날짜 미수집 문제 보강", """
      <p style="margin:0;">대회 리플레이는 원본 구조상 날짜가 직접 들어 있지 않아 기존에는 <b>date not exported</b>로 처리됐습니다. 이번 패치에서는 match_stats, teams, league_competitions, year_schedules를 조합해서 리그 일정 기반으로 날짜를 추정합니다.</p>
      <p style="margin:10px 0 0 0;">현재 데이터 기준 대회 리플레이 <b>414건</b> 중 <b>414건</b>이 날짜 추정에 성공했고, unknown은 <b>0건</b>입니다. 이 날짜는 리플레이 기록 필터와 패치 후 표본 판단에 사용됩니다.</p>
""", images["dates"], "▲ 리플레이 기록에서 날짜가 잡히며, 날짜 출처는 일정 기반 추정으로 관리됩니다.")}

<br>

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-collapse:collapse;background-color:#ffffff;border:1px solid #e5e7eb;">
  <tr>
    <td style="padding:20px;color:#222;font-family:Arial,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:15px;line-height:1.75;">
      <div style="font-size:11px;color:#2563eb;font-weight:bold;letter-spacing:1px;margin-bottom:5px;">06 · DATA SNAPSHOT</div>
      <div style="font-size:19px;font-weight:bold;color:#111827;margin-bottom:10px;">현재 생성 데이터 기준</div>
      <p style="margin:0;">
        · 챔피언 수: <b>60</b><br>
        · 솔랭 기록: <b>487건</b><br>
        · 대회 리플레이: <b>414건</b><br>
        · 매치 스탯: <b>414건</b><br>
        · 리그 경기 시리즈: <b>167개</b><br>
        · 날짜 추정 성공: <b>414건</b><br>
        · 날짜 unknown: <b>0건</b><br>
        · 최신 추정 경기일: <b>2026-02-15</b><br>
        · 최신 패치일: <b>2026-02-11</b><br>
        · 패치 후 경과일: <b>4일</b>
      </p>
    </td>
  </tr>
</table>

<br>

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f9fafb" style="border-collapse:collapse;background-color:#f9fafb;border:1px solid #e5e7eb;">
  <tr>
    <td style="padding:14px;color:#4b5563;font-family:Arial,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;font-size:12px;line-height:1.7;">
      <b>검증:</b><br>
      · Python 데이터 생성기 문법 검사 통과<br>
      · app.js Node 문법 검사 통과<br>
      · meta-data.js 로드 및 파싱 확인<br>
      · Computer Use 접근성 확인: 종합점수, 날짜 추정, 자동: 일반 10픽, 점수 설명 표시 확인<br>
      · 커밋: ade8f33 Add schedule-inferred replay dates and meta scoring
    </td>
  </tr>
</table>

<br>

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fff8ed" style="border-collapse:collapse;background-color:#fff8ed;border:1px solid #ead7b7;">
  <tr>
    <td style="padding:20px;color:#1f2937;font-family:Arial,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;text-align:center;">
      <div style="font-size:20px;line-height:1.6;font-weight:bold;">
        이번 패치의 핵심은<br>
        “승률만 보는 티어표”에서 “게임 규칙과 밴픽 흐름을 같이 보는 메타표”로 바뀐 점입니다.
      </div>
    </td>
  </tr>
</table>

</div>
"""
    return body


if __name__ == "__main__":
    main()
