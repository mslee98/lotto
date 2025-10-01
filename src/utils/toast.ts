import { toast } from 'react-toastify'

// 공통 toast 설정
const defaultToastOptions = {
  position: "top-right" as const,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
}

// 성공 토스트
export const showSuccessToast = (message: string, autoClose = 2000) => {
  toast.success(message, {
    ...defaultToastOptions,
    autoClose,
  })
}

// 에러 토스트
export const showErrorToast = (message: string, autoClose = 3000) => {
  toast.error(message, {
    ...defaultToastOptions,
    autoClose,
  })
}

// 정보 토스트
export const showInfoToast = (message: string, autoClose = 3000) => {
  toast.info(message, {
    ...defaultToastOptions,
    autoClose,
  })
}

// 경고 토스트
export const showWarningToast = (message: string, autoClose = 3000) => {
  toast.warn(message, {
    ...defaultToastOptions,
    autoClose,
  })
}
