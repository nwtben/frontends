<script lang="ts">
export default {
  name: "AccountPayments",
};
</script>

<script setup lang="ts">
import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
} from '@headlessui/vue';

definePageMeta({
  layout: "account",
});
const cardValue = ref('card_payment');
const emits = defineEmits<{
  (e: "success"): void;
}>();

const {
  paymentMethods,
  getPaymentMethods,
  selectedPaymentMethod,
  setPaymentMethod,
} = useCheckout();
const { setDefaultPaymentMethod } = useUser();
const { pushSuccess } = useNotifications();

useBreadcrumbs([
  {
    name: "Account Overview",
    path: "/account",
  },
  {
    name: "Payment",
    path: "/account/payment",
  },
]);

const isLoading = ref(true);

const formData = reactive({
  paymentMethod: "",
});

const invokeSave = async (): Promise<void> => {
  try {
    await setPaymentMethod({ id: formData.paymentMethod });
    await setDefaultPaymentMethod(formData.paymentMethod);
    emits("success");
    pushSuccess("Set default payment method successfully");
  } catch (error) {
    console.error("error set default payment method", error);
  }
};

onMounted(async () => {
  await getPaymentMethods();
  isLoading.value = false;
});
</script>

<template>
  <div class="col-span-2 mb-24">
    <div class="mb-10">
      <h3 class="mb-4">
        Payment methods
      </h3>
      <p class="text-gray-900">
        View all available payment methods and select a default payment method.
      </p>
    </div>
    <RadioGroup
      v-model="cardValue"
      class="border border-gray-200 mb-6"
    >
      <RadioGroupOption
        v-slot="{ checked }"
        value="card_payment"
      >
        <div
          :class="[checked ? 'bg-gray-50 text-white' : 'bg-white ']"
          class="relative flex cursor-pointer rounded-lg p-4"
        >
          <span :class="[checked ? 'bg-gray-800 border-transparent' : 'bg-white border-gray-300', 'h-4 w-4 mr-3 mt-0.25 rounded-full border flex items-center justify-center']" aria-hidden="true">
            <span class="rounded-full bg-white w-1.5 h-1.5" />
          </span>
          <div>
            <RadioGroupLabel class="block text-sm font-medium text-gray-900">
              Card payment
            </RadioGroupLabel>
            <p class="text-gray-700 text-sm">
              Apply Pay
            </p>
            <p class="text-gray-700 text-sm">
              Mastercard
            </p>
            <p class="text-gray-700 text-sm">
              •••• Ending in 1545
            </p>
          </div>
        </div>
      </RadioGroupOption>
      <div class="w-full border-b border-b-gray-200" />
      <RadioGroupOption
        v-slot="{ checked }"
        value="Swish"
      >
        <div
          :class="[checked ? 'bg-gray-50 text-white ' : 'bg-white ']"
          class="relative flex cursor-pointer px-4 py-5"
        >
          <span
            :class="[checked ? 'shadow-radio' : '']"
            class="border border-gray-300 w-4 h-4 mr-3 mt-1 rounded-full"
          />
          <div>
            <RadioGroupLabel class="text-sm font-medium text-gray-900">
              Swish
            </RadioGroupLabel>
          </div>
        </div>
      </RadioGroupOption>
    </RadioGroup>
    <button class="text-white font-medium py-2 px-5 bg-gray-800 shadow-sm disabled:opacity-50">
      Change
    </button>
  </div>
</template>
