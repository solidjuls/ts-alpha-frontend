import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Box, Flex } from 'components/Atoms';
import Text from 'components/Text';
import { Game } from 'types/game.types';
import { Data, Layout, Config } from 'plotly.js';
import { endType } from 'utils/constants';
import getAxiosInstance from 'utils/axios';

// Dynamically import Plot with no SSR
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

// Color palette
const colors = {
  // Side colors
  usa: '#4B6CB7',      // Calm blue for USA
  ussr: '#B74B4B',     // Muted red for USSR
  
  // Outcome colors
  wins: '#2E8B57',     // Sea green for wins
  losses: '#8B7355',   // Warm brown for losses
  ties: '#808080',     // Gray for ties
  
  // Win/loss type colors - consistent regardless of source
  defcon: '#6A5ACD',    // Slate blue for DEFCON (changed from sea green)
  scoring: '#4682B4',   // Steel blue for Scoring/Final Scoring/Europe Control
  vp: '#8B4513',        // Saddle brown for VP Track
  wargames: '#2F4F4F',  // Dark slate gray for Wargames (moved from Cuban)
  forfeit: '#A0522D',   // Sienna for Forfeit
  timer: '#8B7355',     // Peru for Timer Expired
  cuban: '#2F4F4F',     // Dark slate gray for Cuban Missile Crisis
  scoringCard: '#4682B4', // Steel blue for Scoring Card Held
  unknown: '#A9A9A9'    // Dark gray for Unknown
};

interface WinTypeChartProps {
  playerId: string;
  fromDate?: string;
}

// Define a fixed order for win/loss types
const winLossTypeOrder = [
  'DEFCON',
  'Final Scoring',
  'VP Track',
  'Wargames',
  'Forfeit',
  'Timer Expired',
  'Cuban Missile Crisis',
  'Scoring Card Held',
  'Unknown'
] as const;

interface WinTypeStats {
  USA: {
    wins: number;
    losses: number;
    ties: number;
    winTypes: Record<string, number>;
    lossTypes: Record<string, number>;
  };
  USSR: {
    wins: number;
    losses: number;
    ties: number;
    winTypes: Record<string, number>;
    lossTypes: Record<string, number>;
  };
}

const WinTypeChart: React.FC<WinTypeChartProps> = ({ playerId, fromDate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [winTypeStats, setWinTypeStats] = useState<WinTypeStats | null>(null);
  const [chartReady, setChartReady] = useState(false);
  
  useEffect(() => {
    const fetchWinTypeData = async () => {
      setIsLoading(true);
      setChartReady(false);
      try {
        const url = `/api/game/win-types?userFilter=${playerId}${fromDate ? `&fromDate=${fromDate}` : ''}`;
        const response = await getAxiosInstance().get<WinTypeStats>(url);
        setWinTypeStats(response.data);
      } catch (error) {
        console.error('Error fetching win type data:', error);
      } finally {
        // Add a small delay before marking as ready to ensure everything is loaded
        setTimeout(() => {
          setIsLoading(false);
          setChartReady(true);
        }, 500);
      }
    };
    
    fetchWinTypeData();
  }, [playerId, fromDate]);

  // Calculate win rates
  const usaWinRate = winTypeStats?.USA ? (winTypeStats.USA.wins / (winTypeStats.USA.wins + winTypeStats.USA.losses + winTypeStats.USA.ties) * 100).toFixed(1) : '0';
  const ussrWinRate = winTypeStats?.USSR ? (winTypeStats.USSR.wins / (winTypeStats.USSR.wins + winTypeStats.USSR.losses + winTypeStats.USSR.ties) * 100).toFixed(1) : '0';

  // Calculate total games for percentage calculations
  const totalUSAGames = winTypeStats?.USA ? (winTypeStats.USA.wins + winTypeStats.USA.losses + winTypeStats.USA.ties) : 0;
  const totalUSSRGames = winTypeStats?.USSR ? (winTypeStats.USSR.wins + winTypeStats.USSR.losses + winTypeStats.USSR.ties) : 0;
  const totalGames = totalUSAGames + totalUSSRGames;

  // Calculate percentages for each category
  const calculatePercentages = (side: 'USA' | 'USSR') => {
    if (!winTypeStats?.[side]) return {};
    
    const sideTotal = winTypeStats[side].wins + winTypeStats[side].losses + winTypeStats[side].ties;
    if (sideTotal === 0) return {};
    
    const percentages: Record<string, number> = {};
    
    // Calculate percentages for wins, losses, ties
    percentages[`${side}-Wins`] = (winTypeStats[side].wins / sideTotal) * 100;
    percentages[`${side}-Losses`] = (winTypeStats[side].losses / sideTotal) * 100;
    percentages[`${side}-Ties`] = (winTypeStats[side].ties / sideTotal) * 100;
    
    // Calculate percentages for win types
    if (winTypeStats[side].wins > 0) {
      winLossTypeOrder.forEach(type => {
        const count = winTypeStats[side].winTypes[type] || 0;
        percentages[`${side}-Wins-${type}`] = (count / winTypeStats[side].wins) * 100;
      });
    }
    
    // Calculate percentages for loss types
    if (winTypeStats[side].losses > 0) {
      winLossTypeOrder.forEach(type => {
        const count = winTypeStats[side].lossTypes[type] || 0;
        percentages[`${side}-Losses-${type}`] = (count / winTypeStats[side].losses) * 100;
      });
    }
    
    return percentages;
  };
  
  const usaPercentages = calculatePercentages('USA');
  const ussrPercentages = calculatePercentages('USSR');
  
  // Prepare data for the chart - using a sunburst chart to show the hierarchy
  const data: Data[] = [
    {
      type: "sunburst",
      ids: [
        "USA", "USSR",
        "USA-Wins", "USA-Losses", "USA-Ties",
        "USSR-Wins", "USSR-Losses", "USSR-Ties",
        ...winLossTypeOrder.map(type => `USA-Wins-${type}`),
        ...winLossTypeOrder.map(type => `USA-Losses-${type}`),
        ...winLossTypeOrder.map(type => `USSR-Wins-${type}`),
        ...winLossTypeOrder.map(type => `USSR-Losses-${type}`)
      ],
      labels: [
        "USA", "USSR",
        "Wins", "Losses", "Ties",
        "Wins", "Losses", "Ties",
        ...winLossTypeOrder,
        ...winLossTypeOrder,
        ...winLossTypeOrder,
        ...winLossTypeOrder
      ],
      parents: [
        "", "",
        "USA", "USA", "USA",
        "USSR", "USSR", "USSR",
        ...winLossTypeOrder.map(() => "USA-Wins"),
        ...winLossTypeOrder.map(() => "USA-Losses"),
        ...winLossTypeOrder.map(() => "USSR-Wins"),
        ...winLossTypeOrder.map(() => "USSR-Losses")
      ],
      values: [
        winTypeStats?.USA ? (winTypeStats.USA.wins + winTypeStats.USA.losses + winTypeStats.USA.ties) : 0, 
        winTypeStats?.USSR ? (winTypeStats.USSR.wins + winTypeStats.USSR.losses + winTypeStats.USSR.ties) : 0,
        winTypeStats?.USA?.wins || 0, winTypeStats?.USA?.losses || 0, winTypeStats?.USA?.ties || 0,
        winTypeStats?.USSR?.wins || 0, winTypeStats?.USSR?.losses || 0, winTypeStats?.USSR?.ties || 0,
        ...winLossTypeOrder.map(type => winTypeStats?.USA?.winTypes[type] || 0),
        ...winLossTypeOrder.map(type => winTypeStats?.USA?.lossTypes[type] || 0),
        ...winLossTypeOrder.map(type => winTypeStats?.USSR?.winTypes[type] || 0),
        ...winLossTypeOrder.map(type => winTypeStats?.USSR?.lossTypes[type] || 0)
      ],
      branchvalues: "total",
      hovertemplate: "<b>%{label}</b><br>" +
                     "Count: %{value}<br>" +
                     "Percentage: %{customdata:.0f}%<br>" +
                     "<extra></extra>",
      customdata: [
        // USA, USSR percentages of total games
        totalUSAGames > 0 ? (totalUSAGames / totalGames) * 100 : 0,
        totalUSSRGames > 0 ? (totalUSSRGames / totalGames) * 100 : 0,
        // USA Wins, Losses, Ties percentages
        usaPercentages["USA-Wins"] || 0,
        usaPercentages["USA-Losses"] || 0,
        usaPercentages["USA-Ties"] || 0,
        // USSR Wins, Losses, Ties percentages
        ussrPercentages["USSR-Wins"] || 0,
        ussrPercentages["USSR-Losses"] || 0,
        ussrPercentages["USSR-Ties"] || 0,
        // USA Win Types percentages
        ...winLossTypeOrder.map(type => usaPercentages[`USA-Wins-${type}`] || 0),
        // USA Loss Types percentages
        ...winLossTypeOrder.map(type => usaPercentages[`USA-Losses-${type}`] || 0),
        // USSR Win Types percentages
        ...winLossTypeOrder.map(type => ussrPercentages[`USSR-Wins-${type}`] || 0),
        // USSR Loss Types percentages
        ...winLossTypeOrder.map(type => ussrPercentages[`USSR-Losses-${type}`] || 0)
      ],
      marker: {
        colors: [
          colors.usa, colors.ussr,                    // USA, USSR
          colors.wins, colors.losses, colors.ties,    // USA Wins, Losses, Ties
          colors.wins, colors.losses, colors.ties,    // USSR Wins, Losses, Ties
          colors.defcon, colors.scoring, colors.vp, colors.wargames, colors.forfeit, colors.timer, colors.cuban, colors.scoringCard, colors.unknown,  // USA Win Types
          colors.defcon, colors.scoring, colors.vp, colors.wargames, colors.forfeit, colors.timer, colors.cuban, colors.scoringCard, colors.unknown,  // USA Loss Types
          colors.defcon, colors.scoring, colors.vp, colors.wargames, colors.forfeit, colors.timer, colors.cuban, colors.scoringCard, colors.unknown,  // USSR Win Types
          colors.defcon, colors.scoring, colors.vp, colors.wargames, colors.forfeit, colors.timer, colors.cuban, colors.scoringCard, colors.unknown   // USSR Loss Types
        ],
        line: { 
          color: [
            colors.usa, colors.usa,                    // USA, USSR
            colors.usa, colors.usa, colors.usa,        // USA Wins, Losses, Ties
            colors.ussr, colors.ussr, colors.ussr,     // USSR Wins, Losses, Ties
            colors.usa, colors.usa, colors.usa, colors.usa, colors.usa, colors.usa, colors.usa, colors.usa, colors.usa,  // USA Win Types
            colors.usa, colors.usa, colors.usa, colors.usa, colors.usa, colors.usa, colors.usa, colors.usa, colors.usa,  // USA Loss Types
            colors.ussr, colors.ussr, colors.ussr, colors.ussr, colors.ussr, colors.ussr, colors.ussr, colors.ussr, colors.ussr,  // USSR Win Types
            colors.ussr, colors.ussr, colors.ussr, colors.ussr, colors.ussr, colors.ussr, colors.ussr, colors.ussr, colors.ussr   // USSR Loss Types
          ],
          width: 1 
        }
      },
      textinfo: "label+value",
      textfont: { size: 14 }
    }
  ];

  const layout: Partial<Layout> = {
    title: {
      text: 'Win/Loss Distribution by Side and Type',
      font: {
        size: 20,
        family: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
      }
    },
    height: 600,
    margin: { t: 60, r: 0, b: 0, l: 0 },
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    font: {
      family: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
    }
  };

  const config: Partial<Config> = {
    responsive: true,
    displayModeBar: false
  };

  return (
    <>
      {isLoading || !chartReady ? (
        <Box css={{ 
          height: '600px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          marginTop: '16px'
        }}>
          <Text css={{ color: '#666' }}>Loading win/loss data...</Text>
        </Box>
      ) : (
        <>
          <Plot
            data={data}
            layout={layout}
            config={config}
            style={{ width: '100%', height: '600px' }}
          />
          
          <Box css={{ marginTop: '16px' }}>
            <Flex css={{ 
              flexWrap: 'wrap', 
              gap: '12px',
              justifyContent: 'center',
              marginTop: '16px'
            }}>
              <Box css={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box css={{ width: '16px', height: '16px', backgroundColor: colors.defcon, borderRadius: '4px' }} />
                <Box>DEFCON</Box>
              </Box>
              <Box css={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box css={{ width: '16px', height: '16px', backgroundColor: colors.scoring, borderRadius: '4px' }} />
                <Box>Final Scoring</Box>
              </Box>
              <Box css={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box css={{ width: '16px', height: '16px', backgroundColor: colors.vp, borderRadius: '4px' }} />
                <Box>VP Track</Box>
              </Box>
              <Box css={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box css={{ width: '16px', height: '16px', backgroundColor: colors.wargames, borderRadius: '4px' }} />
                <Box>Wargames</Box>
              </Box>
              <Box css={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box css={{ width: '16px', height: '16px', backgroundColor: colors.forfeit, borderRadius: '4px' }} />
                <Box>Forfeit</Box>
              </Box>
              <Box css={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box css={{ width: '16px', height: '16px', backgroundColor: colors.timer, borderRadius: '4px' }} />
                <Box>Timer Expired</Box>
              </Box>
              <Box css={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box css={{ width: '16px', height: '16px', backgroundColor: colors.cuban, borderRadius: '4px' }} />
                <Box>Cuban Missile Crisis</Box>
              </Box>
              <Box css={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box css={{ width: '16px', height: '16px', backgroundColor: colors.scoringCard, borderRadius: '4px' }} />
                <Box>Scoring Card Held</Box>
              </Box>
              <Box css={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box css={{ width: '16px', height: '16px', backgroundColor: colors.unknown, borderRadius: '4px' }} />
                <Box>Unknown</Box>
              </Box>
            </Flex>
          </Box>
        </>
      )}
    </>
  );
};

export default WinTypeChart;