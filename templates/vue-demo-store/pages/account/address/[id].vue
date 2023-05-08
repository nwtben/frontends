<script lang="ts">
export default {
  name: "AccountAddressDetailPage",
};
</script>

<script setup lang="ts">

definePageMeta({
  layout: "account",
});
const route = useRoute();
const isCreation = ref(route.params.id === 'new');

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
</script>

<template>
  <section class="flex flex-col space-y-10 mb-24">
    <section>
      <h3 class="mb-4">{{isCreation ? 'Add new address' : 'Edit address'}}</h3>
    </section>
    <div class="flex flex-col gap-4">
      <form class="flex flex-col gap-6">
        <div>
          <p class="text-sm text-brand-dark mb-1 font-medium">
            Full name
          </p>
          <input class="border border-gray-300 py-2 px-3 text-sm text-gray-900 w-full shadow-input">
        </div>
        <div>
          <p class="text-sm font-medium text-brand-dark mb-1">
            Address
          </p>
          <textarea
            class="border border-gray-300 py-2 px-3 text-sm text-gray-900 w-full shadow-input"
            :rows="3"
          />
        </div>
        <div>
          <SharedCheckbox content="Add company" />
        </div>
        <div class="grid grid-col-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <p class="text-sm text-brand-dark mb-1 font-medium">
              Zip-code
            </p>
            <input class="border border-gray-300 py-2 px-3 text-sm text-dark-primary w-full shadow-input">
          </div>
          <div>
            <p class="text-sm text-brand-dark mb-1 font-medium">
              City
            </p>
            <input class="border border-gray-300 py-2 px-3 text-sm text-dark-primary w-full shadow-input">
          </div>
          <div>
            <p class="text-sm text-brand-dark mb-1 font-medium">
              Country
            </p>
            <SharedSelect />
          </div>
        </div>

        <div>
          <SharedCheckbox content="Use as shipping address" />
        </div>

        <div>
          <SharedCheckbox content="Use as billing address" />
        </div>
        <div>
          <button class="text-white font-medium py-2 px-5 bg-brand-primary">
            {{isCreation ? 'Add address' : 'Update address'}}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
