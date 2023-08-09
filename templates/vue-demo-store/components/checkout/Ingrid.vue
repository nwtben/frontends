<template>
    <div class="card">
        <div id="ingrid" v-html="siwHtml"></div>
        <slot/>
    </div>
</template>

<script>
  import {
  useCheckout,
  useSessionContext,
  useCart,
  useUser,
  useShopwareContext,
  useSalutations,
  useCountries
  } from "@shopware-pwa/composables-next";
  import Axios from 'axios';

  export default {
      name: 'Ingrid',
      data() {
      return {
        siwSessionId: "",
        siwHtml: "",
        siwOption: "",
        salutationId: null,
        countryId: null,
        lastUpdateDeliveryAddress: null
      }    
    },
    setup() {
      const { isGuestSession, register, isLoggedIn } = useUser()
      const { getCountries } = useCountries();
      const {
        refreshSessionContext,
        activeShippingAddress,
        setActiveShippingAddress,
        activeBillingAddress,
        setActiveBillingAddress,
      } = useSessionContext();
      const { refreshCart } = useCart()

      const { apiInstance } = useShopwareContext();
      const { getSalutations, fetchSalutations } = useSalutations();

      return {
        isGuestSession,
        apiInstance,
        refreshCart,
        getSalutations,
        fetchSalutations,
        register,
        isLoggedIn,
        refreshSessionContext,
        activeShippingAddress,
        setActiveShippingAddress,
        activeBillingAddress,
        setActiveBillingAddress,
        getCountries
      }
    },
    mounted() {
      const id = this.salutations?.[salutations.length -1]?.id;
      if (id) {
        this.salutationId = id;
      }
      this.getSiw();  
    },
    methods: {
      getSiw() {
        const accesstToken = this.apiInstance.config.accessToken;
        const contextToken = this.apiInstance.config.contextToken;
        const requestOptions = {
          url: this.apiInstance.config.endpoint+"/store-api/ingrid/session",
          method: 'POST',
          headers: { 'Content-Type': 'application/json' , 'sw-access-key': accesstToken ,'sw-context-token': contextToken},
          data: {}
        };
      
        Axios(requestOptions)
        .then((response) => {
          this.siwHtml = response.data.html_snippet
          this.siwSessionId = response.data.siwSessionId
        }
        )
        .catch((error) => console.log("ingridEror ",error));
      },
      replaceScriptNode(node) {
        if (!this.isExternalScript(node) && this.isScriptNode(node)) {
          node.parentNode.replaceChild(this.cloneScriptNode(node), node);
        } else {
          var i = 0,
            children = node.childNodes;
          while (i < children.length) {
            this.replaceScriptNode(children[i++]);
          }
        }
        return node;
      },

      isScriptNode(node)  {
        return node.nodeName === "SCRIPT";
      },

      isExternalScript(node) {
        return !!node.src && node.src !== "";
      },

      cloneScriptNode(node) {
        var script = document.createElement("script");
        script.text = node.innerHTML;
        for (var i = node.attributes.length - 1; i >= 0; i--) {
          script.setAttribute(node.attributes[i].name, node.attributes[i].value);
        }
        return script;
      },
      registerUser(user) {
        this.register(user)
      }
    },
    updated() {
      var self = this;
      if (this.siwHtml) {
        this.replaceScriptNode(document.getElementById("shipwallet-container"));
        var checkExists = setInterval(() => {
          if(window._sw) {
            window._sw(function(api){
              api.on('data_changed', function(m,b) {
                if (!b.initial_load && b.shipping_method_changed || b.pickup_location_changed || b.delivery_address_changed || b.payment_method_changed || b.price_changed) {
                  self.getSiw();
                  setTimeout(function() {
                    self.siwOption = new Date()
                  }, 1000);
                }
              })
              api.on('summary_changed', function(summary) {
                    if (summary.delivery_address) {
                        if (JSON.stringify(summary.delivery_address) == self.lastUpdateDeliveryAddress) {
                            return;
                        }
                        if( !self.isGuestSession && !self.isLoggedIn && self.activeBillingAddress == null) {
                          let country = self.getCountries.find(country => country.iso === summary.delivery_address.country);
                          let user = {};
                          user.billingAddress = {};
                          user.guest = true;
                          user.email = summary.delivery_address.email;
                          user.emailConfirmation = summary.delivery_address.email;
                          user.salutationId = self.salutationId;
                          user.firstName = summary.delivery_address.first_name;
                          user.lastName = summary.delivery_address.last_name;
                          user.billingAddress.countryId = country.id;
                          user.billingAddress.street = summary.delivery_address.address_lines[0];
                          user.billingAddress.zipcode = summary.delivery_address.postal_code;
                          user.billingAddress.city = summary.delivery_address.city;
                          user.billingAddress.phoneNumber = summary.delivery_address.phone_number;

                          self.registerUser(user)
                          self.refreshSessionContext();
                          self.lastUpdateDeliveryAddress = JSON.stringify(summary.delivery_address);
                        } else {
                          self.getSiw();
                          self.lastUpdateDeliveryAddress = JSON.stringify(summary.delivery_address);
                        }
                    }
                });
            })
            clearInterval(checkExists);
          }
        }, 2000);
      }
    },
    watch: {
      siwOption: function() {
        this.refreshCart()
      },
      getSalutations: function(salutations) {
        const id = salutations?.[salutations.length -1]?.id;
        if (id) {
          this.salutationId = id;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>