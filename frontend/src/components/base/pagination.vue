<template>
  <div class="pagination-show">
    <template v-if="total > pageSize">
      <template v-if="(pageSize * currentPage) < total">
        <strong
          v-text="$t('common.showing') + ' ' + (pageSize * (currentPage-1) + 1) + ' - ' + (pageSize * currentPage) + ' ' + $t('common.of') + ' ' + total"
        ></strong>
      </template>
      <template v-else>
        <strong
          v-text="$t('common.showing') + ' ' + (pageSize * (currentPage-1) + 1) + ' - ' + total + ' ' + $t('common.of') + ' ' + total"
        ></strong>
      </template>
    </template>
    <template v-else>
      <template v-if="(total == 0)">
        <strong
          v-text="$t('common.showing') + ' ' + (pageSize * (currentPage-1)) + ' - ' + total + ' ' + $t('common.of') + ' ' + total"
        ></strong>
      </template>
      <template v-else>
        <strong
          v-text="$t('common.showing') + ' ' + (pageSize * (currentPage-1) + 1) + ' - ' + total + ' ' + $t('common.of') + ' ' + total"
        ></strong>
      </template>
    </template>
  </div>
</template>

<script>
  export default {
    name: "VPagination",
    props: {
      total: Number,
      pageSize: Number,
      currentPage: Number
    },
    data() {
      return {};
    },
    computed: {},
    methods: {}
  };
</script>