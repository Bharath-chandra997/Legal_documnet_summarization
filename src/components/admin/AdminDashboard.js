import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [startDate, setStartDate] = useState(format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const navigate = useNavigate();

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/login-stats', {
        params: { startDate, endDate },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/signin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  useEffect(() => {
    fetchStats();
  }, [startDate, endDate]);

  const chartData = {
    labels: stats.map(stat => format(new Date(stat.date), 'MMM dd')),
    datasets: [
      {
        label: 'Daily Logins',
        data: stats.map(stat => stat.count),
        backgroundColor: chartType === 'bar' ? 'rgba(75, 192, 192, 0.7)' : 'rgba(75, 192, 192, 0.3)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        tension: 0.1,
        fill: chartType === 'line',
        borderRadius: chartType === 'bar' ? 6 : 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 16
        },
        bodyFont: {
          size: 14
        },
        padding: 12
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 1000
    }
  };

  return (
    <div className="admindashboard">
      <div className="admindashboard-header">
        <div className="admindashboard-header-content">
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout} className="admindashboard-logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="admindashboard-content">
        <div className="admindashboard-stats-card">
          <div className="admindashboard-card-header">
            <h2>User Login Statistics</h2>
            <div className="admindashboard-chart-toggle">
              <button 
                onClick={() => setChartType('bar')} 
                className={chartType === 'bar' ? 'active' : ''}
              >
                Bar Chart
              </button>
              <button 
                onClick={() => setChartType('line')} 
                className={chartType === 'line' ? 'active' : ''}
              >
                Line Graph
              </button>
            </div>
          </div>

          <div className="admindashboard-date-controls">
            <div className="admindashboard-date-input">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="admindashboard-date-input">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button onClick={fetchStats} disabled={isLoading} className="admindashboard-refresh-btn">
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>

          <div className="admindashboard-chart-container">
            {stats.length > 0 ? (
              chartType === 'bar' ? (
                <Bar data={chartData} options={options} />
              ) : (
                <Line data={chartData} options={options} />
              )
            ) : (
              <div className="admindashboard-no-data">
                {isLoading ? 'Loading data...' : 'No data available'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;