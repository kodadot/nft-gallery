import { getHSpread } from '@/utils/chart'

function getAnnotation({ type = 'list', value }) {
  const attributes = {
    list: {
      borderColor: '#E6007E',
      content: 'IQR List',
      position: 'start',
    },
    buy: {
      borderColor: '#00BB7F',
      content: 'IQR Buy',
      position: 'end',
    },
  }

  if (!value) {
    return {
      borderWidth: 0,
    }
  }

  return {
    type: 'line',
    borderWidth: 0,
    scaleID: 'y',
    borderColor: attributes[type].borderColor,
    label: {
      content: () => `${attributes[type].content}: ${value.toFixed(2)}`,
      position: attributes[type].position,
      display: true,
    },
    value: () => value,
  }
}

export default function ({ labels, unit, valueList, valueBuy }) {
  const { iqr: iqrList } = getHSpread(valueList)
  const { iqr: iqrBuy } = getHSpread(valueBuy)
  const dataIqrList = getAnnotation({ type: 'list', value: iqrList })
  const dataIqrBuy = getAnnotation({ type: 'buy', value: iqrBuy })
  const annotations = labels.length === 1 ? [] : [dataIqrList, dataIqrBuy]

  return {
    responsive: true,
    scales: {
      y: {
        ticks: {
          color: 'white',
          callback: (value) => {
            return `${value} ${unit}`
          },
        },
      },
    },
    plugins: {
      annotation: { annotations },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: (ctx) => {
            return `${ctx[0].dataset.label} ${ctx[0].label}`
          },
          label: (ctx) => {
            const median = ctx.parsed.median.toFixed(2)
            const q1 = ctx.parsed.q1.toFixed(2)
            const q3 = ctx.parsed.q3.toFixed(2)
            const iqr = (parseFloat(q3) - parseFloat(q1)).toFixed(2)
            const min = ctx.parsed.min.toFixed(2)
            const max = ctx.parsed.max.toFixed(2)

            const boxplotValues = [
              `Median: ${median}`,
              `Q3: ${q3}`,
              `Q1: ${q1}`,
              `IQR: ${iqr}`,
              `Min: ${min}`,
              `Max: ${max}`,
            ]
            return boxplotValues
          },
        },
      },
    },
  }
}
