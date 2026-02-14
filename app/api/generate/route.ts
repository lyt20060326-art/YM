export const runtime = 'edge';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    const headers = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    };

    // 1. 提交绘图任务
    const submitRes = await fetch("https://api.apimart.ai/v1/images/generations", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        model: "gemini-3-pro-image-preview",
        prompt: prompt,
        size: "1:1",
        n: 1,
        resolution: "2K"
      })
    });

    const submitData = await submitRes.json();
    const taskId = submitData.data?.[0]?.task_id;

    if (taskId) {
      console.log(`🚀 任务提交成功，ID: ${taskId}`);

      // 2. 自动轮询查询（共尝试 12 次，每次间隔 5 秒，总计一分钟）
      for (let i = 0; i < 12; i++) {
        await new Promise(resolve => setTimeout(resolve, 5000));

        const checkRes = await fetch(`https://api.apimart.ai/v1/tasks/${taskId}`, { headers });
        const checkData = await checkRes.json();
        
        // 打印状态辅助调试
        const currentStatus = checkData.status || (checkData.data && checkData.data.status);
        console.log(`🔄 第 ${i + 1} 次尝试取图，状态: ${currentStatus}`);

        // 3. 【终极路径提取】精准刺穿截图中的嵌套结构
        // 这里的路径必须完整：checkData.data.result.images[0].url[0]
        const finalUrl = checkData.data?.result?.images?.[0]?.url?.[0] || 
                         checkData.result?.images?.[0]?.url?.[0];

        if (finalUrl && typeof finalUrl === 'string' && finalUrl.startsWith('http')) {
          console.log('✅ 成功抓取到地址:', finalUrl);
          return NextResponse.json({ url: finalUrl });
        }

        // 如果状态显示失败则停止
        if (currentStatus === 'failed') break;
      }
      return NextResponse.json({ error: "AI 画得太慢了，请重新尝试" }, { status: 504 });
    }

    return NextResponse.json({ error: "任务启动失败" }, { status: 500 });

  } catch (error) {
    return NextResponse.json({ error: "网络连接故障" }, { status: 500 });
  }
}