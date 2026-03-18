"use client";

import { X } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    // Added 'success' to support the Green Accept button
    variant?: 'danger' | 'primary' | 'success';
    showRemarksField?: boolean;
    remarksValue?: string;
    onRemarksChange?: (value: string) => void;
    remarksPlaceholder?: string;
    remarksRequired?: boolean;
    closeOnConfirm?: boolean;
    disableConfirm?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = 'primary',
    showRemarksField = false,
    remarksValue = '',
    onRemarksChange,
    remarksPlaceholder = 'Add remarks',
    remarksRequired = false,
    closeOnConfirm = true,
    disableConfirm = false,
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    const isConfirmDisabled =
        disableConfirm ||
        (showRemarksField && remarksRequired && !remarksValue.trim());

    const handleConfirm = async () => {
        if (isConfirmDisabled) return;
        await onConfirm();
        if (closeOnConfirm) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-[var(--primary-dark-purple)]">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600 leading-relaxed">{message}</p>
                    {showRemarksField && (
                        <div className="mt-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Remarks{remarksRequired ? ' *' : ''}
                            </label>
                            <textarea
                                value={remarksValue}
                                onChange={(e) => onRemarksChange?.(e.target.value)}
                                placeholder={remarksPlaceholder}
                                rows={3}
                                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-[var(--primary-purple)] focus:ring-2 focus:ring-[var(--primary-purple)]/20"
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 bg-gray-50/50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isConfirmDisabled}
                        className={`px-6 py-2.5 rounded-xl font-semibold text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                            variant === 'danger'
                                ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
                                : variant === 'success'
                                ? 'bg-green-600 hover:bg-green-700 shadow-green-200'
                                : 'bg-[var(--primary-purple)] hover:bg-[var(--primary-dark-purple)] shadow-purple-200'
                        } ${isConfirmDisabled ? 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100' : ''}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}