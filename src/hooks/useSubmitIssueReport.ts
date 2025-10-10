import { submitIssueReport } from '@/apis';
import { useToast } from '@/providers/ToastProvider';
import { useMutation } from '@tanstack/react-query';

export const useSubmitIssueReport = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: submitIssueReport,
    onSuccess: () => {
      showToast('問題已成功回報，謝謝您的反饋！', 'success');
    },
    onError: (error: Error) => {
      console.error('提交問題回報失敗:', error);
      showToast('提交失敗，請稍後再試', 'error');
    },
  });
};
