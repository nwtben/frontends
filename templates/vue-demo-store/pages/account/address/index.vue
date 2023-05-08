<script lang="ts">
export default {
  name: "AccountAddressPage",
};
</script>

<script setup lang="ts">
import SharedCard from "../../../components/shared/SharedCard.vue";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";

definePageMeta({
  layout: "account",
});
const router = useRouter();
const loadingData = ref(true);
const { pushSuccess, pushError } = useNotifications();
const { refreshSessionContext } = useSessionContext();
const {
  customerAddresses,
  loadCustomerAddresses,
  setDefaultCustomerShippingAddress,
  setDefaultCustomerBillingAddress,
  deleteCustomerAddress,
} = useAddress();
const {
  userDefaultBillingAddress,
  userDefaultShippingAddress,
  defaultBillingAddressId,
  defaultShippingAddressId,
} = useUser();

useBreadcrumbs([
  {
    name: "Account Overview",
    path: "/account",
  },
  {
    name: "Address",
    path: "/account/address",
  },
]);

onBeforeMount(async () => {
  await loadCustomerAddresses();
  loadingData.value = false;
});

const removeAddress = async (addressId: string) => {
  try {
    await deleteCustomerAddress(addressId);
    pushSuccess("Address deleted");
  } catch (error) {
    pushError("Address deleted error");
  }
};

const setDefaultShippingAddress = async (id: string) => {
  try {
    await setDefaultCustomerShippingAddress(id);
    refreshSessionContext();
    pushSuccess("Set default shipping address successfully");
  } catch (error) {
    pushError("Set default shipping address error");
  }
};

const setDefaultBillingAddress = async (id: string) => {
  try {
    await setDefaultCustomerBillingAddress(id);
    refreshSessionContext();
    pushSuccess("Set default billing address successfully");
  } catch (error) {
    pushError("Set default billing address error");
  }
};
</script>

<template>
  <section class="flex flex-col space-y-10 mb-24">
    <section>
      <h3 class="mb-4">Addresses</h3>
      <p class="text-base">
        View your current default addresses or add new ones.
      </p>
    </section>
    <section>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div class="flex flex-col">
          <h6>Billing address</h6>
          <SharedCard class="flex-1">
            <template #content>
              <p class="text-base md:text-sm">
                {{ userDefaultBillingAddress?.firstName }}
                {{ userDefaultBillingAddress?.lastName }}<br />
                {{ userDefaultBillingAddress?.street }}<br />
                {{ userDefaultBillingAddress?.zipcode }}
                {{ userDefaultBillingAddress?.city }},<br />
                {{
                  getTranslatedProperty(
                    userDefaultBillingAddress?.country,
                    "name"
                  )
                }}
              </p>
            </template>
          </SharedCard>
        </div>
        <div class="flex flex-col">
          <h6>Shipping address</h6>
          <SharedCard class="flex-1">
            <template #content>
              <p
                class="text-base md:text-sm"
                v-if="
                  userDefaultShippingAddress?.id ===
                  userDefaultBillingAddress?.id
                "
              >
                Same as billing address.
              </p>
              <p class="text-base md:text-sm" v-else>
                {{ userDefaultShippingAddress?.firstName }}
                {{ userDefaultShippingAddress?.lastName }}<br />
                {{ userDefaultShippingAddress?.street }}<br />
                {{ userDefaultShippingAddress?.zipcode }}
                {{ userDefaultShippingAddress?.city }},<br />
                {{
                  getTranslatedProperty(
                    userDefaultShippingAddress?.country,
                    "name"
                  )
                }}
              </p>
            </template>
          </SharedCard>
        </div>
      </div>
      <button
        class="text-base font-medium text-white bg-gray-800 shadow-sm py-2 px-5"
        @click="router.push('/account/address/new')"
      >
        Add address
      </button>
    </section>
    <section>
      <h6 class="text-xl font-bold md:text-2xl md:font-normal">
        All addresses
      </h6>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="customerAddress of customerAddresses" class="flex flex-col">
          <SharedCard class="flex-1">
            <template #content>
              <div class="flex flex-col h-full">
                <p class="text-base md:text-sm">
                  {{ customerAddress?.firstName }} {{ customerAddress?.lastName
                  }}<br />
                  {{ customerAddress?.street }}<br />
                  {{ customerAddress?.zipcode }}
                  {{ customerAddress?.city }},<br />
                  {{ getTranslatedProperty(customerAddress?.country, "name") }}
                </p>
                <div class="flex-1 flex flex-col mt-4 gap-3 justify-end">
                  <div v-if="defaultShippingAddressId !== customerAddress.id">
                    <button
                      class="inline hover:bg-gray-50 border border-gray-300 px-3 py-2 text-gray-700 text-xs font-medium"
                      @click="setDefaultShippingAddress(customerAddress.id)"
                    >
                      Make this shipping address
                    </button>
                  </div>
                  <div v-if="defaultBillingAddressId !== customerAddress.id">
                    <button
                      class="inline hover:bg-gray-50 border border-gray-300 px-3 py-2 text-gray-700 text-xs font-medium"
                      @click="setDefaultBillingAddress(customerAddress.id)"
                    >
                      Make this billing address
                    </button>
                  </div>
                  <div class="flex gap-3">
                    <button
                      class="text-sm font-medium text-white bg-gray-800 shadow-sm py-2 px-4"
                      @click="router.push(`/account/address/${customerAddress.id}`)"
                    >
                      Edit
                    </button>
                    <button
                      class="text-sm font-medium text-gray-700 bg-gray-100 shadow-sm py-2 px-4"
                      @click="() => removeAddress(customerAddress.id)"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </SharedCard>
        </div>
      </div>
    </section>
  </section>
</template>
