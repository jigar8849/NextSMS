// app/dashboard/page.tsx (or pages/dashboard.tsx)
'use client';

import { FaUsers, FaCreditCard, FaExclamationCircle, FaCar, FaUserCog } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from 'react';

interface DashboardData {
  totalResidents: number;
  pendingPayments: number;
  activeComplaints: number;
  parkingSlotsTaken: number;
  totalParkingSlots: number;
  recentActivities: string[];
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`https://next-sms-ten.vercel.app/admin/dashboard`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">No data available</p>
      </div>
    );
  }

  const {
    totalResidents,
    pendingPayments,
    activeComplaints,
    parkingSlotsTaken,
    totalParkingSlots,
    recentActivities,
  } = data;
  return (
    <div className="mt-15 bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-blue-600 text-white rounded-lg p-6 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome back, Admin!</h1>
        <p className="text-sm md:text-base mt-2">Here&apos;s what&apos;s happening in your society today.</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total Residents</p>
            <h3 className="text-xl font-bold">{totalResidents}</h3>
          </div>
          <div className="bg-blue-600 text-white p-4 rounded-full">
            <FaUsers size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Pending Payments</p>
            <h3 className="text-xl font-bold">₹{pendingPayments}</h3>
          </div>
          <div className="bg-green-600 text-white p-4 rounded-full">
            <FaCreditCard size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Active Complaints</p>
            <h3 className="text-xl font-bold">{activeComplaints}</h3>
          </div>
          <div className="bg-red-600 text-white p-4 rounded-full">
            <FaExclamationCircle size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Parking Slots</p>
            <h3 className="text-xl font-bold">{parkingSlotsTaken}/{totalParkingSlots}</h3>
          </div>
          <div className="bg-purple-600 text-white p-4 rounded-full">
            <FaCar size={24} />
          </div>
        </div>
      </div>

      {/* Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-4">
          <h5 className="font-bold mb-2 text-lg">Recent Activities</h5>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {recentActivities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-4">
          <h5 className="font-bold mb-2 text-lg">Quick Actions</h5>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Link href="/admin/forms/addMember" className="border p-4 rounded-lg flex flex-col items-center justify-center hover:shadow-md transition">
              <FaUsers className="text-blue-600 text-2xl mb-2" />
              <p className="text-blue-600 font-semibold text-sm">Add Resident</p>
            </Link>

            <Link href="/admin/forms/addEmployee" className="border p-4 rounded-lg flex flex-col items-center justify-center hover:shadow-md transition">
              <FaUserCog  className="text-blue-600 text-2xl mb-2" />
              <p className="text-blue-600 font-semibold text-sm">Add Employees</p>
            </Link>

            <Link href="/admin/payments" className="border p-4 rounded-lg flex flex-col items-center justify-center hover:shadow-md transition">
              <FaCreditCard className="text-blue-600 text-2xl mb-2" />
              <p className="text-blue-600 font-semibold text-sm">Record Payment</p>
            </Link>

            <Link href="/admin/complaints" className="border p-4 rounded-lg flex flex-col items-center justify-center hover:shadow-md transition">
              <FaExclamationCircle className="text-blue-600 text-2xl mb-2" />
              <p className="text-blue-600 font-semibold text-sm">View Complaints</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
