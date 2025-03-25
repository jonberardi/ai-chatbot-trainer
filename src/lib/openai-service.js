import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a response from a persona based on conversation history
 * @param {Object} persona - The persona object
 * @param {Array} messages - Array of previous messages
 * @returns {Promise<string>} - The generated response
 */
export async function generatePersonaResponse(persona, messages) {
  try {
    // Format the conversation history for the API
    const formattedMessages = [
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
        role: msg.sender_type === 'student' ? 'user' : 'assistant',
        content: msg.content
      }))
    ];

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: formattedMessages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating persona response:', error);
    throw new Error('Failed to generate response from the persona');
  }
}

/**
 * Evaluate a student message based on criteria
 * @param {Object} persona - The persona object
 * @param {Array} messages - Array of previous messages
 * @param {Array} criteria - Array of evaluation criteria
 * @param {string} studentMessage - The message to evaluate
 * @returns {Promise<Array>} - Array of evaluations
 */
export async function evaluateStudentMessage(persona, messages, criteria, studentMessage) {
  try {
    // Format the conversation context
    const conversationContext = messages.map(msg => 
      `${msg.sender_type === 'student' ? 'Student' : persona.name}: ${msg.content}`
    ).join('\n');

    // Create prompts for each criterion
    const evaluations = await Promise.all(criteria.map(async (criterion) => {
      const prompt = `
        You are evaluating a student's response in a training session with ${persona.name}, who is ${persona.background}.
        
        Conversation context:
        ${conversationContext}
        
        Student's message to evaluate:
        "${studentMessage}"
        
        Evaluation criterion: ${criterion.name}
        Description: ${criterion.description}
        
        Please evaluate the student's message on a scale of 0-5 for this criterion, where:
        0-1: Unsatisfactory
        2: Needs improvement
        3: Satisfactory
        4: Good
        5: Excellent
        
        Provide a score and detailed feedback explaining the evaluation.
        
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

      const response = completion.choices[0].message.content;
      
      // Extract score and feedback
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

/**
 * Generate a performance summary based on evaluations
 * @param {Object} persona - The persona object
 * @param {Array} evaluations - Array of evaluations
 * @param {Array} criteria - Array of evaluation criteria
 * @returns {Promise<Object>} - Performance summary
 */
export async function generatePerformanceSummary(persona, evaluations, criteria) {
  try {
    // Group evaluations by criteria
    const evaluationsByCriteria = {};
    criteria.forEach(criterion => {
      evaluationsByCriteria[criterion.name] = evaluations
        .filter(eval => eval.criteria_id === criterion.id)
        .map(eval => ({
          score: eval.score,
          feedback: eval.feedback
        }));
    });

    // Calculate overall score
    let totalWeightedScore = 0;
    let totalWeight = 0;

    criteria.forEach(criterion => {
      const criterionEvals = evaluationsByCriteria[criterion.name];
      if (criterionEvals && criterionEvals.length > 0) {
        const avgScore = criterionEvals.reduce((sum, eval) => sum + eval.score, 0) / criterionEvals.length;
        totalWeightedScore += avgScore * criterion.weight;
        totalWeight += criterion.weight;
      }
    });

    const overallScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

    // Format the evaluation data for the summary prompt
    const evaluationSummary = criteria.map(criterion => {
      const criterionEvals = evaluationsByCriteria[criterion.name];
      if (criterionEvals && criterionEvals.length > 0) {
        const avgScore = criterionEvals.reduce((sum, eval) => sum + eval.score, 0) / criterionEvals.length;
        return `${criterion.name} (Weight: ${criterion.weight}): Average Score ${avgScore.toFixed(1)}/5
        - ${criterionEvals.map(eval => eval.feedback).join('\n        - ')}`;
      }
      return `${criterion.name}: No evaluations`;
    }).join('\n\n');

    // Generate the performance summary
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

    const response = completion.choices[0].message.content;
    
    // Extract strengths and areas for improvement
    const strengthsMatch = response.match(/Strengths:\s*([\s\S]+?)(?=Areas for Improvement:|$)/i);
    const areasMatch = response.match(/Areas for Improvement:\s*([\s\S]+?)(?=Recommendations:|$)/i);
    const recommendationsMatch = response.match(/Recommendations:\s*([\s\S]+)/i);
    
    const strengths = strengthsMatch ? strengthsMatch[1].trim() : 'No strengths identified';
    const areasForImprovement = areasMatch ? areasMatch[1].trim() : 'No areas for improvement identified';
    const recommendations = recommendationsMatch ? recommendationsMatch[1].trim() : 'No recommendations provided';

    return {
      overall_score: overallScore,
      strengths,
      areas_for_improvement: areasForImprovement,
      recommendations
    };
  } catch (error) {
    console.error('Error generating performance summary:', error);
    throw new Error('Failed to generate performance summary');
  }
}
