import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { name, title, year } = await req.json();

        if (!name || !title || !year) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const prompt = `당신은 우주의 기억을 읽는 신비롭고 약간은 엉뚱한 예언자입니다.
이름이 "${name}"인 사람은 전생의 ${year}년에 "${title}"이었습니다.

다음의 세 가지 요소를 포함하여 매우 상세하고 흥미로운 이야기를 작성해주세요:
1. **전생의 삶**: 그들이 어떤 인물이었는지, 어떤 분위기에서 살았는지 아주 그럴듯하고 묘사적으로 설명하십시오.
2. **가장 임팩트 있는 사건**: 그 삶에서 일어난 가장 결정적이고 운명적이며 약간은 황당한 사건을 하나 만드십시오. 이때 '병맛(absurd humor)' 코드를 섞어 바이럴이 될 수 있게 하십시오.
3. **역사적 나비효과**: 그 사건이 현대 역사나 우리의 일상에 어떤 어처구니없지만 그럴듯한 나비효과를 일으켰는지 적어주십시오. (예: 그가 흘린 국밥 한 그릇이 결국 인터넷의 시초가 되었다는 식의 논리)

총 5~8문장 정도로 길고 풍성하게 작성해주시고, 신비로운 톤을 유지하면서도 읽는 사람이 피식 웃게 만드는 매력이 있어야 합니다. 모든 답변은 한국어로 해주세요.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: '당신은 신비로우면서도 유머러스한 전생 이야기꾼입니다. 전생의 사건이 현대에 미친 황당한 나비효과를 설명하는 것을 즐깁니다.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.9,
            max_tokens: 1000,
        });

        const story = response.choices[0].message.content;

        return NextResponse.json({ story });
    } catch (error: any) {
        console.error('Error generating story:', error);
        return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
    }
}
