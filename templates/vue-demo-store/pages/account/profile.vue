<script setup lang="ts">
import {
  ChevronDownIcon,
} from '@heroicons/vue/20/solid';

definePageMeta({
  layout: "account",
});

useBreadcrumbs([
  {
    name: "Account Overview",
    path: "/account",
  },
  {
    name: "My profile",
    path: "/account/profile",
  },
]);
const { user } = useUser();

</script>

<script lang="ts">
export default {
  name: "ProfilePage",
};
</script>

<template>
  <section class="flex flex-col space-y-10 mb-24">
    <section>
      <h3 class="mb-4">My profile</h3>
      <p class="text-base">Check your personal data</p>
    </section>
    <section>
      <AccountPersonalData />
    </section>
    <section>
      <h4 class="text-lg font-medium mb-4">
        Login data
      </h4>
      <p class="text-sm text-gray-900">
        {{ user?.email }}
      </p>
      <div class="flex items-center mt-6">
        <p class="mr-1 text-sm text-gray-700 font-medium">
          Change e-mail address
        </p>
        <ChevronDownIcon class="w-5 h-5" />
      </div>
      <div class="flex items-center mt-6">
        <p class="mr-1 text-sm text-gray-700 font-medium">
          Change password
        </p>
        <ChevronDownIcon class="w-5 h-5" />
      </div>
    </section>
  </section>
</template>
