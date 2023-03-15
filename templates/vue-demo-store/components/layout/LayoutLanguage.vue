<script setup lang="ts">
</script>
<template>
  <div
    class="sw-language-switcher"
    data-testid="language-switcher"
  >
     <select
      id="salutation"
      name="salutation"
      autocomplete="salutation-name"
      class="min-w-[80px] py-2.5 bg-transparent cursor-pointer focus:outline-none focus:ring-brand-light focus:border-brand-light sm:text-sm"
    >
      <option
        :value="'en'"
      >
        English
      </option>
    </select>
  </div>
</template>
