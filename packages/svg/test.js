const fs = require('fs')

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

function isWeekend(date) {
  return date.getDay() === 6 || date.getDay() === 0
}

const dotSize = 5
const dotColor = '#6FF2E9'
const weekendColor = '#EB4D3E'
const highlightWeekend = false
const layout = 'vertical' // 'vertical' | 'horizontal'
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

const dots_bg = []
const dots_elapsed = []
let animationDelay = 0
for (let i = 0; i < 12; i++) {
  const monthDays = getDaysInMonth(yyyy, i + 1)
  totalDays += monthDays

  for (let d = 0; d < monthDays; d++) {
    const offset =
      monthDays === 31 ? 0 : monthDays === 30 ? dotSize : dotSize * 3
    const weekend =
      highlightWeekend && isWeekend(new Date(`${yyyy}-${i + 1}-${d + 1}`))
    const dot = `<circle cx="${(d * 2 + 1) * dotSize + offset}" cy="${
      (i * 2 + 1) * dotSize
    }"${weekend ? `fill="${weekendColor}"` : ''} />`

    dots_bg.push(dot)

    if (i + 1 < mm || (i + 1 === mm && d + 1 <= dd)) {
      animationDelay += 20
      elapsedDays += 1
      const idx = dot.indexOf('/>') - 1
      if (i + 1 === mm && d + 1 === dd) {
        dots_elapsed.push(
          `${dot.substring(0, idx)} class="blink" style="animation-delay: ${
            animationDelay + 100
          }ms" />`,
        )
      } else {
        dots_elapsed.push(
          `${dot.substring(
            0,
            idx,
          )} class="fadeIn" style="animation-delay: ${animationDelay}ms" />`,
        )
      }
    }
  }
}

const header = isHorizontal
  ? `
  <g transform="translate(${svgWidth - padding}, 0)">
    <text class="text-year" transform="translate(0, ${
      padding + dotSize
    })">${yyyy}</text>
    <text class="text-percent" transform="translate(0, ${
      svgHeight / 2
    })">${Math.round((100 * elapsedDays) / totalDays)}%</text>
    <text class="text-progress" transform="translate(0, ${
      svgHeight - padding - dotSize
    })">${elapsedDays}/${totalDays}</text>
  </g>
`
  : `
  <g transform="translate(0, 24)">
    <text class="text-year" transform="translate(${padding}, 0)">${yyyy}</text>
    <text class="text-percent" transform="translate(${
      svgWidth / 2
    }, 0)">${Math.round((100 * elapsedDays) / totalDays)}%</text>
    <text class="text-progress" transform="translate(${
      svgWidth - padding
    }, 0)">${elapsedDays}/${totalDays}</text>
  </g>
`

let svg = `
<svg transform="translate(40,40)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <rect width="${svgWidth}" height="${svgHeight}" fill="#000" />
  ${header.trim()}
  <g transform="translate(${padding}, ${
  isHorizontal ? padding : 40
})" fill="${dotColor}" stroke-width="0" opacity="0.3" >
    ${dots_bg.join('\n    ')}
	</g>
  <g transform="translate(${padding}, ${
  isHorizontal ? padding : 40
})" fill="${dotColor}" stroke-width="0" >
    ${dots_elapsed.join('\n    ')}
	</g>
  <style>
    circle {
      r: ${dotSize / 2};
    }
    text {
      font-family: DIN Condensed, Arial Narrow, Helvetica Neue, Arial, sans-serif;
    }
    text.text-year {
      text-anchor: ${isHorizontal ? 'end' : 'start'};
      dominant-baseline: ${isHorizontal ? 'text-before-edge' : 'middle'};
      font-size: ${isHorizontal ? 20 : 18}px;
      fill: #fff;
    }
    text.text-percent {
      text-anchor: ${isHorizontal ? 'end' : 'middle'};
      dominant-baseline: ${isHorizontal ? 'middle' : 'middle'};
      font-size: ${isHorizontal ? 40 : 24}px;
      fill: #ff0000;
    }
    text.text-progress {
      text-anchor: ${isHorizontal ? 'end' : 'end'};
      dominant-baseline: ${isHorizontal ? 'text-after-edge' : 'middle'};
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
`

fs.writeFileSync('./dots.svg', svg)
