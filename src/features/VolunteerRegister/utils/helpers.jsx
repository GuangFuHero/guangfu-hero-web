export const safeApiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`請求失敗 (${response.status})`);
    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    console.error('API錯誤:', err.message);
    return { success: false, error: err.message };
  }
};
