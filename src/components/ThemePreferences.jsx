import { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';

const ThemePreferences = () => {
  const { themePreferences, updateThemePreferences } = useFinance();

  const [localPreferences, setLocalPreferences] = useState(themePreferences || {
    mode: 'light',
    colorScheme: 'blue',
    fontSize: 'medium',
    density: 'comfortable',
    animations: true,
    accentColor: '#38bdf8',
    highContrast: false
  });

  const colorSchemes = [
    { id: 'blue', name: 'Blue', primary: '#3b82f6', secondary: '#1e40af' },
    { id: 'green', name: 'Green', primary: '#10b981', secondary: '#047857' },
    { id: 'purple', name: 'Purple', primary: '#8b5cf6', secondary: '#7c3aed' },
    { id: 'red', name: 'Red', primary: '#ef4444', secondary: '#dc2626' },
    { id: 'orange', name: 'Orange', primary: '#f97316', secondary: '#ea580c' },
    { id: 'pink', name: 'Pink', primary: '#ec4899', secondary: '#db2777' },
    { id: 'indigo', name: 'Indigo', primary: '#6366f1', secondary: '#4f46e5' },
    { id: 'teal', name: 'Teal', primary: '#14b8a6', secondary: '#0f766e' }
  ];

  const fontSizes = [
    { id: 'small', name: 'Small', description: 'Compact text for more content' },
    { id: 'medium', name: 'Medium', description: 'Balanced readability' },
    { id: 'large', name: 'Large', description: 'Enhanced readability' },
    { id: 'extra-large', name: 'Extra Large', description: 'Maximum accessibility' }
  ];

  const densities = [
    { id: 'compact', name: 'Compact', description: 'More content in less space' },
    { id: 'comfortable', name: 'Comfortable', description: 'Balanced spacing' },
    { id: 'spacious', name: 'Spacious', description: 'Extra breathing room' }
  ];

  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...localPreferences, [key]: value };
    setLocalPreferences(newPreferences);
    updateThemePreferences(newPreferences);

    // Apply changes immediately
    applyThemePreferences(newPreferences);
  };

  const applyThemePreferences = (prefs) => {
    const root = document.documentElement;

    // Apply color scheme
    root.style.setProperty('--primary', colorSchemes.find(c => c.id === prefs.colorScheme)?.primary || '#3b82f6');
    root.style.setProperty('--primary-dark', colorSchemes.find(c => c.id === prefs.colorScheme)?.secondary || '#1e40af');

    // Apply font size
    const fontSizes = { small: '14px', medium: '16px', large: '18px', 'extra-large': '20px' };
    root.style.setProperty('--font-size-base', fontSizes[prefs.fontSize] || '16px');

    // Apply density
    const densities = {
      compact: { padding: '0.5rem', margin: '0.5rem', gap: '0.5rem' },
      comfortable: { padding: '0.75rem', margin: '0.75rem', gap: '0.75rem' },
      spacious: { padding: '1rem', margin: '1rem', gap: '1rem' }
    };
    const density = densities[prefs.density];
    root.style.setProperty('--spacing-padding', density.padding);
    root.style.setProperty('--spacing-margin', density.margin);
    root.style.setProperty('--spacing-gap', density.gap);

    // Apply animations
    root.style.setProperty('--animation-duration', prefs.animations ? '0.3s' : '0s');

    // Apply high contrast
    if (prefs.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply theme mode
    document.body.className = prefs.mode;
  };

  const resetToDefaults = () => {
    const defaults = {
      mode: 'light',
      colorScheme: 'blue',
      fontSize: 'medium',
      density: 'comfortable',
      animations: true,
      accentColor: '#38bdf8',
      highContrast: false
    };
    setLocalPreferences(defaults);
    updateThemePreferences(defaults);
    applyThemePreferences(defaults);
  };

  const exportTheme = () => {
    const themeData = {
      ...localPreferences,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smart-budget-theme.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importTheme = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const themeData = JSON.parse(e.target.result);
          if (themeData.version) {
            setLocalPreferences(themeData);
            updateThemePreferences(themeData);
            applyThemePreferences(themeData);
            alert('Theme imported successfully!');
          } else {
            alert('Invalid theme file format!');
          }
        } catch (error) {
          alert('Error importing theme!');
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    applyThemePreferences(localPreferences);
  }, []);

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--text)' }}>Theme Preferences</h3>

      {/* Theme Mode */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Theme Mode</h4>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[
            { id: 'light', name: 'Light', icon: '☀️' },
            { id: 'dark', name: 'Dark', icon: '🌙' }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => handlePreferenceChange('mode', mode.id)}
              style={{
                padding: '1rem',
                border: `2px solid ${localPreferences.mode === mode.id ? 'var(--primary)' : '#e5e7eb'}`,
                borderRadius: '8px',
                background: localPreferences.mode === mode.id ? 'var(--primary)' : 'var(--bg)',
                color: localPreferences.mode === mode.id ? 'white' : 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1.1rem',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{mode.icon}</span>
              <span>{mode.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Scheme */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Color Scheme</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1rem'
        }}>
          {colorSchemes.map(scheme => (
            <button
              key={scheme.id}
              onClick={() => handlePreferenceChange('colorScheme', scheme.id)}
              style={{
                padding: '1rem',
                border: `2px solid ${localPreferences.colorScheme === scheme.id ? scheme.primary : '#e5e7eb'}`,
                borderRadius: '8px',
                background: `linear-gradient(135deg, ${scheme.primary}, ${scheme.secondary})`,
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {localPreferences.colorScheme === scheme.id && '✓'}
              </div>
              <span>{scheme.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Font Size</h4>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {fontSizes.map(size => (
            <label
              key={size.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                border: `2px solid ${localPreferences.fontSize === size.id ? 'var(--primary)' : '#e5e7eb'}`,
                borderRadius: '8px',
                backgroundColor: 'var(--bg)',
                cursor: 'pointer',
                transition: 'border-color 0.2s'
              }}
            >
              <input
                type="radio"
                name="fontSize"
                value={size.id}
                checked={localPreferences.fontSize === size.id}
                onChange={(e) => handlePreferenceChange('fontSize', e.target.value)}
                style={{ margin: 0 }}
              />
              <div>
                <div style={{ fontWeight: '500', color: 'var(--text)' }}>{size.name}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{size.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Layout Density */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Layout Density</h4>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {densities.map(density => (
            <label
              key={density.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                border: `2px solid ${localPreferences.density === density.id ? 'var(--primary)' : '#e5e7eb'}`,
                borderRadius: '8px',
                backgroundColor: 'var(--bg)',
                cursor: 'pointer',
                transition: 'border-color 0.2s'
              }}
            >
              <input
                type="radio"
                name="density"
                value={density.id}
                checked={localPreferences.density === density.id}
                onChange={(e) => handlePreferenceChange('density', e.target.value)}
                style={{ margin: 0 }}
              />
              <div>
                <div style={{ fontWeight: '500', color: 'var(--text)' }}>{density.name}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{density.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Additional Options</h4>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: 'var(--bg)',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={localPreferences.animations}
              onChange={(e) => handlePreferenceChange('animations', e.target.checked)}
              style={{ margin: 0 }}
            />
            <div>
              <div style={{ fontWeight: '500', color: 'var(--text)' }}>Enable Animations</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Smooth transitions and effects</div>
            </div>
          </label>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: 'var(--bg)',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={localPreferences.highContrast}
              onChange={(e) => handlePreferenceChange('highContrast', e.target.checked)}
              style={{ margin: 0 }}
            />
            <div>
              <div style={{ fontWeight: '500', color: 'var(--text)' }}>High Contrast Mode</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Better visibility for accessibility</div>
            </div>
          </label>
        </div>
      </div>

      {/* Theme Management */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Theme Management</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <button
            onClick={exportTheme}
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>📤</span>
            Export Theme
          </button>
          <label style={{
            padding: '0.75rem 1rem',
            background: '#f3f4f6',
            color: 'var(--text)',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'center'
          }}>
            <span>📥</span>
            Import Theme
            <input
              type="file"
              accept=".json"
              onChange={importTheme}
              style={{ display: 'none' }}
            />
          </label>
          <button
            onClick={resetToDefaults}
            style={{
              padding: '0.75rem 1rem',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>🔄</span>
            Reset to Default
          </button>
        </div>
      </div>

      {/* Preview */}
      <div style={{
        padding: '1rem',
        backgroundColor: 'var(--bg)',
        border: '1px solid #e5e7eb',
        borderRadius: '8px'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text)' }}>Preview</h4>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: 'var(--spacing-padding)',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '6px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)'
          }}></div>
          <span style={{
            color: 'var(--text)',
            fontSize: 'var(--font-size-base)'
          }}>
            This is how your theme looks!
          </span>
        </div>
      </div>
    </div>
  );
};

export default ThemePreferences;
