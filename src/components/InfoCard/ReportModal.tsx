'use client';

import React, { useState } from 'react';
import { submitReport } from '@/lib/api';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationType: string;
  locationName: string;
  locationId: string;
}

type ModalStep = 'form' | 'success';

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  locationType,
  locationName,
  locationId,
}) => {
  const [step, setStep] = useState<ModalStep>('form');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('請填寫問題原因');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitReport({
        name: locationName,
        location_type: locationType,
        location_id: locationId,
        reason: reason.trim(),
        notes: '',
        status: 'false',
      });

      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失敗,請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setReason('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 z-[70] bg-[var(--black-overlay)] backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal 內容 */}
      <div className="fixed inset-0 z-[80] flex items-end pointer-events-none">
        <div
          className="bg-white rounded-t-2xl w-full max-h-[85vh] overflow-y-auto animate-slide-up shadow-lg pointer-events-auto"
          onClick={e => e.stopPropagation()}
        >
          {step === 'form' ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-center p-6 pb-4 border-b border-[var(--gray-3)]">
                <button onClick={handleClose} className="text-[var(--gray)] hover:text-gray-800">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <h2 className="text-xl font-bold text-[var(--text-black)]">回報問題</h2>
                <button
                  onClick={handleClose}
                  className="text-[var(--gray-2)] hover:text-[var(--gray)] text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="px-6 py-4 space-y-4">
                {/* 問題點類型 */}
                <div>
                  <label className="block text-sm font-medium text-[var(--gray)] mb-2">
                    問題點類型
                  </label>
                  <input
                    type="text"
                    value={locationType}
                    disabled
                    className="w-full px-4 py-3 bg-[var(--gray-4)] text-[var(--gray)] rounded-lg cursor-not-allowed"
                  />
                </div>

                {/* 問題點名稱 */}
                <div>
                  <label className="block text-sm font-medium text-[var(--gray)] mb-2">
                    問題點名稱
                  </label>
                  <input
                    type="text"
                    value={locationName}
                    disabled
                    className="w-full px-4 py-3 bg-[var(--gray-4)] text-[var(--gray)] rounded-lg cursor-not-allowed"
                  />
                </div>

                {/* 問題原因 */}
                <div>
                  <label className="block text-sm font-medium text-[var(--gray)] mb-2">
                    問題原因 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={e => {
                      setReason(e.target.value);
                      setError(null);
                    }}
                    placeholder="請描述您發現的問題..."
                    rows={4}
                    className="w-full px-4 py-3 border border-[var(--gray-3)] bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-[#009688] focus:border-transparent resize-none"
                  />
                  {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="px-6 pb-6 pt-2 flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 bg-[var(--gray-3)] text-[var(--gray)] py-3 rounded-lg font-medium hover:bg-[var(--gray-2)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-[#C96319] text-white py-3 rounded-lg font-medium hover:bg-[#B55815] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '提交中...' : '提交回報'}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Success Screen */}
              <div className="p-6">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleClose}
                    className="text-[var(--gray-2)] hover:text-[var(--gray)] text-xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-center py-8">
                  {/* 成功圖示 */}
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-[var(--text-black)] mb-2">提交完成</h2>
                  <p className="text-[var(--gray)] mb-8">
                    您的回報已成功送出
                    <br />
                    感謝您的協助!
                  </p>

                  <button
                    onClick={handleClose}
                    className="bg-[#C96319] text-white py-3 px-8 rounded-lg font-medium hover:bg-[#B55815] transition-colors"
                  >
                    確定
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ReportModal;
