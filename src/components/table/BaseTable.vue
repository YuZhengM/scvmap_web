<template>
  <BaseLoading class="base_table_template" ref="loading">
    <!-- Search Information -->
    <div class="top_content" v-if="isSearch">
      <div class="search" v-if="!isServicePaging">
        {{ searchTitle }}
        <el-input placeholder="Please enter the search content" v-model="search" clearable size="default" maxlength="100"></el-input>
      </div>
      <div class="serviceSearch" :style="`width: ${serviceSearchWidth}%;`" v-if="isServicePaging">
        <div class="serviceSelect" :style="`width: ${fieldWidth}%;`">
          <BaseSelect :title="searchTitle" :width="`${width}%`" :select-data="fieldData" :change-event="fieldChange" placeholder="Select field" is-line ref="select"/>
        </div>
        <div class="serviceSymbol">
          <BaseSelect width="114px" :select-data="symbolData" placeholder="Select" is-line ref="symbolLabel"/>
        </div>
        <div class="serviceContent" :style="`width: ${contentWidth}%;`">
          <el-input placeholder="Search content" v-model="serviceSearch" clearable size="default" maxlength="100"></el-input>
        </div>
        <div class="serviceSubmit">
          <el-button type="primary" @click="searchClick" :style="`width: ${buttonSize[0]}px; height: ${buttonSize[1]}px;`">Search</el-button>
          <el-button type="info" @click="RefreshClick" :style="`width: ${buttonSize[0]}px; height: ${buttonSize[1]}px;`">Refresh</el-button>
        </div>
      </div>
      <div class="download" v-show="fileDownloadUrls !== undefined && fileDownloadUrls.length > 0">
        <el-link :href="item.url" v-for="(item, i) in fileDownloadUrls" :key="i">
          <el-button size="small" type="primary"> {{ item.title }} &nbsp; <i class="fas fa-file-download"></i></el-button>
        </el-link>
        &nbsp;
      </div>
    </div>
    <!-- Table data display -->
    <el-table class="table_info"
              :data="showData"
              @sort-change="changeTableSort"
              @expand-change="expandChange"
              @selection-change="handleSelectionChange"
              stripe border
              :lazy="lazy"
              :load="load"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              ref="baseTable">
      <el-table-column type="expand" v-if="isExpand">
        <template #default="props">
          <slot name="expand" :content="props"></slot>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="40" v-if="isSelection"/>
      <ColumnTable :table-description="beforeColumnTableDescription"/>
      <slot name="default"></slot>
      <ColumnTable :table-description="afterColumnTableDescription"/>
    </el-table>
    <!-- Pagination data display -->
    <Paging :change-page="changePage" :layout="layout" :change-size="changeSize" :pager-count="pagerCount" v-if="isPaging" :pageSizes="pageSizes" :is-simple="isSimple" ref="paging"/>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import Paging from '@/components/page/Paging.vue';
import { PageResult } from '@/service/model/reponse/result';
import Base from '@/service/util/base/base';
import ArrayUtil from '@/service/util/base/array';
import Json from '@/service/util/base/json';
import Time from '@/service/util/base/time';
import '@/assets/less/components/table/BaseTable.less';
import { TABLE_NUMBER_SYMBOL_SELECT, TABLE_STRING_SYMBOL_SELECT, TableHead } from '@/service/model/components/table';
import ColumnTable from '@/components/table/ColumnTable.vue';
import { Page } from '@/service/model/reponse/request';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import { InputSelect } from '@/service/model/components/input';
import { ElNotification } from 'element-plus';

/**
 * The `tableDescription` is a required parameter.
 * When `isRearPaging` = false, the `tableData` parameter content must be passed.
 * When `isRearPaging` = true, the `updateNewData` function content must be passed.
 */
export default defineComponent({
  name: 'BaseTable',
  components: {
    BaseSelect,
    BaseLoading,
    ColumnTable,
    Paging
  },
  props: {
    // Passed data
    tableData: {
      type: Array,
      default: () => ([])
    },
    // Column names and column name information in the data
    tableDescription: {
      type: Array,
      default: () => ([] as Array<TableHead>)
    },
    // Whether to show pagination
    isPaging: {
      type: Boolean,
      default: () => true
    },
    // Whether to show the search
    isSearch: {
      type: Boolean,
      default: () => true
    },
    // Whether it is backend pagination
    isServicePaging: {
      type: Boolean,
      default: () => true
    },
    // Whether it is backend pagination
    searchTitle: {
      type: String,
      default: () => 'Search: '
    },
    // Total width of the selected field in backend pagination
    fieldWidth: {
      type: Number,
      default: () => 30
    },
    // Width of the selected field box in backend pagination
    width: {
      type: Number,
      default: () => 70
    },
    // Width of the input content box in backend pagination
    contentWidth: {
      type: Number,
      default: () => 25
    },
    // Width of the input content box in backend pagination
    serviceSearchWidth: {
      type: Number,
      default: () => 70
    },
    // Padding of the selected button in backend pagination
    buttonSize: {
      type: Array,
      default: () => [70, 32]
    },
    // Update data
    updateNewData: {
      type: Function,
      default: () => ({})
    },
    // Maximum number of page number buttons
    pagerCount: {
      type: Number,
      default: () => 7
    },
    // Whether to enable the loading animation
    isLoading: {
      type: Boolean,
      default: () => true
    },
    // Whether to lazy load child node data
    lazy: {
      type: Boolean,
      default: () => true
    },
    // Function to load child node data
    childrenLoad: {
      type: Function,
      default: () => ({})
    },
    // Whether to have extended information
    isExpand: {
      type: Boolean,
      default: () => false
    },
    // When the extended part is clicked
    expandEvent: {
      type: Function,
      default: () => ({})
    },
    // When the extended part is opened
    expandOpen: {
      type: Function,
      default: () => ({})
    },
    // When the extended part is closed
    expandClose: {
      type: Function,
      default: () => ({})
    },
    // Selection event
    selectionChange: {
      type: Function,
      default: () => ({})
    },
    // Sorting event
    sortChange: {
      type: Function,
      default: () => ({})
    },
    // Page number change event
    pageEvent: {
      type: Function,
      default: () => ({})
    },
    // Page size change event
    sizeEvent: {
      type: Function,
      default: () => ({})
    },
    // Callback function before backend pagination
    callbackFunctionBefore: {
      type: Function,
      default: () => ({})
    },
    // Callback function for backend pagination
    callbackFunction: {
      type: Function,
      default: () => ({})
    },
    // Whether the pagination is in simple form
    isSimple: {
      type: Boolean,
      default: () => false
    },
    // Whether to add a selection column to the table
    isSelection: {
      type: Boolean,
      default: () => false
    },
    // Drop-down page size list
    pageSizes: {
      type: Array,
      default: () => [10, 25, 45, 50, 75, 100]
    },
    // Drop-down page size list
    removeSelectContent: {
      type: Array,
      default: () => []
    },
    // Feasibility value for monitoring
    continueValue: {
      type: Boolean,
      default: () => true
    },
    // Whether to start loading
    isMounted: {
      type: Boolean,
      default: () => true
    },
    // Whether to start loading
    isSelectChange: {
      type: Boolean,
      default: () => true
    },
    beforeColumnNumber: {
      type: Number,
      default: () => -1
    },
    // Display layout
    layout: {
      type: String,
      default: () => 'total, sizes, prev, pager, next, jumper'
    },
    // URL information for downloading the table
    downloadUrls: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    // Loading animation label
    const loading = ref();
    // Get the search label
    const select = ref();
    // Get the pagination label
    const paging = ref();
    const baseTable = ref();
    const symbolLabel = ref();
    // Get data information
    const tableDescription = props.tableDescription.filter((item: any) => Base.noNull(item.column));
    const signalColumNumber = props.beforeColumnNumber === -1 ? tableDescription?.length : props.beforeColumnNumber;
    // Set reactive data
    const data = reactive({
      // Search content
      search: '' as string,
      serviceSearch: '' as string,
      // Drop-down field information
      fieldData: [] as Array<InputSelect>,
      symbolData: [] as Array<InputSelect>,
      // Data passed from the page (overall information of the searched content, referred to as local data)
      pagingChangeData: [] as Array<{}>,
      // Data directly visible to the front-end user (display data)
      showData: [] as { [key: string]: any },
      direction: 0,
      column: Object,
      /**
       * Overall page data information (all data, only applicable to non-backend pagination, meaning the front-end has all the data)
       * [The difference from pagingChangeData is that when the search content changes (when search changes),
       * pageTableData remains unchanged, while pagingChangeData is the overall information of the searched content]
       * When using backend pagination, only showData has a value, and the rest (pagingChangeData, pageTableData, tableData) have no value
       */
      pageTableData: props.tableData as { [key: string]: any },
      // Table title information
      signalColumNumber: props.beforeColumnNumber === -1 ? tableDescription?.length : props.beforeColumnNumber,
      beforeColumnTableDescription: tableDescription.slice(0, signalColumNumber),
      afterColumnTableDescription: tableDescription.slice(signalColumNumber),
      feasibilityValue: props.isMounted,
      // Store the expand switch
      expandDataSize: 0,
      // Pagination information
      page: {
        page: 1,
        size: 10,
        field: '',
        order: 0,
        searchField: '',
        content: '',
        type: 1,
        symbol: 1
      } as Page,
      fileDownloadUrls: [] as any
    });

    /**
     * Field information for backend pagination search
     */
    const updateField = () => {
      if (props.isServicePaging && props.tableDescription) {
        ArrayUtil.clear(data.fieldData);
        props.tableDescription.forEach((item: any) => {
          if (props.removeSelectContent.indexOf(item.title) < 0) {
            data.fieldData.push({
              label: item.title,
              value: `${item.database}##${item.type}`
            });
          }
        });
      }
    };

    /**
     * Set pagination information and the data displayed on the current page
     * @param tableData All data to be displayed with pagination
     * @param isReset Whether to reset the local data. This variable is used for deep copy, mainly due to the default sorting information.
     */
    function setPagingData(tableData: { [key: string]: any }, isReset = true) {
      // Update data
      if (isReset) {
        data.pagingChangeData = tableData as Array<{}>;
      }
      // Ensure paging is available
      if (!paging.value) {
        return [];
      }
      // If the data is empty, return directly and reset the data length to 0
      if (Base.isNull(tableData)) {
        paging.value.total = 0;
        return [];
      }
      // Reset the length
      paging.value.total = tableData?.length;
      // Get the start and end range of the displayed data
      const start = (paging.value.currentPage - 1) * paging.value.pageSize;
      const end = start + paging.value.pageSize > paging.value.total ? paging.value.total : start + paging.value.pageSize;
      const setData = [];
      // Add data
      for (let i = start; i < end; i++) {
        setData.push(tableData[i]);
      }
      return setData;
    }

    const setPageValue = () => {
      data.page.page = paging.value.currentPage;
      data.page.size = paging.value.pageSize;
      data.page.searchField = String(select.value.select.split('##')[0]);
      data.page.content = data.serviceSearch;
      data.page.type = Number(Base.isNull(select.value.select.split('##')[1]) ? 1 : select.value.select.split('##')[1]);
      data.page.symbol = symbolLabel.value.select;
    };

    /**
     * Update data
     * @param isReset Whether to make a new data request
     * @param newData Information of the data if a new request is made
     */
    const dataUpdate = (isReset = false, newData?: { [key: string]: any }) => {
      // Check if it is backend pagination
      if (props.isServicePaging && paging.value) {
        // Update the selected field information
        updateField();
        // Assign values
        setPageValue();
        // Show loading animation
        if (props.isLoading) {
          loading.value.loading = true;
        }
        Time.awaitPromise(true, 500, 150000, () => data.feasibilityValue).then(() => {
          props.callbackFunctionBefore();
          // Execute the data query function first
          props.updateNewData(data.page).then((res: PageResult<Array<any>>) => {
            // Hide loading animation
            if (props.isLoading) {
              loading.value.loading = false;
            }
            // Reset the data
            paging.value.total = res.total;
            data.showData = res.data as { [key: string]: any };
          }).then(() => {
            props.callbackFunction(data.showData);
          });
        });
      } else {
        // Refresh all data
        if (isReset && newData) {
          data.pageTableData = newData;
        }
        // Regardless of the value of isReset, if newData exists, assign the data to data.pagingChangeData
        // In business logic:
        // 1. isReset === true means the global data has changed, so the local data must be updated. Temporarily assign the global data to the local data.
        // 2. isReset === false means the global data has not changed, only the page number has been changed to refresh the local data.
        if (newData) {
          data.pagingChangeData = newData as Array<{}>;
        }
        // Determine the source of the processed data
        const tableData = Base.noNull(data.search) ? data.pagingChangeData : data.pageTableData;
        const setData = setPagingData(tableData);
        if (Base.isNull(setData)) {
          // To ensure that when the table column name structure changes, no rows are displayed when the data is empty
          data.showData = [];
          return [];
        }
        data.showData = setData;
      }
    };

    // Sorting
    const changeTableSort = (column: any) => {
      // Check if pagination is enabled
      if (!props.isPaging) {
        return;
      }
      // If the current total is less than or equal to the number of items per page, return directly
      if (paging.value.total <= paging.value.pageSize) {
        return;
      }
      // column.order: ascending: ascending order, descending: descending order
      data.direction = column.order === 'ascending' ? 1 : column.order === 'descending' ? -1 : 0;
      data.column = column;
      // Check if it is backend pagination
      if (props.isServicePaging) {
        // Get the class name in the database
        const columnInfo: TableHead = props.tableDescription?.filter((item: any) => item.column === column.prop)[0] as TableHead;
        // Get pagination sorting information
        setPageValue();
        data.page.field = data.direction === 0 ? '' : String(columnInfo.database);
        data.page.order = data.direction;
        // Show loading animation
        if (props.isLoading) {
          loading.value.loading = true;
        }
        Time.awaitPromise(true, 500, 150000, () => data.feasibilityValue).then(() => {
          props.callbackFunctionBefore();
          // Execute the data query function first
          props.updateNewData(data.page).then((res: PageResult<Array<any>>) => {
            // Hide loading animation
            if (props.isLoading) {
              loading.value.loading = false;
            }
            // Reset the data
            paging.value.total = res.total;
            data.showData = res.data as { [key: string]: any };
          }).then(() => {
            props.callbackFunction(data.showData);
          });
        });
      } else {
        // Get the data to be sorted
        const localData = Base.noNull(data.search) ? data.pagingChangeData : data.pageTableData;
        // Perform a shallow copy to ensure that the props.tableData data never changes, preventing issues when returning to normal data (i.e., when direction === 0)
        const tableData = ArrayUtil.deepCopy(localData);
        // Do not perform sorting
        if (data.direction === 0) {
          data.showData = setPagingData(localData);
        }
        // Perform sorting
        ArrayUtil.sort(tableData, column.prop, data.direction);
        // Update table data
        data.showData = setPagingData(tableData, false);
      }
      props.sortChange();
    };

    // Backend pagination search click event
    const searchClick = () => {
      if (Base.isNull(select.value.select)) {
        ElNotification({ title: 'Search', message: 'Please select the column to search for!', type: 'error' });
        return;
      }
      if (Base.isNull(data.serviceSearch)) {
        ElNotification({ title: 'Search', message: 'Please enter search content!', type: 'error' });
        return;
      }
      // Whether it is requested data
      dataUpdate(false);
    };

    // Backend pagination search click event
    const RefreshClick = () => {
      data.serviceSearch = '';
      dataUpdate(false);
    };

    // Backend pagination search click event
    const handleSelectionChange = (val: Array<any>) => {
      if (props.isSelectChange) {
        props.selectionChange(val, data.showData);
      }
    };

    onMounted(() => {
      // Check if loading should start
      if (data.feasibilityValue) {
        // Check the pagination type and if all data is queried at once
        if (!props.isPaging) {
          data.showData = data.pageTableData;
        } else {
          // Whether it is requested data
          dataUpdate(false);
        }
      }
    });

    const changePage = () => {
      dataUpdate();
      if (props.pageEvent) {
        props.pageEvent();
      }
      if (data.column) {
        changeTableSort(data.column);
      }
    };

    // Change page size
    const changeSize = () => {
      dataUpdate();
      if (props.sizeEvent) {
        props.sizeEvent();
      }
      if (data.column) {
        changeTableSort(data.column);
      }
    };

    // Watch
    watch(() => props.tableData, (newValue) => {
      // Here we need to check if it is backend pagination, as backend pagination does not need to monitor props.tableData
      if (!props.isPaging) {
        data.pageTableData = newValue;
        data.showData = newValue;
      } else if (props.isPaging && !props.isServicePaging) {
        // Update table data
        dataUpdate(true, newValue);
      }
    }, {
      immediate: true,
      deep: true
    });

    // Watch
    watch(() => props.tableDescription, (newValue) => {
      // Update table column names
      const tableDescription = newValue.filter((item: any) => Base.noNull(item.column));
      data.signalColumNumber = props.beforeColumnNumber === -1 ? tableDescription?.length : props.beforeColumnNumber;
      data.beforeColumnTableDescription = tableDescription.slice(0, data.signalColumNumber);
      data.afterColumnTableDescription = tableDescription.slice(data.signalColumNumber);
      updateField();
    }, {
      immediate: true,
      deep: true
    });

    // Watch
    watch(() => props.isMounted, (newValue) => {
      // Update table column names
      data.feasibilityValue = newValue;
      if (props.isServicePaging) {
        // Update table data
        dataUpdate(false);
      }
    }, {
      immediate: true,
      deep: true
    });

    // Watch with a 1-second delay (When monitoring reactive variables, you can directly monitor the object and must use an inline function)
    watch(() => data.search, Time.debounce((value: string) => {
      // Check if the search content is empty
      if (Base.noNull(value)) {
        // Check if it is backend pagination
        // eslint-disable-next-line no-empty
        if (props.isServicePaging) {

        } else if (!props.isServicePaging) {
          // Perform a shallow copy
          const tableData = ArrayUtil.deepCopy(data.pageTableData) as Array<{}>;
          const newData: { [key: string]: any; } | undefined = [];
          // Check if it is not empty
          if (Base.noNull(tableData)) {
            // Get the column information of the object
            const keys = Json.getKeys(tableData[0]);
            // Loop through the data
            tableData.forEach((item: any) => {
              // Loop through the columns of the data
              for (let i = 0; i < keys.length; i++) {
                // Get the value
                const string = String(item[keys[i]]);
                // Check if it contains the search information
                if (string.search(value) !== -1) {
                  newData.push(item);
                  break;
                }
              }
            });
          }
          // Get the data
          data.showData = setPagingData(newData);
        }
      } else {
        // Check if it is backend pagination
        // eslint-disable-next-line no-lonely-if
        if (!props.isPaging) {
          data.showData = data.pageTableData;
        } else if (!props.isServicePaging) {
          // Get the data
          data.showData = setPagingData(data.pageTableData);
        }
      }
    }, 500), {
      immediate: true,
      deep: true
    });

    // 监控
    watch(() => props.downloadUrls, (newValue) => {
      data.fileDownloadUrls = newValue;
    }, {
      immediate: true,
      deep: true
    });

    const startLoading = () => {
      loading.value.loading = true;
    };

    const endLoading = () => {
      loading.value.loading = false;
    };

    const load = (row: any, treeNode: any, resolve: (date: any[]) => void) => {
      resolve(props.childrenLoad(row, treeNode));
    };

    const expandChange = (row: any, expandedRows: any) => {
      // true 是展开
      const { length } = expandedRows;
      if (length > data.expandDataSize) {
        props.expandOpen(row);
      } else {
        props.expandClose(row);
      }
      props.expandEvent(row, expandedRows);
      data.expandDataSize = length;
    };

    const fieldChange = (value: string) => {
      const typeValue = Number(value.split('##')[1]);
      if (typeValue === 1) {
        data.symbolData = TABLE_STRING_SYMBOL_SELECT;
      } else if (typeValue === 2) {
        data.symbolData = TABLE_NUMBER_SYMBOL_SELECT;
      }
      symbolLabel.value.select = TABLE_NUMBER_SYMBOL_SELECT[0].value;
    };

    const selectionToggleChange = (rows?: any[]) => {
      if (baseTable.value) {
        if (rows) {
          rows.forEach((row) => {
            // noinspection TypeScriptValidateJSTypes
            baseTable.value.toggleRowSelection(row, undefined);
          });
        } else {
          baseTable.value.clearSelection();
        }
      }
    };

    const dataDownload = () => props.downloadUrls;

    return {
      ...toRefs(data),
      loading,
      select,
      paging,
      baseTable,
      symbolLabel,
      searchClick,
      RefreshClick,
      dataUpdate,
      changeTableSort,
      expandChange,
      fieldChange,
      dataDownload,
      handleSelectionChange,
      selectionToggleChange,
      changePage,
      changeSize,
      startLoading,
      endLoading,
      load
    };
  }
});
</script>
