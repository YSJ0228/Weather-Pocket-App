import { X, AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      {/* 백드롭 */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-80 animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md z-90 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/20 overflow-hidden border border-white/20">
          {/* 배경 그라데이션 */}
          <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-white to-slate-50 opacity-80" />
          
          {/* 내용 */}
          <div className="relative">
            {/* 아이콘 영역 */}
            <div className="flex items-center justify-center pt-10 pb-6">
              <div className="relative">
                {/* 펄스 효과 */}
                <div className="absolute inset-0 rounded-full animate-pulse bg-[#70C1D3]/20" />
                
                {/* 아이콘 컨테이너 */}
                <div className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg bg-linear-to-br from-[#70C1D3] to-[#5BA9BE]">
                  <AlertTriangle className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-all duration-200 active:scale-90 backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 제목 */}
            <div className="px-8 pb-3">
              <h3 className="text-2xl font-black text-slate-800 text-center tracking-tight">
                {title}
              </h3>
            </div>

            {/* 메시지 */}
            <div className="px-8 pb-8">
              <p className="text-slate-600 text-base leading-relaxed text-center">
                {message}
              </p>
            </div>

            {/* 버튼 영역 */}
            <div className="px-6 pb-6 flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3.5 rounded-2xl bg-white text-slate-700 font-bold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md transition-all duration-200 active:scale-95"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-6 py-3.5 rounded-2xl text-white font-bold transition-all duration-200 active:scale-95 shadow-lg bg-linear-to-r from-[#70C1D3] to-[#5BA9BE] hover:from-[#5BA9BE] hover:to-[#4A98AD] shadow-[#70C1D3]/30 hover:shadow-[#70C1D3]/40"
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
