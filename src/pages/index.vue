<template>
  <v-container class="mt-4">
    <v-text-field
      v-model="state.similarityThreshold"
      label="Similarity Threshold"
    />

    <div class="mt-6">
      <div class="mb-4 d-flex items-center justify-between">
        <p class="text-h4">List Data</p>
        <div class="a w-[300px]">
          <v-text-field v-model="state.keySearch" label="Search Value" />
        </div>
      </div>

      <v-data-table
        :headers="state.headers"
        :items="state.dataListSearch"
        :items-per-page-options="[
          { title: '5', value: 5 },
          { title: '10', value: 10 },
          { title: '20', value: 20 },
        ]"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.value }}</td>
            <td>{{ mapNameBet(item.provider) }}</td>
            <td>{{ item.type }}</td>
          </tr>
        </template>
      </v-data-table>
    </div>

    <div class="mt-6">
      <div class="mb-4">
        <p class="text-h4">Auto Generate</p>
      </div>

      <v-row>
        <v-col>
          <v-card :title="mapNameBet(ProviderBet.ESPORTS_BET)">
            <v-virtual-scroll :height="300" :items="[1]">
              <template v-slot:default>
                <div
                  class="bg-gray-600 w-full p-4 min-h-[300px] flex flex-grow relative"
                >
                  <VueDraggable
                    v-model="state.esportsBetList"
                    group="drop"
                    class="flex-1"
                  >
                    <v-btn
                      v-for="(item, index) in state.esportsBetList"
                      :key="item.value"
                      :class="['w-full', index == 0 ? '' : 'mt-2']"
                      class="capitalize-btn"
                    >
                      {{ item.value }}
                    </v-btn>
                  </VueDraggable>
                  <div
                    v-if="!state.esportsBetList.length"
                    class="flex justify-center items-center absolute top-0 left-0 h-full w-full"
                  >
                    <p>Drop here</p>
                  </div>
                </div>
              </template>
            </v-virtual-scroll>
          </v-card>
        </v-col>
        <v-col
          ><v-card :title="mapNameBet(ProviderBet.THUNDER_PICK)">
            <v-virtual-scroll :height="300" :items="[1]">
              <template v-slot:default>
                <div
                  class="bg-gray-600 w-full p-4 min-h-[300px] flex flex-grow relative"
                >
                  <VueDraggable
                    v-model="state.thunderPickList"
                    group="drop"
                    class="flex-1"
                  >
                    <v-btn
                      v-for="(item, index) in state.thunderPickList"
                      :key="item.value"
                      :class="['w-full', index == 0 ? '' : 'mt-2']"
                      class="capitalize-btn"
                    >
                      {{ item.value }}
                    </v-btn>
                  </VueDraggable>
                  <div
                    v-if="!state.thunderPickList.length"
                    class="flex justify-center items-center absolute top-0 left-0 h-full w-full"
                  >
                    <p>Drop here</p>
                  </div>
                </div>
              </template>
            </v-virtual-scroll>
          </v-card>
        </v-col>
      </v-row>
      <div class="mt-6 d-flex items-center justify-center">
        <v-btn
          :loading="state.loading"
          :disabled="
            !state.esportsBetList.length || !state.thunderPickList.length
          "
          class="d-block capitalize-btn"
          @click="generateData"
          >Generate</v-btn
        >
        <v-btn
          :loading="state.pushing"
          class="ml-4 d-block capitalize-btn"
          @click="pushAuto"
          >Push</v-btn
        >
        <v-btn class="ml-4 d-block capitalize-btn" @click="reset">Reset</v-btn>
      </div>

      <template v-if="!state.loading"
        ><div class="mt-6">
          <v-row>
            <v-col>
              <v-virtual-scroll :height="300" :items="[1]">
                <v-treeview
                  :items="formatTreeResult"
                  :height="300"
                ></v-treeview>
              </v-virtual-scroll>
            </v-col>
            <v-col>
              <v-virtual-scroll :height="300" :items="[1]">
                <pre class="json-pre">{{ state.generatedData }}</pre>
              </v-virtual-scroll>
            </v-col>
          </v-row>
        </div></template
      >
    </div>

    <div class="mt-6">
      <div class="mb-4">
        <p class="text-h4">Manual Generate</p>
      </div>
      <v-row>
        <v-col>
          <v-card :title="mapNameBet(ProviderBet.ESPORTS_BET)" color="red">
            <v-virtual-scroll :height="300" :items="[1]">
              <template v-slot:default>
                <div
                  class="bg-gray-600 w-full p-4 min-h-[300px] flex flex-grow relative"
                >
                  <VueDraggable
                    v-model="state.esportsManualBetListData"
                    group="drop-manual-1"
                    class="flex-1"
                  >
                    <v-btn
                      v-for="(item, index) in state.esportsManualBetListData"
                      :key="item.value"
                      :class="['w-full', index == 0 ? '' : 'mt-2']"
                      class="capitalize-btn"
                    >
                      {{ item.value }}
                    </v-btn>
                  </VueDraggable>
                  <div
                    v-if="!state.esportsManualBetListData.length"
                    class="flex justify-center items-center absolute top-0 left-0 h-full w-full"
                  >
                    <p>Drop here</p>
                  </div>
                </div>
              </template>
            </v-virtual-scroll>
            <template
              v-if="state.esportsManualBetListData.length"
              v-slot:actions
            >
              <v-btn class="capitalize-btn" @click="selectAllManualEsportsBet"
                >Select all</v-btn
              >
            </template>
          </v-card>
          <div class="arrow-container">
            <div class="arrow">
              <v-icon icon="mdi-arrow-down" start></v-icon>
            </div>
          </div>
          <v-card
            :title="mapNameBet(ProviderBet.ESPORTS_BET)"
            color="red"
            class="mt-4"
          >
            <v-virtual-scroll :height="300" :items="[1]">
              <template v-slot:default>
                <div
                  class="bg-gray-600 w-full p-4 min-h-[300px] flex flex-grow relative"
                >
                  <VueDraggable
                    v-model="state.esportsManualBetList"
                    group="drop-manual-1"
                    class="flex-1"
                  >
                    <v-btn
                      v-for="(item, index) in state.esportsManualBetList"
                      :key="item.value"
                      :class="['w-full', index == 0 ? '' : 'mt-2']"
                      class="capitalize-btn"
                    >
                      {{ item.value }}
                    </v-btn>
                  </VueDraggable>
                  <div
                    v-if="!state.esportsManualBetList.length"
                    class="flex justify-center items-center absolute top-0 left-0 h-full w-full"
                  >
                    <p>Drop here</p>
                  </div>
                </div>
              </template>
            </v-virtual-scroll>
          </v-card>
        </v-col>
        <v-col
          ><v-card :title="mapNameBet(ProviderBet.THUNDER_PICK)" color="purple">
            <v-virtual-scroll :height="300" :items="[1]">
              <template v-slot:default>
                <div
                  class="bg-gray-600 w-full p-4 min-h-[300px] flex flex-grow relative"
                >
                  <VueDraggable
                    v-model="state.thunderManualPickListData"
                    group="drop-manual-2"
                    class="flex-1"
                  >
                    <v-btn
                      v-for="(item, index) in state.thunderManualPickListData"
                      :key="item.value"
                      :class="['w-full', index == 0 ? '' : 'mt-2']"
                      class="capitalize-btn"
                    >
                      {{ item.value }}
                    </v-btn>
                  </VueDraggable>
                  <div
                    v-if="!state.thunderManualPickListData.length"
                    class="flex justify-center items-center absolute top-0 left-0 h-full w-full"
                  >
                    <p>Drop here</p>
                  </div>
                </div>
              </template>
            </v-virtual-scroll>
            <template
              v-if="state.thunderManualPickListData.length"
              v-slot:actions
            >
              <v-btn class="capitalize-btn" @click="selectAllManualThunderPick"
                >Select all</v-btn
              >
            </template>
          </v-card>
          <div class="arrow-container">
            <div class="arrow">
              <v-icon icon="mdi-arrow-down" start></v-icon>
            </div>
          </div>
          <v-card
            :title="mapNameBet(ProviderBet.THUNDER_PICK)"
            class="mt-4"
            color="purple"
          >
            <v-virtual-scroll :height="300" :items="[1]">
              <template v-slot:default>
                <div
                  class="bg-gray-600 w-full p-4 min-h-[300px] flex flex-grow relative"
                >
                  <VueDraggable
                    v-model="state.thunderManualPickList"
                    group="drop-manual-2"
                    class="flex-1"
                  >
                    <v-btn
                      v-for="(item, index) in state.thunderManualPickList"
                      :key="item.value"
                      :class="['w-full', index == 0 ? '' : 'mt-2']"
                      class="capitalize-btn"
                    >
                      {{ item.value }}
                    </v-btn>
                  </VueDraggable>
                  <div
                    v-if="!state.thunderManualPickList.length"
                    class="flex justify-center items-center absolute top-0 left-0 h-full w-full"
                  >
                    <p>Drop here</p>
                  </div>
                </div>
              </template>
            </v-virtual-scroll>
          </v-card>
        </v-col>
      </v-row>
      <div class="mt-6 d-flex items-center justify-center">
        <v-btn
          :loading="state.loadingManual"
          :disabled="
            !state.esportsManualBetList.length ||
            !state.thunderManualPickList.length
          "
          class="d-block capitalize-btn"
          @click="generateDataManual"
          >Generate</v-btn
        >
        <v-btn
          :loading="state.pushingManual"
          class="ml-4 d-block capitalize-btn"
          @click="pushManual"
          >Push</v-btn
        >
        <v-btn class="ml-4 d-block capitalize-btn" @click="resetManual"
          >Reset</v-btn
        >
      </div>

      <template v-if="!state.loadingManual"
        ><div class="mt-6">
          <v-row>
            <v-col>
              <v-virtual-scroll :height="300" :items="[1]">
                <v-treeview
                  :items="formatTreeResultManual"
                  :height="300"
                ></v-treeview>
              </v-virtual-scroll>
            </v-col>
            <v-col>
              <v-virtual-scroll :height="300" :items="[1]">
                <pre class="json-pre">{{ state.generatedDataManual }}</pre>
              </v-virtual-scroll>
            </v-col>
          </v-row>
        </div></template
      >
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from "vue";
import { cloneDeep, debounce } from "lodash";
import { VueDraggable } from "vue-draggable-plus";

import { ProviderBet } from "@/enums";
import { BetModel } from "@/models";
import { useBetService } from "@/services";

// data
const state = reactive({
  similarityThreshold: "1 / 2" as string,
  keySearch: "" as string,
  headers: [
    {
      title: "Value",
      sortable: true,
      key: "value",
    },
    { title: "Provider", key: "provider", sortable: true },
    { title: "Type", key: "type", sortable: true },
  ] as any[],
  dataList: [] as BetModel[],
  dataListSearch: [] as BetModel[],
  esportsBetList: [] as BetModel[],
  esportsBetListSaveData: [] as BetModel[],
  esportsManualBetList: [] as BetModel[],
  esportsManualBetListData: [] as BetModel[],
  thunderPickList: [] as BetModel[],
  thunderPickListSaveData: [] as BetModel[],
  thunderManualPickList: [] as BetModel[],
  thunderManualPickListData: [] as BetModel[],
  loading: false,
  loadingManual: false,
  pushing: false,
  pushingManual: false,
  generatedData: [] as BetModel[],
  generatedDataManual: [] as BetModel[],
});

// computed
const formatTreeResult = computed(() => {
  let idCounter = 1;

  return state.generatedData.map((item) => ({
    id: idCounter++,
    title: item.value,
    children: (item.maps ?? []).map((mapItem) => ({
      id: idCounter++,
      title: mapItem.value,
    })),
  }));
});

const formatTreeResultManual = computed(() => {
  let idCounter = 1;

  return state.generatedDataManual.map((item) => ({
    id: idCounter++,
    title: item.value,
    children: (item.maps ?? []).map((mapItem) => ({
      id: idCounter++,
      title: mapItem.value,
    })),
  }));
});

// watch
watch(
  () => state.keySearch,
  () => {
    debouncedSearchData();
  }
);

// methods
function jaccardIndex(set1: Set<string>, set2: Set<string>): number {
  const intersectionSize = new Set([...set1].filter((x) => set2.has(x))).size;
  const unionSize = new Set([...set1, ...set2]).size;
  return intersectionSize / unionSize;
}

function mapSimilarItems(
  list1: BetModel[],
  list2: BetModel[],
  provider?: ProviderBet
): BetModel[] {
  const result: { [key: string]: BetModel[] } = {};
  const similarityThreshold = eval(state.similarityThreshold);

  function stringToSet(str: string): Set<string> {
    return new Set(str.toLowerCase().split(/\s+/));
  }

  list2.forEach((item2) => {
    result[item2.value] = [];
    const set2 = stringToSet(item2.value);

    list1.forEach((item1) => {
      const set1 = stringToSet(item1.value);

      if (
        jaccardIndex(set1, set2) >= similarityThreshold &&
        item2.type == item1.type
      ) {
        result[item2.value].push(item1);
      }
    });
  });

  const filteredData = Object.keys(result).map((key) => {
    const item = list2.find((item) => item.value === key);
    return {
      value: key,
      provider: provider,
      maps: result[key],
      type: item?.type,
    } as BetModel;
  });

  const removeDuplicateMaps = (maps: BetModel[]): BetModel[] => {
    const uniqueMaps = new Map<string, BetModel>();
    maps.forEach((map) => {
      const key = `${map.provider}-${map.type}-${map.value}`;
      if (!uniqueMaps.has(key)) {
        uniqueMaps.set(key, map);
      }
    });
    return Array.from(uniqueMaps.values());
  };

  const updatedData = filteredData.map((item) => ({
    ...item,
    maps: removeDuplicateMaps(item.maps ?? []),
  }));

  return updatedData;
}

function generateData() {
  state.loading = true;

  setTimeout(() => {
    state.generatedData = mapSimilarItems(
      state.thunderPickList,
      state.esportsBetList,
      ProviderBet.ESPORTS_BET
    );

    state.loading = false;
  }, 1000);
}

function generateDataManual() {
  state.loadingManual = true;

  setTimeout(() => {
    state.generatedDataManual = mapSimilarItems(
      state.thunderManualPickList.length
        ? state.thunderManualPickList
        : state.thunderManualPickListData,
      state.esportsManualBetList,
      ProviderBet.ESPORTS_BET
    );

    state.loadingManual = false;
  }, 1000);
}

function mapNameBet(provider: ProviderBet) {
  if (provider == ProviderBet.ESPORTS_BET) {
    return "Esports Bet";
  } else if (provider == ProviderBet.THUNDER_PICK) {
    return "Thunder Pick";
  }

  return "-";
}

function selectAllManualEsportsBet() {
  state.esportsManualBetList = cloneDeep([
    ...state.esportsManualBetList,
    ...state.esportsManualBetListData,
  ]);
  state.esportsManualBetListData = [];
}

function selectAllManualThunderPick() {
  state.thunderManualPickList = cloneDeep([
    ...state.thunderManualPickList,
    ...state.thunderManualPickListData,
  ]);
  state.thunderManualPickListData = [];
}

function reset() {
  state.esportsBetList = cloneDeep(state.esportsBetListSaveData);
  state.thunderPickList = cloneDeep(state.thunderPickListSaveData);
  state.generatedData = [];
}

function resetManual() {
  state.esportsManualBetListData = cloneDeep(state.esportsBetListSaveData);
  state.thunderManualPickListData = cloneDeep(state.thunderPickListSaveData);
  state.esportsManualBetList = [];
  state.thunderManualPickList = [];
}

function searchData() {
  state.dataListSearch = state.keySearch.length
    ? cloneDeep(state.dataList).filter(
        (item) =>
          item.value.toLowerCase().includes(state.keySearch) ||
          state.keySearch.toLowerCase().includes(item.value)
      )
    : cloneDeep(state.dataList);
}

async function pushAuto() {
  state.pushing = true;

  let data = state.generatedData
    .filter((item) => item.maps?.length)
    .map((item) => [item, ...(item.maps ?? [])] as BetModel[]);

  console.log(data);

  const betService = useBetService();
  const futures: any[] = [];

  data.forEach(async (item) => {
    futures.push(betService.placeBet(item));
  });

  await Promise.all(futures);

  state.pushing = false;
}

async function pushManual() {
  state.pushingManual = true;

  let data = state.generatedDataManual
    .filter((item) => item.maps?.length)
    .map((item) => [item, ...(item.maps ?? [])] as BetModel[]);

  const betService = useBetService();
  const futures: any[] = [];

  data.forEach(async (item) => {
    futures.push(betService.placeBet(item));
  });

  await Promise.all(futures);

  state.pushingManual = false;
}

async function initData() {
  // services
  const betService = useBetService();
  await betService.fetchBets();

  state.esportsBetList = betService.providerBets.value.esportsBet;
  state.thunderPickList = betService.providerBets.value.thunderPick;
  state.esportsBetListSaveData = betService.providerBets.value.esportsBet;
  state.thunderPickListSaveData = betService.providerBets.value.thunderPick;
  state.esportsManualBetListData = betService.providerBets.value.esportsBet;
  state.thunderManualPickListData = betService.providerBets.value.thunderPick;
  state.dataList = betService.bets.value;

  searchData();
}

const debouncedSearchData = debounce(searchData, 300);

// created
initData();
</script>

<style lang="scss" scoped>
.json-pre {
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
}

.capitalize-btn {
  text-transform: capitalize;
}

.arrow-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  margin-top: 16px;
}

.arrow {
  position: relative;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
