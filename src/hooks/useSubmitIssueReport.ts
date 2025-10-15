import { submitIssueReport } from '@/lib/apis';
import { useMutation } from '@tanstack/react-query';

export const useSubmitIssueReport = () => {
  return useMutation({ mutationFn: submitIssueReport });
};
