<script lang="ts" setup>
const localePath = useLocalePath();

useBreadcrumbs([
  {
    name: "My Account",
    path: "/account",
  },
  {
    name: "Recover password",
    path: "/account/recover",
  },
]);
</script>

<template>
  <div class="recover-wrapper">
    <AccountRecoverPassword>
      <template #action>
        <div class="text-center space-y-2">
          <p class="py-2 px-4 text-lg text-brand-primary">
            {{ $t('have_account_yet') }}
          </p>
          <NuxtLink
            :to="localePath('/register')"
            class="text-sm font-medium px-4 text-gray-600 focus:outline-none underline"
          >
            {{ $t('register_today') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/login')"
            class="flex justify-center align-center text-sm font-medium text-gray-600 py-2 px-4 focus:outline-none underline"
          >
            {{ $t('try_login_again') }}
          </NuxtLink>
        </div>
      </template>
    </AccountRecoverPassword>
  </div>
</template>
