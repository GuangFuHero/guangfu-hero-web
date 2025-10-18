import { submitReport } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

export const useSubmitIssueReport = () => {
  return useMutation({ mutationFn: submitReport });
};
