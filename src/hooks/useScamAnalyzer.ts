import { useState, useCallback } from 'react';
import { ScamCategory, ScanResultData } from '../types/scam.types';
import { upiAnalysisService } from '../services/upiAnalysisService';
import { smsAnalysisService } from '../services/smsAnalysisService';
import { urlAnalysisService } from '../services/urlAnalysisService';
import { screenshotAnalysisService } from '../services/screenshotAnalysisService';
import { historyStorage } from '../storage/historyStorage';

export function useScamAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ScamCategory>('upi_vpa');
  const [lastResult, setLastResult] = useState<ScanResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(
    async (category: ScamCategory, input: string): Promise<ScanResultData | null> => {
      if (!input.trim()) {
        setError('Please enter content to analyze');
        return null;
      }

      setIsAnalyzing(true);
      setError(null);

      try {
        let result: ScanResultData;

        switch (category) {
          case 'upi_vpa':
            result = await upiAnalysisService.analyzeVPA({ vpa: input });
            break;
          case 'sms':
            result = await smsAnalysisService.analyzeSMS({ messageText: input });
            break;
          case 'url':
            result = await urlAnalysisService.analyzeURL({ url: input });
            break;
          case 'screenshot':
            result = await screenshotAnalysisService.analyzeScreenshot({ imageUri: input });
            break;
        }

        setLastResult(result);
        await historyStorage.saveScanResult(result);
        return result;
      } catch (err: any) {
        const errorMsg = err.message || 'An error occurred during analysis';
        setError(errorMsg);
        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [],
  );

  return {
    isAnalyzing,
    activeCategory,
    setActiveCategory,
    lastResult,
    error,
    analyze,
    clearError: () => setError(null),
  };
}
