import { ref, computed } from "vue";

export function useFetch<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  headers: HeadersInit = { "Content-Type": "application/json" }
) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(true);

  const fetchData = async () => {
    loading.value = true;
    error.value = null;
    try {
      const options: RequestInit = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      };
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      data.value = (await response.json()) as any;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  fetchData();

  return {
    data: computed(() => data.value),
    error: computed(() => error.value),
    loading: computed(() => loading.value),
    refetch: fetchData,
  };
}
