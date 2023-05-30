<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    change: (payload: { min: number, max: number, type: string }) => void;
    min: number;
    max: number;
  }>(),
  {
    change: () => {},
  }
);
const minValue = ref(props.min);
const maxValue = ref(props.max);
const minHiddenText = ref<any>();
const maxHiddenText = ref<any>();
const minError = ref<any>();
const maxError = ref<any>();
const { currentCurrency } = useCurrency();

const emit = defineEmits(['change']);
const handleInputRange = (event: any, type: 'start' | 'end') => {
  if (type === 'start') {
    const value = Math.min(event.target.value, maxValue.value - 10);
    minValue.value = value;
  } else {
    const value = Math.max(event.target.value, minValue.value + 10);
    maxValue.value = value;
  }
}

const handleChangeRange = (type: 'start' | 'end') => {
  emit('change', { type, min: minValue.value, max: maxValue.value });
}

const duration = props.max - props.min;
const getValue = (x: number) => {
  return ((x - props.min) / duration) * 100;
}

const handleInputMin = (e: any) => {
  minHiddenText.value.innerHTML = e.target.value;
  if (+e.target.value <= maxValue.value) {
    minValue.value = +e.target.value;
    minError.value = false;
  } else {
    minError.value = true;
  }
}

const handleInputMax = (e: any) => {
  maxHiddenText.value.innerHTML = e.target.value;
  if (+e.target.value >= minValue.value) {
    maxValue.value = +e.target.value;
    maxError.value = false;
  } else {
    maxError.value = true;
  }
}
</script>

<template>
  <div class="flex flex-col items-center w-full mt-4">
    <div class="mb-6 w-full flex justify-between">
      <div class="px-2 shadow-chip border h-8 flex justify-center items-center text-sm" :class="[
        minError ? 'border-red text-red' : 'border-gray-300 text-gray-900'
      ]">
        <span class="relative">
          <span ref="minHiddenText" class="opacity-0">{{ minValue }}</span>
          <input type="number" class="outline-none absolute top-0 left-0 w-full h-full bg-transparent" :value="minValue" @input="handleInputMin" />
        </span>
        <span>{{currentCurrency?.symbol ?? ''}}</span>
      </div>
      <div class="px-2 shadow-chip border h-8 flex justify-center items-center text-sm" :class="[
        maxError ? 'border-red text-red' : 'border-gray-300 text-gray-900'
      ]">
        <span class="relative">
          <span ref="maxHiddenText" class="opacity-0">{{ maxValue }}</span>
          <input type="number" class="outline-none absolute top-0 left-0 w-full h-full bg-transparent" :value="maxValue" @input="handleInputMax" />
        </span>
        <span>{{currentCurrency?.symbol ?? ''}}</span>
      </div>
    </div>
    <div class="w-full mb-1">
      <div class="relative">
        <div class="absolute w-full">
          <div
            class="absolute left-0 h-1 rounded-lg bg-gray-200"
            :style="{ width: getValue(minValue) + '%' }"
          />
          <div
            class="absolute right-0 h-1 rounded-lg bg-gray-200"
            :style="{ width: 100 - getValue(maxValue) + '%' }"
          />
          <div
            class="absolute left-0 h-1 rounded-lg bg-gray-700"
            :style="{ left: getValue(minValue) + '%', right: 100 - getValue(maxValue) + '%' }"
          />
          <span
            class="absolute -top-1.5 h-4 w-4 cursor-pointer bg-gray-700 rounded-full outline-none"
            :style="{ left: `calc(${getValue(minValue)}% - ${16 * (getValue(minValue)/100)}px)`}"
          />
          <span
            class="absolute -top-1.5 h-4 w-4 cursor-pointer bg-gray-700 rounded-full outline-none"
            :style="{ right: `calc(${100 - getValue(maxValue)}% - ${16 * ((100 - getValue(maxValue))/100)}px)`}"
          />
        </div>
        <input
          type="range"
          tabindex="0"
          :max="props.max"
          :min="props.min"
          step="0.01"
          :value="minValue"
          @input="(event) => handleInputRange(event,'start')"
          @change="() => handleChangeRange('start')"
        >

        <input
          type="range"
          tabindex="0"
          :max="props.max"
          :min="props.min"
          step="0.01"
          :value="maxValue"
          @input="(event) => handleInputRange(event, 'end')"
          @change="() => handleChangeRange('end')"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type=range] {
  @apply absolute appearance-none pointer-events-none w-full border-none bg-transparent z-10 -top-2.5;
}
input[type=range]::-webkit-slider-thumb {
  @apply w-4 h-4 rounded-full bg-white relative cursor-pointer my-1 appearance-none opacity-0;
  pointer-events: all;
}
</style>