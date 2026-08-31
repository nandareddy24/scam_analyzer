import { sanitizeInputSummary } from '../src/storage/scanHistory';
import { smsAnalyzer } from '../src/services/smsAnalyzer';
import { upiAnalyzer } from '../src/services/upiAnalyzer';
import { urlAnalyzer } from '../src/services/urlAnalyzer';
import { screenshotAnalyzer } from '../src/services/screenshotAnalyzer';

/**
 * Frontend TypeScript Logic Test Suite
 * Executes unit assertions against React Native service layers, privacy sanitizers, and validation logic.
 */
export async function runFrontendTests() {
  console.log('\n========================================');
  console.log('🧪 RUNNING REACT NATIVE FRONTEND LOGIC TESTS');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASSED: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${testName}`);
      failed++;
    }
  }

  // 1. PRIVACY SANITIZER TESTS
  console.log('[1/5] Testing Privacy Sanitization Engine...');
  const cardTest = sanitizeInputSummary('Card number 4111 2222 3333 4444 used for transaction.');
  assert(!cardTest.includes('4111 2222 3333 4444'), 'Card number must be redacted');
  assert(cardTest.includes('[CARD REDACTED]'), 'Card redaction placeholder present');

  const otpTest = sanitizeInputSummary('Your secret OTP is: 987654. Do not share.');
  assert(!otpTest.includes('987654'), 'OTP code 987654 must be redacted');
  assert(otpTest.includes('[REDACTED]'), 'OTP redaction placeholder present');

  const truncateTest = sanitizeInputSummary('A'.repeat(100));
  assert(truncateTest.length <= 60, 'Long inputs must be truncated to <= 60 chars');

  // 2. SMS ANALYZER TESTS
  console.log('\n[2/5] Testing SMS Analyzer Service...');
  try {
    const smsRes = await smsAnalyzer.analyzeSMS({
      messageText: 'URGENT: SBI account blocked within 24 hours due to pending KYC. Update at http://sbi-kyc.top',
    });
    assert(smsRes.riskScore >= 50, 'SMS scam message produces riskScore >= 50');
    assert((smsRes.verdict as string) === 'SCAM' || (smsRes.verdict as string) === 'CRITICAL' || (smsRes.verdict as string) === 'SUSPICIOUS', 'SMS verdict is threat level');
    assert(smsRes.detectedRedFlags.length > 0, 'Detected red flags list is non-empty');
  } catch (e: any) {
    assert(false, `SMS Analyzer failed with error: ${e.message}`);
  }

  // 3. UPI ANALYZER TESTS
  console.log('\n[3/5] Testing UPI ID Analyzer Service...');
  try {
    const upiRes = await upiAnalyzer.analyzeUPI({ upiId: 'paytm-refund-desk@okaxis' });
    assert(upiRes.riskScore >= 50, 'Suspicious refund VPA produces riskScore >= 50');
    assert(typeof upiRes.formatValidationMessage === 'string', 'Format validation message is generated');
  } catch (e: any) {
    assert(false, `UPI Analyzer failed with error: ${e.message}`);
  }

  // 4. URL ANALYZER TESTS
  console.log('\n[4/5] Testing URL Phishing Analyzer Service...');
  try {
    const urlRes = await urlAnalyzer.analyzeURL({ url: 'http://sbi-reward-points.top/claim' });
    assert(urlRes.hasSSL === false, 'Unencrypted HTTP URL recognized correctly');
    assert(urlRes.riskScore >= 70, 'Phishing TLD (.top) produces riskScore >= 70');
    assert(urlRes.verdict === 'PHISHING_SCAM' || urlRes.verdict === 'SUSPICIOUS', 'Phishing link flagged correctly');
  } catch (e: any) {
    assert(false, `URL Analyzer failed with error: ${e.message}`);
  }

  // 5. SCREENSHOT ANALYZER TESTS
  console.log('\n[5/5] Testing Screenshot Proof Analyzer Service...');
  try {
    const shotRes = await screenshotAnalyzer.analyzeScreenshot({ imageUri: 'fake_paytm_txn_receipt_5000.png' });
    assert(shotRes.riskScore >= 80, 'Manipulated Paytm proof produces riskScore >= 80');
    assert(shotRes.disclaimer.includes('automated risk assessment'), 'Disclaimer text is present');
  } catch (e: any) {
    assert(false, `Screenshot Analyzer failed with error: ${e.message}`);
  }

  console.log('\n----------------------------------------');
  console.log(`SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('----------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

// Execute tests if invoked directly via ts-node / node runner
if (require.main === module) {
  runFrontendTests();
}
