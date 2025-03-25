import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Types
type Message = {
  sender_type: 'student' | 'ai' | string;
  content: string;
};

type Persona = {
  name: string;
  background: string;
  expertise: string;
  personality: string;
  conversation_style: string;
  knowledge_domains: string;
};

type Criterion = {
  id: number;
  name: string;
  description: string;
  weight: number;
};

type Evaluation = {
  criteria_id: number;
  score: number;
  feedback: string;
};

export async function generatePersonaResponse(persona: Persona, messages: Message[]): Promise<string> {
  try {
    const formattedMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are ${persona.name}, ${persona.background}. 
        Your expertise is in ${persona.expertise}. 
        Your personality is ${persona.personality}. 
        Your conversation style is ${persona.conversation_style}.
        You are knowledgeable about ${persona.knowledge_domains}.
        Respond as this persona would in a training scenario.`
      },
      ...messages.map(msg => ({
        role: (msg.sender_type === 'student' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.content,
        name: msg.sender_type === 'student' ? 'student' : 'ai'
      }))
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: formattedMessages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating persona response:', error);
    throw new Error('Failed to generate response from the persona');
  }
}

export async function evaluateStudentMessage(
  persona: Persona,
  messages: Message[],
  criteria: Criterion[],
  studentMessage: string
): Promise<Evaluation[]> {
  try {
    const conversationContext = messages
      .map(msg => `${msg.sender_type === 'student' ? 'Student' : persona.name}: ${msg.content}`)
      .join('\n');

    const evaluations = await Promise.all(criteria.map(async (criterion) => {
      const prompt = `
        You are evaluating a student's response in a training session with ${persona.name}, who is ${persona.background}.
        
        Conversation context:
        ${conversationContext}
        
        Student's message to evaluate:
        "${studentMessage}"
        
        Evaluation criterion: ${criterion.name}
        Description: ${criterion.description}
        
        Please evaluate the student's message on a scale of 0–5 for this criterion.

        Format your response as:
        Score: [numeric score]
        Feedback: [detailed feedback]
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.3,
      });

      const response = completion.choices[0].message.content || '';

      const scoreMatch = response.match(/Score:\s*(\d+(\.\d+)?)/i);
      const feedbackMatch = response.match(/Feedback:\s*([\s\S]+)/i);

      const score = scoreMatch ? parseFloat(scoreMatch[1]) : 0;
      const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'No feedback provided';

      return {
        criteria_id: criterion.id,
        score,
        feedback
      };
    }));

    return evaluations;
  } catch (error) {
    console.error('Error evaluating student message:', error);
    throw new Error('Failed to evaluate student message');
  }
}

export async function generatePerformanceSummary(
  persona: Persona,
  evaluations: Evaluation[],
  criteria: Criterion[]
): Promise<{
  overall_score: number;
  strengths: string;
  areas_for_improvement: string;
  recommendations: string;
}> {
  try {
    const evaluationsByCriteria: Record<string, Evaluation[]> = {};
    criteria.forEach(criterion => {
      evaluationsByCriteria[criterion.name] = evaluations
      .filter(e => e.criteria_id === criterion.id);
    });

    let totalWeightedScore = 0;
    let totalWeight = 0;

    criteria.forEach(criterion => {
      const criterionEvals = evaluationsByCriteria[criterion.name];
      if (criterionEvals?.length) {
        const avgScore = criterionEvals.reduce((sum, e) => sum + e.score, 0) / criterionEvals.length;
        totalWeightedScore += avgScore * criterion.weight;
        totalWeight += criterion.weight;
      }
    });

    const overallScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

    const evaluationSummary = criteria.map(criterion => {
      const criterionEvals = evaluationsByCriteria[criterion.name];
      if (criterionEvals?.length) {
        const avgScore = criterionEvals.reduce((sum, e) => sum + e.score, 0) / criterionEvals.length;
        return `${criterion.name} (Weight: ${criterion.weight}): Average Score ${avgScore.toFixed(1)}/5
        - ${criterionEvals.map(e => e.feedback).join('\n        - ')}`;
      }
      return `${criterion.name}: No evaluations`;
    }).join('\n\n');

    const prompt = `
      You are analyzing the performance of a student in a training session with ${persona.name}, who is ${persona.background}.
      
      Overall Score: ${overallScore.toFixed(2)}/5
      
      Detailed Evaluations:
      ${evaluationSummary}
      
      Based on these evaluations, provide:
      1. A summary of the student's strengths (3-5 points)
      2. Areas for improvement (3-5 points)
      3. Specific recommendations for future practice
      
      Format your response as:
      Strengths: [bullet points]
      Areas for Improvement: [bullet points]
      Recommendations: [paragraph]
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.5,
    });

    const response = completion.choices[0].message.content || '';

    const strengthsMatch = response.match(/Strengths:\s*([\s\S]+?)(?=Areas for Improvement:|$)/i);
    const areasMatch = response.match(/Areas for Improvement:\s*([\s\S]+?)(?=Recommendations:|$)/i);
    const recommendationsMatch = response.match(/Recommendations:\s*([\s\S]+)/i);

    return {
      overall_score: overallScore,
      strengths: strengthsMatch?.[1].trim() || 'No strengths identified',
      areas_for_improvement: areasMatch?.[1].trim() || 'No areas for improvement identified',
      recommendations: recommendationsMatch?.[1].trim() || 'No recommendations provided'
    };
  } catch (error) {
    console.error('Error generating performance summary:', error);
    throw new Error('Failed to generate performance summary');
  }
}