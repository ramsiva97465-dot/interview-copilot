import React from 'react';
import { Download, Monitor, Sparkles, ExternalLink } from 'lucide-react';

export const WebDownloadBanner: React.FC = () => {
    // Only render when opened in a web browser, NOT inside Electron desktop app
    const isElectron = typeof window !== 'undefined' && (
        !!(window as any).electronAPI && !(window as any).electronAPI.isMock
    );

    if (isElectron) return null;

    const handleDownload = () => {
        // Direct download URL for the Windows Desktop Installer (.exe)
        const downloadUrl = 'https://github.com/ramsiva97465-dot/interview-copilot/releases/latest/download/Xivora.Studio-Setup-2.9.0.exe';
        
        // Trigger download
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'Xivora Studio-Setup-2.9.0.exe';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="w-full bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-purple-900/90 border-b border-purple-500/30 px-4 py-2.5 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg z-50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0">
                    <Monitor className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm tracking-tight">Xivora Studio for Windows</span>
                        <span className="text-[10px] bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full border border-purple-400/30 font-medium flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> Desktop App
                        </span>
                    </div>
                    <p className="text-xs text-purple-200/80 hidden sm:block">
                        Download the desktop app for real-time AI interview copilot, screen capture, & low latency answers.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium text-xs px-4 py-2 rounded-lg shadow-md hover:shadow-purple-500/25 transition-all duration-200 cursor-pointer active:scale-95"
                >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download for Windows (.exe)</span>
                </button>
            </div>
        </div>
    );
};
