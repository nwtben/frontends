<script setup lang="ts">
import { Product } from "@shopware-pwa/types";
import { maxValue, minValue, numeric, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { StarIcon } from "@heroicons/vue/24/solid";

const props = defineProps<{
  product: Product;
}>();
const { product } = toRefs(props);
const { addReview } = useProductReviews(product);

const rating = ref<number>(0);

const state = reactive({
  title: "",
  content: "",
  points: 0,
});

const rules = computed(() => ({
  title: {
    required,
  },
  content: {
    required,
  },
  points: {
    required,
    numeric,
    minValue: minValue(1),
    maxValue: maxValue(5),
  },
}));

const $v = useVuelidate(rules, state);

const onSelectRating = (value: number, type: string = "") => {
  if (type === "selected") {
    rating.value = value;
  } else {
    rating.value += value;
  }
  state.points = rating.value;
};

const onAddReview = async (): Promise<void> => {
  const isFormCorrect = await $v.value.$validate();
  if (isFormCorrect) {
    try {
      const result = await addReview({
        title: state.title,
        content: state.content,
        points: state.points
      })
    } catch (e) {
      console.error("error add review", e);
    }
  } else {
    return;
  }
};
</script>

<template>
  <div class="space-y-8">
    <form class="space-y-6" @submit.prevent="onAddReview">
      <div>
        <label class="block mb-2 text-sm font-medium text-gray-500 dark:text-white">Your rating</label>
        <div class="flex">
          <StarIcon
            v-for="value in rating"
            class="w-4 h-4 text-black cursor-pointer"
            @click="() => onSelectRating(value, 'selected')"
          />
          <StarIcon
            v-for="value in 5 - rating"
            class="w-4 h-4 text-gray-300 cursor-pointer"
            @click="() => onSelectRating(value)"
          />
        </div>
      </div>
      <div class="mt-4 space-y-4 lg:mt-5 md:space-y-5">
        <div>
          <label
            for="title"
            class="block mb-2 text-sm font-medium text-gray-500 dark:text-white"
          >
            Title
          </label>
          <input
            id="title"
            v-model="state.title"
            name="title"
            required
            class="border border-gray-300 py-2 px-3 text-sm text-gray-900 w-full shadow-input"
          />
          <span
            v-if="$v.title.$error"
            class="text-red-600 focus:ring-brand-primary border-gray-300 rounded"
          >
            {{ $v.title.$errors[0].$message }}
          </span>
        </div>
        <div>
          <label
            for="content"
            class="block mb-2 text-sm font-medium text-gray-500 dark:text-white"
            >Your review</label
          >
          <textarea
            id="content"
            v-model="state.content"
            name="content"
            required
            class="border border-gray-300 py-2 px-3 text-sm text-gray-900 w-full shadow-input"
          />
          <span
            v-if="$v.content.$error"
            class="text-red-600 focus:ring-brand-primary border-gray-300 rounded"
          >
            {{ $v.content.$errors[0].$message }}
          </span>
        </div>
      </div>

      <div class="flex">
        <button
          class="group relative w-20 flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>
