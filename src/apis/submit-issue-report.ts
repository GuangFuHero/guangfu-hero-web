import { IssueReportData } from '@/types/map';
import { createApiRequest } from './config';

export const submitIssueReport = async (
  reportData: IssueReportData
): Promise<any> => {
  return createApiRequest('/reports', {
    method: 'POST',
    body: JSON.stringify(reportData),
  });
};
