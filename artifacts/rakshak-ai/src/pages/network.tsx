import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  useGetNetworkGraph,
  NetworkGraph,
  NetworkNode,
  NetworkEdge
} from '@workspace/api-client-react';
import { 
  Network as NetworkIcon, Search, ZoomIn, ZoomOut, Maximize,
  ShieldAlert, User, MapPin, Car, Smartphone, Building, FileText, Loader2
} from 'lucide-react';

export default function NetworkAnalysis() {
  const [location] = useLocation();
  // Extract params from URL if present (e.g. ?accusedId=123)
  const searchParams = new URLSearchParams(window.location.search);
  const accusedIdParam = searchParams.get('accusedId');
  const firIdParam = searchParams.get('firId');
  
  const accusedId = accusedIdParam ? parseInt(accusedIdParam) : null;
  const firId = firIdParam ? parseInt(firIdParam) : null;

  const { data: graphData, isLoading } = useGetNetworkGraph({ 
    accusedId, 
    firId 
  });

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen w-full overflow-hidden">
      <div className="p-4 border-b bg-background/95 backdrop-blur z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tight flex items-center gap-2">
            <NetworkIcon className="h-6 w-6 text-primary" />
            NETWORK INTELLIGENCE
          </h1>
          <p className="text-muted-foreground font-mono text-xs mt-1 uppercase tracking-widest">
            Relational Link Analysis System
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex gap-2">
            <Badge variant="outline" className="font-mono text-[10px] bg-background">
              Nodes: {graphData?.stats.totalNodes || 0}
            </Badge>
            <Badge variant="outline" className="font-mono text-[10px] bg-background">
              Links: {graphData?.stats.totalEdges || 0}
            </Badge>
            {graphData?.stats.gangsDetected && graphData.stats.gangsDetected > 0 ? (
              <Badge variant="destructive" className="font-mono text-[10px] animate-pulse">
                Gangs Detected: {graphData.stats.gangsDetected}
              </Badge>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-sidebar overflow-hidden flex">
        {/* Ambient grid background for the graph */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none"></div>

        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-primary font-mono gap-4">
            <Loader2 className="h-12 w-12 animate-spin" />
            <p className="animate-pulse tracking-widest">CALCULATING VECTOR TOPOLOGY...</p>
          </div>
        ) : graphData ? (
          <ForceGraph data={graphData} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono">
            No network data available.
          </div>
        )}

        {/* Legend Overlay */}
        <Card className="absolute bottom-4 left-4 border-border/50 bg-background/80 backdrop-blur w-48 shadow-xl hidden md:block z-20">
          <CardHeader className="py-3 px-4 border-b border-border/50">
            <CardTitle className="font-mono text-xs uppercase tracking-wider">Node Taxonomy</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <LegendItem icon={<User size={12} />} label="Accused" color="bg-destructive" />
            <LegendItem icon={<User size={12} />} label="Victim" color="bg-emerald-500" />
            <LegendItem icon={<MapPin size={12} />} label="Location" color="bg-primary" />
            <LegendItem icon={<Car size={12} />} label="Vehicle" color="bg-amber-500" />
            <LegendItem icon={<Smartphone size={12} />} label="Phone/Comms" color="bg-purple-500" />
            <LegendItem icon={<Building size={12} />} label="Bank/Finance" color="bg-blue-400" />
            <LegendItem icon={<FileText size={12} />} label="FIR" color="bg-secondary" border="border-border" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LegendItem({ icon, label, color, border = "border-transparent" }: any) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <div className={`h-4 w-4 rounded-full flex items-center justify-center text-white border ${color} ${border}`}>
        {icon}
      </div>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

// Custom Force Directed Graph using Canvas/SVG hybrid approach
function ForceGraph({ data }: { data: NetworkGraph }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Simulation state
  const [nodes, setNodes] = useState<(NetworkNode & { x: number, y: number, vx: number, vy: number })[]>([]);
  const [edges, setEdges] = useState<NetworkEdge[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    setDimensions({ width: clientWidth, height: clientHeight });
    
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize nodes randomly in the center area
  useEffect(() => {
    if (data.nodes.length === 0) return;
    
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    const radius = Math.min(cx, cy) * 0.8;
    
    // Check if we have a central node to position exactly in center
    const centralNodeId = data.stats?.centralNode;
    
    const initialNodes = data.nodes.map((node, i) => {
      if (node.id === centralNodeId) {
        return { ...node, x: cx, y: cy, vx: 0, vy: 0 };
      }
      
      const angle = (i / data.nodes.length) * 2 * Math.PI;
      // Add some randomness so they don't form a perfect circle initially
      const r = radius * (0.3 + Math.random() * 0.7);
      
      return {
        ...node,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        vx: 0,
        vy: 0
      };
    });
    
    setNodes(initialNodes);
    setEdges(data.edges);
  }, [data, dimensions.width, dimensions.height]);

  // Force simulation loop
  useEffect(() => {
    if (nodes.length === 0) return;
    
    let animationFrameId: number;
    let alpha = 1;
    const alphaMin = 0.001;
    const alphaDecay = 1 - Math.pow(alphaMin, 1 / 300);
    
    // Center of gravity
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;

    const tick = () => {
      alpha += (0 - alpha) * alphaDecay;
      
      if (alpha < alphaMin) return; // Simulation settled
      
      setNodes(currentNodes => {
        const newNodes = [...currentNodes];
        
        // 1. Repulsion (Charge) - Nodes push each other away
        for (let i = 0; i < newNodes.length; i++) {
          for (let j = i + 1; j < newNodes.length; j++) {
            const nodeA = newNodes[i];
            const nodeB = newNodes[j];
            const dx = nodeB.x - nodeA.x;
            const dy = nodeB.y - nodeA.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0 && distance < 300) { // Limit repulsion distance for performance
              const force = (150 * 150) / (distance * distance) * alpha;
              const fx = (dx / distance) * force;
              const fy = (dy / distance) * force;
              
              nodeA.vx -= fx;
              nodeA.vy -= fy;
              nodeB.vx += fx;
              nodeB.vy += fy;
            }
          }
        }
        
        // 2. Attraction (Link) - Edges pull connected nodes together
        edges.forEach(edge => {
          const sourceIdx = newNodes.findIndex(n => n.id === edge.source);
          const targetIdx = newNodes.findIndex(n => n.id === edge.target);
          
          if (sourceIdx !== -1 && targetIdx !== -1) {
            const source = newNodes[sourceIdx];
            const target = newNodes[targetIdx];
            
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Ideal link distance depends on edge weight (stronger weight = closer)
            const targetDist = 100 - (edge.weight * 10);
            
            if (distance > 0) {
              const force = (distance - targetDist) * 0.05 * alpha * edge.weight;
              const fx = (dx / distance) * force;
              const fy = (dy / distance) * force;
              
              source.vx += fx;
              source.vy += fy;
              target.vx -= fx;
              target.vy -= fy;
            }
          }
        });
        
        // 3. Gravity - Pull towards center softly
        for (let i = 0; i < newNodes.length; i++) {
          const node = newNodes[i];
          node.vx += (cx - node.x) * 0.01 * alpha;
          node.vy += (cy - node.y) * 0.01 * alpha;
          
          // Apply velocity & dampen (friction)
          node.x += node.vx;
          node.y += node.vy;
          node.vx *= 0.9;
          node.vy *= 0.9;
          
          // Keep within bounds
          node.x = Math.max(50, Math.min(dimensions.width - 50, node.x));
          node.y = Math.max(50, Math.min(dimensions.height - 50, node.y));
        }
        
        return newNodes;
      });
      
      animationFrameId = requestAnimationFrame(tick);
    };
    
    animationFrameId = requestAnimationFrame(tick);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [edges, dimensions.width, dimensions.height]);

  // Pan and Zoom handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newZoom = Math.max(0.1, Math.min(4, zoom - e.deltaY * 0.001));
    setZoom(newZoom);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getNodeColor = (type: string, riskLevel?: string | null) => {
    if (type === 'accused') {
      if (riskLevel === 'critical') return '#ef4444'; // destructive
      if (riskLevel === 'high') return '#f59e0b'; // amber
      return '#3b82f6'; // blue
    }
    switch (type) {
      case 'victim': return '#10b981'; // emerald
      case 'location': return '#3b82f6'; // primary
      case 'vehicle': return '#f59e0b'; // amber
      case 'phone': return '#a855f7'; // purple
      case 'bank': return '#60a5fa'; // blue-400
      case 'fir': return '#1e293b'; // secondary
      default: return '#64748b'; // slate
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'accused':
      case 'victim': return <User size={12} className="text-white" />;
      case 'location': return <MapPin size={12} className="text-white" />;
      case 'vehicle': return <Car size={12} className="text-white" />;
      case 'phone': return <Smartphone size={12} className="text-white" />;
      case 'bank': return <Building size={12} className="text-white" />;
      case 'fir': return <FileText size={12} className="text-white" />;
      default: return <div className="w-1 h-1 bg-white rounded-full" />;
    }
  };

  // Find connected nodes if hovering
  const connectedNodes = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    const connected = new Set<string>();
    connected.add(hoveredNode);
    edges.forEach(e => {
      if (e.source === hoveredNode) connected.add(e.target);
      if (e.target === hoveredNode) connected.add(e.source);
    });
    return connected;
  }, [hoveredNode, edges]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative cursor-move"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Graph Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-background/80 backdrop-blur p-1 rounded-md border shadow-sm">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.min(4, z + 0.2))}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setZoom(1); setPan({x:0, y:0}); }}>
          <Maximize className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.max(0.1, z - 0.2))}>
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>

      <svg 
        width="100%" 
        height="100%" 
        className="absolute inset-0 pointer-events-none"
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Edges */}
          {edges.map(edge => {
            const source = nodes.find(n => n.id === edge.source);
            const target = nodes.find(n => n.id === edge.target);
            if (!source || !target) return null;
            
            const isFaded = hoveredNode && !connectedNodes.has(edge.source) && !connectedNodes.has(edge.target);
            const isHighlighted = hoveredNode && (edge.source === hoveredNode || edge.target === hoveredNode);
            
            return (
              <g key={edge.id}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                  strokeWidth={edge.weight * (isHighlighted ? 2 : 1)}
                  strokeOpacity={isFaded ? 0.1 : isHighlighted ? 0.8 : 0.4}
                />
                {isHighlighted && (
                  <text
                    x={(source.x + target.x) / 2}
                    y={(source.y + target.y) / 2 - 5}
                    textAnchor="middle"
                    fill="hsl(var(--primary))"
                    fontSize="10px"
                    fontFamily="monospace"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Nodes Rendered as HTML for better interactivity and styling */}
      <div 
        className="absolute inset-0 pointer-events-none origin-top-left"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
      >
        {nodes.map(node => {
          const isFaded = hoveredNode && !connectedNodes.has(node.id);
          const isCentral = node.id === data.stats?.centralNode;
          const radius = isCentral ? 24 : node.type === 'fir' ? 16 : 20;
          
          return (
            <div
              key={node.id}
              className="absolute flex flex-col items-center pointer-events-auto transition-opacity duration-300"
              style={{
                left: node.x,
                top: node.y,
                transform: 'translate(-50%, -50%)',
                opacity: isFaded ? 0.2 : 1,
                zIndex: hoveredNode === node.id ? 50 : isCentral ? 40 : 10
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {isCentral && (
                <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-destructive transform scale-150 pointer-events-none" />
              )}
              
              <div 
                className="rounded-full shadow-lg flex items-center justify-center border-2 border-background/50 hover:border-white transition-all cursor-pointer"
                style={{
                  width: radius * 2,
                  height: radius * 2,
                  backgroundColor: getNodeColor(node.type, node.riskLevel)
                }}
              >
                {getNodeIcon(node.type)}
              </div>
              
              <div 
                className={`mt-1 font-mono text-[10px] px-1.5 py-0.5 rounded backdrop-blur ${
                  hoveredNode === node.id ? 'bg-primary text-primary-foreground font-bold' : 'bg-background/80 text-foreground border border-border'
                } whitespace-nowrap`}
              >
                {node.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
