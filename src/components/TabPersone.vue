<template>
  <v-data-table-server
    class="my-3"
    v-model:items-per-page="itemsPerPage"
    v-model:page="page"
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="serverItems"
    :items-length="totalItems"
    :loading="loading"
    :search="search"
    item-value="name"
    @update:options="loadPersonasApi"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Lista Persone</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="800px"
        >
          <template v-slot:activator="{ props }">
            <ExportPersonasToEmail />
            <v-btn
              v-if="showActions"
              class="mb-2"
              color="primary"
              dark
              v-bind="props"
            >
              Aggiungi persona
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form ref="form" v-model="valid">
                  <v-row>
                    <v-col cols="12" md="6" sm="6">
                      <v-text-field
                        v-model="editedItem.nome"
                        label="Nome"
                        :rules="[rules.required]"
                        :error-messages="errors.nome"
                        @input="resetErrorsApi"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                      <v-text-field
                        v-model="editedItem.cognome"
                        label="Cognome"
                        :rules="[rules.required]"
                        :error-messages="errors.cognome"
                        @input="resetErrorsApi"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                      <v-date-input
                        v-model="editedItem.data_di_nascita"
                        label="Date di nascita"
                        variant="solo"
                        :rules="[rules.required]"
                        :error-messages="errors.data_di_nascita"
                        @input="resetErrorsApi"
                      ></v-date-input>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                      <v-text-field
                        v-model="editedItem.email"
                        label="Email"
                        :rules="[rules.required, rules.email]"
                        :error-messages="errors.email"
                        @input="resetErrorsApi"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                      <v-text-field
                        v-model="editedItem.telefono"
                        label="Telefono"
                        :rules="[rules.required]"
                        :error-messages="errors.telefono"
                        @input="resetErrorsApi"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                      <v-text-field
                        v-model="editedItem.codice_fiscale"
                        label="Codice fiscale"
                        :rules="[rules.required, rules.codiceFiscale]"
                        :error-messages="errors.codice_fiscale"
                        @input="toUpperCase"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">Annulla</v-btn>
              <v-btn :disabled="!valid" color="blue-darken-1" variant="text" @click="save">Salva</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Vuoi procedere con la cancellazione?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Annulla</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        class="me-2"
        size="small"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        size="small"
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>

    <template v-slot:item.data_di_nascita="{ item }">
      {{ formatDate(item.data_di_nascita) }}
    </template>
  </v-data-table-server>
</template>

<script>
import axios from "@/services/axios";
import moment from 'moment';
import ExportPersonasToEmail from "@/components/ExportPersonasToEmail.vue";
import {mapGetters} from "vuex";
export default {
  components: {ExportPersonasToEmail},
  data: () => ({
    dialog: false,
    dialogDelete: false,
    itemsPerPage: 10,
    page: 1,
    sortBy: [],
    headers: [
      { title: 'ID', sortable: false, key: 'id',},
      { title: 'Nome', sortable: true, key: 'nome',},
      { title: 'Cognome', sortable: false, key: 'cognome',},
      { title: 'Data di nascita', sortable: false, key: 'data_di_nascita',},
      { title: 'Email', sortable: false, key: 'email',},
      { title: 'Telefono', sortable: false, key: 'telefono',},
      { title: 'Codice Fiscale', sortable: false, key: 'codice_fiscale',},
    ],
    search: '',
    serverItems: [],
    loading: true,
    totalItems: 0,
    editedIndex: -1,
    editedItem: {
      nome: '',
      cognome: '',
      data_di_nascita: null,
      email: '',
      telefono: '',
      codice_fiscale: '',
    },
    defaultItem: {
      nome: '',
      cognome: '',
      data_di_nascita: null,
      email: '',
      telefono: '',
      codice_fiscale: '',
    },

    menu: false,
    tempDate: '',
    errors: {},
    valid: false,
    rules: {
      required: value => !!value || 'Campo obbligatorio.',
      email: value => {
        const pattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
        return pattern.test(value) || 'E-mail non valida.';
      },
      codiceFiscale: value => {
        // Il codice fiscale deve essere esattamente di 16 caratteri
        if (value.length !== 16) {
          return 'Il Codice Fiscale deve essere lungo 16 caratteri.';
        }
        // Il codice fiscale deve contenere solo lettere maiuscole e numeri
        const pattern = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;
        return pattern.test(value) || 'Codice fiscale non valido';
      },
    }
  }),

  computed: {
    ...mapGetters(['isAdmin']),
    formTitle () {
      return this.editedIndex === -1 ? 'Inserisci nuova persona' : 'Modifica dettagli persona'
    },
    showActions() {
      return this.isAdmin;
    },
  },
  created() {
    if(this.showActions){
      this.headers.push(
        { title: 'Azioni', key: 'actions', sortable: false }
      )
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  methods: {
    async loadPersonasApi({page, itemsPerPage, sortBy}) {
      this.loading = true

      // TODO ottimizzare gestione per n ordinamenti
      const sortKey = (sortBy && sortBy.length === 1) ? sortBy[0].key : ''
      const sortOrder = (sortBy && sortBy.length === 1) ? sortBy[0].order : ''

      try {
        let uri = `/api/personas?page=${page}&per_page=${itemsPerPage}&sort_by=${sortKey}&sort=${sortOrder}`;
        console.log(uri)
        const response = await axios.get(uri);

        this.serverItems = transformDate(response.data.data)
        this.totalItems = response.data.total
        this.loading = false

      } catch (error) {
        if (error?.response?.data?.message) {
          console.log(error.response.data.message);
        }
        alert('Errore Datatables');
      }
    },

    async deletePersonaApi(item) {
      try {
        let uri = `/api/personas/${item.id}`;
        await axios.delete(uri);
        return true;
      } catch (error) {
        if (error?.response?.data?.message) {
          console.log(error.response.data.message);
        }
        alert('Errore Api Delete');
      }
      return null
    },

    async createPersonaApi(item) {
      try {
        let uri = `/api/personas`;
        item.data_di_nascita = moment(item.data_di_nascita).format('YYYY-MM-DD');
        await axios.post(uri, item);
        return true;
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          if (error?.response?.data?.message) {
            console.log(error.response.data.message);
          }
          alert('Errore api create persona');
        }
      }
      return false
    },

    async updatePersonaApi(item) {
      try {
        let uri = `/api/personas/${item.id}`;
        item.data_di_nascita = moment(item.data_di_nascita).format('YYYY-MM-DD');
        await axios.put(uri, item);
        return true;
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          if (error?.response?.data?.message) {
            console.log(error.response.data.message);
          }
          alert('Errore api update persona');
        }
      }
      return null
    },

    formatDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },

    resetErrorsApi(){
      this.errors = {}
    },

    toUpperCase(event) {
      this.resetErrorsApi()
      this.editedItem.codice_fiscale = event.target.value.toUpperCase();
    },

    editItem (item) {
      this.resetErrorsApi()
      this.editedIndex = this.serverItems.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true

      //nextTick assicura che la validazione venga chiamata solo dopo che il DOM è stato aggiornato.
      this.$nextTick(() => {
        // Attiva la validazione quando la modale è aperta
        this.$refs.form.validate();
      });
    },

    deleteItem (item) {
      this.editedIndex = this.serverItems.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      const deletePersona = await this.deletePersonaApi(this.editedItem);
      if (deletePersona) {
        this.refreshPersonas()
        this.serverItems.splice(this.editedIndex, 1)
        this.closeDelete()
      }
    },

    refreshPersonas() {
      let criteria = {
        page:this.page,
        itemsPerPage:this.itemsPerPage,
        sortBy:this.sortBy
      }
      this.loadPersonasApi(criteria)
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save() {
      if (this.editedIndex > -1) {
        // update persona
        const updatePersona = await this.updatePersonaApi(this.editedItem);
        if (updatePersona) {
          this.refreshPersonas()
          Object.assign(this.serverItems[this.editedIndex], this.editedItem)
          this.close()
        }
      } else {
        // crea nuova persona
        const createPersona = await this.createPersonaApi(this.editedItem);
        if (createPersona) {
          this.refreshPersonas()
          this.serverItems.push(this.editedItem)
          this.close()
        }
      }
    },
  },
}

const transformDate = (dataArray) => {
  return dataArray.map(item => {
    // Trasformo la stringa della data YYYY-DD-MM in un oggetto Date
    const date = new Date(item.data_di_nascita);
    return {
      ...item,
      data_di_nascita: date
    };
  });
};
</script>
