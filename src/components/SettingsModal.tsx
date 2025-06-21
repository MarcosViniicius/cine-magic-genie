
import React, { useState, useEffect } from 'react';
import { X, Settings, Monitor, Palette, Globe, Bell, Shield } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserSettings {
  theme: 'dark' | 'light' | 'auto';
  language: 'pt' | 'en' | 'es';
  notifications: boolean;
  autoplay: boolean;
  dataUsage: 'low' | 'medium' | 'high';
  adultContent: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'dark',
    language: 'pt',
    notifications: true,
    autoplay: true,
    dataUsage: 'medium',
    adultContent: false
  });

  useEffect(() => {
    // Carregar configurações do localStorage
    const savedSettings = localStorage.getItem('cinemind-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem('cinemind-settings', JSON.stringify(newSettings));
  };

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Configurações</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
          {/* Aparência */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Palette className="w-5 h-5 text-slate-400" />
              <h4 className="text-lg font-semibold text-white">Aparência</h4>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <label className="block text-white text-sm font-medium mb-3">Tema</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'dark', label: 'Escuro', icon: Monitor },
                  { value: 'light', label: 'Claro', icon: Monitor },
                  { value: 'auto', label: 'Auto', icon: Monitor }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => handleSettingChange('theme', value)}
                    className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center space-y-2 ${
                      settings.theme === value
                        ? 'border-pink-500 bg-pink-500/10'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                    <span className="text-white text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Idioma */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-slate-400" />
              <h4 className="text-lg font-semibold text-white">Idioma</h4>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-pink-500 focus:outline-none"
              >
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>

          {/* Notificações */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-slate-400" />
              <h4 className="text-lg font-semibold text-white">Notificações</h4>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Notificações Push</p>
                  <p className="text-slate-400 text-sm">Receba alertas sobre novos filmes</p>
                </div>
                <button
                  onClick={() => handleSettingChange('notifications', !settings.notifications)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.notifications ? 'bg-pink-500' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.notifications ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Reprodução Automática</p>
                  <p className="text-slate-400 text-sm">Reproduzir trailers automaticamente</p>
                </div>
                <button
                  onClick={() => handleSettingChange('autoplay', !settings.autoplay)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.autoplay ? 'bg-pink-500' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.autoplay ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Privacidade */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-slate-400" />
              <h4 className="text-lg font-semibold text-white">Privacidade</h4>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Conteúdo Adulto</p>
                  <p className="text-slate-400 text-sm">Incluir filmes com classificação adulta</p>
                </div>
                <button
                  onClick={() => handleSettingChange('adultContent', !settings.adultContent)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.adultContent ? 'bg-pink-500' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.adultContent ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-3">Uso de Dados</label>
                <select
                  value={settings.dataUsage}
                  onChange={(e) => handleSettingChange('dataUsage', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-pink-500 focus:outline-none"
                >
                  <option value="low">Baixo (apenas texto)</option>
                  <option value="medium">Médio (imagens comprimidas)</option>
                  <option value="high">Alto (qualidade máxima)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
