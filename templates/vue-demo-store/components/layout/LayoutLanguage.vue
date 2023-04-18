<script setup lang="ts">
const { setLanguage, languages, currentLanguage } = useLanguage();

</script>
<template>
  <div
    class="sw-language-switcher"
    data-testid="language-switcher"
  >
     <select
      id="language"
      name="language"
      :value="currentLanguage?.id"
      class="caret-current min-w-[70px] mt-2 mb-4 font-medium bg-transparent cursor-pointer focus:outline-none focus:ring-brand-light focus:border-brand-light text-sm"
      @change="(e: any) => setLanguage(e.target.value)"
      >
      <option
        v-for="lang of languages"
        :key="lang.translationCode?.code"
        :value="lang.id"
      >
        {{ lang.name }}
      </option>
    </select>
  </div>
</template>
