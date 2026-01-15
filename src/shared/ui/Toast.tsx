import { useEffect } from "react";
import { Star, XCircle, Trash2, Edit2, Settings } from "lucide-react";

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: "success" | "error" | "info" | "edit" | "settings";
  duration?: number;
}

export const Toast = ({
  isOpen,
  onClose,
  message,
  type = "success",
  duration = 2000,
}: ToastProps) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const configMap = {
    success: {
      Icon: Star,
      iconColor: "text-white",
      bg: "from-[#70C1D3] via-[#5FB5C9] to-[#5BA9BE]",
      shadowColor: "shadow-[#70C1D3]/40",
      borderColor: "border-[#70C1D3]/30",
      bgGradient: "from-[#70C1D3]/5 via-[#70C1D3]/10 to-transparent",
    },
    error: {
      Icon: XCircle,
      iconColor: "text-white",
      bg: "from-orange-500 via-orange-500 to-orange-600",
      shadowColor: "shadow-orange-500/40",
      borderColor: "border-orange-500/30",
      bgGradient: "from-orange-500/5 via-orange-500/10 to-transparent",
    },
    info: {
      Icon: Trash2,
      iconColor: "text-white",
      bg: "from-red-500 via-red-500 to-red-600",
      shadowColor: "shadow-red-500/40",
      borderColor: "border-red-500/30",
      bgGradient: "from-red-500/5 via-red-500/10 to-transparent",
    },
    edit: {
      Icon: Edit2,
      iconColor: "text-white",
      bg: "from-lime-500 via-lime-500 to-lime-600",
      shadowColor: "shadow-lime-500/40",
      borderColor: "border-lime-500/30",
      bgGradient: "from-lime-500/5 via-lime-500/10 to-transparent",
    },
    settings: {
      Icon: Settings,
      iconColor: "text-white",
      bg: "from-[#70C1D3] via-[#5FB5C9] to-[#5BA9BE]",
      shadowColor: "shadow-[#70C1D3]/40",
      borderColor: "border-[#70C1D3]/30",
      bgGradient: "from-[#70C1D3]/5 via-[#70C1D3]/10 to-transparent",
    },
  };

  const config = configMap[type];
  const { Icon } = config;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-100 animate-in slide-in-from-top-4 fade-in zoom-in-95 duration-500">
      <div className={`relative bg-white/98 backdrop-blur-2xl rounded-3xl shadow-2xl ${config.shadowColor} overflow-hidden min-w-[320px] max-w-md border ${config.borderColor}`}>
        {/* 애니메이션 배경 그라데이션 */}
        <div className={`absolute inset-0 bg-linear-to-r ${config.bgGradient} animate-pulse`} />
        
        <div className="relative flex items-center gap-4 px-5 py-4">
          {/* 아이콘 - 더 크고 화려하게 */}
          <div className="relative shrink-0">
            {/* 펄스 효과 링 */}
            <div className={`absolute inset-0 rounded-full bg-linear-to-br ${config.bg} opacity-20 blur-md animate-pulse`} />
            
            {/* 아이콘 컨테이너 */}
            <div className={`relative w-12 h-12 rounded-2xl bg-linear-to-br ${config.bg} flex items-center justify-center shadow-xl ${config.shadowColor} transform hover:scale-110 transition-transform duration-300`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} strokeWidth={2.5} />
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 py-1">
            <p className="text-slate-800 font-bold text-base leading-relaxed tracking-tight">
              {message}
            </p>
          </div>
        </div>

        {/* 진행 바 (선택적) */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200/50 overflow-hidden">
          <div
            className={`h-full bg-linear-to-r ${config.bg}`}
            style={{
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};
