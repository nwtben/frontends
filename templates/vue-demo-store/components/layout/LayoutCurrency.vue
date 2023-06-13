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
    <SwSelect
      id="currency"
      name="currency"
      :value="currentCurrency?.id"
      @change="(e: any) => setCurrency(e.target.value)"
      class="mt-2 mb-4"
    >
      <option
        v-for="currency of availableCurrencies"
        :key="currency.id"
        :value="currency.id"
      >
        {{ currency.symbol }} {{ currency.isoCode }}
      </option>
    </SwSelect>
  </div>
</template>
