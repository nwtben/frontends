<script setup lang="ts">
import {
  ChevronDownIcon,
} from '@heroicons/vue/20/solid';

definePageMeta({
  layout: "account",
});

useBreadcrumbs([
  {
    name: "My Account",
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
      <h3 class="mb-4">{{$t('my_profile')}}</h3>
      <p class="text-base">{{$t('check_your_personal_data')}}</p>
    </section>
    <section>
      <AccountPersonalData />
    </section>
    <section>
      <h4 class="text-lg font-medium mb-4">
          {{$t('login_data') }}
      </h4>
      <p class="text-sm text-gray-900">
        {{ user?.email }}
      </p>
      <div class="flex items-center mt-6">
        <p class="mr-1 text-sm text-gray-700 font-medium">
            {{$t('change_email_address') }}
        </p>
        <ChevronDownIcon class="w-5 h-5" />
      </div>
      <div class="flex items-center mt-6">
        <p class="mr-1 text-sm text-gray-700 font-medium">
            {{$t('change_password') }}
        </p>
        <ChevronDownIcon class="w-5 h-5" />
      </div>
    </section>
  </section>
</template>
