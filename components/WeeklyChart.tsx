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
        const arrivalDateOnly = new Date(arrivalDate.getFullYear(), arrivalDate.getMonth(), arrivalDate.getDate());
        const dayDateOnly = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate());
        return arrivalDateOnly.getTime() === dayDateOnly.getTime();
      });

      // Calculate peak arrival time for the day (like mobile screen time)
      let peakArrivalTime = null; // Use null for no arrivals
      let timeTag = 'fast';
      
      if (dayArrivals.length > 0) {
        // Find the most common hour of arrival (peak time)
        const hourCounts = dayArrivals.reduce((counts, arrival) => {
          const arrivalTime = new Date(arrival.timestamp);
          const hour = arrivalTime.getHours();
          counts[hour] = (counts[hour] || 0) + 1;
          return counts;
        }, {} as Record<number, number>);
        
        // Get the hour with most arrivals
        const peakHour = Object.entries(hourCounts).reduce((a, b) => 
          hourCounts[Number(a[0])] > hourCounts[Number(b[0])] ? a : b
        )[0];
        
        peakArrivalTime = Number(peakHour);
        
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
        arrivalTime: peakArrivalTime, // null for no arrivals
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

  const weekBounds = useMemo(() => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1 + (currentWeekOffset * 7));
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    return { startDate, endDate };
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

  // Dynamic Y-axis range based on actual data - like screen time tracker
  const yAxisRange = useMemo(() => {
    const validTimes = chartData
      .filter(day => day.arrivalTime !== null)
      .map(day => day.arrivalTime!);
    
    if (validTimes.length === 0) return [0, 6]; // Default 6-hour range
    
    const minTime = Math.min(...validTimes);
    const maxTime = Math.max(...validTimes);
    
    // Add 20% padding above max value for better visualization
    const padding = (maxTime - minTime) * 0.2;
    const rangeMin = Math.max(0, minTime - padding);
    const rangeMax = Math.min(24, maxTime + padding);
    
    // Ensure minimum range of 4 hours for readability
    if (rangeMax - rangeMin < 4) {
      const center = (rangeMin + rangeMax) / 2;
      const halfRange = 2;
      return [Math.max(0, center - halfRange), Math.min(24, center + halfRange)];
    }
    
    return [rangeMin, rangeMax];
  }, [chartData]);

  // Dynamic Y-axis ticks - screen time style with clean hour intervals
  const yAxisTicks = useMemo(() => {
    const [min, max] = yAxisRange;
    const range = max - min;
    
    // Generate clean hour intervals (0h, 1h, 2h, 3h, 4h, 5h, etc.)
    const ticks = [];
    const startHour = Math.floor(min);
    const endHour = Math.ceil(max);
    
    // Show every hour or every 2 hours based on range
    const interval = range > 8 ? 2 : 1;
    
    for (let hour = startHour; hour <= endHour; hour += interval) {
      if (hour >= 0 && hour <= 24) {
        ticks.push(hour);
      }
    }
    
    // Ensure we have at least 3 ticks
    if (ticks.length < 3) {
      const center = (min + max) / 2;
      return [Math.floor(center - 1), Math.floor(center), Math.floor(center + 1)];
    }
    
    return ticks;
  }, [yAxisRange]);

  const formatTime = (hour: number) => {
    // Time formatting for Y-axis (12am, 1am, 2am, etc.)
    if (hour === 0) return '12am';
    if (hour < 12) return `${hour}am`;
    if (hour === 12) return '12pm';
    if (hour < 24) return `${hour - 12}pm`;
    return '12am';
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
      
      // Get the latest arrival time for this day
      const dayArrivals = arrivals?.filter(arrival => {
        const arrivalDate = new Date(arrival.timestamp);
        const dayDate = new Date(data.date);
        const arrivalDateOnly = new Date(arrivalDate.getFullYear(), arrivalDate.getMonth(), arrivalDate.getDate());
        const dayDateOnly = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate());
        return arrivalDateOnly.getTime() === dayDateOnly.getTime();
      }) || [];
      
      const latestArrival = dayArrivals.length > 0 ? 
        dayArrivals.reduce((latest, current) => 
          new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
        ) : null;
      
      const getTagColor = (tag: string) => {
        switch (tag) {
          case 'fast': return 'text-green-400';
          case 'late': return 'text-yellow-400';
          case 'very_late': return 'text-red-400';
          default: return 'text-gray-400';
        }
      };
      
      const getTagLabel = (tag: string) => {
        switch (tag) {
          case 'fast': return 'Fast (8pm-9pm)';
          case 'late': return 'Late (10pm-12am)';
          case 'very_late': return 'Very Late (12am-6am)';
          default: return 'Unknown';
        }
      };
      
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-black/90 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl p-4 min-w-[200px]"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-white/70 rounded-full"></div>
            <p className="font-semibold text-white text-sm">{data.day}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/60">Peak Time:</span>
              <span className="text-sm font-medium text-white">{formatTime(data.arrivalTime)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/60">Total Arrivals:</span>
              <span className="text-sm font-medium text-white">{data.count}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/60">Category:</span>
              <span className={`text-xs font-medium ${getTagColor(data.timeTag)}`}>
                {getTagLabel(data.timeTag)}
              </span>
            </div>
            
            {latestArrival && (
              <div className="pt-2 border-t border-white/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/60">Latest Arrival:</span>
                  <span className="text-sm font-medium text-cyan-400">
                    {new Date(latestArrival.timestamp).toLocaleTimeString('en-GB', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: false 
                    })}
                  </span>
                </div>
                {latestArrival.note && (
                  <div className="mt-1">
                    <span className="text-xs text-white/50 italic">"{latestArrival.note}"</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const CustomBar = (props: any) => {
    const { fill, payload, ...rest } = props;
    
    // Show bar if there's any data
    if (!payload || payload.count === 0 || payload.arrivalTime === null) {
      return null;
    }
    
    // Screen time style bar calculation - proportional to max value
    const [yAxisMin, yAxisMax] = yAxisRange;
    const timeValue = payload.arrivalTime || 0;
    
    // Calculate exact proportional height within the Y-axis range
    const normalizedHeight = ((timeValue - yAxisMin) / (yAxisMax - yAxisMin)) * rest.height;
    
    // Use full calculated height - no artificial restrictions
    const barHeight = Math.max(6, normalizedHeight); // Minimum 6px for visibility
    
    // Adjust Y position to align with the bottom
    const barY = rest.y + (rest.height - barHeight);
    
    return (
      <motion.rect
        initial={{ height: 0, y: rest.y + rest.height }}
        animate={{ height: barHeight, y: barY }}
        transition={{ 
          duration: 0.6, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: Math.random() * 0.1
        }}
        fill="url(#gradient)"
        rx="8"
        ry="8"
        x={rest.x}
        width={rest.width}
        height={barHeight}
        y={barY}
      />
    );
  };

  // Method 3: Alternative approach with Cell component
  const renderCustomBar = (entry: any, index: number) => {
    if (!entry || entry.arrivalTime === null || entry.count === 0) {
      return null;
    }
    
    const timeValue = entry.arrivalTime || 0;
    const barHeight = Math.max((timeValue / 24) * 200, 8);
    
    return (
      <rect
        key={`bar-${index}`}
        x={entry.x}
        y={entry.y + entry.height - barHeight}
        width={entry.width}
        height={barHeight}
        fill="url(#gradient)"
        rx="6"
        ry="6"
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
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0"></div>
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
                <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.9} />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.7} />
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
              tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 500 }}
              domain={yAxisRange}
              ticks={yAxisTicks}
              tickFormatter={(value) => formatTime(value)}
              type="number"
              allowDataOverflow={true}
              tickCount={6}
            />
            
            {/* Removed reference line for cleaner screen time look */}
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Method 1: Standard Bar with explicit fill */}
            <Bar 
              dataKey="arrivalTime" 
              fill="#FFFFFF"
              radius={[4, 4, 0, 0]}
              minPointSize={4}
              maxBarSize={50}
            />
            
            {/* Method 2: Custom Bar with shape */}
            <Bar 
              dataKey="arrivalTime" 
              shape={<CustomBar />}
              fill="url(#gradient)"
              radius={[4, 4, 0, 0]}
              minPointSize={4}
              maxBarSize={50}
            />
            
            {/* Method 3: Cell-based approach */}
            <Bar 
              dataKey="arrivalTime" 
              fill="url(#gradient)"
              radius={[4, 4, 0, 0]}
              minPointSize={4}
              maxBarSize={50}
            >
              {chartData.map((entry, index) => renderCustomBar(entry, index))}
            </Bar>
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
