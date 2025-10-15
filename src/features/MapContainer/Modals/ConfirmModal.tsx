import { useModal } from '@/providers/ModalProvider';

export default function ConfirmModal() {
  const { isConfirmModalOpen, confirmData, closeModal } = useModal();

  if (!isConfirmModalOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-1001">
      <div className="bg-white rounded-[12px] p-6 w-full max-w-md mx-4">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{confirmData?.title || '確認'}</h3>
          <div
            className="text-gray-600 font-medium"
            dangerouslySetInnerHTML={{
              __html: confirmData?.message?.replaceAll(/\r\n/g, '<br>') || '',
            }}
          />
        </div>

        <div className="flex space-x-3">
          <button
            className="cursor-pointer font-medium flex-1 px-4 py-2 border border-gray-300 rounded-[12px] text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => {
              if (confirmData?.onCancel) confirmData.onCancel();
              else closeModal();
            }}
          >
            取消
          </button>
          <button
            className="cursor-pointer font-medium flex-1 px-4 py-2 bg-blue-600 text-white rounded-[12px] hover:bg-blue-700 transition-colors"
            onClick={() => {
              confirmData?.onConfirm();
            }}
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
}
