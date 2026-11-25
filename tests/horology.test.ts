import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('VK TIME Horological Commercial Logic', () => {
  it('calculates 18% GST tax accurately on discounted subtotals', () => {
    const subtotal = 48500;
    const discountPercent = 10;
    const discountAmount = (subtotal * discountPercent) / 100;
    const taxableSubtotal = subtotal - discountAmount;
    const taxAmount = Math.round(taxableSubtotal * 0.18);
    const finalTotal = taxableSubtotal + taxAmount;

    assert.strictEqual(discountAmount, 4850);
    assert.strictEqual(taxableSubtotal, 43650);
    assert.strictEqual(taxAmount, 7857);
    assert.strictEqual(finalTotal, 51507);
  });

  it('validates minimum order values for promotional privilege codes', () => {
    const coupon = {
      code: 'HOROLOGY5000',
      minOrderValue: 40000,
      discountAmount: 5000,
    };

    const eligibleCartTotal = 44000;
    const ineligibleCartTotal = 24500;

    assert.strictEqual(eligibleCartTotal >= coupon.minOrderValue, true);
    assert.strictEqual(ineligibleCartTotal >= coupon.minOrderValue, false);
  });

  it('verifies wrist size compatibility calculation within bounds', () => {
    const wristSizeMinMm = 150;
    const wristSizeMaxMm = 210;

    const wearerA = 170; // Standard wrist
    const wearerB = 140; // Too small
    const wearerC = 220; // Too large

    assert.strictEqual(wearerA >= wristSizeMinMm && wearerA <= wristSizeMaxMm, true);
    assert.strictEqual(wearerB >= wristSizeMinMm && wearerB <= wristSizeMaxMm, false);
    assert.strictEqual(wearerC >= wristSizeMinMm && wearerC <= wristSizeMaxMm, false);
  });
});
