import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function HistoryChart({ readDate, sensorData, chartRef }) {
	if (sensorData && readDate) return ( 
	<Line className='p-8'
		ref={chartRef}
		datasetIdKey='id'
		data={{
		  labels: readDate,
		  datasets: sensorData,
		}}
	  /> 
	)
}

export default HistoryChart;
