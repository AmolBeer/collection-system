import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { translations } from './translations';
import { Language } from '../types';

// Test component to consume the language context
const TestComponent: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div>
      <span data-testid="current-language">{language}</span>
      <span data-testid="translated-text">{t.dashboard}</span>
      <button
        data-testid="set-zh"
        onClick={() => setLanguage('zh')}
      >
        Set Chinese
      </button>
      <button
        data-testid="set-en"
        onClick={() => setLanguage('en')}
      >
        Set English
      </button>
      <button
        data-testid="set-id"
        onClick={() => setLanguage('id')}
      >
        Set Indonesian
      </button>
    </div>
  );
};

describe('LanguageContext', () => {
  it('should provide the initial language and translations', () => {
    const initialLanguage: Language = 'zh';
    
    render(
      <LanguageProvider language={initialLanguage} setLanguage={() => {}}>
        <TestComponent />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('current-language').textContent).toBe('zh');
    expect(screen.getByTestId('translated-text').textContent).toBe(translations['zh'].dashboard);
  });

  it('should switch to English and update translations', () => {
    const initialLanguage: Language = 'zh';
    const mockSetLanguage = jest.fn();
    
    render(
      <LanguageProvider language={initialLanguage} setLanguage={mockSetLanguage}>
        <TestComponent />
      </LanguageProvider>
    );
    
    // Initial state should be Chinese
    expect(screen.getByTestId('current-language').textContent).toBe('zh');
    
    // Click to switch to English
    fireEvent.click(screen.getByTestId('set-en'));
    
    // Verify setLanguage was called with 'en'
    expect(mockSetLanguage).toHaveBeenCalledWith('en');
  });

  it('should switch to Indonesian and update translations', () => {
    const initialLanguage: Language = 'zh';
    const mockSetLanguage = jest.fn();
    
    render(
      <LanguageProvider language={initialLanguage} setLanguage={mockSetLanguage}>
        <TestComponent />
      </LanguageProvider>
    );
    
    // Click to switch to Indonesian
    fireEvent.click(screen.getByTestId('set-id'));
    
    // Verify setLanguage was called with 'id'
    expect(mockSetLanguage).toHaveBeenCalledWith('id');
  });

  it('should provide correct translations for Chinese', () => {
    render(
      <LanguageProvider language="zh" setLanguage={() => {}}>
        <TestComponent />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('translated-text').textContent).toBe('数据面板');
  });

  it('should provide correct translations for English', () => {
    render(
      <LanguageProvider language="en" setLanguage={() => {}}>
        <TestComponent />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('translated-text').textContent).toBe('Dashboard');
  });

  it('should provide correct translations for Indonesian', () => {
    render(
      <LanguageProvider language="id" setLanguage={() => {}}>
        <TestComponent />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('translated-text').textContent).toBe('Dashboard');
  });

  it('should throw error when useLanguage is called outside LanguageProvider', () => {
    const TestWithoutProvider: React.FC = () => {
      useLanguage();
      return <div>Test</div>;
    };
    
    expect(() => {
      render(<TestWithoutProvider />);
    }).toThrow('useLanguage must be used within LanguageProvider');
  });

  it('should update translated text when language changes', () => {
    let currentLanguage: Language = 'zh';
    const setLanguageFn = (lang: Language) => {
      currentLanguage = lang;
    };
    
    const { rerender } = render(
      <LanguageProvider language={currentLanguage} setLanguage={setLanguageFn}>
        <TestComponent />
      </LanguageProvider>
    );
    
    // Initial state
    expect(screen.getByTestId('translated-text').textContent).toBe('数据面板');
    
    // Switch to English
    currentLanguage = 'en';
    rerender(
      <LanguageProvider language={currentLanguage} setLanguage={setLanguageFn}>
        <TestComponent />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('translated-text').textContent).toBe('Dashboard');
    
    // Switch to Indonesian
    currentLanguage = 'id';
    rerender(
      <LanguageProvider language={currentLanguage} setLanguage={setLanguageFn}>
        <TestComponent />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('translated-text').textContent).toBe('Dashboard');
  });

  it('should have all required translation keys in all languages', () => {
    const zhKeys = Object.keys(translations['zh']);
    const enKeys = Object.keys(translations['en']);
    const idKeys = Object.keys(translations['id']);
    
    // All languages should have the same keys
    expect(zhKeys.sort()).toEqual(enKeys.sort());
    expect(enKeys.sort()).toEqual(idKeys.sort());
  });

  it('should provide correct translations for key terms across all languages', () => {
    // Test case list translation
    expect(translations['zh'].caseList).toBe('案件列表');
    expect(translations['en'].caseList).toBe('Case List');
    expect(translations['id'].caseList).toBe('Daftar Kasus');
    
    // Test recovery list translation
    expect(translations['zh'].recoveryList).toBe('催回列表');
    expect(translations['en'].recoveryList).toBe('Recovery List');
    expect(translations['id'].recoveryList).toBe('Daftar Pemulihan');
    
    // Test save button translation
    expect(translations['zh'].save).toBe('保存');
    expect(translations['en'].save).toBe('Save');
    expect(translations['id'].save).toBe('Simpan');
    
    // Test cancel button translation
    expect(translations['zh'].cancel).toBe('取消');
    expect(translations['en'].cancel).toBe('Cancel');
    expect(translations['id'].cancel).toBe('Batal');
  });
});
