import { camelCase } from '../../src/util/string';

describe('string module', () => {
  describe('camelCase', () => {
    it('should convert two words', () => {
      expect(camelCase('Hello World')).toBe('helloWorld');
      expect(camelCase('hello world')).toBe('helloWorld');
      expect(camelCase('hello World')).toBe('helloWorld');
      expect(camelCase('Hello world')).toBe('helloWorld');
    });

    it('should convert two words and number', () => {
      expect(camelCase('Hello World 42')).toBe('helloWorld42');
    });

    it('should convert empty str', () => {
      expect(camelCase('')).toBe('');
      expect(camelCase(' ')).toBe('');
      expect(camelCase(null)).toBe('');
      expect(camelCase(undefined)).toBe('');
    });

    it('should convert one number', () => {
      expect(camelCase('42')).toBe('42');
    });

    it('should convert one lowercase word', () => {
      expect(camelCase('Hello')).toBe('hello');
    });

    it('should convert uppercase words', () => {
      expect(camelCase('HELLO')).toBe('hello');
      expect(camelCase('HELLO WORLD')).toBe('helloWorld');
    });

    it('should NOT convert camelCase strings', () => {
      expect(camelCase('phoneNumber')).toBe('phoneNumber');
      expect(camelCase('myPhoneNumber')).toBe('myPhoneNumber');
    });

    it('should convert mixed strings', () => {
      expect(camelCase('my phoneNumber')).toBe('myPhonenumber');
      expect(camelCase('THEIR PhoneNumber')).toBe('theirPhonenumber');
    });
  });
});
