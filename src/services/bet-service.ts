import { ref } from "vue";
import axios from "axios";
import { BetModel, ProviderModel } from "@/models";
import { ProviderBet } from "@/enums";

const HEADER = {
  "Content-Type": "application/json",
};

console.log(import.meta.env);

// Define the composable
export function useBetService() {
  const bets = ref<BetModel[]>([]);
  const providerBets = ref<ProviderModel>({ esportsBet: [], thunderPick: [] });
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  // Function to fetch bets
  const fetchBets = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get<BetModel[]>(`/api/unmapping`);
      console.log(response.data);
      bets.value = response.data;

      providerBets.value = {
        esportsBet: bets.value.filter(
          (item) => item.provider == ProviderBet.ESPORTS_BET
        ),
        thunderPick: bets.value.filter(
          (item) => item.provider == ProviderBet.THUNDER_PICK
        ),
      };
    } catch (err) {
      error.value = "Error fetching bets: " + (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  // Function to place a bet
  const placeBet = async (betsParam: BetModel[]) => {
    loading.value = true;
    error.value = null;

    const data = {
      type: betsParam[0].type,
      property: betsParam.map((item) => {
        return { provider: item.provider, value: item.value };
      }),
    };

    try {
      await axios.post<boolean>(`/api/mapping`, JSON.stringify(data), {
        headers: HEADER,
      });
    } catch (err) {
      error.value = "Error placing bet: " + (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  // Return the composable API
  return {
    bets,
    providerBets,
    error,
    loading,
    fetchBets,
    placeBet,
  };
}
