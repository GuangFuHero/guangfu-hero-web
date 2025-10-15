import { IssueReportData } from '@/lib/types/map';

export const submitIssueReport = async (reportData: IssueReportData): Promise<void> => {
  fetch('/devapi/reports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reportData),
  });
};
