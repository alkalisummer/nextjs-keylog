import React from 'react';

interface wDataArr {
  name: string;
  value: number;
  articles: [];
}

const WordCloudOpt = (dataArr: wDataArr[]) => {
  const chartOpt = {
    series: [
      {
        type: 'wordCloud',
        shape: 'pentagon',
        left: 0,
        top: 0,
        width: '95%',
        height: '95%',
        right: null,
        bottom: null,
        sizeRange: [20, 90],
        rotationRange: [-90, 90],
        rotationStep: 45,
        gridSize: 14,
        drawOutOfBound: false,
        shrinkToFit: true,
        layoutAnimation: true,
        textStyle: {
          fontFamily: 'Spoqa Han Sans Neo',
          fontWeight: 'bold',
          // Color can be a callback function or a color string
          color: function () {
            // Random color
            return 'rgb(' + [Math.round(Math.random() * 160), Math.round(Math.random() * 160), Math.round(Math.random() * 160)].join(',') + ')';
          },
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            textShadowBlur: 0,
            textShadowColor: '#fffff',
          },
        },
        data: dataArr,
      },
    ],
  };

  return chartOpt;
};

interface lineChartData {
  dateArr: string[];
  valueArr: {}[];
  legendArr: string[];
}

export const LineChartOpt = (params: lineChartData) => {
  const chartOpt = {
    tooltip: {
      trigger: 'axis',
    },
    title: {
      text: '관심도 변화',
    },
    legend: {
      data: params.legendArr,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: params.dateArr,
    },
    yAxis: {
      type: 'value',
    },
    series: params.valueArr,
  };
  return chartOpt;
};

export default WordCloudOpt;
