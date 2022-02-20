export default {
  props: ['pages'],
  template: `
  <nav aria-label="Page navigation">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: !pages.has_pre }">
        <a class="page-link" href="#" aria-label="Previous"
          @click.prevent="$emit('emit-pages', pages.current_page - 1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item" :class="{ active: page === pages.current_page}"
          v-for="page in pages.total_pages" :key="'p'+page">
        <a class="page-link" href="#"
          @click.prevent="$emit('emit-pages', page)">
          {{ page }}
        </a>
      </li>
      <li class="page-item" :class="{ disabled: !pages.has_next }">
        <a class="page-link" href="#" aria-label="Next"
          @click.prevent="$emit('emit-pages', pages.current_page + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`,
};
