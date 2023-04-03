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
      class="caret-current min-w-[70px] py-2.5 bg-transparent cursor-pointer focus:outline-none focus:ring-brand-light focus:border-brand-light sm:text-sm"
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
