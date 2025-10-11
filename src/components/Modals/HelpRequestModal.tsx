import { useModal } from "@/providers/ModalProvider";
import { useToast } from "@/providers/ToastProvider";
import { HelpRequestData, UserPosition } from "@/types/map";

interface HelpRequestModalProps {
  userPosition: UserPosition | null;
}

export default function HelpRequestModal({
  userPosition,
}: HelpRequestModalProps) {
  const { isHelpModalOpen, closeHelpModal } = useModal();
  const { showToast } = useToast();

  if (!isHelpModalOpen) return null;

  const handleHelpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const peopleNeeded = parseInt(formData.get("peopleNeeded") as string, 10);

    if (isNaN(peopleNeeded) || peopleNeeded < 1) {
      showToast("請輸入有效的人數（至少1人）", "error");
      return;
    }

    const helpRequest: HelpRequestData = {
      peopleNeeded,
      type: formData.get("requestType") as string,
      urgency: (formData.get("urgencyLevel") as string) || "medium",
      contactPerson: formData.get("contactPerson") as string,
      contactPhone: formData.get("contactPhone") as string,
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      coordinates: userPosition || undefined,
      timestamp: new Date().toISOString(),
    };

    // 模擬提交（實際應用中應該發送到後端）
    console.log("提交人力請求:", helpRequest);
    showToast("人力請求已提交，相關單位將盡快與您聯繫", "success");
    closeHelpModal();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1001">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">請求人力支援</h3>
          <button
            onClick={closeHelpModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <form onSubmit={handleHelpSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="requestType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              請求類型
            </label>
            <select
              id="requestType"
              name="requestType"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">請選擇請求類型</option>
              <option value="rescue">救援人力</option>
              <option value="medical">醫療人力</option>
              <option value="cleanup">清理人力</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="peopleNeeded"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              所需人數
            </label>
            <input
              type="number"
              id="peopleNeeded"
              name="peopleNeeded"
              min="1"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="contactPerson"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              聯絡人
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="contactPhone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              聯絡電話
            </label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              詳細地點
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="將自動填入當前位置"
              defaultValue={
                userPosition
                  ? `緯度: ${userPosition.lat.toFixed(
                      6,
                    )}, 經度: ${userPosition.lng.toFixed(6)}`
                  : ""
              }
              readOnly
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              詳細描述
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請詳細描述需要的協助內容..."
              required
            ></textarea>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={closeHelpModal}
              className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="cursor-pointer flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              提交請求
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
