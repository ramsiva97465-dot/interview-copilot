import React from 'react';
import { motion } from 'framer-motion';
import { Code2, FileText, Presentation, Sliders, Sparkles, ArrowUpRight } from 'lucide-react';
import { useT } from '../i18n';

interface ModeSelectionCardsProps {
    onSelectMode: (modeKey: string) => void;
    isLight?: boolean;
}

export const ModeSelectionCards: React.FC<ModeSelectionCardsProps> = ({ onSelectMode, isLight = false }) => {
    const t = useT();

    const MODES = [
        {
            id: 'technical-interview',
            title: 'Interview Copilot',
            desc: 'Live Coding, DSA, System Design & STAR behavioral answers.',
            icon: Code2,
            badge: 'Popular',
            badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
            bgGradient: isLight 
                ? 'from-purple-50 via-white to-purple-50/30 border-purple-200/80 hover:border-purple-400' 
                : 'from-purple-950/40 via-purple-900/20 to-black/40 border-purple-500/20 hover:border-purple-400/50',
            iconBg: 'bg-purple-500/20 text-purple-400',
            hoverGlow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]',
        },
        {
            id: 'team-meet',
            title: 'Summarize Meeting',
            desc: 'Real-time notes, key takeaways & automated action items.',
            icon: FileText,
            badge: 'Audio STT',
            badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
            bgGradient: isLight 
                ? 'from-emerald-50 via-white to-emerald-50/30 border-emerald-200/80 hover:border-emerald-400' 
                : 'from-emerald-950/40 via-emerald-900/20 to-black/40 border-emerald-500/20 hover:border-emerald-400/50',
            iconBg: 'bg-emerald-500/20 text-emerald-400',
            hoverGlow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]',
        },
        {
            id: 'sales',
            title: 'Presentation Co-pilot',
            desc: 'Slide explanations, key talking points & audience Q&A assistance.',
            icon: Presentation,
            badge: 'Vision AI',
            badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
            bgGradient: isLight 
                ? 'from-amber-50 via-white to-amber-50/30 border-amber-200/80 hover:border-amber-400' 
                : 'from-amber-950/40 via-amber-900/20 to-black/40 border-amber-500/20 hover:border-amber-400/50',
            iconBg: 'bg-amber-500/20 text-amber-400',
            hoverGlow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]',
        },
        {
            id: 'general',
            title: 'Custom & Others',
            desc: 'Screen analysis, research, document Q&A & custom prompts.',
            icon: Sliders,
            badge: 'Flexible',
            badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
            bgGradient: isLight 
                ? 'from-sky-50 via-white to-sky-50/30 border-sky-200/80 hover:border-sky-400' 
                : 'from-sky-950/40 via-sky-900/20 to-black/40 border-sky-500/20 hover:border-sky-400/50',
            iconBg: 'bg-sky-500/20 text-sky-400',
            hoverGlow: 'hover:shadow-[0_0_25px_rgba(14,165,233,0.25)]',
        },
    ];

    return (
        <div className="w-full h-full flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-2.5 h-full">
                {MODES.map((mode) => {
                    const Icon = mode.icon;
                    return (
                        <motion.button
                            key={mode.id}
                            whileHover={{ scale: 1.015, y: -1 }}
                            whileTap={{ scale: 0.985 }}
                            onClick={() => onSelectMode(mode.id)}
                            className={`relative text-left p-3.5 rounded-xl border bg-gradient-to-br transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group ${mode.bgGradient} ${mode.hoverGlow}`}
                        >
                            {/* Card Header */}
                            <div className="flex items-center justify-between w-full mb-1">
                                <div className="flex items-center gap-2">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${mode.iconBg} transition-transform group-hover:scale-110 duration-200`}>
                                        <Icon size={16} />
                                    </div>
                                    <span className="text-[13px] font-semibold text-text-primary tracking-tight">
                                        {t(mode.title)}
                                    </span>
                                </div>
                                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${mode.badgeColor}`}>
                                    {mode.badge}
                                </span>
                            </div>

                            {/* Card Description */}
                            <p className="text-[11px] text-text-secondary leading-[1.35] line-clamp-2 mt-1 mb-1 font-normal opacity-90">
                                {mode.desc}
                            </p>

                            {/* Card Footer action link */}
                            <div className="flex items-center justify-end text-[10px] font-medium text-text-tertiary group-hover:text-accent-primary transition-colors">
                                <span className="flex items-center gap-0.5">
                                    {t('Start Mode')}
                                    <ArrowUpRight size={11} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </span>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};
