export interface Options {
  dotSize: number
  dotColor: string
  backgroundColor: string
  layout: 'vertical' | 'horizontal'
  highlightWeekend: boolean
  weekendColor: string
}

export const defaultOptions: Options = {
  dotSize: 5,
  dotColor: '#6FF2E9',
  backgroundColor: '#000',
  highlightWeekend: false,
  weekendColor: '#EB4D3E',
  layout: 'vertical',
}
