<template>
  <BaseLoading class="base_table_template" ref="loading">
    <!-- 搜索信息 -->
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
      <div class="download" v-show="fileDownloadUrl !== '' && fileDownloadUrl !== undefined">
        <el-link :href="fileDownloadUrl">
          <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
        </el-link>
      </div>
    </div>
    <!-- table 数据显示 -->
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
    <!-- 分页数据显示 -->
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
 * tableDescription 必须传递的参数
 * isRearPaging = false 时候, 必须传递 tableData 参数内容
 * isRearPaging = true 时候, 必须传递 updateNewData 函数内容
 * tableSort 排序函数, 需要进行传递, 不然排序就会在页面显示生效, 全局无效
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
    // 传递的数据
    tableData: {
      type: Array,
      default: () => ([])
    },
    // 列名和数据中列名信息
    tableDescription: {
      type: Array,
      default: () => ([] as Array<TableHead>)
    },
    // 是否显示分页
    isPaging: {
      type: Boolean,
      default: () => true
    },
    // 是否显示搜索
    isSearch: {
      type: Boolean,
      default: () => true
    },
    // 是否为后端分页
    isServicePaging: {
      type: Boolean,
      default: () => true
    },
    // 是否为后端分页
    searchTitle: {
      type: String,
      default: () => 'Search: '
    },
    // 后端分页选中字段的总宽度
    fieldWidth: {
      type: Number,
      default: () => 30
    },
    // 后端分页选中字段的框的宽度
    width: {
      type: Number,
      default: () => 70
    },
    // 后端分页选中输入内容框的宽度
    contentWidth: {
      type: Number,
      default: () => 25
    },
    // 后端分页选中输入内容框的宽度
    serviceSearchWidth: {
      type: Number,
      default: () => 70
    },
    // 后端分页选中按钮的 padding
    buttonSize: {
      type: Array,
      default: () => [70, 32]
    },
    // 更新数据
    updateNewData: {
      type: Function,
      default: () => ({})
    },
    // 最大页码按钮数
    pagerCount: {
      type: Number,
      default: () => 7
    },
    // 是否开启加载动画
    isLoading: {
      type: Boolean,
      default: () => true
    },
    // 是否懒加载子节点数据
    lazy: {
      type: Boolean,
      default: () => true
    },
    // 子节点加载数据的函数
    childrenLoad: {
      type: Function,
      default: () => ({})
    },
    // 是否带有外延信息
    isExpand: {
      type: Boolean,
      default: () => false
    },
    // 外延点击的时候
    expandEvent: {
      type: Function,
      default: () => ({})
    },
    // 外延点击的时候 (展开)
    expandOpen: {
      type: Function,
      default: () => ({})
    },
    // 外延点击的时候 (关闭)
    expandClose: {
      type: Function,
      default: () => ({})
    },
    // 筛选事件
    selectionChange: {
      type: Function,
      default: () => ({})
    },
    // 顺序事件
    sortChange: {
      type: Function,
      default: () => ({})
    },
    // 页数改变
    pageEvent: {
      type: Function,
      default: () => ({})
    },
    // 页数改变
    sizeEvent: {
      type: Function,
      default: () => ({})
    },
    // 后端分页的回调函数
    callbackFunctionBefore: {
      type: Function,
      default: () => ({})
    },
    // 后端分页的回调函数
    callbackFunction: {
      type: Function,
      default: () => ({})
    },
    // 分页是否为简单形式
    isSimple: {
      type: Boolean,
      default: () => false
    },
    // 表格是否添加一列筛选
    isSelection: {
      type: Boolean,
      default: () => false
    },
    // 下拉页数列表
    pageSizes: {
      type: Array,
      default: () => [10, 25, 45, 50, 75, 100]
    },
    // 下拉页数列表
    removeSelectContent: {
      type: Array,
      default: () => []
    },
    // 监控的可行性值
    continueValue: {
      type: Boolean,
      default: () => true
    },
    // 是否开始进行加载
    isMounted: {
      type: Boolean,
      default: () => true
    },
    // 是否开始进行加载
    isSelectChange: {
      type: Boolean,
      default: () => true
    },
    beforeColumnNumber: {
      type: Number,
      default: () => -1
    },
    // 显示的样式
    layout: {
      type: String,
      default: () => 'total, sizes, prev, pager, next, jumper'
    },
    // 下载表格的 URL 信息
    downloadUrl: {
      type: String,
      default: () => ''
    }
  },
  setup(props) {
    // 加载动画标签
    const loading = ref();
    // 获取搜索标签
    const select = ref();
    // 获取分页标签
    const paging = ref();
    const baseTable = ref();
    const symbolLabel = ref();
    // 获取数据信息
    const tableDescription = props.tableDescription.filter((item: any) => Base.noNull(item.column));
    const signalColumNumber = props.beforeColumnNumber === -1 ? tableDescription?.length : props.beforeColumnNumber;
    // 设置响应数据
    const data = reactive({
      // 搜索的内容
      search: '' as string,
      serviceSearch: '' as string,
      // 下拉的字段信息
      fieldData: [] as Array<InputSelect>,
      symbolData: [] as Array<InputSelect>,
      // 页面传入的数据 (搜索后的内容整体信息, 称之为局部数据)
      pagingChangeData: [] as Array<{}>,
      // 前端用户直接可以看到的数据 (展示数据)
      showData: [] as { [key: string]: any },
      direction: 0,
      column: Object,
      /**
       * 页面整体数据信息 (全部数据, 仅限制于非后端分页, 意味着前端拿到了所有数据方有值)
       * [与 pagingChangeData 数据的区别在于, 当搜索内容的时候 (当 search 改变的时候) pageTableData 不会变, 而 pagingChangeData 是搜索后的内容整体信息]
       * 其中当为后端分页的时候只有 showData 有值, 其余的 (pagingChangeData, pageTableData, tableData) 没有值
       */
      pageTableData: props.tableData as { [key: string]: any },
      // 表格标题信息
      signalColumNumber: props.beforeColumnNumber === -1 ? tableDescription?.length : props.beforeColumnNumber,
      beforeColumnTableDescription: tableDescription.slice(0, signalColumNumber),
      afterColumnTableDescription: tableDescription.slice(signalColumNumber),
      feasibilityValue: props.isMounted,
      // 存储扩展开关的
      expandDataSize: 0,
      // 分页情况
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
      fileDownloadUrl: '' as string
    });

    /**
     * 后台分页搜索信息的字段情况
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
     * 设置分页信息和当页显示数据
     * @param tableData 加上分页全部显示的数据
     * @param isReset 是否需要重新设置局部数据 此变量用于深拷贝含义, 主要由于排序默认信息而设
     */
    function setPagingData(tableData: { [key: string]: any }, isReset = true) {
      // 更新数据
      if (isReset) {
        data.pagingChangeData = tableData as Array<{}>;
      }
      // 保证 paging 可行
      if (!paging.value) {
        return [];
      }
      // 数据为空直接返回且数据长度重新设置为 0
      if (Base.isNull(tableData)) {
        paging.value.total = 0;
        return [];
      }
      // 重新设定长度
      paging.value.total = tableData?.length;
      // 获取展示数据的开始和结束的范围
      const start = (paging.value.currentPage - 1) * paging.value.pageSize;
      const end = start + paging.value.pageSize > paging.value.total ? paging.value.total : start + paging.value.pageSize;
      const setData = [];
      // 添加数据
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
     * 更新数据
     * @param isReset 是否进行重新请求数据
     * @param newData 若重新请求, 则该数据的信息
     */
    const dataUpdate = (isReset = false, newData?: { [key: string]: any }) => {
      // 判断是否为后端分页
      if (props.isServicePaging && paging.value) {
        // 更新选择的字段信息
        updateField();
        // 赋值
        setPageValue();
        // 加载动画
        if (props.isLoading) {
          loading.value.loading = true;
        }
        Time.awaitPromise(true, 500, 150000, () => data.feasibilityValue).then(() => {
          props.callbackFunctionBefore();
          // 先执行查询数据函数
          props.updateNewData(data.page).then((res: PageResult<Array<any>>) => {
            // 加载动画
            if (props.isLoading) {
              loading.value.loading = false;
            }
            // 重新设定数据
            paging.value.total = res.total;
            data.showData = res.data as { [key: string]: any };
          }).then(() => {
            props.callbackFunction(data.showData);
          });
        });
      } else {
        // 刷新全部数据
        if (isReset && newData) {
          data.pageTableData = newData;
        }
        // 无论 isReset 是否为 ture, 只要 newData 存在, 就将 data.pagingChangeData 数据进行赋值
        // 业务逻辑中代表:
        // 1. isReset === true 代表这全局数据变化, 则局部数据必须更新, 暂且将全局数据赋值给局部数据
        // 2. isReset === false 全局数据没有变化, 只是更改了页数刷新了局部数据
        if (newData) {
          data.pagingChangeData = newData as Array<{}>;
        }
        // 判断处理的数据来源
        const tableData = Base.noNull(data.search) ? data.pagingChangeData : data.pageTableData;
        const setData = setPagingData(tableData);
        if (Base.isNull(setData)) {
          // 此处为了保证改变换来表列名结构后, 数据为空却出现有行现象
          data.showData = [];
          return [];
        }
        data.showData = setData;
      }
    };
    // 排序
    const changeTableSort = (column: any) => {
      // 判断是否进行了分页
      if (!props.isPaging) {
        return;
      }
      // 当前的总数 <= 每页的显示数量大小, 直接返回
      if (paging.value.total <= paging.value.pageSize) {
        return;
      }
      // column.order: ascending: 升序, descending: 降序
      data.direction = column.order === 'ascending' ? 1 : column.order === 'descending' ? -1 : 0;
      data.column = column;
      // 判断是否为后端分页
      if (props.isServicePaging) {
        // 获取数据库中的类名
        const columnInfo: TableHead = props.tableDescription?.filter((item: any) => item.column === column.prop)[0] as TableHead;
        // 获取分页排序信息
        setPageValue();
        data.page.field = data.direction === 0 ? '' : String(columnInfo.database);
        data.page.order = data.direction;
        // 加载动画
        if (props.isLoading) {
          loading.value.loading = true;
        }
        Time.awaitPromise(data.feasibilityValue).then(() => {
          props.callbackFunctionBefore();
          // 先执行查询数据函数
          props.updateNewData(data.page).then((res: PageResult<Array<any>>) => {
            // 加载动画
            if (props.isLoading) {
              loading.value.loading = false;
            }
            // 重新设定数据
            paging.value.total = res.total;
            data.showData = res.data as { [key: string]: any };
          }).then(() => {
            props.callbackFunction(data.showData);
          });
        });
      } else {
        // 获取需要排序的数据
        const localData = Base.noNull(data.search) ? data.pagingChangeData : data.pageTableData;
        // 进行浅拷贝, 保证 props.tableData 数据永远不会变化, 防止回归正常数据出问题 (也就是 direction === 0 时)
        const tableData = ArrayUtil.deepCopy(localData);
        // 不进行排序
        if (data.direction === 0) {
          data.showData = setPagingData(localData);
        }
        // 进行排序
        ArrayUtil.sort(tableData, column.prop, data.direction);
        // 更新 table 数据
        data.showData = setPagingData(tableData, false);
      }
      props.sortChange();
    };

    // 后台分页搜索点击事件
    const searchClick = () => {
      if (Base.isNull(select.value.select)) {
        ElNotification({ title: 'Search', message: 'Please select the column to search for!', type: 'error' });
        return;
      }
      if (Base.isNull(data.serviceSearch)) {
        ElNotification({ title: 'Search', message: 'Please enter search content!', type: 'error' });
        return;
      }
      // 是否为请求的数据
      dataUpdate(false);
    };

    // 后台分页搜索点击事件
    const RefreshClick = () => {
      data.serviceSearch = '';
      dataUpdate(false);
    };

    // 后台分页搜索点击事件
    const handleSelectionChange = (val: Array<any>) => {
      if (props.isSelectChange) {
        props.selectionChange(val, data.showData);
      }
    };

    onMounted(() => {
      // 是否开始进行加载
      if (data.feasibilityValue) {
        // 判断是否分页类型和判断是否为一次性查询所有数据
        if (!props.isPaging) {
          data.showData = data.pageTableData;
        } else {
          // 是否为请求的数据
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

    // 改变大小
    const changeSize = () => {
      dataUpdate();
      if (props.sizeEvent) {
        props.sizeEvent();
      }
      if (data.column) {
        changeTableSort(data.column);
      }
    };

    // 监控
    watch(() => props.tableData, (newValue) => {
      // 这里需要判断是否为后台分页, 由于后台分页不需要监督 props.tableData
      if (!props.isPaging) {
        data.pageTableData = newValue;
        data.showData = newValue;
      } else if (props.isPaging && !props.isServicePaging) {
        // 更新 table 数据
        dataUpdate(true, newValue);
      }
    }, {
      immediate: true,
      deep: true
    });

    // 监控
    watch(() => props.tableDescription, (newValue) => {
      // 更新表列名
      const tableDescription = newValue.filter((item: any) => Base.noNull(item.column));
      data.signalColumNumber = props.beforeColumnNumber === -1 ? tableDescription?.length : props.beforeColumnNumber;
      data.beforeColumnTableDescription = tableDescription.slice(0, data.signalColumNumber);
      data.afterColumnTableDescription = tableDescription.slice(data.signalColumNumber);
    }, {
      immediate: true,
      deep: true
    });

    // 监控
    watch(() => props.isMounted, (newValue) => {
      // 更新表列名
      data.feasibilityValue = newValue;
      if (props.isServicePaging) {
        // 更新 table 数据
        dataUpdate(false);
      }
    }, {
      immediate: true,
      deep: true
    });

    // watch 监听, 延迟 1 秒 (监听 reactive 创建的响应式变量, 可以直接监听对象, 必须使用内联函数)
    watch(() => data.search, Time.debounce((value: string) => {
      // 判断搜索内容是否为空
      if (Base.noNull(value)) {
        // 判断是否为后端分页
        // eslint-disable-next-line no-empty
        if (props.isServicePaging) {

        } else if (!props.isServicePaging) {
          // 进行浅拷贝
          const tableData = ArrayUtil.deepCopy(data.pageTableData) as Array<{}>;
          const newData: { [key: string]: any; } | undefined = [];
          // 判断不为空
          if (Base.noNull(tableData)) {
            // 获取对象的列信息
            const keys = Json.getKeys(tableData[0]);
            // 循环数据
            tableData.forEach((item: any) => {
              // 循环数据的列
              for (let i = 0; i < keys.length; i++) {
                // 获取值
                const string = String(item[keys[i]]);
                // 判断是否含有搜索的信息
                if (string.search(value) !== -1) {
                  newData.push(item);
                  break;
                }
              }
            });
          }
          // 获取数据
          data.showData = setPagingData(newData);
        }
      } else {
        // 判断是否为后端分页
        // eslint-disable-next-line no-lonely-if
        if (!props.isPaging) {
          data.showData = data.pageTableData;
        } else if (!props.isServicePaging) {
          // 获取数据
          data.showData = setPagingData(data.pageTableData);
        }
      }
    }, 500), {
      immediate: true,
      deep: true
    });

    // 监控
    watch(() => props.downloadUrl, (newValue) => {
      data.fileDownloadUrl = newValue;
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

    const dataDownload = () => props.downloadUrl;

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
