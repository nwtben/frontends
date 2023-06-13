<script setup lang="ts">
const { setLanguage, languages, currentLanguage } = useLanguage();

</script>
<template>
  <div
    class="sw-language-switcher"
    data-testid="language-switcher"
  >
    <SwSelect
      id="language"
      name="language"
      :value="currentLanguage?.id" 
      @change="(e: any) => setLanguage(e.target.value)"
      class="mt-2 mb-4"
    >
      <option
        v-for="lang of languages"
        :key="lang.translationCode?.code"
        :value="lang.id"
      >
        {{ lang.name }}
      </option>
    </SwSelect>
  </div>
</template>
