import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const GaugeChart = (props) => {
  const chartRef = useRef();
  const [chartInstance, setChartInstance] = useState()

  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }

    const { id, label, needle, min, max, metric } = props;

    // Logic untuk membuat gauge chart (serupa dengan kode yang Anda bagikan)
    let middleColor = "";
    let range = max - min;
    let halfRange = range / 2;
    let needleValue = 0;
    let symbol = "";

    if (needle < (min - halfRange)) {
      needleValue = min - halfRange;
      symbol = "<";
    } else if (needle > (max + halfRange)) {
      needleValue = max + halfRange;
      symbol = ">";
    } else {
      needleValue = needle;
    }

    if (needleValue < min || needleValue > max) {
      middleColor = "#F82B2B"; // merah
    } else {
      middleColor = "#60A5FA"; // biru
    }

    const data = {
      labels: [`${min - range}`, `${min}`, `${max}`, `${max + range}`],
      datasets: [{
        label: label,
        data: [halfRange, range, halfRange, 0],
        backgroundColor: [
          '#D1D4DD',
          '#41A0CF',
          '#D1D4DD',
        ],
        borderColor: [],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        cutout: '80%',
        needleValue: needleValue, // dynamic
      }]
    };

    const gaugeNeedle = {
      id: 'gaugeNeedle',
      afterDatasetsDraw(chart, args, plugins) {
        const { ctx, data } = chart;
        ctx.save();

        const xCenter = chart.getDatasetMeta(0).data[0].x;
        const yCenter = chart.getDatasetMeta(0).data[0].y;

        const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
        const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;

        const middleRadius = (outerRadius - innerRadius) / 2;
        const radius = 6;
        const angle = Math.PI / 180;

        const needleValue = data.datasets[0].needleValue;

        const circumference = ((chart.getDatasetMeta(0).data[0].circumference / Math.PI) / data.datasets[0].data[0]) * (needleValue - (min - halfRange));

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, outerRadius);
        gradient.addColorStop(0, "#FFFFFF");
        gradient.addColorStop(1, middleColor);

        ctx.translate(xCenter, yCenter);

        ctx.beginPath();
        ctx.arc(0, 0, innerRadius, 0, angle * 180, true);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();

        ctx.rotate(Math.PI * (circumference + 1.5));

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.lineWidth = 1;

        ctx.moveTo(0 - radius, 0);
        ctx.lineTo(0, 0 - innerRadius - middleRadius);
        ctx.lineTo(0 + radius, 0);
        ctx.closePath();

        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, angle * 360, false);
        ctx.fill();
        ctx.closePath();

        ctx.restore();
      }
    };

    const gaugeFlowMeter = {
      id: 'gaugeFlowMeter',
      afterDatasetsDraw(chart, args, plugins) {
        const { ctx, data } = chart;
        ctx.save();

        const needleValue = data.datasets[0].needleValue;
        const xCenter = chart.getDatasetMeta(0).data[0].x;
        const yCenter = chart.getDatasetMeta(0).data[0].y;

        const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;

        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'grey';
        ctx.fillText(parseFloat(`${min - halfRange}`).toFixed(1), xCenter - (outerRadius + (outerRadius * 20 / 100)), yCenter + 16);

        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'grey';
        ctx.fillText(parseFloat(`${max + halfRange}`).toFixed(1), xCenter + (outerRadius - (outerRadius * 20 / 100)), yCenter + 16);

        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'grey';
        ctx.fillText(parseFloat(`${min}`).toFixed(1), xCenter - (outerRadius + (outerRadius * 20 / 100)), yCenter - (outerRadius * 80 / 100));

        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'grey';
        ctx.fillText(parseFloat(`${max}`).toFixed(1), xCenter + (outerRadius - (outerRadius * 20 / 100)), yCenter - (outerRadius * 80 / 100));

        ctx.font = '14px sans-serif';
        ctx.fillStyle = 'grey';
        ctx.fillText(symbol.concat(" ", parseFloat(needleValue).toFixed(1), " ", metric), xCenter - 30, yCenter + 30);
      }
    };

    const config = {
      type: 'doughnut',
      data,
      options: {
        layout: {
          padding: {
            top: 0,
            right: 20,
            left: 20,
            bottom: 0,
          }
        },
        aspectRatio: 1.1,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            displayColors: false,
            position: 'nearest',
          },
        }
      },
      plugins: [gaugeNeedle, gaugeFlowMeter,]
    };

    const ctx = chartRef.current.getContext('2d');
    const newChartInstance = new Chart(ctx, config);
    setChartInstance(newChartInstance);
  }, [props]);

  return (
    <div className="flex flex-col items-center text-center">
      <canvas className='text-slate-900 dark:text-white' ref={chartRef} id={props.id}></canvas>
      <p className="font-semibold text-slate-950">{props.label}</p>
    </div>
  );
};

export default GaugeChart;