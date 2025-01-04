import { useLoadingStore } from "@/store/useLoadingStore";

export const useLoading = () => {
  const { isLoading, setIsLoading } = useLoadingStore();

  const showLoading = () => setIsLoading(true)
  const hideLoading = () => setIsLoading(false)

  return { isLoading, showLoading, hideLoading }
}

