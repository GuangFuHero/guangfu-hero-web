import { useSubmitIssueReport } from '@/hooks/useSubmitIssueReport';
import { ReportRequest } from '@/lib/types';
import { useModal } from '@/providers/ModalProvider';
import { useToast } from '@/providers/ToastProvider';
import { useState } from 'react';

type ModalStep = 'form' | 'success';

export default function ReportIssueModal() {
  const { isReportModalOpen, reportData, closeModal, closeReportModalAndReturn } = useModal();
  const { showToast } = useToast();
  const submitIssueReportMutation = useSubmitIssueReport();

  const [step, setStep] = useState<ModalStep>('form');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isReportModalOpen) return null;

  const handleReportSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!reportData || !reason.trim()) {
      setError('請填寫問題原因');
      return;
    }

    const report: ReportRequest = {
      location_type: reportData.category,
      location_id: reportData.id,
      name: reportData.name,
      reason: reason.trim(),
      status: 'false',
    };

    try {
      await submitIssueReportMutation.mutateAsync(report);
      setStep('success');
    } catch (error) {
      console.error('error', error);
      showToast('提交失敗，請稍後再試', 'error');
    }
  };

  const handleClose = () => {
    setStep('form');
    setReason('');
    setError(null);
    closeModal();
  };

  const handleCancel = () => {
    setStep('form');
    setReason('');
    setError(null);
    closeReportModalAndReturn();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-1000 bg-[var(--black-overlay)] backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-1001 flex items-end pointer-events-none">
        <div
          className="bg-white rounded-t-2xl w-full max-h-[85vh] overflow-y-auto animate-slide-up shadow-lg pointer-events-auto"
          onClick={e => e.stopPropagation()}
        >
          {step === 'form' ? (
            <>
              <div className="flex justify-between items-center p-6 pb-4 border-b border-[var(--gray-3)]">
                <button
                  onClick={handleCancel}
                  className="text-[var(--gray)] hover:text-gray-800 cursor-pointer"
                >
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
                  className="text-[var(--gray-2)] hover:text-[var(--gray)] text-xl cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleReportSubmit} className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--gray)] mb-2">
                    問題點類型
                  </label>
                  <input
                    type="text"
                    value={reportData?.category || ''}
                    disabled
                    className="w-full px-4 py-3 bg-[var(--gray-4)] text-[var(--gray)] rounded-lg cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--gray)] mb-2">
                    問題點名稱
                  </label>
                  <input
                    type="text"
                    value={reportData?.name || ''}
                    disabled
                    className="w-full px-4 py-3 bg-[var(--gray-4)] text-[var(--gray)] rounded-lg cursor-not-allowed"
                  />
                </div>

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
                    required
                  />
                  {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={submitIssueReportMutation.isPending}
                    className="flex-1 bg-[var(--gray-3)] text-[var(--gray)] py-3 rounded-lg font-medium hover:bg-[var(--gray-2)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={submitIssueReportMutation.isPending}
                    className="flex-1 bg-[#C96319] text-white py-3 rounded-lg font-medium hover:bg-[#B55815] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitIssueReportMutation.isPending ? '提交中...' : '提交回報'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
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
}
