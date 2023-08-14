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
}

export const LineChartOpt = (params: lineChartData) => {
  const chartOpt = {
    tooltip: {
      trigger: 'axis',
      position: function (pt: any) {
        return [pt[0], '10%'];
      },
    },
    title: {
      left: 'center',
      text: 'Large Area Chart',
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        restore: {},
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: params.dateArr,
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 10,
      },
      {
        start: 0,
        end: 10,
      },
    ],
    series: params.valueArr,
  };
  return chartOpt;
};

export default WordCloudOpt;
