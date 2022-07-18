import { Options, defaultOptions } from './options'
import { getDaysInMonth, isWeekend } from './util'

export function generate(options: Partial<Options>) {
  const opts = { ...defaultOptions, ...options }
  const { dotColor, backgroundColor, highlightWeekend, weekendColor, layout } =
    opts
  const dotSize = parseInt(opts.dotSize as any, 10)
  const isHorizontal = layout === 'horizontal'
  const padding = dotSize * 3
  const svgWidth = isHorizontal
    ? padding * 2 + 31 * 2 * dotSize + 60
    : padding * 2 + 31 * 2 * dotSize
  const svgHeight = isHorizontal
    ? padding * 2 + 12 * 2 * dotSize
    : 12 * 2 * dotSize + padding + 40

  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = now.getMonth() + 1
  const dd = now.getDate()
  let totalDays = 0
  let elapsedDays = 0

  const dots_bg: string[] = []
  const dots_elapsed: string[] = []
  let animationDelay = 0

  for (let i = 0; i < 12; i++) {
    const monthDays = getDaysInMonth(yyyy, i + 1)
    totalDays += monthDays

    for (let d = 0; d < monthDays; d++) {
      const offset =
        monthDays === 31 ? 0 : monthDays === 30 ? dotSize : dotSize * 3
      const weekend =
        highlightWeekend && isWeekend(new Date(`${yyyy}-${i + 1}-${d + 1}`))
      const fill = weekend ? `fill="${weekendColor}"` : ''
      const cx = (d * 2 + 1) * dotSize + offset
      const cy = (i * 2 + 1) * dotSize
      dots_bg.push(`<circle cx="${cx}" cy="${cy}" ${fill} />`)

      if (i + 1 < mm || (i + 1 === mm && d + 1 <= dd)) {
        elapsedDays += 1
        animationDelay += 20

        const isToday = i + 1 === mm && d + 1 === dd
        const className = isToday ? 'blink' : 'fadeIn'
        const animDelay = isToday ? animationDelay + 100 : animationDelay
        const inlineStyle = `animation-delay: ${animDelay}ms`
        dots_elapsed.push(
          `<circle cx="${cx}" cy="${cy}" ${fill} class="${className}" style="${inlineStyle}" />`,
        )
      }
    }
  }

  const headerYear = yyyy.toString()
  const headerProgress = `${Math.round((100 * elapsedDays) / totalDays)}%`
  const headerRatio = `${elapsedDays}/${totalDays}`

  // prettier-ignore
  const header = isHorizontal
    ? `
  <g transform="translate(${svgWidth - padding}, 0)">
    <text class="text-year" transform="translate(0, ${padding + dotSize})">${headerYear}</text>
    <text class="text-percent" transform="translate(0, ${svgHeight / 2})">${headerProgress}</text>
    <text class="text-progress" transform="translate(0, ${svgHeight - padding - dotSize})">${headerRatio}</text>
  </g>
`
    : `
  <g transform="translate(0, 24)">
    <text class="text-year" transform="translate(${padding}, 0)">${headerYear}</text>
    <text class="text-percent" transform="translate(${svgWidth / 2}, 0)">${headerProgress}</text>
    <text class="text-progress" transform="translate(${svgWidth - padding}, 0)">${headerRatio}</text>
  </g>
`;

  const gtx = padding
  const gty = isHorizontal ? padding : 40
  // prettier-ignore
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <rect width="${svgWidth}" height="${svgHeight}" fill="${backgroundColor}" />
  ${header.trim()}
  <g transform="translate(${gtx}, ${gty})" fill="${dotColor}" stroke-width="0" opacity="0.3" >
    ${dots_bg.join("\n    ")}
	</g>
  <g transform="translate(${gtx}, ${gty})" fill="${dotColor}" stroke-width="0" >
    ${dots_elapsed.join("\n    ")}
	</g>
  <style>
    circle {
      r: ${dotSize / 2};
    }
    text {
      font-family: DIN Condensed, Arial Narrow, Helvetica Neue, Arial, sans-serif;
    }
    text.text-year {
      text-anchor: ${isHorizontal ? "end" : "start"};
      dominant-baseline: ${isHorizontal ? "text-before-edge" : "middle"};
      font-size: ${isHorizontal ? 20 : 18}px;
      fill: #fff;
    }
    text.text-percent {
      text-anchor: ${isHorizontal ? "end" : "middle"};
      dominant-baseline: ${isHorizontal ? "middle" : "middle"};
      font-size: ${isHorizontal ? 40 : 24}px;
      fill: #ff0000;
    }
    text.text-progress {
      text-anchor: ${isHorizontal ? "end" : "end"};
      dominant-baseline: ${isHorizontal ? "text-after-edge" : "middle"};
      font-size: ${isHorizontal ? 20 : 18}px;
      fill: #AAFF55;
    }
    @keyframes blink {
      0% { opacity: 1; }
      50% { opacity: 0; }
      100% { opacity: 1; }
    }
    @keyframes fadeIn {
      0% { opacity: 0; r: ${dotSize / 2}; }
      25% { opacity: 1; r: ${dotSize / 2 + 1}; }
      75% { opacity: 1; r: ${dotSize / 2 + 1}; }
      100% { opacity: 1; r: ${dotSize / 2}; }
    }
    .blink {
      opacity: 0;
      animation: blink 1s linear infinite;
    }
    .fadeIn {
      opacity: 0;
      animation: fadeIn 0.8s linear;
      animation-fill-mode: forwards;
    }
  </style>
</svg>
`;

  return svg.trim()
}
