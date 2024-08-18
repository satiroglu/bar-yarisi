var dom = document.getElementById("container");
var myChart = echarts.init(dom, null, {
  renderer: "canvas",
  useDirtyRect: false,
});
var app = {};
var option;

const updateFrequency = 2000;
const dimension = 0;
const countryColors = {
  Australia: "#84C3BE",
  Canada: "#75151E",
  China: "#78858B",
  Cuba: "#4E3B31",
  Finland: "#A18594",
  France: "#DE4C8A",
  Germany: "#CF3476",
  Iceland: "#9D9101",
  India: "#FF7514",
  Japan: "#3B3C36",
  "North Korea": "#FFFF00",
  "South Korea": "#231A24",
  "New Zealand": "#F4A900",
  Norway: "#CB2821",
  Poland: "#3B83BD",
  Russia: "#721422",
  Turkey: "#A52019",
  "United Kingdom": "#E63244",
  "United States": "#C7B446",
};
$.when(
  $.getJSON("../assets/data/country.json"),
  $.getJSON("../assets/data/mainData.json")
).done(function (res0, res1) {
  const flags = res0[0];
  const data = res1[0];
  const years = [];
  for (let i = 0; i < data.length; ++i) {
    if (years.length === 0 || years[years.length - 1] !== data[i][4]) {
      years.push(data[i][4]);
    }
  }
  function getFlag(countryName) {
    if (!countryName) {
      return "";
    }
    return (
      flags.find(function (item) {
        return item.name === countryName;
      }) || {}
    ).emoji;
  }
  let startIndex = 0;
  let startYear = years[startIndex];
  option = {
    legend: {
      show: true,
      selectorLabel: true,
    },
    grid: {
      top: 100,
      bottom: 30,
      left: 250,
      right: 80,
    },
    xAxis: {
      max: "dataMax",
      axisLabel: {
        formatter: function (n) {
          return "$" + Math.round(n) + "m";
        },
      },
    },
    dataset: {
      source: data.slice(1).filter(function (d) {
        return d[4] === startYear;
      }),
    },
    yAxis: {
      type: "category",
      inverse: true,
      max: 9,
      axisLabel: {
        show: true,
        fontSize: 14,
        //   formatter: function (value) {
        //     return value + "{flag|" + getFlag(value) + "}";
        //   },
        //   rich: {
        //     flag: {
        //       fontSize: 16,
        //       padding: 3,
        //     },
        //   },
      },
      animationDuration: 300,
      animationDurationUpdate: 300,
    },
    series: [
      {
        realtimeSort: true,
        seriesLayoutBy: "column",
        type: "bar",
        itemStyle: {
          color: function (param) {
            return countryColors[param.value[3]] || "#5470c6";
          },
        },
        encode: {
          x: dimension,
          y: 3,
        },
        label: {
          show: true,
          precision: 1,
          position: "right",
          valueAnimation: true,
          fontFamily: "monospace",
        },
      },
    ],
    // Disable init animation.
    animationDuration: 0,
    animationDurationUpdate: updateFrequency,
    animationEasing: "linear",
    animationEasingUpdate: "linear",
    graphic: {
      elements: [
        {
          type: "text",
          right: 160,
          bottom: 60,
          style: {
            text: startYear,
            font: "bolder 80px monospace",
            fill: "rgba(100, 100, 100, 0.25)",
          },
          z: 100,
        },
      ],
    },
  };
  // console.log(option);
  myChart.setOption(option);
  for (let i = startIndex; i < years.length - 1; ++i) {
    (function (i) {
      setTimeout(function () {
        updateYear(years[i + 1]);
      }, (i - startIndex) * updateFrequency);
    })(i);
  }
  function updateYear(year) {
    let source = data.slice(1).filter(function (d) {
      return d[4] === year;
    });
    option.series[0].data = source;
    option.graphic.elements[0].style.text = year;
    myChart.setOption(option);
  }
});

if (option && typeof option === "object") {
  myChart.setOption(option);
}

window.addEventListener("resize", myChart.resize);
