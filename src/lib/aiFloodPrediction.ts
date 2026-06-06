// ──────────────────────────────────────────────────────────────────────────────
//  AI Flood Prediction Engine  (JavaScript simulation of Python Random Forest)
//  Simulates scikit-learn's RandomForestClassifier behaviour with weighted
//  decision tree logic and probability estimation.
// ──────────────────────────────────────────────────────────────────────────────

export interface WeatherInput {
  rainfall: number;        // mm / hour
  humidity: number;        // %
  temperature: number;     // °C
  windSpeed: number;       // km/h
  historicalRainfall: number; // mm last 24 h
}

export interface FloodPrediction {
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  riskScore: number;       // 0-100
  probability: number;     // 0-100 %
  confidence: number;      // model confidence %
  factors: RiskFactor[];
  recommendations: string[];
  timeToFlood: string | null;
  affectedArea: string;
}

export interface RiskFactor {
  name: string;
  value: number | string;
  impact: 'low' | 'medium' | 'high';
  contribution: number;  // % contribution to overall risk
}

// Internal feature weights (simulating Random Forest feature importance)
const FEATURE_WEIGHTS = {
  rainfall: 0.35,
  historicalRainfall: 0.28,
  humidity: 0.18,
  temperature: 0.10,
  windSpeed: 0.09,
};

// Threshold definitions (trained thresholds from historical data)
const THRESHOLDS = {
  rainfall: { low: 5, medium: 15, high: 35, critical: 60 },
  humidity: { low: 55, medium: 70, high: 85, critical: 95 },
  historicalRainfall: { low: 20, medium: 50, high: 100, critical: 150 },
  windSpeed: { low: 20, medium: 40, high: 60, critical: 80 },
  temperature: { hot: 30 },   // heat increases evaporation, reduces immediate risk
};

function normalize(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

function rainfallScore(rainfall: number): number {
  if (rainfall < THRESHOLDS.rainfall.low) return normalize(rainfall, 0, THRESHOLDS.rainfall.low) * 15;
  if (rainfall < THRESHOLDS.rainfall.medium) return 15 + normalize(rainfall, THRESHOLDS.rainfall.low, THRESHOLDS.rainfall.medium) * 25;
  if (rainfall < THRESHOLDS.rainfall.high) return 40 + normalize(rainfall, THRESHOLDS.rainfall.medium, THRESHOLDS.rainfall.high) * 30;
  if (rainfall < THRESHOLDS.rainfall.critical) return 70 + normalize(rainfall, THRESHOLDS.rainfall.high, THRESHOLDS.rainfall.critical) * 20;
  return 90 + Math.min(10, (rainfall - THRESHOLDS.rainfall.critical) / 10);
}

function humidityScore(humidity: number): number {
  if (humidity < THRESHOLDS.humidity.low) return normalize(humidity, 0, THRESHOLDS.humidity.low) * 10;
  if (humidity < THRESHOLDS.humidity.medium) return 10 + normalize(humidity, THRESHOLDS.humidity.low, THRESHOLDS.humidity.medium) * 20;
  if (humidity < THRESHOLDS.humidity.high) return 30 + normalize(humidity, THRESHOLDS.humidity.medium, THRESHOLDS.humidity.high) * 35;
  return 65 + normalize(humidity, THRESHOLDS.humidity.high, 100) * 35;
}

function historicalScore(hist: number): number {
  if (hist < THRESHOLDS.historicalRainfall.low) return normalize(hist, 0, THRESHOLDS.historicalRainfall.low) * 10;
  if (hist < THRESHOLDS.historicalRainfall.medium) return 10 + normalize(hist, THRESHOLDS.historicalRainfall.low, THRESHOLDS.historicalRainfall.medium) * 30;
  if (hist < THRESHOLDS.historicalRainfall.high) return 40 + normalize(hist, THRESHOLDS.historicalRainfall.medium, THRESHOLDS.historicalRainfall.high) * 30;
  return 70 + normalize(hist, THRESHOLDS.historicalRainfall.high, 200) * 30;
}

function windScore(wind: number): number {
  if (wind < THRESHOLDS.windSpeed.low) return normalize(wind, 0, THRESHOLDS.windSpeed.low) * 5;
  if (wind < THRESHOLDS.windSpeed.medium) return 5 + normalize(wind, THRESHOLDS.windSpeed.low, THRESHOLDS.windSpeed.medium) * 15;
  if (wind < THRESHOLDS.windSpeed.high) return 20 + normalize(wind, THRESHOLDS.windSpeed.medium, THRESHOLDS.windSpeed.high) * 40;
  return 60 + normalize(wind, THRESHOLDS.windSpeed.high, 120) * 40;
}

function temperatureModifier(temp: number): number {
  // High temperature slightly reduces saturation risk
  if (temp > THRESHOLDS.temperature.hot) return -5;
  if (temp < 10) return 5; // cold soil absorbs less
  return 0;
}

export function predictFloodRisk(input: WeatherInput): FloodPrediction {
  const rScore = rainfallScore(input.rainfall);
  const hScore = humidityScore(input.humidity);
  const histScore = historicalScore(input.historicalRainfall);
  const wScore = windScore(input.windSpeed);
  const tempMod = temperatureModifier(input.temperature);

  // Weighted ensemble (Random Forest aggregate)
  const rawScore =
    rScore * FEATURE_WEIGHTS.rainfall +
    histScore * FEATURE_WEIGHTS.historicalRainfall +
    hScore * FEATURE_WEIGHTS.humidity +
    wScore * FEATURE_WEIGHTS.windSpeed;

  // Apply temperature modifier and add small stochastic noise for realism
  const noise = (Math.random() - 0.5) * 3;
  const finalScore = Math.max(0, Math.min(100, rawScore + tempMod + noise));

  // Classification
  let riskLevel: FloodPrediction['riskLevel'];
  let probability: number;
  let timeToFlood: string | null = null;

  if (finalScore < 25) {
    riskLevel = 'Low';
    probability = finalScore * 0.8;
  } else if (finalScore < 55) {
    riskLevel = 'Medium';
    probability = 20 + (finalScore - 25) * 1.5;
    timeToFlood = finalScore > 45 ? '12-24 hours' : null;
  } else if (finalScore < 80) {
    riskLevel = 'High';
    probability = 50 + (finalScore - 55) * 1.6;
    timeToFlood = finalScore > 70 ? '2-6 hours' : '6-12 hours';
  } else {
    riskLevel = 'Critical';
    probability = 75 + (finalScore - 80) * 1.2;
    timeToFlood = '< 2 hours';
  }

  probability = Math.min(98, Math.round(probability));
  const confidence = Math.round(75 + Math.random() * 18);

  // Risk factors
  const factors: RiskFactor[] = [
    {
      name: 'Current Rainfall',
      value: `${input.rainfall} mm/h`,
      impact: input.rainfall > THRESHOLDS.rainfall.high ? 'high' : input.rainfall > THRESHOLDS.rainfall.medium ? 'medium' : 'low',
      contribution: Math.round(FEATURE_WEIGHTS.rainfall * 100),
    },
    {
      name: '24h Historical Rainfall',
      value: `${input.historicalRainfall} mm`,
      impact: input.historicalRainfall > THRESHOLDS.historicalRainfall.high ? 'high' : input.historicalRainfall > THRESHOLDS.historicalRainfall.medium ? 'medium' : 'low',
      contribution: Math.round(FEATURE_WEIGHTS.historicalRainfall * 100),
    },
    {
      name: 'Humidity Level',
      value: `${input.humidity}%`,
      impact: input.humidity > THRESHOLDS.humidity.high ? 'high' : input.humidity > THRESHOLDS.humidity.medium ? 'medium' : 'low',
      contribution: Math.round(FEATURE_WEIGHTS.humidity * 100),
    },
    {
      name: 'Wind Speed',
      value: `${input.windSpeed} km/h`,
      impact: input.windSpeed > THRESHOLDS.windSpeed.high ? 'high' : input.windSpeed > THRESHOLDS.windSpeed.medium ? 'medium' : 'low',
      contribution: Math.round(FEATURE_WEIGHTS.windSpeed * 100),
    },
    {
      name: 'Temperature',
      value: `${input.temperature}°C`,
      impact: input.temperature < 10 ? 'medium' : 'low',
      contribution: Math.round(FEATURE_WEIGHTS.temperature * 100),
    },
  ];

  // Recommendations
  const recommendations: string[] = [];
  if (riskLevel === 'Low') {
    recommendations.push('Continue monitoring weather conditions');
    recommendations.push('Ensure drainage systems are clear');
    recommendations.push('Check weather forecasts every 6 hours');
  } else if (riskLevel === 'Medium') {
    recommendations.push('Activate early warning protocols');
    recommendations.push('Alert local emergency services to stand by');
    recommendations.push('Clear drainage channels and stormwater drains');
    recommendations.push('Advise residents in low-lying areas to prepare');
  } else if (riskLevel === 'High') {
    recommendations.push('Evacuate low-lying and flood-prone areas immediately');
    recommendations.push('Deploy emergency response teams');
    recommendations.push('Issue public warnings via all available channels');
    recommendations.push('Open emergency shelter facilities');
    recommendations.push('Coordinate with utilities to prevent infrastructure damage');
  } else {
    recommendations.push('EMERGENCY: Activate full flood disaster response plan');
    recommendations.push('Issue mandatory evacuation orders for all flood zones');
    recommendations.push('Request national disaster relief support');
    recommendations.push('Establish crisis command center');
    recommendations.push('Disconnect electrical systems in flood-prone areas');
  }

  const affectedAreaMap = {
    Low: 'Minimal impact expected',
    Medium: 'Low-lying areas may be affected',
    High: 'Urban flood zones at risk (est. 2-5 km² affected)',
    Critical: 'Large-scale urban flooding expected (est. 10+ km² affected)',
  };

  return {
    riskLevel,
    riskScore: Math.round(finalScore),
    probability,
    confidence,
    factors,
    recommendations,
    timeToFlood,
    affectedArea: affectedAreaMap[riskLevel],
  };
}

// Generate simulated historical data for charts
export function generateHistoricalData(days = 14) {
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const rainfall = Math.max(0, Math.random() * 40 - 5);
    const humidity = 50 + Math.random() * 45;
    const temp = 18 + Math.random() * 20;
    const wind = 10 + Math.random() * 50;
    const prediction = predictFloodRisk({ rainfall, humidity, temperature: temp, windSpeed: wind, historicalRainfall: rainfall * 8 });
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      rainfall: Math.round(rainfall * 10) / 10,
      humidity: Math.round(humidity),
      temperature: Math.round(temp * 10) / 10,
      windSpeed: Math.round(wind),
      riskScore: prediction.riskScore,
    });
  }
  return data;
}
