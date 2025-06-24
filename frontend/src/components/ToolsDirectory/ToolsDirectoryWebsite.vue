<template>
  <div id="tools_directory">
    <div class="search-header">
      <h2>Tools Directory (Website View)</h2>
      <input
        v-model="search"
        type="search"
        class="form-control"
        placeholder="Search tools or sites…"
      />
    </div>

    <div class="panel-group" id="toolAccordion">
      <div v-for="tool in filteredTools" :key="tool.id" class="accordion">
        <button class="accordion-header" @click="toggleAccordion(tool.id)">
          {{ tool.name }}
          <span class="arrow" :class="{ open: openAccordions.includes(tool.id) }">▼</span>
        </button>

        <div v-if="openAccordions.includes(tool.id)" class="accordion-content">
          
          <div class="sites-using-tool accordion-content--section">
            <h4>Sites using this tool:</h4>
            <ul>
              <li v-for="url in tool.websites" :key="url">
                <a :href="url" target="_blank">{{ url }}</a>
              </li>
            </ul>
          </div>
          
          <div class="location-tags accordion-content--section" v-if="tool.locationTags">
            <h4>Site Locations:</h4>
            <p>{{ tool.locationTags.siteLocations?.join(', ') || 'N/A' }}</p>
            <h4>Web Dash Locations:</h4>
            <p>{{ tool.locationTags.webDashLocations?.join(', ') || 'N/A' }}</p>
          </div>
          
          <div class="ticket-references accordion-content--section" v-if="tool.ticketReferences.length">
            <h4>Tickets:</h4>
            <ul>
              <li v-for="link in tool.ticketReferences" :key="link">
                <a :href="link" target="_blank">{{ link }}</a>
              </li>
            </ul>
          </div>
          <div class="tool-description accordion-content--section">
            <h4>Description: </h4>
            <p v-if="tool.description">{{ tool.description }}</p>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
import { tools } from '@/data/thirdPartyTools.js';

export default {
  name: 'ToolsDirectoryWebsite',
  data() {
    return { 
      search: '',
      openAccordions: [], 
    };
  },
  computed: {
    filteredTools() {
      const term = this.search.toLowerCase();
      if (!term) return tools;
      return tools.filter(
        t =>
          t.name.toLowerCase().includes(term) ||
          t.websites.some(w => w.toLowerCase().includes(term))
      );
    }
  },
  methods: {
    toggleAccordion(id) {
      if (this.openAccordions.includes(id)) {
        this.openAccordions = this.openAccordions.filter(openId => openId !== id);
      } else {
        this.openAccordions.push(id);
      }
    }
  }
};
</script>
<style scoped>
#tools_directory {
  background-color: whitesmoke;
  padding: 12px 24px;
}

.search-header {
  margin: 18px 0px 30px 0px;
  padding: 24px;
  color: white;
  background-color: #57B3CE;
  border: 1px solid #57B3CE;
  border-radius: 5px;
  box-shadow: 1px 2px 5px #bbb;
}

#toolAccordion .accordion-header {
  color: whitesmoke;
  padding: 18px;
  border: 1px solid;
  width: 100%;
  font-size: 1.2rem;
  border-radius: 5px;
}
#toolAccordion .accordion .accordion-header {
  background: #064A94;
  border-color: #064A94;
}

.accordion-content {
  background: #ffffff;
  border-left: 4px solid #57B3CE;
  padding: 12px;
  margin-top: 5px;
  border-radius: 5px;
}

.accordion-content--section {
  padding: 12px;
  margin: 24px auto;
}
.accordion-content--section h4 {
  font-size: 1.2em;
}
.accordion-content--section a {
  font-size: 16px;
}
.accordion-content--section p {
  font-size: 16px!important;
}

.arrow {
  transition: transform 0.3s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

</style>
