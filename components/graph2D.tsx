import React, { useState, useEffect, useRef, SetStateAction } from "react";

import ForceGraph2D, { LinkObject, NodeObject } from "react-force-graph-2d";
import type { ForceGraphMethods, GraphData } from "react-force-graph-2d";

import { joyoList } from "../data/joyo";
import { jinmeiyoList } from "../data/jinmeiyo";

import SpriteText from "three-spritetext";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";

type KanjiInfo = {
  id: string;
  kanjialiveData?: any;
  jishoData?: any;
};

interface Props {
  kanjiInfo: KanjiInfo;
  graphData: any;
}

const Graph2D: React.FC<Props> = ({ kanjiInfo, graphData }) => {
  const fgRef: React.MutableRefObject<ForceGraphMethods | undefined> = useRef();

  const router = useRouter();

  const [data, setData] = useState<GraphData>({
    nodes: [],
    links: [],
  });

  useEffect(() => {
    setData(graphData.withOutLinks as unknown as GraphData);
  }, []);

  const handleClick = (node: NodeObject) => {
    router.push(`/kanji/${node.id}`);
  };

  // prefetch routes for nodes visible in the graph
  useEffect(() => {
    data?.nodes?.forEach((node) => {
      router.prefetch(`/kanji/${node.id}`);
    });
  }, [data, router]);

  // store the hovered node in a state
  const [hoverNode, setHoverNode] = useState<NodeObject | null>(null);

  // store global scale for arrow length
  const [scale, setScale] = useState(1);

  const handleNodeHover = (node: NodeObject | null) => {
    setHoverNode(node || null);
    // paintNode(node);
  };

  const paintNode = (
    node: NodeObject,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) => {
    // console.log(`hovernode: ${hoverNode?.id}`);
    const label = String(node.id);
    const fontSize = 10;
    // const fontSize = 24 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2); // some padding

    let color;
    // if it is he main node
    if (node.id === kanjiInfo.id) {
      color = "#2B99CF";
    } else if (joyoList?.includes(String(node.id))) {
      color = "#80c2e2";
    } else if (jinmeiyoList?.includes(String(node.id))) {
      color = "#d5ebf5";
    } else {
      color = "#fff";
    }

    if (node.id === hoverNode?.id) {
      color = "#2B99CF";
    }

    const radius = (bckgDimensions[1] / 2) * 1.5;

    ctx.beginPath();
    node.x &&
      node.y &&
      ctx.arc(node.x, node.y, radius * 1.1, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#000000";
    ctx.fill();

    ctx.beginPath();
    node.x && node.y && ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    node.x && node.y && ctx.fillText(label, node.x, node.y);

    // node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
  };

  // FOCUS  ON MAIN NODE AT START
  useEffect(() => {
    const focusMain = setTimeout(() => {
      if (kanjiInfo.id && data?.nodes?.length > 0) {
        fgRef?.current?.zoomToFit(1000, 100);
      }
    }, 100);
    return () => clearTimeout(focusMain);
  }, [data, kanjiInfo.id]);

  return (
    <ForceGraph2D
      width={500}
      height={500}
      backgroundColor={"var(--color-background)"}
      graphData={data}
      // nodeLabel="id"
      // ARROWS

      // linkColor={"var(--color-foreground)"}
      ref={fgRef}
      warmupTicks={10}
      onNodeClick={handleClick}
      nodeCanvasObject={paintNode}
      nodePointerAreaPaint={(node, color, ctx, globalScale) => {
        const label = String(node.id);
        // const fontSize = 24 / globalScale;
        const fontSize = 10;
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(
          (n) => n + fontSize * 0.2
        ); // some padding
        // const bckgDimensions = node.__bckgDimensions;
        const radius = (bckgDimensions[1] / 2) * 1.5;

        ctx.beginPath();
        node.x &&
          node.y &&
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
      }}
      onNodeHover={(node) => handleNodeHover(node)}
      linkColor={() =>
        getComputedStyle(document?.body)?.getPropertyValue("--color-foreground")
      }
      linkDirectionalArrowLength={4}
      // linkDirectionalArrowRelPos={0.82}
      // linkDirectionalArrowResolution={32}
      //PARTICLES
      linkDirectionalParticles={3}
      linkDirectionalParticleSpeed={0.008}
      linkDirectionalParticleWidth={2}
      // onRenderFramePre={(_, globalScale) => console.log(globalScale)}
      // onZoom={(e) => {
      //   console.log(e.k);

      //   setScale(e.k);
      // }}
    />
  );
};

export default Graph2D;