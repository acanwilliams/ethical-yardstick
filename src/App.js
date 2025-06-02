import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Users, Scale, Heart, Shield, Eye, Lightbulb, Save, History } from 'lucide-react';

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
    if (keywords.includes('secret') || keywords.includes('proprietary') && !keywords.includes('open')) score -= 2;
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
    if (keywords.includes('dangerous') || keywords.includes('risky') && !keywords.includes('assessment')) score -= 2;
    if (keywords.includes('addiction') || keywords.includes('mental health') && keywords.includes('negative')) score -= 2;
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
    const averageScore = frameworks.reduce(Claude can make mistakes. Please double-check responses.
