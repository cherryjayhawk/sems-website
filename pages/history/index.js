// 'use client'

import Layout from '@/src/containers/Layout'
import Head from 'next/head'
import Topbar from '@/src/containers/Topbar'
import Content from '@/src/containers/Content'
import HistoryFilter from '@/src/components/HistoryFilter'
import HistoryChart from '@/src/components/HistoryChart'
import Error from '@/src/components/Error'
import { Button } from "@mui/material";
import ExcelExport from '../../src/components/ExcelExport'
import PrintIcon from "@mui/icons-material/Print";

import useSWR from 'swr'
import CircularIndeterminate from '@/src/components/Loading'
import { useSession } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function History() {
    const { data: session } = useSession();
    const chartRef = useRef();
    const dt = new Date();
    const fileName = toIsoStringFileName(dt);

    function toIsoString(date) {
		var tzo = -date.getTimezoneOffset(),
			dif = tzo >= 0 ? '+' : '-',
			pad = function(num) {
				return (num < 10 ? '0' : '') + num;
			};
	
		return date.getFullYear() +
			'-' + pad(date.getMonth() + 1) +
			'-' + pad(date.getDate()) +
			'T' + pad(date.getHours()) +
			':' + pad(date.getMinutes()) 
	}

    function toIsoStringFileName(date) {
		var tzo = -date.getTimezoneOffset(),
			dif = tzo >= 0 ? '+' : '-',
			pad = function(num) {
				return (num < 10 ? '0' : '') + num;
			};
	
		return 'laporan_monitor_' + date.getFullYear() +
			'_' + pad(date.getMonth() + 1) +
			'_' + pad(date.getDate()) +
			'__' + pad(date.getHours()) +
			'_' + pad(date.getMinutes()) 
	}
    
    const [areaList, setAreaList] = useState([]); // State untuk daftar area
    const [startDate, setStartDate] = useState(toIsoString(dt).slice(0, 11).concat("00:00")); // State untuk tanggal awal
    const [endDate, setEndDate] = useState(toIsoString(dt)); // State untuk tanggal akhir
    const [area, setArea] = useState('AREA001');// State untuk area
    const [data, setData] = useState([]); // State untuk data yang akan ditampilkan di line chart
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingExcel, setIsLoadingExcel] = useState(true);
    const [errorArea, setErrorArea] = useState(false)
    const [errorChart, setErrorChart] = useState(false)
    const [excelData, setExcelData] = useState()


    const [validationError, setValidationError] = useState(''); // State untuk pesan kesalahan validasi

    // Fungsi untuk mengambil daftar area dari sumber eksternal
    const fetchAreaList = async () => {
        if (session) {
            try {
                const authorizationHeader = `Bearer ${session?.user.access_token}`;
                const headers = new Headers({
                    Authorization: authorizationHeader,
                });

                // Lakukan permintaan HTTP untuk mengambil daftar area
                const response = await fetch('https://sems-webservice-ten.vercel.app/api/areas', { headers });
                const areaData = await response.json();
                setAreaList(areaData);
            } catch (error) {
                console.error('Error fetching area list:', error);
                setIsLoading(false)
                setErrorArea(true)
            }
        }
    };
  
    // Fungsi untuk melakukan fetch data berdasarkan tanggal dan area
    const fetchData = async () => {
        if (session) {
            try {
                const authorizationHeader = `Bearer ${session?.user.access_token}`;
                const headers = new Headers({
                    Authorization: authorizationHeader,
                });
                // Lakukan permintaan HTTP (misalnya, fetch data dari API) berdasarkan startDate, endDate, dan area
                const response = await fetch(
                    `https://sems-webservice-ten.vercel.app/api/history?start_date=${startDate}&end_date=${endDate}&area=${area}`,
                    { headers }
                );
                const newData = await response.json();
                setData(newData);
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false)
                setErrorChart(true)
            }
        }
    };

    const fetchDataExcel = async () => {
        if (session) {
            try {
                setIsLoadingExcel(true)
                const authorizationHeader = `Bearer ${session?.user.access_token}`;
                const headers = new Headers({
                    Authorization: authorizationHeader,
                });
                // Lakukan permintaan HTTP (misalnya, fetch data dari API) berdasarkan startDate, endDate, dan area
                const response = await fetch(
                    `${process.env.WEBSERVICE_URL}/api/reports?start_date=${startDate}&end_date=${endDate}`,
                    { headers }
                );
                const newData = await response.json();
                setExcelData(newData);
                setIsLoadingExcel(false)
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoadingExcel(false)
                setErrorChart(true)
            }
        }
    };

    // Fungsi untuk menangani perubahan tanggal awal
    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);
    };

    // Fungsi untuk menangani perubahan tanggal akhir
    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);
    };

    // Fungsi untuk menangani klik tombol "Kirim"
    const handleKirimClick = () => {
        setErrorArea(false)
        setErrorChart(false)
        setIsLoading(true)
        fetchData();
        fetchDataExcel();
    };

    // Menggunakan useEffect untuk mengambil daftar area saat komponen pertama kali dimuat
    useEffect(() => {
        fetchAreaList();
        fetchData();
        fetchDataExcel();

        // const exportToPDF = () => {
        //     if (chartRef.current) {
        //         html2canvas(chartRef.current).then((canvas) => {
        //         const imgData = canvas.toDataURL('image/png');
        //         const pdf = new jsPDF();
        //         pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);
        //         pdf.save(fileName + '.pdf');
        //         });
        //     }
        // };
        // // Attach the event handler with vanilla JavaScript inside useEffect
        // const exportButton = document.getElementById('exportButton');
        // if (exportButton) {
        //     exportButton.addEventListener('click', exportToPDF);
        // }

        // Clean up the event handler when the component unmounts
        // return () => {
        //     if (exportButton) {
        //         exportButton.removeEventListener('click', exportToPDF);
        //     }
        // };
    }, [session]);
    
    return (
    <>
        <Head>
            <title>Riwayat | Soil and Environment Monitoring Systems</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
            <Topbar text="Menu | Riwayat" />
            <Content>
                <div className="px-8 py-8 my-4 border-2 border-[--contrast-color] rounded">
                    <div className="flex justify-between mb-4">
                        <div className="text-xl font-semibold">
                            Monitor Riwayat
                        </div>
                    </div>
                    <div className='flex flex-col items-end gap-2 min-h-[20vh]'>
                        <div className="flex border-2 w-72 my-1 font-semibold border-gray-300 dark:bg-none dark:bg-slate-900">
                            <span className="bg-gray-300 dark:bg-slate-900 dark:border-r-2 w-12 h-10 flex justify-center items-center px-2">Area:</span>
                            {
                                errorArea ? (
                                    <select disabled defaultValue={''} className="w-72 h-10 px-3 py-1  dark:bg-slate-900">
                                        <option value={''}>--Terjadi Kesalahan--</option>
                                    </select>
                                ) : (
                                    <select defaultValue={area} value={area} onChange={(e) => setArea(e.target.value)} className="w-72 h-10 px-3 py-1 dark:bg-slate-900 rounded-none">
                                        {areaList.map((areaOption) => (
                                            <option key={areaOption.id} value={areaOption.id} className='rounded-none h-10'>
                                                {areaOption.area_name}
                                            </option>
                                        ))}
                                    </select>
                                )
                            }
                        </div>  
                        <div className="flex border-2 w-72 my-1 font-semibold border-gray-300 dark:bg-slate-900">
                            <span className="bg-gray-300 dark:bg-slate-900 dark:border-r-2 w-12 h-10 flex justify-center items-center px-2">Dari:</span>
                            <input type="datetime-local" value={startDate} onChange={handleStartDateChange} className="pl-2 w-60 h-10 text-[--contrast-color] py-1 border-gray-300 dark:bg-slate-900" /> <br/>
                        </div>
                        <div className="flex border-2 w-72 my-1 font-semibold border-gray-300 dark:bg-slate-900">
                            <span className="bg-gray-300 dark:bg-slate-900 dark:border-r-2 w-12 h-10 flex justify-center items-center px-2">Ke:</span>
                            <input type="datetime-local" value={endDate} onChange={handleEndDateChange} className="pl-2 w-60 h-10 text-[--contrast-color] py-1 border-gray-300 dark:bg-slate-900"/><br/>
                        </div>    
                        <button onClick={handleKirimClick} disabled={validationError} className='w-24 h-12 font-semibold rounded bg-slate-900 text-white dark:text-slate-900 dark:bg-gray-300'>
                            Kirim
                        </button>
                    </div>
                    <div className='flex flex-col justify-center items-center min-h-[40vh] gap-2'>
                    {
                        errorChart && (
                            <Error />
                        ) 
                    }
                    {
                        isLoading ? (
                            <CircularIndeterminate/>
                        ) : (
                            // <p>bruh</p>
                            <HistoryChart chartRef={chartRef} readDate={data?.read_date} sensorData={data?.sensor_data} />
                        )
                    }
                    {
                        !isLoadingExcel && !errorChart && (
                            <div className='w-full flex justify-start items-center gap-2'>
                                <span className='font-semibold'>Cetak: </span>
                                <ExcelExport excelData={excelData} fileName={fileName} />
                            </div>
                        )
                    }
                    </div>
                </div> 
            </Content>
        </Layout>
    </>
    )
}
