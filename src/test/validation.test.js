import { budgetValidator } from '@/lib/validation'

describe('Budget Validator', () => {
  it('should throw error if max < min', () => {
    expect(() => budgetValidator(100, 50)).toThrow('Budget max must be >= min')
  })

  it('should not throw if max >= min', () => {
    expect(() => budgetValidator(50, 100)).not.toThrow()
  })

  it('should not throw if only min or max', () => {
    expect(() => budgetValidator(50, null)).not.toThrow()
    expect(() => budgetValidator(null, 100)).not.toThrow()
  })
})