<script setup lang="ts">
import { CustomerAddress, Country, Salutation } from "@shopware-pwa/types";
import { SharedModal } from "~~/components/shared/SharedModal.vue";
const { createCustomerAddress, updateCustomerAddress } = useAddress();

const { close } = inject<SharedModal>("modal") as SharedModal;

const emits = defineEmits<{
  (e: "success"): void;
  (e: "close"): void;
}>();

const props = withDefaults(
  defineProps<{
    address?: CustomerAddress;
    countries: Array<Country>;
    salutations: Array<Salutation>;
    title?: string;
  }>(),
  {
    title: "Account address",
    address: undefined,
  }
);

const countriesOptions = computed(() => {
  return props.countries.map(country => ({
    label: country.translated.name,
    value: country.id
  }))
});

const formData = reactive<CustomerAddress>({
  countryId: props.address?.countryId ?? "",
  salutationId: props.address?.salutationId ?? props.salutations?.[0]?.id ?? "",
  firstName: props.address?.firstName ?? "",
  lastName: props.address?.lastName ?? "",
  zipcode: props.address?.zipcode ?? "",
  city: props.address?.city ?? "",
  street: props.address?.street ?? "",
  id: props.address?.id ?? "",
});

const invokeSave = async (): Promise<void> => {
  try {
    let addressResult = false;
    const saveAddress = formData.id
      ? updateCustomerAddress
      : createCustomerAddress;
    await saveAddress(formData);
    emits("success");
    close();
  } catch (error) {
    console.error("error save address", error);
  }
};
</script>

<template>
  <div class="mt-5 md:mt-0 md:col-span-2">
    <div class="shadow overflow-hidden sm:rounded-md">
      <form id="account-address" name="account-address" method="post">
        <div class="px-4 py-5 bg-white sm:p-6">
          <h3 class="text-2xl border-b pb-3">
            {{ props.title }}
          </h3>
          <div class="flex flex-col mt-6 gap-6">
            <div>
              <div class="flex flex-col md:flex-row gap-6">
                <div class="flex-1">
                  <label class="text-sm font-medium text-gray-700 mb-1" for="firstName">{{ $t('first_name') }}</label>
                  <input
                    v-model="formData.firstName"
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
                    v-model="formData.lastName"
                    id="lastName"
                    name="lastName"
                    type="text"
                    autocomplete="lastName"
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 mb-1" for="address">{{ $t('street_address') }}</label>
              <input
                v-model="formData.street"
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
                  v-model="formData.zipcode"
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
                  v-model="formData.city"
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
              <select
                name="country"
                v-model="formData.countryId"
                class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
              >
                <!-- <option disabled selected value="">Enter salutation...</option> -->
                <option
                  v-for="country in countriesOptions"
                  :key="country.value"
                  :value="country.value"
                >
                  {{ country.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light"
            @click.stop.prevent="invokeSave"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
