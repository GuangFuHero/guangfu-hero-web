import { useSubmitIssueReport } from '@/hooks/useSubmitIssueReport';
import { useModal } from '@/providers/ModalProvider';
import { IssueReportData } from '@/types/map';

export default function ReportIssueModal() {
  const { isReportModalOpen, reportData, closeReportModal } = useModal();
  const submitIssueReportMutation = useSubmitIssueReport();

  if (!isReportModalOpen) return null;

  const handleReportSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!reportData) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const report: IssueReportData = {
      location_type: reportData.category,
      location_id: reportData.id,
      name: reportData.name,
      reason: formData.get('reason') as string,
      status: 'false',
    };

    try {
      await submitIssueReportMutation.mutateAsync(report);
      closeReportModal();
    } catch (error) {
      console.error(error);
      // 錯誤處理已在 mutation 的 onError 中處理
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1001">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">回報問題</h3>
          <button
            onClick={closeReportModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="reportCategory"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              問題點類型
            </label>
            <input
              type="text"
              id="reportCategory"
              name="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              value={reportData?.category || ''}
              readOnly
            />
          </div>

          <div>
            <label htmlFor="reportName" className="block text-sm font-medium text-gray-700 mb-1">
              問題點名稱
            </label>
            <input
              type="text"
              id="reportName"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              value={reportData?.name || ''}
              readOnly
            />
          </div>

          <div>
            <label htmlFor="issueReason" className="block text-sm font-medium text-gray-700 mb-1">
              問題原因 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="issueReason"
              name="reason"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="請描述您發現的問題..."
              required
            ></textarea>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={closeReportModal}
              className="cursor-pointer flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="cursor-pointer flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              disabled={submitIssueReportMutation.isPending}
            >
              {submitIssueReportMutation.isPending ? '提交中...' : '提交回報'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
