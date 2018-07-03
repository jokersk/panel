<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" 
            style="width: 200px;" class="filter-item" 
              placeholder="undone order number" v-model="listQuery.orderNumber">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" 
            style="width: 200px;" class="filter-item" 
              placeholder="Client Email" v-model="listQuery.billing_email">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" 
            style="width: 200px;" class="filter-item" 
              placeholder="telephone" v-model="listQuery.billing_telephone">
      </el-input>
      
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" 
          element-loading-text="loading..." border fit highlight-current-row
      style="width: 100%">
     
      <el-table-column width="180px" align="center" label="DATE">
        <template slot-scope="scope">
          <span>{{scope.row.create_at | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="STATUS" width="200" min-width="110px" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.OrderStatus}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column  label="UNDONE ORDER #" width="170">
        <template slot-scope="scope">
          <span>{{scope.row.order_ref_id}}</span>
        </template>
      </el-table-column>
       <el-table-column width="190" label="CITYCHAIN ORDER #">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input class="edit-input" size="small" v-model="scope.row.citychain_id"></el-input>
            <el-button class='cancel-btn' size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)">cancel</el-button>
          </template>
          <span v-else>{{ scope.row.citychain_id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="DELIVERED (UNDONE)" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.citychain">{{scope.row.citychain.delivery_at}}</span>
        </template> 
      </el-table-column>


      <el-table-column align="center" label="RECEIVED (CITYCHAIN)" width="200">
        <template slot-scope="scope" v-if="scope.row.ship_to_pos">
          <el-switch v-if="scope.row.showReceivedButton" v-model="scope.row.hasReceived" @change="updateReceived(scope.row)" ></el-switch>
          <span v-if="scope.row.citychain && scope.row.citychain.received_at">{{scope.row.citychain.received_at}}</span>
        </template> 
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
        </template>
      </el-table-column>
      
      
    </el-table>



    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-row>
        <el-col :span="6">
            ID: 
        </el-col>
        <el-col :span="6">
          {{openingOrder.id}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
            Order_ref_id: 
        </el-col>
        <el-col :span="6">
          {{openingOrder.order_ref_id}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
            Email: 
        </el-col>
        <el-col :span="6">
          {{openingOrder.billing_email}}
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="6">
            telephone: 
        </el-col>
        <el-col :span="6">
          {{openingOrder.billing_telephone}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
            Address: 
        </el-col>
        <el-col :span="6">
          {{openingOrder.shipping_address}} <br>
          {{openingOrder.shipping_address2}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
            CITYCHAIN ORDER ID: 
        </el-col>
        <el-col :span="6">
          <el-input class="edit-input" size="small" v-model="openingOrder.citychain_id"></el-input>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="updateData(openingOrder)">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"> </el-table-column>
        <el-table-column prop="pv" label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import { fetchList, updateOrder } from '@/api/orders'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import * as _ from 'lodash'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      openingOrder: ''
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.orders.map(v => {
          this.$set(v, 'edit', false)
          v.showReceivedButton = false
          if (v.citychain && v.citychain.received_at) v.hasReceived = true
          else {
            v.hasReceived = false
            v.showReceivedButton = true
          }
          v.originalCityId = v.citychain ? v.citychain.citychain_order_id : v.citychain_id
          return v
        })
        if (!!this.listQuery.orderNumber) {
          this.list = this.list.filter(list => {
            return _.includes(list.order_ref_id, this.listQuery.orderNumber)
          })
        }
        if (!!this.listQuery.billing_email) {
          this.list = this.list.filter(list => {
            return this.listQuery.billing_email === list.billing_email
          })
        }
        if (!!this.listQuery.billing_telephone) {
          this.list = this.list.filter(list => {
            return this.listQuery.billing_telephone === list.billing_telephone
          })
        }
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.openingOrder = row
    },
    updateData(row) {
      updateOrder({ 'undone_id': row.id, 'citychain_order_id': row.citychain_id }).then(response => {
        row.citychain = response.data
        this.dialogFormVisible = false
        this.$message({
          message: 'CityChain Order Id has been edited',
          type: 'success'
        })
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    updateReceived(row) {
      console.log(row)
      if (!row.citychain_id) {
        this.$message({
          message: 'Please Input CityChain Order Id',
          type: 'warning'
        })
        row.hasReceived = false
        return false
      }

      if (row.hasReceived) {
        this.$confirm('確定收貨後，系統將會發送電子郵件通知客人到店拿取貨品。要確定收貨及發送電子郵件嗎？')
          .then(_ => {
            this.listLoading = true
            updateOrder({ 'undone_id': row.id, 'updateReceived': 1 }).then(response => {
              this.listLoading = false
              if (response.data) {
                row.citychain.received_at = response.data.received_at
                row.showReceivedButton = false
              }
              this.$message({
                message: 'Update Success',
                type: 'success'
              })
            })
          })
          .catch(_ => {
            row.hasReceived = false
          })
      }
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
