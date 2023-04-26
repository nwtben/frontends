<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  minLength,
  email,
  sameAs,
  requiredIf,
} from "@vuelidate/validators";
import { ClientApiError } from "@shopware-pwa/types";

const { user, refreshUser, updatePersonalInfo, updateEmail } = useUser();

const errorMessages = ref<string[]>([]);

const isSuccess = ref(false);
const updated = ref(false);
const isUpdating = ref(false);

const state = reactive({
  firstName: "",
  lastName: "",
  // email: "",
  // emailConfirmation: "",
  // password: "",
  salutationId: "",
  title: "",
});

// const isEmailChanging = computed(() => state.email !== user.value?.email);

const isNameChanging = computed(
  () =>
    state.firstName !== user.value?.firstName ||
    state.lastName !== user.value?.lastName
);

const refs = toRefs(state);

// const emailConfirmationValidationRule = computed(() =>
//   isEmailChanging.value
//     ? {
//         required,
//         email,
//         sameAsEmail: sameAs(refs.email),
//       }
//     : {}
// );

const rules = computed(() => ({
  firstName: {
    required,
  },
  lastName: {
    required,
  },
  // email: {
  //   email,
  //   required,
  // },
  // emailConfirmation: emailConfirmationValidationRule.value, // take a dynamic one
  // password: {
  //   required: requiredIf(() => {
  //     return isEmailChanging.value;
  //   }),
  //   minLength: minLength(8),
  // },
}));

const $v = useVuelidate(rules, state);

const invokeUpdate = async (): Promise<void> => {
  errorMessages.value = [];
  isSuccess.value = false;
  try {
    updated.value = false;
    $v.value.$touch();
    if ($v.value.$invalid) {
      return;
    }
    isUpdating.value = true;

    if (isNameChanging.value) {
      await updatePersonalInfo({
        firstName: state.firstName,
        lastName: state.lastName,
        salutationId: state.salutationId,
        title: state.title,
      });
      isSuccess.value = true;
    }

    // if (isEmailChanging.value) {
    //   await updateEmail({
    //     email: state.email,
    //     emailConfirmation: state.emailConfirmation,
    //     password: state.password,
    //   });
    //   isSuccess.value = true;
    // }

    isUpdating.value = false;

    refreshUser();
  } catch (err) {
    const e = err as ClientApiError;
    errorMessages.value = e.messages.map((m) => m.detail);
  }
};

onMounted(async () => {
  await refreshUser();
  state.firstName = user.value?.firstName || "";
  state.lastName = user.value?.lastName || "";
  state.salutationId = user.value?.salutationId || "";
  state.title = user.value?.title || "";
  // state.a = user.value?.phone 
  // state.email = user.value?.email || "";
});
</script>
<template>
  <h6>Personal data</h6>
  <div class="mt-4">
    <form class="flex flex-col gap-6" @submit.prevent="invokeUpdate">
      <div>
        <label for="firstName" class="text-sm text-gray-700 font-medium mb-1">
          First name
        </label>
        <input v-model="state.firstName" id="firstName" class="border border-gray-300 py-2 px-3 text-base md:text-sm text-gray-900 w-full shadow-sm">
      </div>
      <div>
        <label for="lastName" class="text-sm text-gray-700 font-medium mb-1">
          Last name
        </label>
        <input v-model="state.lastName" id="lastName" class="border border-gray-300 py-2 px-3 text-base md:text-sm text-gray-900 w-full shadow-sm">
      </div>
      <div>
        <label for="phone" class="text-sm text-gray-700 font-medium mb-1">
          Phone number (Optional)
        </label>
        <input id="phone" class="border border-gray-300 py-2 px-3 text-base md:text-sm text-gray-900 w-full shadow-sm">
      </div>

      <button type="submit" :disabled="isUpdating" class="text-white font-medium py-2 px-5 bg-gray-800 shadow-sm disabled:opacity-50">
        Update personal data
      </button>
    </form>
  </div>
</template>
