<script setup lang="ts">
import { useCurrency } from '../../composables/useCurrency';

const { fetchAvailableCurrencies, availableCurrencies, currentCurrency, setCurrency } = useCurrency();

onMounted(async () => {
  await fetchAvailableCurrencies();
})
</script>
<template>
  <div
    class="sw-currency-switcher"
    data-testid="currency-switcher"
  >
    <select
      id="currency"
      :value="currentCurrency?.id"
      name="currency"
      class="caret-current min-w-[60px] mt-2 mb-4 font-medium bg-transparent cursor-pointer focus:outline-none focus:ring-brand-light focus:border-brand-light text-sm"
      @change="(e: any) => setCurrency(e.target.value)"
      >
      <option
        v-for="currency of availableCurrencies"
        :key="currency.id"
        :value="currency.id"
      >
        {{ currency.symbol }} {{ currency.isoCode }}
      </option>
    </select>
  </div>
</template>
