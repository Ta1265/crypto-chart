import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js';
import styles from './app.module.css';

const chartOptions = {
  type: 'line',
  data: {
    datasets: [{
      label: 'BTC USD',
      pointRadius: 0,
      backgroundColor: [
        'rgba(255, 206, 86, 0.2)',
      ],
      borderColor: [
        'rgba(255, 206, 86, 1)',
      ],
    }],
  },
};

interface ResponseData {
  bpi: BPI;
  disclaimer: string;
  time: any;
}

interface BPI {
  [date: string]: number;
}

function App(): JSX.Element {
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [start, setStart] = useState('2013-09-01');
  const [end, setEnd] = useState('2021-02-20');

  const getChartData = () => {
    console.log(start, end);
    axios.get<ResponseData>(`https://api.coindesk.com/v1/bpi/historical/close.json?start=${start}&end=${end}`)
      .then((response) => {
        if (chartInstance?.data.datasets) {
          chartInstance.data.labels = Object.keys(response.data.bpi);
          chartInstance.data.datasets[0].data = Object.values(response.data.bpi);
          chartInstance.update();
        }
      })
      .catch((error: Error) => console.error(error.message));
  };

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const newChartInstance = new Chart(chartRef.current, chartOptions);
      setChartInstance(newChartInstance);
    }
  }, [chartRef]);

  useEffect(getChartData, [chartInstance, start, end]);

  return (
    <div className={styles.appStyle}>
      <canvas ref={chartRef} width="400" height="400" />
      From:
      <input
        type="date"
        value={start}
        onChange={(e) => {
          e.preventDefault();
          setStart(e.target.value);
        }}
      />
      To:
      <input
        type="date"
        value={end}
        onChange={(e) => {
          e.preventDefault();
          setEnd(e.target.value);
        }}
      />
    </div>
  );
}

export default App;
