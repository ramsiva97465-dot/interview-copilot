import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    Upload, 
    FileText, 
    Trash2, 
    Check, 
    Mic, 
    FileCheck, 
    Briefcase, 
    User, 
    Sparkles, 
    AlertCircle,
    Building2,
    ShieldCheck,
    TrendingUp,
    Crown
} from 'lucide-react';
import { useT } from '../i18n';

interface CustomModeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStartMeeting: (options?: {
        recordAudio?: boolean;
        generateSummary?: boolean;
        customRole?: string;
        userName?: string;
    }) => void;
    isLight?: boolean;
}

interface UploadedFile {
    id: string;
    fileName: string;
    createdAt?: string;
}

const PRESET_ROLES = [
    {
        id: 'accounting-manager',
        title: 'Accounting Manager',
        icon: Building2,
        desc: 'Financial reports, auditing, compliance & budget tracking',
        badge: 'Finance',
        color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300'
    },
    {
        id: 'qa-tester',
        title: 'QA / Software Tester',
        icon: ShieldCheck,
        desc: 'Test cases, bug reports, automation & sprint quality analysis',
        badge: 'Engineering',
        color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-300'
    },
    {
        id: 'marketing-head',
        title: 'Marketing Head',
        icon: TrendingUp,
        desc: 'Campaign ROI, GTM strategy, branding & growth metrics',
        badge: 'Growth',
        color: 'from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-300'
    },
    {
        id: 'ceo-executive',
        title: 'CEO / Executive Board',
        icon: Crown,
        desc: 'High-level governance, investor relations & strategic decisions',
        badge: 'Executive',
        color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-300'
    }
];

export const CustomModeModal: React.FC<CustomModeModalProps> = ({
    isOpen,
    onClose,
    onStartMeeting,
    isLight = false
}) => {
    const t = useT();
    
    // State
    const [selectedRole, setSelectedRole] = useState<string>('Accounting Manager');
    const [customRoleInput, setCustomRoleInput] = useState<string>('Accounting Manager');
    const [userName, setUserName] = useState<string>(() => {
        return localStorage.getItem('meetfloo_user_name') || '';
    });
    const [recordAudio, setRecordAudio] = useState<boolean>(() => {
        const saved = localStorage.getItem('meetfloo_record_audio');
        return saved !== null ? saved === 'true' : true;
    });
    const [generateSummary, setGenerateSummary] = useState<boolean>(() => {
        const saved = localStorage.getItem('meetfloo_generate_summary');
        return saved !== null ? saved === 'true' : true;
    });

    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [targetModeId, setTargetModeId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isStarting, setIsStarting] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize or retrieve custom mode ID
    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;
        const initMode = async () => {
            try {
                const modes = await (window.electronAPI as any)?.modesGetAll?.();
                if (!Array.isArray(modes)) return;

                let customMode = modes.find((m: any) => m.templateType === 'general' || m.id === 'general');
                if (!customMode) {
                    customMode = modes.find((m: any) => m.templateType === 'custom' || m.name?.toLowerCase().includes('custom'));
                }

                if (!customMode && (window.electronAPI as any)?.modesCreate) {
                    const res = await (window.electronAPI as any).modesCreate({
                        name: 'Custom Mode',
                        templateType: 'general'
                    });
                    if (res?.success && res.mode) {
                        customMode = res.mode;
                    }
                }

                if (customMode && isMounted) {
                    setTargetModeId(customMode.id);
                    // Load existing reference files
                    const files = await (window.electronAPI as any)?.modesGetReferenceFiles?.(customMode.id);
                    if (Array.isArray(files) && isMounted) {
                        setUploadedFiles(files);
                    }
                }
            } catch (err) {
                console.error('[CustomModeModal] Error initializing mode:', err);
            }
        };

        initMode();
        return () => {
            isMounted = false;
        };
    }, [isOpen]);

    // Handle role chip click
    const handleSelectPreset = (roleTitle: string) => {
        setSelectedRole(roleTitle);
        setCustomRoleInput(roleTitle);
    };

    // Handle file upload
    const handleFileUpload = async (directPath?: string) => {
        if (!targetModeId) return;
        setIsUploading(true);
        setUploadError(null);

        try {
            const res = await (window.electronAPI as any)?.modesUploadReferenceFile?.(targetModeId, directPath);
            if (res?.success && res.file) {
                setUploadedFiles(prev => [...prev, res.file]);
            } else if (!res?.cancelled && res?.error) {
                setUploadError(res.error);
            }
        } catch (err: any) {
            setUploadError(err?.message || 'Failed to upload document');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Handle delete file
    const handleDeleteFile = async (fileId: string) => {
        try {
            const res = await (window.electronAPI as any)?.modesDeleteReferenceFile?.(fileId);
            if (res?.success) {
                setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
            }
        } catch (err) {
            console.error('[CustomModeModal] Error deleting reference file:', err);
        }
    };

    // Handle Drag & Drop
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            const filePath = (file as any).path;
            if (filePath) {
                handleFileUpload(filePath);
            }
        }
    };

    // Handle Start Meeting
    const handleStart = async () => {
        setIsStarting(true);
        try {
            // Save preferences
            localStorage.setItem('meetfloo_user_name', userName.trim());
            localStorage.setItem('meetfloo_record_audio', recordAudio ? 'true' : 'false');
            localStorage.setItem('meetfloo_generate_summary', generateSummary ? 'true' : 'false');

            const finalRole = customRoleInput.trim() || selectedRole || 'Professional';

            if (targetModeId) {
                const contextText = `You are an AI Copilot for ${userName.trim() || 'the user'} in the role of ${finalRole}. Ground all answers in company reference documents, technical standards, and real-time meeting context. Maintain an executive, accurate, and professional tone.`;

                await (window.electronAPI as any)?.modesUpdate?.(targetModeId, {
                    name: finalRole,
                    customContext: contextText
                });

                await (window.electronAPI as any)?.modesSetActive?.(targetModeId);
            }

            onStartMeeting({
                recordAudio,
                generateSummary,
                customRole: finalRole,
                userName: userName.trim()
            });

            onClose();
        } catch (err) {
            console.error('[CustomModeModal] Start meeting error:', err);
        } finally {
            setIsStarting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className={`relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
                    isLight 
                        ? 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-400/20' 
                        : 'bg-[#111114] border-white/10 text-white shadow-black/80'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-sky-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm">
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold tracking-tight text-text-primary flex items-center gap-2">
                                {t('Custom & Professional Mode')}
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                    MeetFloo AI
                                </span>
                            </h2>
                            <p className="text-xs text-text-secondary mt-0.5">
                                {t('Customize your role, grounding documents, and session options.')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-white/[0.06] transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 space-y-6">
                    {/* 1. Preset Roles Grid */}
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2.5 flex items-center gap-1.5">
                            <Briefcase size={13} />
                            {t('1. Select Your Role / Designation')}
                        </label>
                        <div className="grid grid-cols-2 gap-2.5">
                            {PRESET_ROLES.map((role) => {
                                const Icon = role.icon;
                                const isSelected = selectedRole === role.title;
                                return (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => handleSelectPreset(role.title)}
                                        className={`relative text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                                            isSelected 
                                                ? `${role.color} ring-1 ring-white/30 shadow-lg` 
                                                : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/20'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-1">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-white/10 text-text-secondary'}`}>
                                                    <Icon size={14} />
                                                </div>
                                                <span className="text-xs font-semibold text-text-primary">
                                                    {role.title}
                                                </span>
                                            </div>
                                            {isSelected && (
                                                <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                                                    <Check size={10} strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-text-secondary line-clamp-2 mt-0.5 opacity-80">
                                            {role.desc}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Custom role input */}
                        <div className="mt-2.5">
                            <input
                                type="text"
                                value={customRoleInput}
                                onChange={(e) => {
                                    setCustomRoleInput(e.target.value);
                                    setSelectedRole('');
                                }}
                                placeholder={t('Or type a custom role (e.g. Senior Project Architect, DevOps Lead)...')}
                                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-400/80 focus:ring-1 focus:ring-purple-400/30 text-text-primary placeholder:text-text-tertiary/70 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* 2. User Name */}
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2 flex items-center gap-1.5">
                            <User size={13} />
                            {t('2. Your Name')}
                        </label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder={t('e.g. Sivaram, John Doe')}
                            className="w-full px-3.5 py-2 text-xs rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-400/80 focus:ring-1 focus:ring-purple-400/30 text-text-primary placeholder:text-text-tertiary/70 outline-none transition-all"
                        />
                    </div>

                    {/* 3. Company Documents / Grounding Files */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                                <FileText size={13} />
                                {t('3. Company PDF & Word Documents (Real-time Knowledge)')}
                            </label>
                            <span className="text-[11px] text-text-tertiary">
                                {uploadedFiles.length} {uploadedFiles.length === 1 ? 'file' : 'files'} attached
                            </span>
                        </div>

                        {/* Dropzone */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            onDrop={handleDrop}
                            onClick={() => handleFileUpload()}
                            className="relative border-2 border-dashed border-white/15 hover:border-purple-400/50 rounded-xl p-4 text-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.docx,.doc,.txt,.md,.csv"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const file = e.target.files[0];
                                        const filePath = (file as any).path;
                                        handleFileUpload(filePath);
                                    }
                                }}
                            />
                            <div className="flex flex-col items-center justify-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Upload size={16} />
                                </div>
                                <div className="text-xs">
                                    <span className="font-semibold text-purple-300 hover:underline">
                                        {isUploading ? t('Uploading & indexing document...') : t('Click to browse company documents')}
                                    </span>
                                    <span className="text-text-tertiary"> {t('or drag and drop here')}</span>
                                </div>
                                <p className="text-[10px] text-text-tertiary">
                                    {t('Supported: PDF, Word (.docx), Markdown (.md), Text (.txt), CSV')}
                                </p>
                            </div>
                        </div>

                        {uploadError && (
                            <div className="mt-2 text-xs text-red-400 flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
                                <AlertCircle size={13} />
                                <span>{uploadError}</span>
                            </div>
                        )}

                        {/* Uploaded File List */}
                        {uploadedFiles.length > 0 && (
                            <div className="mt-3 space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                                {uploadedFiles.map((file) => (
                                    <div
                                        key={file.id}
                                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <FileCheck size={14} className="text-emerald-400 shrink-0" />
                                            <span className="text-text-primary truncate font-medium">
                                                {file.fileName}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteFile(file.id);
                                            }}
                                            className="w-6 h-6 rounded flex items-center justify-center text-text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                                            title={t('Remove document')}
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 4. Session & Output Options */}
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2.5 flex items-center gap-1.5">
                            <Sparkles size={13} />
                            {t('4. Meeting Output & Recording Options')}
                        </label>
                        <div className="space-y-2.5">
                            {/* Summary Option */}
                            <label className="flex items-start justify-between gap-3 p-3 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-colors">
                                <div className="min-w-0">
                                    <span className="text-xs font-medium text-text-primary block">
                                        {t('Generate Meeting Summary & Transcript Notes')}
                                    </span>
                                    <span className="text-[11px] text-text-tertiary leading-relaxed block mt-0.5">
                                        {t('Produces structured notes, key takeaways, and action items at the end of the meeting.')}
                                    </span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={generateSummary}
                                    onChange={(e) => setGenerateSummary(e.target.checked)}
                                    className="w-4 h-4 rounded border-zinc-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 mt-0.5 cursor-pointer"
                                />
                            </label>

                            {/* Full Audio Recording Option */}
                            <label className="flex items-start justify-between gap-3 p-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] hover:bg-amber-500/[0.06] cursor-pointer transition-colors">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-amber-300 block">
                                            {t('Record Full Meeting Audio (.wav)')}
                                        </span>
                                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                            Recommended
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-text-tertiary leading-relaxed block mt-0.5">
                                        {t('Records microphone and system sound into a 16kHz WAV audio file saved at meeting completion.')}
                                    </span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={recordAudio}
                                    onChange={(e) => setRecordAudio(e.target.checked)}
                                    className="w-4 h-4 rounded border-amber-500/50 text-amber-500 focus:ring-amber-400 focus:ring-offset-0 mt-0.5 cursor-pointer"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-white/[0.08] flex items-center justify-end gap-3 bg-white/[0.01]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-medium rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors"
                    >
                        {t('Cancel')}
                    </button>
                    <button
                        type="button"
                        onClick={handleStart}
                        disabled={isStarting}
                        className="px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-500 hover:via-indigo-500 hover:to-sky-500 text-white shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {isStarting ? (
                            <span>{t('Starting…')}</span>
                        ) : (
                            <>
                                <Sparkles size={14} />
                                <span>{t('Start Meeting with Custom Mode')}</span>
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default CustomModeModal;
