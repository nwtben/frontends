<script lang="ts">
export default {
  name: "AccountPage",
};
</script>

<script setup lang="ts">
import { getTranslatedProperty } from '@shopware-pwa/helpers-next';
import { getCustomerOrders } from "@shopware-pwa/api-client";
import SharedCard from '../../components/shared/SharedCard.vue';
import SharedCheckbox from '../../components/shared/SharedCheckbox.vue';
import { Order } from '@shopware-pwa/types';
import SharedOrders from '../../components/shared/SharedOrders.vue';
import {
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: "account",
});

const newsletter = ref(false);
const router = useRouter();
// const { getCountries } = useCountries();
// const { getSalutations } = useSalutations();
const {
  user,
  logout,
  loadSalutation,
  userDefaultPaymentMethod,
  userDefaultBillingAddress,
  userDefaultShippingAddress,
} = useUser();
const {
  isNewsletterSubscriber,
  newsletterUnsubscribe,
  newsletterSubscribe,
} = useNewsletter();
const { pushSuccess, pushError } = useNotifications();
const { apiInstance } = useShopwareContext();
const orders = ref<Order[]>();
useBreadcrumbs([
  {
    name: "My Account",
    path: "/account",
  },
]);

onMounted(async () => {
  const fetchedOrders = await getCustomerOrders({
    limit: 3,
    sort: [
      { field: "orderDateTime", order: "DESC", naturalSorting: false }
    ]
  }, apiInstance);
  orders.value = fetchedOrders?.elements;
});


const updateNewsletterStatus = async (value: any) => {
  newsletter.value = value;
  try {
    if (newsletter.value) {
      await newsletterSubscribe({
        email: user.value?.email || "",
        option: "subscribe",
      });
      pushSuccess("Newsletter subscribed");
    } else {
      await newsletterUnsubscribe(user.value?.email || "");
      pushSuccess("Newsletter unsubscribe");
    }
  } catch (error) {
    newsletter.value = !value;
    console.log("error", error);
    pushError("Something goes wrong please try again later");
  }
};

onBeforeMount(async () => {
  if (user?.value?.salutationId) {
    await loadSalutation(user.value.salutationId);
  }
});
</script>

<template>
  <section class="flex flex-col space-y-10 mb-24">
    <section>
      <h3 class="mb-4">Account Overview</h3>
      <p class="text-base">Directly access your profile information, the default payment method and given addresses.</p>
    </section>
    <section>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="flex flex-col">
          <h6>Personal data</h6>
          <SharedCard class="flex-1">
            <template #content>
              <p class="text-base md:text-sm">
                {{ user?.firstName }} {{ user?.lastName }}
                <br/>
                <br/>
                {{user?.email}}
              </p>
            </template>
            <template #actions>
              <button class="text-sm font-medium text-white bg-gray-800 shadow-sm py-2 px-4" @click="() => router.push('/account/profile')">
                Edit profile
              </button>
            </template>
          </SharedCard>
        </div>
        <div class="flex flex-col">
          <h6>Default payment method</h6>
          <SharedCard class="flex-1">
            <template #content>
              <p class="text-base md:text-sm font-medium mb-2">{{ userDefaultPaymentMethod?.name }}</p>
              <p class="text-base md:text-sm">{{ userDefaultPaymentMethod?.description }}</p>
              <!-- <p>
                Apple Pay<br/>
                Mastercard<br/>
                •••• Ending in 1545
              </p> -->
            </template>
            <template #actions>
              <button class="text-sm font-medium text-white bg-gray-800 shadow-sm py-2 px-4" @click="() => router.push('/account/payment')">
                Change payment method
              </button>
            </template>
          </SharedCard>
        </div>
      </div>
    </section>
    <section>
      <h6>Newsletter subscription</h6>
      <SharedCard class="flex-1">
        <template #content>
          <div class="flex space-x-2 items-center">
            <SharedCheckbox id="subscription" name="subscription" :modelValue="newsletter" @update:modelValue="updateNewsletterStatus" />
            <label for="subscription" class="font-medium text-sm text-gray-700">Yes, I would like to subscribe to the free Stylad newsletter. (I may unsubscribe at any time.)</label>
          </div>
        </template>
      </SharedCard>
    </section>
    <section>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="flex flex-col">
          <h6>Billing address</h6>
          <SharedCard class="flex-1">
            <template #content>
              <p class="text-base md:text-sm">
                {{ userDefaultBillingAddress?.firstName }} {{ userDefaultBillingAddress?.lastName }}<br/>
                {{ userDefaultBillingAddress?.street }}<br/>
                {{ userDefaultBillingAddress?.zipcode }} {{ userDefaultBillingAddress?.city }},<br/>
                {{ getTranslatedProperty(userDefaultBillingAddress?.country, 'name') }}
              </p>
            </template>
            <template #actions>
              <button class="text-sm font-medium text-white bg-gray-800 shadow-sm py-2 px-4" @click="() => router.push('/account/address')">
                Change billing address
              </button>
            </template>
          </SharedCard>
        </div>
        <div class="flex flex-col">
          <h6>Shipping address</h6>
          <SharedCard class="flex-1">
            <template #content>
              <p class="text-base md:text-sm" v-if="userDefaultShippingAddress?.id === userDefaultBillingAddress?.id">
                Same as billing address.
              </p>
              <p class="text-base md:text-sm" v-else>
                {{ userDefaultShippingAddress?.firstName }} {{ userDefaultShippingAddress?.lastName }}<br/>
                {{ userDefaultShippingAddress?.street }}<br/>
                {{ userDefaultShippingAddress?.zipcode }} {{ userDefaultShippingAddress?.city }},<br/>
                {{ getTranslatedProperty(userDefaultShippingAddress?.country, 'name') }}
              </p>
            </template>
            <template #actions>
              <button class="text-sm font-medium text-white bg-gray-800 shadow-sm py-2 px-4" @click="() => router.push('/account/address')">
                Change shipping address
              </button>
            </template>
          </SharedCard>
        </div>
      </div>
    </section>
    <section>
      <h6 class="mb-4">Latest orders</h6>
      <SharedOrders :orders="orders || []" />
      <button class="mt-6 text-sm font-medium text-white bg-gray-800 shadow-sm py-2 px-4" @click="() => router.push('/account/order')">
        Show all orders
      </button>
    </section>
    <section class="block md:hidden">
      <button
        class="w-full flex items-center justify-center border border-gray-300 shadow-sm py-2 px-4 hover:bg-gray-50"
        @click="logout()"
      >
        <ArrowRightOnRectangleIcon class="h-5 w-5 text-gray-500"/>
        <span class="ml-2 text-gray-700 text-sm font-medium">Logout</span>
      </button>
    </section>
  </section>
</template>