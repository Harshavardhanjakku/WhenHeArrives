"use client";
import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Arrival } from '@/lib/types';

interface WeeklyChartProps {
  arrivals: Arrival[];
}

interface ChartData {
  day: string;
  shortDay: string;
  arrivalTime: number | null;
  count: number;
  date: string;
  timeTag: string;
}

export default function WeeklyChart({ arrivals }: WeeklyChartProps) {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const chartData = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1 + (currentWeekOffset * 7)); // Start from Monday
    startOfWeek.setHours(0, 0, 0, 0);

    const weekData: ChartData[] = [];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const shortDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      
      const dayStart = new Date(dayDate);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(dayDate);
      dayEnd.setHours(23, 59, 59, 999);

      // Filter arrivals for this specific day
      const dayArrivals = arrivals.filter(arrival => {
        const arrivalDate = new Date(arrival.timestamp);
        return arrivalDate >= dayStart && arrivalDate <= dayEnd;
      });

      // Calculate average arrival time for the day
      let averageArrivalTime = null; // Use null for no arrivals
      let timeTag = 'fast';
      
      if (dayArrivals.length > 0) {
        // Calculate average hour of arrival
        const totalHours = dayArrivals.reduce((sum, arrival) => {
          const arrivalTime = new Date(arrival.timestamp);
          return sum + arrivalTime.getHours();
        }, 0);
        
        averageArrivalTime = totalHours / dayArrivals.length;
        
        // Determine the most common time tag for the day
        const tagCounts = dayArrivals.reduce((counts, arrival) => {
          const tag = arrival.timeTag || 'fast';
          counts[tag] = (counts[tag] || 0) + 1;
          return counts;
        }, {} as Record<string, number>);
        
        timeTag = Object.entries(tagCounts).reduce((a, b) => tagCounts[a[0]] > tagCounts[b[0]] ? a[0] : b[0], 'fast');
      }

      weekData.push({
        day: dayNames[i],
        shortDay: shortDayNames[i],
        arrivalTime: averageArrivalTime, // null for no arrivals
        count: dayArrivals.length,
        date: dayDate.toISOString().split('T')[0],
        timeTag: timeTag
      });
    }

    return weekData;
  }, [arrivals, currentWeekOffset]);

  const weekRange = useMemo(() => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1 + (currentWeekOffset * 7));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    return {
      start: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  }, [currentWeekOffset]);

  const hasAnyArrivals = useMemo(() => {
    return chartData.some(day => day.count > 0);
  }, [chartData]);

  // Always render one tree; show empty state or the chart based on data availability

  const averageArrivalTime = useMemo(() => {
    const validTimes = chartData.filter(day => day.arrivalTime !== null);
    if (validTimes.length === 0) return null;
    const totalTime = validTimes.reduce((sum, day) => sum + (day.arrivalTime || 0), 0);
    return Math.round((totalTime / validTimes.length) * 10) / 10;
  }, [chartData]);

  const formatTime = (hour: number) => {
    if (hour === 0) return '12am';
    if (hour < 12) return `${hour}am`;
    if (hour === 12) return '12pm';
    return `${hour - 12}pm`;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setIsTransitioning(true);
    setCurrentWeekOffset(prev => direction === 'prev' ? prev - 1 : prev + 1);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      if (data.arrivalTime === null) {
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-4"
          >
            <p className="font-semibold text-white text-sm">{data.day}</p>
            <p className="text-sm text-white/60 mt-1">No arrival</p>
            <p className="text-xs text-white/40 mt-1">Click to add arrival</p>
          </motion.div>
        );
      }
      
      const getTagColor = (tag: string) => {
        switch (tag) {
          case 'fast': return 'text-green-600';
          case 'late': return 'text-yellow-600';
          case 'very_late': return 'text-red-600';
          default: return 'text-gray-600';
        }
      };
      
      const getTagLabel = (tag: string) => {
        switch (tag) {
          case 'fast': return 'Fast';
          case 'late': return 'Late';
          case 'very_late': return 'Very Late';
          default: return 'Unknown';
        }
      };
      
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-4"
        >
          <p className="font-semibold text-white text-sm">{data.day}</p>
          <p className="text-sm text-white/80 mt-1">
            <span className="font-medium text-white/90">{formatTime(data.arrivalTime)}</span> arrival time
          </p>
          <p className="text-xs text-white/60 mt-1">{data.count} arrivals</p>
          <p className={`text-xs font-medium mt-1 ${getTagColor(data.timeTag)}`}>
            {getTagLabel(data.timeTag)}
          </p>
        </motion.div>
      );
    }
    return null;
  };

  const CustomBar = (props: any) => {
    const { fill, payload, ...rest } = props;
    return (
      <motion.rect
        initial={{ height: 0, y: rest.y + rest.height }}
        animate={{ height: rest.height, y: rest.y }}
        transition={{ 
          duration: 0.8, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: Math.random() * 0.2
        }}
        fill="url(#gradient)"
        rx="6"
        ry="6"
        {...rest}
      />
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black/50 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl p-6 relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-purple-50"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
            Weekly Activity
          </h3>
          <p className="text-sm text-white/60 mt-1">{weekRange.start} - {weekRange.end}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateWeek('prev')}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateWeek('next')}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Chart */}
      <motion.div 
        className="h-72 sm:h-80"
        animate={{ opacity: isTransitioning ? 0.7 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="shortDay" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 13, fill: '#E5E7EB', fontWeight: 500 }}
              interval={0}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              domain={[0, 24]}
              tickFormatter={(value) => formatTime(value)}
            />
            
            {averageArrivalTime !== null && (
              <ReferenceLine 
                y={averageArrivalTime} 
                stroke="#FFFFFF" 
                strokeDasharray="8 8"
                strokeWidth={2}
                strokeOpacity={0.35}
              />
            )}
            
            <Tooltip content={<CustomTooltip />} />
            
            <Bar 
              dataKey="arrivalTime" 
              shape={<CustomBar />}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

        {/* Average line label */}
        {averageArrivalTime !== null && (
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center space-x-3 text-xs text-white/60">
              <div className="w-6 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              <span className="font-medium text-white/80">Average: {formatTime(averageArrivalTime)}</span>
              <div className="w-6 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
