import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Lightbulb, Save, History } from 'lucide-react';

const EthicalYardstick = () => {
  const [useCase, setUseCase] = useState('');
  const [response, setResponse] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedEvaluations, setSavedEvaluations] = useState([]);
  const [highlightSection, setHighlightSection] = useState('');

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - 100;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setHighlightSection(sectionId);
      setTimeout(() => setHighlightSection(''), 3000);
    }
  };

  const evaluateUseCase = (scenario, responseText) => {
    const keywords = (scenario + ' ' + responseText).toLowerCase();
    
    const frameworks = [
      {
        name: 'Justice & Equity',
        score: calculateJusticeScore(keywords),
        concerns: getJusticeConcerns(keywords),
        recommendations: getJusticeRecommendations(keywords)
      },
      {
        name: 'Transparency & Trust',
        score: calculateTransparencyScore(keywords),
        concerns: getTransparencyConcerns(keywords),
        recommendations: getTransparencyRecommendations(keywords)
      },
      {
        name: 'Accountability',
        score: calculateAccountabilityScore(keywords),
        concerns: getAccountabilityConcerns(keywords),
        recommendations: getAccountabilityRecommendations(keywords)
      },
      {
        name: 'Respect for Persons',
        score: calculateRespectScore(keywords),
        concerns: getRespectConcerns(keywords),
        recommendations: getRespectRecommendations(keywords)
      },
      {
        name: 'Non-Maleficence',
        score: calculateNonMaleficenceScore(keywords),
        concerns: getNonMaleficenceConcerns(keywords),
        recommendations: getNonMaleficenceRecommendations(keywords)
      }
    ];

    const overallScore = frameworks.reduce((sum, f) => sum + f.score, 0) / frameworks.length;
    
    return {
      frameworks,
      overallScore,
      riskLevel: overallScore >= 4.5 ? 'low' : overallScore >= 3.5 ? 'medium' : overallScore >= 2.0 ? 'concerning' : 'high',
      keyRecommendations: generateKeyRecommendations(frameworks, keywords),
      interpretation: interpretScore(overallScore)
    };
  };

  const calculateJusticeScore = (keywords) => {
    let score = 3;
    if (keywords.includes('fair') || keywords.includes('equitable') || keywords.includes('justice')) score += 2;
    if (keywords.includes('inclusive') || keywords.includes('accessible') || keywords.includes('equal')) score += 1;
    if (keywords.includes('diverse') || keywords.includes('representation')) score += 1;
    if (keywords.includes('bias') || keywords.includes('discrimination') || keywords.includes('unfair')) score -= 2;
    if (keywords.includes('exclude') || keywords.includes('marginalize')) score -= 2;
    if (keywords.includes('privilege') && !keywords.includes('check')) score -= 1;
    return Math.max(0, Math.min(5, score));
  };

  const calculateTransparencyScore = (keywords) => {
    let score = 3;
    if (keywords.includes('transparent') || keywords.includes('open') || keywords.includes('clear')) score += 2;
    if (keywords.includes('explainable') || keywords.includes('interpretable')) score += 2;
    if (keywords.includes('documented') || keywords.includes('disclosed')) score += 1;
    if (keywords.includes('black box') || keywords.includes('opaque') || keywords.includes('hidden')) score -= 2;
    if ((keywords.includes('secret') || keywords.includes('proprietary')) && !keywords.includes('open')) score -= 2;
    if (keywords.includes('misleading') || keywords.includes('deceptive')) score -= 2;
    return Math.max(0, Math.min(5, score));
  };

  const calculateAccountabilityScore = (keywords) => {
    let score = 3;
    if (keywords.includes('accountable') || keywords.includes('responsible') || keywords.includes('oversight')) score += 2;
    if (keywords.includes('audit') || keywords.includes('review') || keywords.includes('monitoring')) score += 1;
    if (keywords.includes('governance') || keywords.includes('compliance')) score += 1;
    if (keywords.includes('unaccountable') || keywords.includes('no oversight')) score -= 2;
    if (keywords.includes('unchecked') || keywords.includes('unsupervised')) score -= 2;
    if (keywords.includes('blame') && keywords.includes('shift')) score -= 1;
    return Math.max(0, Math.min(5, score));
  };

  const calculateRespectScore = (keywords) => {
    let score = 3;
    if (keywords.includes('consent') && !keywords.includes('without')) score += 2;
    if (keywords.includes('informed consent') || keywords.includes('explicit consent')) score += 1;
    if (keywords.includes('autonomy') || keywords.includes('choice') || keywords.includes('voluntary')) score += 1;
    if (keywords.includes('dignity') || keywords.includes('respect')) score += 1;
    if (keywords.includes('without consent') || keywords.includes('coercive') || keywords.includes('manipulative')) score -= 2;
    if (keywords.includes('exploit') || keywords.includes('abuse')) score -= 2;
    if (keywords.includes('dehumanize') || keywords.includes('objectify')) score -= 2;
    return Math.max(0, Math.min(5, score));
  };

  const calculateNonMaleficenceScore = (keywords) => {
    let score = 3;
    if (keywords.includes('safe') || keywords.includes('protect') || keywords.includes('secure')) score += 2;
    if (keywords.includes('benefit') || keywords.includes('help') || keywords.includes('improve')) score += 1;
    if (keywords.includes('risk assessment') || keywords.includes('mitigation')) score += 1;
    if (keywords.includes('harm') || keywords.includes('damage') || keywords.includes('hurt')) score -= 2;
    if (keywords.includes('dangerous') || (keywords.includes('risky') && !keywords.includes('assessment'))) score -= 2;
    if (keywords.includes('addiction') || (keywords.includes('mental health') && keywords.includes('negative'))) score -= 2;
    return Math.max(0, Math.min(5, score));
  };

  const getJusticeConcerns = (keywords) => {
    const concerns = [];
    if (keywords.includes('bias')) concerns.push('Potential for algorithmic bias and unfair outcomes');
    if (keywords.includes('discrimination')) concerns.push('Risk of discriminatory practices');
    return concerns.length ? concerns : ['Consider fairness across all user groups'];
  };

  const getJusticeRecommendations = (keywords) => {
    return ['Implement bias testing and fairness metrics', 'Ensure diverse representation in data and testing'];
  };

  const getTransparencyConcerns = (keywords) => {
    const concerns = [];
    if (keywords.includes('black box')) concerns.push('Lack of explainability in decision-making');
    if (keywords.includes('hidden')) concerns.push('Insufficient transparency in operations');
    return concerns.length ? concerns : ['Ensure adequate transparency and explainability'];
  };

  const getTransparencyRecommendations = (keywords) => {
    return ['Provide clear explanations of system behavior', 'Document decision-making processes'];
  };

  const getAccountabilityConcerns = (keywords) => {
    const concerns = [];
    if (keywords.includes('unaccountable')) concerns.push('Lack of clear accountability structures');
    return concerns.length ? concerns : ['Establish clear accountability frameworks'];
  };

  const getAccountabilityRecommendations = (keywords) => {
    return ['Implement oversight and review processes', 'Define clear roles and responsibilities'];
  };

  const getRespectConcerns = (keywords) => {
    const concerns = [];
    if (keywords.includes('without consent')) concerns.push('Violation of user autonomy and consent');
    if (keywords.includes('exploit')) concerns.push('Potential exploitation of users');
    return concerns.length ? concerns : ['Ensure respect for human dignity and autonomy'];
  };

  const getRespectRecommendations = (keywords) => {
    return ['Implement robust consent mechanisms', 'Respect user autonomy and choice'];
  };

  const getNonMaleficenceConcerns = (keywords) => {
    const concerns = [];
    if (keywords.includes('harm')) concerns.push('Potential for direct or indirect harm');
    if (keywords.includes('dangerous')) concerns.push('Safety risks identified');
    return concerns.length ? concerns : ['Minimize potential for harm'];
  };

  const getNonMaleficenceRecommendations = (keywords) => {
    return ['Conduct thorough risk assessments', 'Implement safety measures and monitoring'];
  };

  const generateKeyRecommendations = (frameworks, keywords) => {
    const priorityRecs = [];
    const lowScoreFrameworks = frameworks.filter(f => f.score < 2.5);
    const criticalFrameworks = frameworks.filter(f => f.score < 1.5);
    const averageScore = frameworks.reduce((sum, f) => sum + f.score, 0) / frameworks.length;
    
    if (criticalFrameworks.length >= 3) {
      priorityRecs.push('🚨 CRITICAL: Halt deployment immediately - multiple severe ethical violations detected');
      priorityRecs.push('📋 Conduct full ethical impact assessment with external ethics board review');
    } else if (lowScoreFrameworks.length >= 3) {
      priorityRecs.push('⚠️ HIGH PRIORITY: Pause implementation pending ethics board review and remediation');
    }
    
    lowScoreFrameworks.forEach(framework => {
      switch(framework.name) {
        case 'Justice & Equity':
          if (keywords.includes('bias') || keywords.includes('discrimination')) {
            priorityRecs.push('⚖️ URGENT: Implement algorithmic fairness testing across protected classes and demographic groups');
            priorityRecs.push('📊 Establish bias monitoring dashboards with automated alerts for discriminatory outcomes');
          } else {
            priorityRecs.push('🏛️ Develop comprehensive equity framework with measurable fairness metrics');
          }
          break;
        case 'Transparency & Trust':
          if (keywords.includes('black box') || keywords.includes('opaque')) {
            priorityRecs.push('🔍 CRITICAL: Replace black-box models with interpretable alternatives or add explanation layers');
            priorityRecs.push('📖 Create user-facing decision explanation system with plain-language summaries');
          } else {
            priorityRecs.push('💡 Implement explainable AI interfaces showing decision factors and confidence levels');
          }
          break;
        case 'Accountability':
          if (keywords.includes('unaccountable') || keywords.includes('no oversight')) {
            priorityRecs.push('👥 IMMEDIATE: Establish AI governance committee with clear escalation procedures');
            priorityRecs.push('🔍 Implement continuous audit trail with human reviewers for high-impact decisions');
          } else {
            priorityRecs.push('📋 Create formal accountability framework with designated responsible parties');
          }
          break;
        case 'Respect for Persons':
          if (keywords.includes('without consent') || keywords.includes('coercive')) {
            priorityRecs.push('✋ CRITICAL: Redesign system with granular, informed consent as prerequisite');
            priorityRecs.push('🔒 Implement user data sovereignty controls with easy opt-out mechanisms');
          } else {
            priorityRecs.push('🤝 Strengthen user autonomy protections with enhanced consent management');
          }
          break;
        case 'Non-Maleficence':
          if (keywords.includes('harm') || keywords.includes('dangerous')) {
            priorityRecs.push('🛡️ URGENT: Conduct comprehensive harm assessment with mitigation protocols');
            priorityRecs.push('⚡ Deploy real-time safety monitoring with automatic system shutdown triggers');
          } else {
            priorityRecs.push('🔍 Establish proactive risk monitoring with regular safety assessments');
          }
          break;
        default:
          break;
      }
    });
    
    if (keywords.includes('healthcare') || keywords.includes('medical')) {
      if (keywords.includes('without consent')) {
        priorityRecs.push('🏥 MANDATORY: Implement HIPAA-compliant informed consent with IRB oversight');
        priorityRecs.push('⚕️ Require clinical ethics committee approval before any patient data use');
      } else {
        priorityRecs.push('🩺 Ensure FDA compliance pathway and clinical validation with safety monitoring');
        priorityRecs.push('📋 Implement medical ethics oversight with physician-in-the-loop validation');
      }
    }
    
    if (keywords.includes('children') || keywords.includes('minors') || keywords.includes('school')) {
      priorityRecs.push('👶 CRITICAL: Implement COPPA-compliant parental consent with age verification');
      priorityRecs.push('🎓 Establish educational ethics review board with child development experts');
      priorityRecs.push('🔒 Deploy enhanced privacy protections exceeding adult standards');
    }
    
    if (keywords.includes('hiring') || keywords.includes('employment') || keywords.includes('recruitment')) {
      priorityRecs.push('💼 LEGAL REQUIREMENT: Ensure EEOC compliance with adverse impact testing');
      priorityRecs.push('📊 Implement demographic parity monitoring across hiring funnel stages');
      priorityRecs.push('📝 Provide detailed decision explanations to all candidates per legal requirements');
    }
    
    if (keywords.includes('credit') || keywords.includes('loan') || keywords.includes('financial')) {
      priorityRecs.push('💳 REGULATORY: Implement Fair Credit Reporting Act compliance with adverse action notices');
      priorityRecs.push('⚖️ Deploy ECOA-compliant fairness testing across protected classes');
    }
    
    if (keywords.includes('criminal justice') || keywords.includes('policing') || keywords.includes('sentencing')) {
      priorityRecs.push('⚖️ CONSTITUTIONAL: Implement due process protections with judicial oversight');
      priorityRecs.push('📊 Mandate racial bias testing with community accountability measures');
    }
    
    if (keywords.includes('surveillance') || keywords.includes('monitoring') || keywords.includes('tracking')) {
      priorityRecs.push('📹 PRIVACY: Establish strict data minimization with automatic deletion schedules');
      priorityRecs.push('🔔 Implement transparent notification system with user control mechanisms');
      priorityRecs.push('⚖️ Ensure compliance with applicable surveillance laws and constitutional protections');
    }
    
    if (keywords.includes('facial recognition') || keywords.includes('biometric')) {
      priorityRecs.push('👤 ACCURACY: Mandate demographic accuracy testing with 99%+ parity across groups');
      priorityRecs.push('🔒 Implement biometric data protection with encryption and limited retention');
    }
    
    if (keywords.includes('automated') || keywords.includes('autonomous')) {
      priorityRecs.push('🤖 HUMAN OVERSIGHT: Provide meaningful human review for all consequential decisions');
      priorityRecs.push('⚡ Deploy kill switches and human override capabilities');
    }
    
    if (keywords.includes('ai training') || keywords.includes('machine learning')) {
      priorityRecs.push('📊 DATA QUALITY: Audit training data for bias, representation, and consent compliance');
      priorityRecs.push('🔄 Implement continuous model monitoring with performance degradation alerts');
    }
    
    if (averageScore >= 4.0) {
      priorityRecs.push('✅ EXCELLENCE: Document current practices as organizational best practices template');
      priorityRecs.push('📚 Establish ethics training program using this use case as positive example');
      priorityRecs.push('🔄 Implement quarterly ethics reviews to maintain high standards');
    } else if (averageScore >= 3.0) {
      priorityRecs.push('📈 IMPROVEMENT: Develop 90-day action plan addressing identified gaps');
      priorityRecs.push('🎯 Set measurable ethical performance targets with monthly progress reviews');
    } else if (averageScore >= 2.0) {
      priorityRecs.push('🚧 MAJOR REVISION: Redesign core system components to address ethical deficiencies');
      priorityRecs.push('👨‍⚖️ Engage external ethics consultants for independent assessment and guidance');
    }
    
    if (averageScore < 2.5) {
      priorityRecs.push('🔍 MANDATORY: Establish independent ethics oversight board with veto power');
      priorityRecs.push('📋 Require ethics impact assessment for any system modifications');
    }
    
    if (keywords.includes('new') || keywords.includes('novel') || keywords.includes('innovative')) {
      priorityRecs.push('🔬 RESEARCH: Collaborate with ethics researchers to establish new standards');
      priorityRecs.push('🌍 Consider broader societal impact beyond immediate use case');
    }
    
    if (priorityRecs.length === 0) {
      priorityRecs.push('📋 Conduct comprehensive ethical framework assessment using established guidelines');
      priorityRecs.push('👥 Establish stakeholder engagement process for ethical input');
      priorityRecs.push('🔄 Implement regular ethical review cycles with documented procedures');
    }
    
    return priorityRecs.slice(0, 7);
  };

  const interpretScore = (avgScore) => {
    if (avgScore >= 4.5) return "✅ Extremely Ethical";
    else if (avgScore >= 3.5) return "👍 Mostly Ethical";
    else if (avgScore >= 2.0) return "⚠️ Ethically Concerning";
    else return "❌ Not Ethical at All";
  };

  const handleAnalyze = () => {
    if (!useCase.trim()) return;
    
    setLoading(true);
    setTimeout(() => {
      const result = evaluateUseCase(useCase, response);
      setAnalysis(result);
      setLoading(false);
    }, 1000);
  };

  const handleSaveEvaluation = () => {
    if (!analysis) return;
    
    const evaluation = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      useCase,
      response,
      analysis
    };
    
    setSavedEvaluations([evaluation, ...savedEvaluations]);
    alert('✅ Evaluation saved successfully!');
  };

  const getScoreColor = (score) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBadge = (risk) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      concerning: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[risk] || colors.medium;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white relative overflow-hidden" style={{minHeight: '400px'}}>
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 800 400">
              <path d="M0,100 L200,100 L200,150 L400,150" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M100,0 L100,200 L300,200 L300,300" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M500,50 L700,50 L700,200 L800,200" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M0,300 L150,300 L150,250 L350,250" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M600,100 L600,300 L800,300" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="200" cy="100" r="4" fill="currentColor"/>
              <circle cx="200" cy="150" r="4" fill="currentColor"/>
              <circle cx="400" cy="150" r="4" fill="currentColor"/>
              <circle cx="100" cy="200" r="4" fill="currentColor"/>
              <circle cx="300" cy="200" r="4" fill="currentColor"/>
              <circle cx="300" cy="300" r="4" fill="currentColor"/>
              <circle cx="700" cy="50" r="4" fill="currentColor"/>
              <circle cx="700" cy="200" r="4" fill="currentColor"/>
              <circle cx="150" cy="300" r="4" fill="currentColor"/>
              <circle cx="150" cy="250" r="4" fill="currentColor"/>
              <circle cx="600" cy="100" r="4" fill="currentColor"/>
              <circle cx="600" cy="300" r="4" fill="currentColor"/>
            </svg>
          </div>

          <div className="absolute top-6 left-6 space-y-4 z-20">
            <button 
              onClick={() => scrollToSection('use-case-section')}
              className="flex items-center space-x-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg px-4 py-2 transition-all duration-300 border border-white border-opacity-20 cursor-pointer"
            >
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-white font-semibold">Use Case</span>
            </button>
            <button 
              onClick={() => scrollToSection('response-section')}
              className="flex items-center space-x-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg px-4 py-2 transition-all duration-300 border border-white border-opacity-20 cursor-pointer"
            >
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-white font-semibold">Response</span>
            </button>
          </div>

          <div className="absolute top-6 right-6 text-right space-y-2 text-gray-300">
            <div className="text-sm font-semibold opacity-70">DO GOOD</div>
            <div className="text-sm font-semibold opacity-70">MINIMIZE HARM</div>
            <div className="text-sm font-semibold opacity-70">MAXIMIZE BENEFITS</div>
            <div className="text-sm font-semibold opacity-70">ENSURE JUSTICE</div>
          </div>

          <div className="relative z-10 flex items-center justify-center h-full pt-16 pb-8">
            <div className="text-center max-w-4xl">
              <div className="mb-8 flex items-center justify-center">
                <div className="relative">
                  <div className="w-64 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg relative shadow-lg border-2 border-yellow-600">
                    <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                      {[1,2,3,4,5,6,7,8].map((mark) => (
                        <div key={mark} className="flex-1 relative">
                          <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-purple-900 ${
                            mark % 4 === 0 ? 'w-0.5 h-8' : 'w-px h-4'
                          }`}></div>
                          {mark % 4 === 0 && (
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-yellow-200 font-bold">
                              {mark}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute -top-4 -left-4 text-yellow-400 text-2xl">✦</div>
                </div>
              </div>

              <h1 className="text-6xl font-bold mb-4 text-yellow-300 tracking-tight">
                ETHICAL<br/>YARDSTICK
              </h1>
              
              <div className="text-xl text-gray-300 mb-8 font-semibold">
                APRIL C. WILLIAMS
              </div>

              <div className="mb-8 flex justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-lg">
                  <div className="text-4xl">👩🏾‍💼</div>
                </div>
              </div>

              <div className="text-2xl font-bold text-yellow-400 tracking-wider">
                ETHICAL DATA<br/>
                <span className="text-lg">DOC</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <p className="text-gray-600 mb-8 text-center text-lg">
            Use this ethical yardstick to evaluate a use case through a Do No Harm lens.
          </p>

          <div className="space-y-6 mb-8">
            <div id="use-case-section" className={`scroll-mt-20 transition-all duration-300 ${
              highlightSection === 'use-case-section' ? 'ring-4 ring-purple-500 bg-purple-50' : ''
            } rounded-lg p-4`}>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Describe the Use Case
              </label>
              <textarea
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                placeholder="Enter your AI use case or scenario here..."
                className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div id="response-section" className={`scroll-mt-20 transition-all duration-300 ${
              highlightSection === 'response-section' ? 'ring-4 ring-purple-500 bg-purple-50' : ''
            } rounded-lg p-4`}>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Describe the Response
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Describe how you plan to implement or respond to this use case..."
                className="w-full h-24 p-4 border-2 border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={!useCase.trim() || loading}
              className="w-full px-6 py-4 bg-purple-700 text-white rounded-lg hover:bg-purple-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze Ethical Implications'}
            </button>
          </div>

          {analysis && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Overall Ethical Assessment</h2>
                  <div className="text-5xl font-bold mb-2">{analysis.overallScore.toFixed(1)}/5</div>
                  <div className="text-2xl mb-4">{analysis.interpretation}</div>
                  <span className={`px-6 py-3 rounded-full text-lg font-semibold ${getRiskBadge(analysis.riskLevel)}`}>
                    {analysis.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
                
                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                    <Lightbulb className="w-6 h-6 mr-3 text-yellow-500" />
                    Key Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {analysis.keyRecommendations.map((rec, index) => (
                      <li key={index} className="text-gray-700 text-lg">• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Ethical Framework Scores</h2>
                <div className="space-y-8">
                  {analysis.frameworks.map((framework, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-900 text-lg">{framework.name}</span>
                        <span className={`font-bold text-xl ${getScoreColor(framework.score)}`}>
                          {framework.score}/5
                        </span>
                      </div>
                      <div className="relative h-12 bg-gray-200 rounded-lg border-2 border-gray-300 overflow-hidden">
                        <div className="absolute inset-0 flex">
                          {[0,1,2,3,4,5].map((mark) => (
                            <div key={mark} className="flex-1 relative border-r border-gray-400 last:border-r-0">
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-600"></div>
                              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 font-bold">
                                {mark}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div 
                          className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${
                            framework.score >= 4 ? 'bg-green-500' : 
                            framework.score >= 2.5 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(framework.score / 5) * 100}%` }}
                        ></div>
                        
                        <div 
                          className="absolute top-0 h-full w-1 bg-gray-800 transition-all duration-1000 ease-out"
                          style={{ left: `${(framework.score / 5) * 100}%` }}
                        >
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-gray-800"></div>
                        </div>
                      </div>
                      
                      {index === 0 && (
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <span className="text-red-600">Not Ethical (0-2)</span>
                          <span className="text-yellow-600">Concerning (2-4)</span>
                          <span className="text-green-600">Ethical (4-5)</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleSaveEvaluation}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg transition-colors flex items-center mx-auto"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Evaluation
                </button>
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <History className="w-6 h-6 mr-3" />
              📚 Most Recent Evaluation
            </h2>
            
            {savedEvaluations.length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="mb-4">
                  <strong>Use Case:</strong> {savedEvaluations[0].useCase}
                </div>
                <div className="mb-4">
                  <strong>Response:</strong> {savedEvaluations[0].response}
                </div>
                <div className="text-xl font-bold">
                  <strong>Overall Score:</strong> {savedEvaluations[0].analysis.overallScore.toFixed(2)} — {savedEvaluations[0].analysis.interpretation}
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-blue-800">
                ℹ️ No evaluations submitted yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EthicalYardstick;
