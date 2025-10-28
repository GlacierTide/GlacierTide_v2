import React, { useState, useRef, useEffect } from 'react'; // Ensure React is imported for JSX support
import { MessageCircle, X, Send, Loader2, Bot, User, RefreshCw } from 'lucide-react';

const SeaLevelAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    checkAgentStatus();
    loadSuggestions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkAgentStatus = async () => {
    try {
      const response = await fetch('/api/agent/status');
      const data = await response.json();
      setAgentStatus(data);
      
      if (data.agent_available) {
        setMessages([{
          type: 'agent',
          content: `Hi! I'm your sea level analysis assistant. I can help you understand sea level predictions and their impacts.

Available Seas: ${data.supported_seas.join(', ')}

Try asking:
• "What's the sea level prediction for Philippine Sea in 2030?"
• "Compare Arabian Sea and Caribbean Sea"
• "What about 2040 for the same sea?" (I remember context!)`,
          timestamp: new Date()
        }]);
      } else {
        setMessages([{
          type: 'agent',
          content: 'Sorry, I\'m currently unavailable. Please try again later.',
          timestamp: new Date(),
          isError: true
        }]);
      }
    } catch (error) {
      console.error('Failed to check agent status:', error);
      setMessages([{
        type: 'agent',
        content: 'Unable to connect. Please check your connection.',
        timestamp: new Date(),
        isError: true
      }]);
    }
  };

  const loadSuggestions = async () => {
    try {
      const response = await fetch('/api/agent/suggestions');
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !agentStatus?.agent_available) return;

    const userMessage = {
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/agent/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: currentInput }),
      });

      const data = await response.json();

      if (response.ok) {
        const agentMessage = {
          type: 'agent',
          content: data.response || 'I received your message but couldn\'t generate a response.',
          timestamp: new Date(),
          status: data.status,
          // FIXED: More flexible enhanced detection
          isEnhanced: data.response.includes('━━━') || data.response.includes('🎯 RISK ASSESSMENT')
        };
        setMessages(prev => [...prev, agentMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        type: 'agent',
        content: 'I\'m having trouble right now. Please try again or rephrase your question.',
        timestamp: new Date(),
        status: 'error',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const useSuggestion = (suggestion) => {
    setInputValue(suggestion);
  };

  const clearChat = () => {
    checkAgentStatus();
  };

  const formatMessage = (content, message) => {
    // FIXED: Handle enhanced responses
    if (message.isEnhanced) {
      return <FixedEnhancedFormatter content={content} />;
    }

    // Handle error messages
    if (message.isError) {
      return <div className="text-red-600">{content}</div>;
    }

    // Handle JSON responses
    if (content.includes('{') && content.includes('}')) {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[0]);
          const beforeJson = content.substring(0, content.indexOf(jsonMatch[0]));
          const afterJson = content.substring(content.indexOf(jsonMatch[0]) + jsonMatch[0].length);
          
          return (
            <div className="space-y-3">
              {beforeJson && <div className="text-gray-700 leading-relaxed">{beforeJson}</div>}
              <div className="bg-slate-50 p-3 rounded border text-sm">
                <div className="text-xs text-slate-600 mb-2">📊 Technical Data</div>
                <pre className="text-xs text-slate-700 whitespace-pre-wrap">
                  {JSON.stringify(jsonData, null, 2)}
                </pre>
              </div>
              {afterJson && <div className="text-gray-700 leading-relaxed">{afterJson}</div>}
            </div>
          );
        }
      } catch (e) {
        // Fall through to regular formatting
      }
    }
    
    // Regular content formatting
    return (
      <div className="leading-relaxed text-gray-700">
        {content.split('\n').map((line, index) => (
          <div key={index}>
            {line.startsWith('Available Seas:') ? (
              <div className="font-medium text-gray-800 mt-2 mb-1">{line}</div>
            ) : line.startsWith('Try asking:') ? (
              <div className="font-medium text-gray-800 mt-2 mb-1">{line}</div>
            ) : line.startsWith('•') ? (
              <div className="ml-4">{line}</div>
            ) : (
              <div>{line || '\u00A0'}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Simple Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors"
            aria-label="Open Sea Level Assistant"
          >
            <MessageCircle className="h-6 w-6" />
            <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5 font-medium">
              AI
            </div>
          </button>
        )}

        {/* Natural Chat Window */}
        {isOpen && (
          <div className="bg-white rounded-xl shadow-xl w-[420px] h-[580px] flex flex-col border">
            {/* Clean Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 rounded-lg p-2">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Sea Level Assistant</h3>
                  <p className="text-xs text-blue-100">
                    {agentStatus?.agent_available ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={clearChat}
                  className="text-blue-200 hover:text-white p-1.5 rounded"
                  title="Reset"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-blue-200 hover:text-white p-1.5 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Natural Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-cyan-300 text-white rounded-br-sm'
                        : message.isError 
                        ? 'bg-red-50 border border-red-200 text-red-700 rounded-bl-sm'
                        : 'bg-white border rounded-bl-sm shadow-sm text-gray-800'
                    }`}
                  >
                    <div className="text-sm">
                      {formatMessage(message.content, message)}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border p-3 rounded-lg rounded-bl-sm shadow-sm">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600">Analyzing...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Simple Suggestions */}
              {messages.length === 1 && suggestions.length > 0 && (
                <div className="space-y-2 mt-4">
                  <div className="text-sm text-gray-600">Quick examples:</div>
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => useSuggestion(suggestion)}
                      className="w-full text-left text-sm bg-white hover:bg-gray-50 p-2.5 rounded-lg border transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Simple Input */}
            <div className="border-t p-4 bg-white rounded-b-xl">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={agentStatus?.agent_available ? "Ask about sea level predictions..." : "Unavailable"}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  disabled={isLoading || !agentStatus?.agent_available}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading || !agentStatus?.agent_available}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// FIXED: Enhanced Formatter with Correct Pattern Matching
const FixedEnhancedFormatter = ({ content }) => {
  // Try to split on the separator line
  const sections = content.split(/━{20,}/); // Match 20 or more separator characters
  
  if (sections.length < 2) {
    return <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</div>;
  }

  const technicalData = sections[0].trim();
  const enhancedSection = sections[1].trim();

  return (
    <div className="space-y-3">
      {/* Technical Section */}
      {technicalData && (
        <div className="bg-slate-50 p-3 rounded border">
          <div className="text-xs text-slate-600 mb-2">📊 Analysis</div>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{technicalData}</div>
        </div>
      )}

      {/* Enhanced Sections - FIXED Pattern Matching */}
      <div className="space-y-2">
        {enhancedSection.split('\n\n').map((section, index) => {
          // FIXED: Look for patterns without double asterisks
          if (section.includes('🎯 RISK ASSESSMENT')) {
            const content = section.replace('🎯 RISK ASSESSMENT', '').trim();
            return (
              <div key={index} className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                <div className="text-sm">
                  <span className="font-medium text-blue-800">🎯 Risk Level</span>
                  <div className="mt-1 text-blue-700">{content}</div>
                </div>
              </div>
            );
          } else if (section.includes('👥 HUMAN IMPACT')) {
            const content = section.replace('👥 HUMAN IMPACT', '').trim();
            return (
              <div key={index} className="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <div className="text-sm">
                  <span className="font-medium text-orange-800">👥 Impact</span>
                  <div className="mt-1 text-orange-700">{content}</div>
                </div>
              </div>
            );
          } else if (section.includes('⚡ RECOMMENDED ACTION')) {
            const content = section.replace('⚡ RECOMMENDED ACTION', '').trim();
            return (
              <div key={index} className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <div className="text-sm">
                  <span className="font-medium text-green-800">⚡ Next Steps</span>
                  <div className="mt-1 text-green-700">{content}</div>
                </div>
              </div>
            );
          } else if (section.includes('🌊 EXPERT INSIGHT')) {
            const content = section.replace('🌊 EXPERT INSIGHT', '').trim();
            return (
              <div key={index} className="bg-gray-50 p-3 rounded border-l-4 border-gray-400">
                <div className="text-sm">
                  <span className="font-medium text-gray-800">💭 Insight</span>
                  <div className="mt-1 text-gray-700 italic">{content}</div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default SeaLevelAgent;
