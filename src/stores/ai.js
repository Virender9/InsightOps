import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAIStore = defineStore('ai', () => {
  const summaries = ref([])
  const isGenerating = ref(false)
  const currentAnalysis = ref(null)
  const analysisHistory = ref([])
  const error = ref(null)
  const usage = ref({
    tokensUsed: 0,
    requestsToday: 0,
    costToday: 0
  })

  // API configuration
  const API_BASE_URL = 'http://localhost:4000' // Mock API
  // TODO: Replace with Azure OpenAI endpoint
  // const AZURE_OPENAI_ENDPOINT = process.env.VUE_APP_AZURE_OPENAI_ENDPOINT
  // const AZURE_OPENAI_KEY = process.env.VUE_APP_AZURE_OPENAI_KEY
  // const OPENAI_API_KEY = process.env.VUE_APP_OPENAI_API_KEY

  // LLM model configuration
  const modelConfig = ref({
    model: 'gpt-4-turbo',
    temperature: 0.3,
    maxTokens: 1000,
    topP: 0.9,
    frequencyPenalty: 0.1,
    presencePenalty: 0.1
  })

  // Computed properties
  const recentSummaries = computed(() => 
    summaries.value.slice(-10).reverse()
  )

  const summariesByModel = computed(() => {
    const grouped = {}
    summaries.value.forEach(summary => {
      if (!grouped[summary.model]) {
        grouped[summary.model] = []
      }
      grouped[summary.model].push(summary)
    })
    return grouped
  })

  const averageConfidence = computed(() => {
    if (summaries.value.length === 0) return 0
    const totalConfidence = summaries.value.reduce((sum, s) => sum + (s.confidence || 0.8), 0)
    return totalConfidence / summaries.value.length
  })

  // Actions
  const fetchAISummaries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/aiSummaries`)
      summaries.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch AI summaries: ' + err.message
      console.error('Error fetching AI summaries:', err)
    }
  }

  // Azure OpenAI Integration
  const generateWithAzureOpenAI = async (prompt, context = {}) => {
    try {
      /* TODO: Implement Azure OpenAI integration
      const response = await axios.post(
        `${AZURE_OPENAI_ENDPOINT}/openai/deployments/gpt-4-turbo/chat/completions?api-version=2023-12-01-preview`,
        {
          messages: [
            {
              role: 'system',
              content: 'You are an expert in IT operations and root cause analysis. Provide clear, actionable insights based on the data provided.'
            },
            {
              role: 'user', 
              content: prompt
            }
          ],
          temperature: modelConfig.value.temperature,
          max_tokens: modelConfig.value.maxTokens,
          top_p: modelConfig.value.topP,
          frequency_penalty: modelConfig.value.frequencyPenalty,
          presence_penalty: modelConfig.value.presencePenalty
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': AZURE_OPENAI_KEY
          }
        }
      )
      
      // Track usage
      usage.value.tokensUsed += response.data.usage.total_tokens
      usage.value.requestsToday += 1
      usage.value.costToday += calculateCost(response.data.usage.total_tokens)
      
      return {
        content: response.data.choices[0].message.content,
        tokens: response.data.usage.total_tokens,
        model: response.data.model,
        finishReason: response.data.choices[0].finish_reason
      }
      */
      
      // Mock response for development
      return generateMockAIResponse(prompt, context)
    } catch (err) {
      console.error('Azure OpenAI API error:', err)
      throw new Error('Failed to generate AI response: ' + err.message)
    }
  }

  // OpenAI Direct Integration (alternative)
  const generateWithOpenAI = async (prompt, context = {}) => {
    try {
      /* TODO: Implement direct OpenAI integration
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: modelConfig.value.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert in IT operations and root cause analysis. Analyze the provided data and generate actionable insights.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: modelConfig.value.temperature,
          max_tokens: modelConfig.value.maxTokens
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      return {
        content: response.data.choices[0].message.content,
        tokens: response.data.usage.total_tokens,
        model: response.data.model
      }
      */
      
      // Mock response for development
      return generateMockAIResponse(prompt, context)
    } catch (err) {
      console.error('OpenAI API error:', err)
      throw new Error('Failed to generate AI response: ' + err.message)
    }
  }

  const generateMockAIResponse = (prompt, context) => {
    // Simulate processing time
    const processingTime = 1500 + Math.random() * 1000
    
    return new Promise(resolve => {
      setTimeout(() => {
        const responses = {
          rca: {
            content: `Based on the analysis of the incident data, I've identified several key factors:\n\n**Root Cause Analysis:**\n- Memory leak in the application thread pool management system\n- Gradual resource exhaustion leading to cascading failures\n- Configuration drift in connection pool settings\n\n**Key Contributing Factors:**\n1. Recent deployment introduced inefficient connection handling\n2. Increased traffic volume exceeded capacity planning assumptions\n3. Monitoring thresholds were not adjusted for new baseline\n\n**Recommendations:**\n1. Immediate: Rollback to previous stable version\n2. Short-term: Implement connection pool monitoring\n3. Long-term: Enhance capacity planning and testing procedures\n\nConfidence level: 89% based on correlation with historical patterns and log analysis.`,
            tokens: 342,
            model: 'gpt-4-turbo'
          },
          summary: {
            content: `**Incident Summary:**\nHigh CPU usage detected on WebServer-03 resulted from memory leak in application thread pool. The incident began at 22:00 with gradual memory consumption increase, escalating to critical levels by 22:25.\n\n**Impact Assessment:**\n- Service degradation affecting 15% of users\n- Response time increased by 300%\n- No data loss or security concerns\n\n**Resolution Actions:**\n- Emergency rollback executed\n- Additional monitoring implemented\n- Post-incident review scheduled`,
            tokens: 278,
            model: 'gpt-4-turbo'
          },
          temperature: {
            content: `**Temperature Anomaly Analysis:**\nFridgeUnit-01 temperature anomaly shows characteristics of cooling system degradation:\n\n**Environmental Factors:**\n- Recent power fluctuations in Server Room A\n- Delayed HVAC maintenance (overdue by 2 weeks)\n- Increased ambient temperature due to additional server deployment\n\n**Sensor Validation:**\nCross-reference with adjacent units confirms sensor accuracy. Temperature gradient analysis suggests localized cooling issue rather than sensor malfunction.\n\n**Immediate Actions Required:**\n1. Physical inspection of cooling system components\n2. Verify power supply stability\n3. Schedule emergency HVAC maintenance\n4. Consider temporary load redistribution`,
            tokens: 298,
            model: 'gpt-4-turbo'
          }
        }
        
        // Determine response type based on prompt content
        let responseType = 'summary'
        if (prompt.toLowerCase().includes('temperature') || prompt.toLowerCase().includes('fridge')) {
          responseType = 'temperature'
        } else if (prompt.toLowerCase().includes('root cause') || prompt.toLowerCase().includes('rca')) {
          responseType = 'rca'
        }
        
        resolve(responses[responseType])
      }, processingTime)
    })
  }

  // RCA Summary Generation
  const generateRCASummary = async (rcaData) => {
    isGenerating.value = true
    error.value = null
    
    try {
      const prompt = `
Analyze the following root cause analysis data and provide a comprehensive summary:

Incident: ${rcaData.title}
Root Cause: ${rcaData.rootCause}
Confidence: ${rcaData.confidence}
Timeline: ${JSON.stringify(rcaData.timeline, null, 2)}
Correlated Events: ${rcaData.correlatedEvents.join(', ')}
Recommendations: ${rcaData.recommendations.join(', ')}

Provide a detailed analysis including:
1. Executive summary
2. Technical deep-dive
3. Business impact assessment
4. Preventive measures
5. Lessons learned
`
      
      const aiResponse = await generateWithAzureOpenAI(prompt, { type: 'rca', data: rcaData })
      
      const summary = {
        id: `ai_${Date.now()}`,
        rcaFlowId: rcaData.id,
        summary: aiResponse.content,
        keyInsights: extractKeyInsights(aiResponse.content),
        severity: determineSeverity(rcaData),
        generatedAt: new Date().toISOString(),
        model: aiResponse.model,
        tokens: aiResponse.tokens,
        confidence: rcaData.confidence
      }
      
      summaries.value.push(summary)
      currentAnalysis.value = summary
      
      return summary
    } catch (err) {
      error.value = 'Failed to generate RCA summary: ' + err.message
      throw err
    } finally {
      isGenerating.value = false
    }
  }

  // Incident Analysis
  const analyzeIncident = async (incidentData, contextData = {}) => {
    isGenerating.value = true
    
    try {
      const prompt = `
Analyze this incident and provide actionable insights:

Incident: ${incidentData.title}
Category: ${incidentData.category}
Priority: ${incidentData.priority}
Description: ${incidentData.description}
Metrics: ${JSON.stringify(contextData.metrics, null, 2)}
Recent Changes: ${JSON.stringify(contextData.recentChanges, null, 2)}

Provide:
1. Likely root causes (ranked by probability)
2. Immediate action items
3. Risk assessment
4. Similar incident patterns
`
      
      const aiResponse = await generateWithOpenAI(prompt, { type: 'incident', data: incidentData })
      
      const analysis = {
        id: `analysis_${Date.now()}`,
        incidentId: incidentData.id,
        insights: aiResponse.content,
        confidence: 0.8 + Math.random() * 0.2,
        recommendations: extractRecommendations(aiResponse.content),
        timestamp: new Date().toISOString(),
        model: aiResponse.model,
        tokens: aiResponse.tokens
      }
      
      analysisHistory.value.push(analysis)
      currentAnalysis.value = analysis
      
      return analysis
    } catch (err) {
      error.value = 'Failed to analyze incident: ' + err.message
      throw err
    } finally {
      isGenerating.value = false
    }
  }

  // Predictive Analysis
  const generatePredictiveInsights = async (trendData) => {
    try {
      const prompt = `
Analyze these system trends and predict potential issues:

Trend Data: ${JSON.stringify(trendData, null, 2)}

Predict:
1. Potential failure modes
2. Timeline for intervention
3. Preventive actions
4. Resource requirements
`
      
      const aiResponse = await generateWithAzureOpenAI(prompt, { type: 'predictive', data: trendData })
      
      return {
        predictions: aiResponse.content,
        confidence: 0.7 + Math.random() * 0.2,
        generatedAt: new Date().toISOString(),
        model: aiResponse.model,
        tokens: aiResponse.tokens
      }
    } catch (err) {
      console.error('Predictive analysis failed:', err)
      throw err
    }
  }

  // Utility functions
  const extractKeyInsights = (content) => {
    // Simple extraction logic - in real implementation, use NLP
    const insights = []
    const lines = content.split('\n')
    
    lines.forEach(line => {
      if (line.includes('*') || line.includes('-') || line.includes('•')) {
        const insight = line.replace(/[*\-•]/g, '').trim()
        if (insight.length > 20) {
          insights.push(insight)
        }
      }
    })
    
    return insights.slice(0, 5) // Return top 5 insights
  }

  const extractRecommendations = (content) => {
    const recommendations = []
    const lines = content.split('\n')
    
    let inRecommendationSection = false
    lines.forEach(line => {
      if (line.toLowerCase().includes('recommend') || line.toLowerCase().includes('action')) {
        inRecommendationSection = true
      }
      
      if (inRecommendationSection && (line.includes('-') || line.includes('•'))) {
        const rec = line.replace(/[\-•]/g, '').trim()
        if (rec.length > 10) {
          recommendations.push(rec)
        }
      }
    })
    
    return recommendations.slice(0, 10)
  }

  const determineSeverity = (rcaData) => {
    if (rcaData.confidence > 0.9) return 'high'
    if (rcaData.confidence > 0.7) return 'medium'
    return 'low'
  }

  const calculateCost = (tokens) => {
    // GPT-4-turbo pricing: $0.01 per 1K input tokens, $0.03 per 1K output tokens
    // Simplified calculation assuming 70% input, 30% output
    const inputTokens = tokens * 0.7
    const outputTokens = tokens * 0.3
    return (inputTokens / 1000 * 0.01) + (outputTokens / 1000 * 0.03)
  }

  // Configuration management
  const updateModelConfig = (newConfig) => {
    modelConfig.value = { ...modelConfig.value, ...newConfig }
  }

  const resetUsage = () => {
    usage.value = {
      tokensUsed: 0,
      requestsToday: 0,
      costToday: 0
    }
  }

  // Batch processing
  const batchAnalyze = async (items, analysisType = 'incident') => {
    const results = []
    
    for (const item of items) {
      try {
        let result
        switch (analysisType) {
          case 'rca':
            result = await generateRCASummary(item)
            break
          case 'incident':
            result = await analyzeIncident(item)
            break
          default:
            result = await analyzeIncident(item)
        }
        results.push(result)
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (err) {
        console.error(`Batch analysis failed for item ${item.id}:`, err)
        results.push({ id: item.id, error: err.message })
      }
    }
    
    return results
  }

  // Export functionality
  const exportAnalyses = (format = 'json') => {
    const exportData = {
      exported_at: new Date().toISOString(),
      total_summaries: summaries.value.length,
      total_analyses: analysisHistory.value.length,
      usage_stats: usage.value,
      model_config: modelConfig.value,
      summaries: summaries.value,
      analyses: analysisHistory.value
    }
    
    if (format === 'csv') {
      // Convert to CSV format for summaries
      const csvHeaders = 'timestamp,type,model,tokens,confidence,summary\n'
      const csvData = summaries.value.map(s => 
        `${s.generatedAt},summary,${s.model},${s.tokens},${s.confidence || 0.8},"${s.summary.replace(/"/g, '""')}"`
      ).join('\n')
      
      return csvHeaders + csvData
    }
    
    return JSON.stringify(exportData, null, 2)
  }

  const clearHistory = () => {
    analysisHistory.value = []
    currentAnalysis.value = null
  }

  // Additional getters for AIOperationalIntelligence component
  const getAverageConfidence = () => {
    return Math.round(averageConfidence.value * 100)
  }

  const getActiveRecommendations = () => {
    // Mock active recommendations
    return [
      { id: 1, title: 'Scale Database Server', priority: 'high', confidence: 89 },
      { id: 2, title: 'Restart Application Service', priority: 'medium', confidence: 76 },
      { id: 3, title: 'Update Firewall Rules', priority: 'critical', confidence: 95 }
    ]
  }

  const getPredictiveAlerts = () => {
    // Mock predictive alerts
    return [
      { id: 1, message: 'Database connection pool exhaustion predicted in 4-6 hours', probability: 78 },
      { id: 2, message: 'Disk space critical on log server in 2-3 hours', probability: 92 },
      { id: 3, message: 'SSL certificate expiration in 18 hours', probability: 100 }
    ]
  }

  const getRecentActivities = () => {
    // Mock recent AI activities
    return [
      { id: 1, type: 'anomaly', message: 'Anomaly detected in CPU usage pattern', timestamp: Date.now() - 300000 },
      { id: 2, type: 'recommendation', message: 'Generated recommendation for memory optimization', timestamp: Date.now() - 600000 },
      { id: 3, type: 'prediction', message: 'Predicted disk space issue on server-01', timestamp: Date.now() - 900000 },
      { id: 4, type: 'rca', message: 'Completed RCA analysis for incident #INC-2024-001', timestamp: Date.now() - 1200000 }
    ]
  }

  const startAIEngine = () => {
    console.log('🤖 AI Engine started')
    // Mock function - would initialize AI processing in real implementation
    return Promise.resolve()
  }

  const stopAIEngine = () => {
    console.log('🤖 AI Engine stopped')
    // Mock function - would stop AI processing in real implementation
    return Promise.resolve()
  }

  return {
    // State
    summaries,
    isGenerating,
    currentAnalysis,
    analysisHistory,
    error,
    usage,
    modelConfig,
    
    // Computed
    recentSummaries,
    summariesByModel,
    averageConfidence,
    
    // Getters
    getAverageConfidence,
    getActiveRecommendations,
    getPredictiveAlerts,
    getRecentActivities,
    
    // Actions
    startAIEngine,
    stopAIEngine,
    fetchAISummaries,
    generateRCASummary,
    analyzeIncident,
    generatePredictiveInsights,
    batchAnalyze,
    updateModelConfig,
    resetUsage,
    exportAnalyses,
    clearHistory
  }
})
