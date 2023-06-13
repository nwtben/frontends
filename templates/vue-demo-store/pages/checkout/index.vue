<script lang="ts">
export default {
  name: "CheckoutPage",
};
</script>
<script setup lang="ts">
import { SharedModal } from "~~/components/shared/SharedModal.vue";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue';
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, requiredIf } from "@vuelidate/validators";
import { ClientApiError, ShopwareError } from "@shopware-pwa/types";
import {
  CheckCircleIcon,
} from '@heroicons/vue/20/solid';
import {
  PencilSquareIcon
} from '@heroicons/vue/24/outline';

definePageMeta({
  layout: "checkout",
});

const isSameBillingAndShipping = ref(true);
const isDifferentBillingAndShipping = ref();
const submitBtn = ref();
const isAgree = ref();
const { push } = useRouter();
const { currency } = useSessionContext();
const { getCountries } = useCountries();
const { getSalutations } = useSalutations();
const {
  paymentMethods,
  shippingMethods,
  getPaymentMethods,
  getShippingMethods,
  createOrder,
} = useCheckout();
const { register, logout, isLoggedIn, isGuestSession, user } = useUser();
const {
  refreshSessionContext,
  selectedShippingMethod: shippingMethod,
  selectedPaymentMethod: paymentMethod,
  setShippingMethod,
  setPaymentMethod,
  activeShippingAddress,
  setActiveShippingAddress,
  activeBillingAddress,
  setActiveBillingAddress,
} = useSessionContext();
const { cart, cartItems, subtotal, totalPrice, shippingTotal } = useCart();
const { customerAddresses, loadCustomerAddresses } = useAddress();

const modal = inject<SharedModal>("modal") as SharedModal;
const isLoading = reactive<{ [key: string]: boolean }>({});

const selectedShippingMethod = computed({
  get(): string {
    return shippingMethod.value?.id || "";
  },
  async set(shippingMethodId: string) {
    isLoading[shippingMethodId] = true;
    await setShippingMethod({ id: shippingMethodId });
    isLoading[shippingMethodId] = false;
  },
});
const selectedPaymentMethod = computed({
  get(): string {
    return paymentMethod.value?.id || "";
  },
  async set(paymentMethodId: string) {
    isLoading[paymentMethodId] = true;
    await setPaymentMethod({ id: paymentMethodId });
    isLoading[paymentMethodId] = false;
  },
});

const selectedShippingAddress = computed({
  get(): string {
    return activeShippingAddress.value?.id || "";
  },
  async set(shippingAddressId: string) {
    isLoading[`shipping-${shippingAddressId}`] = true;
    await setActiveShippingAddress({ id: shippingAddressId });
    if (shippingAddressId === selectedBillingAddress.value)
      state.customShipping = false;
    isLoading[`shipping-${shippingAddressId}`] = false;
  },
});

const selectedBillingAddress = computed({
  get(): string {
    return activeBillingAddress.value?.id || "";
  },
  async set(billingAddressId: string) {
    isLoading[`billing-${billingAddressId}`] = true;
    await setActiveBillingAddress({ id: billingAddressId });
    if (billingAddressId === selectedShippingAddress.value)
      state.customShipping = false;
    isLoading[`billing-${billingAddressId}`] = false;
  },
});

const isCartLoading = computed(() => {
  return !cart.value;
});

const isCheckoutAvailable = computed(() => {
  return cartItems.value.length > 0;
});

const isUserSession = computed(() => isLoggedIn.value || isGuestSession.value);

const state = reactive<any>({
  salutationId: "",
  firstName: "",
  lastName: "",
  email: "",
  guest: true,
  password: "",
  shippingAddress: {
    phoneNumber: "",
    street: "",
    zipcode: "",
    city: "",
    countryId: "",
  },
  billingAddress: {
    phoneNumber: "",
    street: "",
    zipcode: "",
    city: "",
    countryId: "",
  },
  customShipping: false,
  agree: false,
});

const rules = computed(() => ({
  firstName: {
    required,
    minLength: minLength(3),
  },
  lastName: {
    required,
    minLength: minLength(3),
  },
  email: {
    required,
    email,
  },
  agree: {
    checked: (value: any) => value === true
  },
  password: {
    required: requiredIf(() => {
      return !state.guest;
    }),
    minLength: minLength(8),
  },
  billingAddress: {
    street: {
      required,
      minLength: minLength(3),
    },
    zipcode: {
      required,
    },
    city: {
      required,
    },
    countryId: {
      required,
    },
  },
  shippingAddress: {
    street: {
      required,
      minLength: minLength(3),
    },
    zipcode: {
      required,
    },
    city: {
      required,
    },
    countryId: {
      required,
    },
  },
}));

const $v = useVuelidate(rules, state);

onMounted(async () => {
  refreshSessionContext();

  isLoading["shippingAddress"] = true;
  isLoading["shippingMethods"] = true;
  isLoading["paymentMethods"] = true;

  Promise.any([
    isLoggedIn.value ? loadCustomerAddresses() : null,
    getShippingMethods(),
    getPaymentMethods(),
  ]).finally(() => {
    isLoading["shippingAddress"] = false;
    isLoading["shippingMethods"] = false;
    isLoading["paymentMethods"] = false;
  });
});

const registerErrors = ref<ShopwareError[]>([]);

const placeOrder = async () => {
  isLoading["placeOrder"] = true;
  const order = await createOrder();
  isLoading["placeOrder"] = false;
  return push("/checkout/success/" + order.id);
};

const invokeSubmit = async () => {
  if (!isUserSession.value) {
    $v.value.$touch();
    registerErrors.value = [];
    const valid = await $v.value.$validate();
    if (valid) {
      isLoading.all = true;
      try {
        await registerUser();
        await placeOrder();
      } finally {
        isLoading.all = false;
      }
    }
  } else {
    if (!isAgree.value) return;
    isLoading.all = true;
    try {
      await placeOrder();
    } finally {
      isLoading.all = false;
    }
  }
};

const registerUser = async () => {
  try {
    state.shippingAddress.salutationId = state.salutationId;
    state.shippingAddress.firstName = state.firstName;
    state.shippingAddress.lastName = state.lastName;
    state.billingAddress.salutationId = state.salutationId;
    state.billingAddress.firstName = state.firstName;
    state.billingAddress.lastName = state.lastName;
    console.log(state)
    await register(state);
  } catch (error) {
    const e = error as ClientApiError;
    registerErrors.value = e.messages;
  }
}

async function invokeLogout() {
  await logout();
  await push("/");
}

watch(getSalutations, (salutations) => {
  if (!salutations?.length) return;
  const id = salutations?.[salutations.length -1]?.id;
  if (id) {
    state.salutationId = id;
  }
});

watch(() => state.shippingAddress, (value) => {
  if (!isSameBillingAndShipping.value) return;
  state.billingAddress = {...value};
}, {
  deep: true
});

watch(isSameBillingAndShipping, (value) => {
  if (value) {
    state.billingAddress = {...state.shippingAddress};
  } else {
    state.billingAddress = {
      street: "",
      zipcode: "",
      city: "",
      countryId: "",
      phoneNumber: ""
    }
  }
});

const handleSubmit = () => {
  if (!isUserSession) {
    submitBtn.value.click()
  } else {
    invokeSubmit();
  }
}

const login = () => {
  modal.open('AccountLoginForm')
}

const handleChangeGuest = (e: any) => {
  state.guest = !e.target.checked;
}

</script>

<template>
  <div class="mt-12 md:mt-16 mb-24">
    <div
      v-if="isCheckoutAvailable || isCartLoading"
      class="checkout-inner"
      :class="{
        'opacity-20': isCartLoading,
      }"
    >
      <div class="flex flex-col md:flex-row gap-16">
        <div class="flex-1">
          <!-- New User -->
          <form 
            v-if="!isUserSession"
            class="flex flex-col gap-10"
            id="checkout-billing-address"
            name="checkout-billing-address"
            method="post"
            @submit.prevent="invokeSubmit"
          >
            <div>
              <button
                type="button"
                class="flex items-center justify-center px-5 py-2 text-base font-medium text-white shadow-sm bg-gray-800"
                @click="login"
                >
                {{ $t('log_in_to_your_account') }}
              </button>
            </div>
            <span class="text-base text-dark-variant">{{ $t('or_fill_the_details_below') }}</span>
            <div>
              <h6 class="text-lg font-medium text-dark-primary mb-4">{{ $t('personal_information') }}</h6>
              <div class="flex flex-col gap-6">
                <div>
                  <div class="flex flex-col md:flex-row gap-6 mb-4">
                    <div class="flex-1">
                      <label class="text-sm font-medium text-gray-700 mb-1" for="firstName">{{ $t('first_name') }}</label>
                      <input
                        v-model="state.firstName"
                        id="firstName"
                        name="firstName"
                        type="text"
                        autocomplete="firstName"
                        class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                      />
                    </div>
                    <div class="flex-1">
                      <label class="text-sm font-medium text-gray-700 mb-1" for="lastName">{{  $t('last_name') }}</label>
                      <input
                        v-model="state.lastName"
                        id="lastName"
                        name="lastName"
                        type="text"
                        autocomplete="lastName"
                        class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                      />
                    </div>
                  </div>
                  <SharedCheckbox 
                    :content="$t('create_customer_account')"
                    :value="!state.guest"
                    @change="handleChangeGuest"
                  />
                </div>
                <div class="flex flex-col md:flex-row gap-6">
                  <div class="flex-1">
                    <label class="text-sm font-medium text-gray-700 mb-1" for="email-address">{{ $t('email_address') }}</label>
                    <input
                      v-model="state.email"
                      id="email-address"
                      name="email"
                      type="email"
                      autocomplete="email"
                      class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                  <div class="flex-1">
                    <label v-if="!state.guest" class="capitalize text-sm font-medium text-gray-700 mb-1" for="password">{{ $t('password') }}</label>
                    <input
                      v-if="!state.guest"
                      v-model="state.password"
                      id="password"
                      name="password"
                      type="password"
                      autocomplete="password"
                      class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1" for="phone">{{ $t('phone_number_optional') }}</label>
                  <input
                    v-model="state.shippingAddress.phoneNumber"
                    id="phone"
                    name="phone"
                    autocomplete="phone"
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1" for="address">{{ $t('street_address') }}</label>
                  <input
                    v-model="state.shippingAddress.street"
                    id="address"
                    name="address"
                    type="text"
                    autocomplete="address"
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                  />
                </div>
                <div class="flex gap-4">
                  <div class="w-1/3">
                    <label class="text-sm font-medium text-gray-700 mb-1" for="zipcode">{{ $t('zip_code') }}</label>
                    <input
                      v-model="state.shippingAddress.zipcode"
                      id="zipcode"
                      name="zipcode"
                      type="text"
                      autocomplete="zipcode"
                      class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                  <div class="w-2/3">
                    <label class="text-sm font-medium text-gray-700 mb-1" for="city">{{ $t('city') }}</label>
                    <input
                      v-model="state.shippingAddress.city"
                      id="city"
                      name="city"
                      type="text"
                      autocomplete="city"
                      class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1" for="city">{{ $t('country') }}</label>
                  <SwSelect
                    :compact="false"
                    id="country"
                    v-model="state.shippingAddress.countryId"
                    name="country"
                    autocomplete="country-name"
                    data-testid="checkout-pi-country-input"
                    @blur="$v.shippingAddress.countryId.$touch()"
                  >
                    <option disabled selected value="">
                      Choose country...
                    </option>
                    <option
                      v-for="country in getCountries"
                      :key="country.id"
                      :value="country.id"
                    >
                      {{ country.translated.name }}
                    </option>
                  </SwSelect>
                </div>
                <SharedCheckbox 
                  :content="$t('use_same_for_billing_information')"
                  v-model="isSameBillingAndShipping"
                />
              </div>
            </div>
            <div class="border-b border-gray-200"></div>
            <template v-if="!isSameBillingAndShipping">
              <div>
                <h6 class="text-lg font-medium text-dark-primary mb-4">{{ $t('billing_address') }}</h6>
                <div class="flex flex-col gap-6">
                  <div>
                    <label class="text-sm font-medium text-gray-700 mb-1" for="phone">{{ $t('phone_number_optional') }}</label>
                    <input
                      v-model="state.billingAddress.phoneNumber"
                      id="phone"
                      name="phone"
                      autocomplete="phone"
                      class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700 mb-1" for="address">{{ $t('street_address') }}</label>
                    <input
                      v-model="state.billingAddress.street"
                      id="address"
                      name="address"
                      type="text"
                      autocomplete="address"
                      class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                  <div class="flex gap-4">
                    <div class="w-1/3">
                      <label class="text-sm font-medium text-gray-700 mb-1" for="zipcode">{{ $t('zip_code') }}</label>
                      <input
                        v-model="state.billingAddress.zipcode"
                        id="zipcode"
                        name="zipcode"
                        type="text"
                        autocomplete="zipcode"
                        class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                      />
                    </div>
                    <div class="w-2/3">
                      <label class="text-sm font-medium text-gray-700 mb-1" for="city">{{ $t('city') }}</label>
                      <input
                        v-model="state.billingAddress.city"
                        id="city"
                        name="city"
                        type="text"
                        autocomplete="city"
                        class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700 mb-1" for="country">{{ $t('country') }}</label>
                    <SwSelect
                      :compact="false"
                      id="country"
                      v-model="state.billingAddress.countryId"
                      name="country"
                      autocomplete="country-name"
                      data-testid="checkout-pi-country-input"
                      @blur="$v.billingAddress.countryId.$touch()"
                    > 
                      <option disabled selected value="">
                        Choose country...
                      </option>
                      <option
                        v-for="country in getCountries"
                        :key="country.id"
                        :value="country.id"
                      >
                        {{ country.translated.name }}
                      </option>
                    </SwSelect>
                  </div>
                </div>
              </div>
              <div class="border-b border-gray-200"></div>
            </template>
            <div>
              <h6 class="text-lg font-medium text-dark-primary mb-4">{{  $t('shipping_method') }}</h6>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li
                  v-for="singleShippingMethod in shippingMethods"
                  :key="singleShippingMethod.id"
                  class="shadow-sm relative"
                  :class="selectedShippingMethod === singleShippingMethod.id ? 'border-2 border-gray-500' : 'border border-gray-300'"
                >
                  <input
                    :id="singleShippingMethod.id"
                    v-model="selectedShippingMethod"
                    :value="singleShippingMethod.id"
                    name="shipping-method"
                    type="radio"
                    class="focus:ring-brand-primary h-4 w-4 border-gray-300 hidden"
                    :data-testid="`checkout-shipping-method-${singleShippingMethod.id}`"
                  />
                  <label
                    :for="singleShippingMethod.id"
                    :class="{ 'animate-pulse': isLoading[singleShippingMethod.id] }"
                    class="p-4 block text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    <p>{{ (singleShippingMethod as any).translated.name }}</p>
                    <p class="text-sm text-gray-500">
                      {{(singleShippingMethod.deliveryTime as any)?.translated?.name}}
                    </p>
                    <br/>
                    <p class="font-medium text-sm">{{currency?.symbol}}{{ (singleShippingMethod.prices?.[0] as any)?.currencyPrice?.[0].gross  }}</p>
                  </label>
                  <CheckCircleIcon v-if="selectedShippingMethod === singleShippingMethod.id" class="text-gray-600 absolute top-4 right-4 h-5 w-5" />
                </li>
              </ul>
            </div>
            <div class="border-b border-gray-200"></div>
            <div>
              <h6 class="text-lg font-medium text-dark-primary mb-4">{{ $t('payment_method') }}</h6>
              <div v-if="isLoading['paymentMethods']" class="w-60 h-24">
                <div class="flex animate-pulse flex-row items-top pt-4 h-full space-x-5">
                  <div class="w-4 bg-gray-300 h-4 rounded-full" />
                  <div class="flex flex-col space-y-3">
                    <div class="w-36 bg-gray-300 h-6 rounded-md" />
                    <div class="w-24 bg-gray-300 h-6 rounded-md" />
                  </div>
                </div>
              </div>
              <form v-else>
                <RadioGroup
                  v-model="selectedPaymentMethod"
                  class="border border-gray-200"
                >
                  <RadioGroupOption
                    v-for="paymentMethod in paymentMethods"
                    :key="paymentMethod.id"
                    :value="paymentMethod.id"
                    v-slot="{ checked }"
                  >
                    <div
                      :class="[checked ? 'bg-gray-50 text-white' : 'bg-white ']"
                      class="relative flex cursor-pointer rounded-lg p-4"
                    >
                      <div>
                        <span
                          :class="[
                          checked
                            ? 'bg-gray-800 border-transparent'
                            : 'bg-white border-gray-300',
                          ' h-4 w-4 mr-3 mt-0.25 rounded-full border flex items-center justify-center',
                        ]"
                          aria-hidden="true"
                        >
                        <span class="rounded-full bg-white w-1.5 h-1.5" />
                      </span>
                      </div>
                      <div>
                        <RadioGroupLabel class="block cursor-pointer">
                          <h6 class="block text-sm font-medium text-gray-900">{{ paymentMethod.translated?.name }}</h6>
                          <p class="text-gray-700 text-sm">
                            {{ paymentMethod.translated?.description }}
                          </p>
                        </RadioGroupLabel>
                      </div>
                    </div>

                    <div class="w-full border-b border-b-gray-200" />
                  </RadioGroupOption>
                </RadioGroup>
              </form>
            </div>
            <div class="border-b border-gray-200"></div>
            <div>
              <h6 class="text-lg font-medium text-dark-primary mb-4">{{ $t('terms_and_conditions') }}</h6>
              <SharedCheckbox v-model="state.agree" content="I have read and accepted the <a class='underline underline-offset-2' href='https://shopware-6-demo.shop-studio.io/widgets/cms/7c7e4047d6df467ca9f5c7f1611fe4e6'>terms and conditions</a>." />
            </div>
            <button ref="submitBtn" type="submit" class="hidden">submit</button>
          </form>
          <!-- Existed User -->
          <div 
            v-else 
            class="flex flex-col gap-10"
          >
            <div class="flex gap-2 items-center">
              <span class="text-base text-dark-variant">{{$t('you_are_logged_in_as', [user?.firstName, user?.lastName]) }}</span>
              <button
                type="button"
                class="flex items-center justify-center px-5 py-2 text-base font-medium text-white shadow-sm bg-gray-800"
                @click="invokeLogout"
              >
                {{ $t('log_out') }}
              </button>
            </div>
            <div>
              <h6 class="text-lg font-medium text-dark-primary mb-4">{{ $t('shipping_address') }}</h6>
              <div class="flex flex-col gap-4">
                <div>
                  <RadioGroup
                    v-model="selectedShippingAddress"
                    class="border border-gray-200"
                  >
                    <RadioGroupOption
                      class="cursor-pointer"
                      v-for="customerAddress in customerAddresses"
                      :key="customerAddress.id"
                      :value="customerAddress.id"
                      v-slot="{ checked }"
                    >
                      <div
                        :class="[checked ? 'bg-gray-50 text-white' : 'bg-white ']"
                        class="relative flex cursor-pointer rounded-lg p-4"
                      >
                        <div>
                          <span
                            :class="[
                            checked
                              ? 'bg-gray-800 border-transparent'
                              : 'bg-white border-gray-300',
                            ' h-4 w-4 mr-3 mt-0.25 rounded-full border flex items-center justify-center',
                          ]"
                            aria-hidden="true"
                          >
                          <span class="rounded-full bg-white w-1.5 h-1.5" />
                        </span>
                        </div>
                        <div>
                          <RadioGroupLabel class="block cursor-pointer">
                            <h6 class="block text-sm font-medium text-gray-900">{{ `${customerAddress.firstName} ${customerAddress.lastName}` }}</h6>
                            <p class="text-gray-700 text-sm">
                              <span class="block">{{ customerAddress.street }}</span>
                              <span class="block">{{ customerAddress.zipcode }}</span>
                              <span class="block">{{ customerAddress.city }}</span>
                            </p>
                          </RadioGroupLabel>
                          <PencilSquareIcon class="cursor-pointer absolute top-4 right-4 h-6 w-6 text-gray-900" @click="(e: any) => e.stopPropagation()"/>
                        </div>
                      </div>
  
                      <div class="w-full border-b border-b-gray-200" />
                    </RadioGroupOption>
                  </RadioGroup>
                </div>
                <div>
                  <button
                    type="button"
                    class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white shadow-sm bg-gray-800"
                  >
                    {{ $t('add_new_shipping_address') }}
                  </button>
                </div>
                <div>
                  <SharedCheckbox 
                    :content="$t('different_billing_address')"
                    v-model="isDifferentBillingAndShipping"
                  />
                </div>
              </div>
            </div>
            <div class="border-b border-gray-200"></div>
            <div v-if="isDifferentBillingAndShipping">
              <h6 class="text-lg font-medium text-dark-primary mb-4">{{ $t('billing_address') }}</h6>
              <div class="flex flex-col gap-4">
                <div>
                  <RadioGroup
                    v-model="selectedBillingAddress"
                    class="border border-gray-200"
                  >
                    <RadioGroupOption
                      v-for="customerAddress in customerAddresses"
                      :key="customerAddress.id"
                      :value="customerAddress.id"
                      v-slot="{ checked }"
                    >
                      <div
                        :class="[checked ? 'bg-gray-50 text-white' : 'bg-white ']"
                        class="relative flex cursor-pointer rounded-lg p-4"
                      >
                        <div>
                          <span
                            :class="[
                            checked
                              ? 'bg-gray-800 border-transparent'
                              : 'bg-white border-gray-300',
                            ' h-4 w-4 mr-3 mt-0.25 rounded-full border flex items-center justify-center',
                          ]"
                            aria-hidden="true"
                          >
                          <span class="rounded-full bg-white w-1.5 h-1.5" />
                        </span>
                        </div>
                        <div>
                          <RadioGroupLabel class="block cursor-pointer">
                            <h6 class="block text-sm font-medium text-gray-900">{{ `${customerAddress.firstName} ${customerAddress.lastName}` }}</h6>
                            <p class="text-gray-700 text-sm">
                              <span class="block">{{ customerAddress.street }}</span>
                              <span class="block">{{ customerAddress.zipcode }}</span>
                              <span class="block">{{ customerAddress.city }}</span>
                            </p>
                          </RadioGroupLabel>
                        </div>
                      </div>
  
                      <div class="w-full border-b border-b-gray-200" />
                    </RadioGroupOption>
                  </RadioGroup>
                </div>
                <div>
                  <button
                    type="button"
                    class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white shadow-sm bg-gray-800"
                  >
                    {{$t('add_new_billing_address')}}
                  </button>
                </div>
              </div>
            </div>
            <div v-if="isDifferentBillingAndShipping" class="border-b border-gray-200"></div>
            <div>
              <h6 class="text-lg font-medium text-dark-primary mb-4">{{ $t('shipping_method') }}</h6>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li
                  v-for="singleShippingMethod in shippingMethods"
                  :key="singleShippingMethod.id"
                  class="shadow-sm relative"
                  :class="selectedShippingMethod === singleShippingMethod.id ? 'border-2 border-gray-500' : 'border border-gray-300'"
                >
                  <input
                    :id="singleShippingMethod.id"
                    v-model="selectedShippingMethod"
                    :value="singleShippingMethod.id"
                    name="shipping-method"
                    type="radio"
                    class="focus:ring-brand-primary h-4 w-4 border-gray-300 hidden"
                    :data-testid="`checkout-shipping-method-${singleShippingMethod.id}`"
                  />
                  <label
                    :for="singleShippingMethod.id"
                    :class="{ 'animate-pulse': isLoading[singleShippingMethod.id] }"
                    class="p-4 block text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    <p>{{ (singleShippingMethod as any).translated.name }}</p>
                    <p class="text-sm text-gray-500">
                      {{(singleShippingMethod.deliveryTime as any)?.translated?.name}}
                    </p>
                    <br/>
                    <p class="font-medium text-sm">{{currency?.symbol}}{{ (singleShippingMethod.prices?.[0] as any)?.currencyPrice?.[0].gross  }}</p>
                  </label>
                  <CheckCircleIcon v-if="selectedShippingMethod === singleShippingMethod.id" class="text-gray-600 absolute top-4 right-4 h-5 w-5" />
                </li>
              </ul>
            </div>
            <div class="border-b border-gray-200"></div>
            <div>
              <h6 class="text-lg font-medium text-dark-primary mb-4">{{ $t('payment_method') }}</h6>
              <div v-if="isLoading['paymentMethods']" class="w-60 h-24">
                <div class="flex animate-pulse flex-row items-top pt-4 h-full space-x-5">
                  <div class="w-4 bg-gray-300 h-4 rounded-full" />
                  <div class="flex flex-col space-y-3">
                    <div class="w-36 bg-gray-300 h-6 rounded-md" />
                    <div class="w-24 bg-gray-300 h-6 rounded-md" />
                  </div>
                </div>
              </div>
              <form v-else>
                <RadioGroup
                  v-model="selectedPaymentMethod"
                  class="border border-gray-200"
                >
                  <RadioGroupOption
                    v-for="paymentMethod in paymentMethods"
                    :key="paymentMethod.id"
                    :value="paymentMethod.id"
                    v-slot="{ checked }"
                  >
                    <div
                      :class="[checked ? 'bg-gray-50 text-white' : 'bg-white ']"
                      class="relative flex cursor-pointer rounded-lg p-4"
                    >
                      <div>
                        <span
                          :class="[
                          checked
                            ? 'bg-gray-800 border-transparent'
                            : 'bg-white border-gray-300',
                          ' h-4 w-4 mr-3 mt-0.25 rounded-full border flex items-center justify-center',
                        ]"
                          aria-hidden="true"
                        >
                        <span class="rounded-full bg-white w-1.5 h-1.5" />
                      </span>
                      </div>
                      <div>
                        <RadioGroupLabel class="block cursor-pointer">
                          <h6 class="block text-sm font-medium text-gray-900">{{ paymentMethod.translated?.name }}</h6>
                          <p class="text-gray-700 text-sm">
                            {{ paymentMethod.translated?.description }}
                          </p>
                        </RadioGroupLabel>
                      </div>
                    </div>

                    <div class="w-full border-b border-b-gray-200" />
                  </RadioGroupOption>
                </RadioGroup>
              </form>
            </div>
            <div class="border-b border-gray-200"></div>
            <div>
              <h6 class="text-lg font-medium text-dark-primary mb-4">{{ $t('terms_and_conditions') }}</h6>
              <SharedCheckbox v-model="isAgree" content="I have read and accepted the <a class='underline underline-offset-2' href='https://shopware-6-demo.shop-studio.io/widgets/cms/7c7e4047d6df467ca9f5c7f1611fe4e6'>terms and conditions</a>." />
            </div>
          </div>
        </div>
        <div class="w-full md:w-1/2 md:max-w-[574px]">
          <h5 class="text-lg font-medium text-dark-primary mb-4">{{ $t('order_summary') }}</h5>
          <SharedOrdersSummary :showCartItems="true">
            <template #action>
              <button
                class="mt-6 w-full flex items-center justify-center px-5 py-3 text-base font-medium text-white shadow-sm bg-gray-800 disabled:opacity-70"
                :disabled="isLoading.all"
                @click="handleSubmit"
              >
                {{ $t('confirm_order') }}
              </button>
            </template>
          </SharedOrdersSummary>
          <SharedValueProposition class="mt-6" :isColumn="true" />
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <h1 class="m-10 text-2xl font-medium text-gray-900">
        Your cart is empty!
      </h1>
      <NuxtLink
        class="inline-flex justify-center py-2 px-4 my-8 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-light"
        to="/"
        data-testid="checkout-go-home-link"
      >
        Go to home page
      </NuxtLink>
    </div>
  </div>
</template>
