<template>
  <div class="app-container">

    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <!-- <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column> -->

      <el-table-column width="180px" align="center" label="DATE">
        <template slot-scope="scope">
          <span>{{scope.row.create_at | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column width="120px" align="center" label="Author">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column width="100px" label="Importance">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" icon-class="star" class="meta-item__icon" :key="n"></svg-icon>
        </template>
      </el-table-column> -->

      <el-table-column class-name="status-col" label="STATUS" width="200" min-width="110px" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.OrderStatus}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column  label="UNDONE ORDER ID" width="170">
        <template slot-scope="scope">
          <span>{{scope.row.order_ref_id}}</span>
        </template>
      </el-table-column>


      <el-table-column width="190" label="CITYCHAIN ORDER ID">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input class="edit-input" size="small" v-model="scope.row.citychain_id"></el-input>
            <el-button class='cancel-btn' size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)">cancel</el-button>
          </template>
          <span v-else>{{ scope.row.citychain_id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="EMAIL" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.billing_email">{{scope.row.billing_email}}</span>
        </template> 
      </el-table-column>

       <el-table-column align="center" label="TELEPHONE" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.billing_telephone">{{scope.row.billing_telephone}}</span>
        </template> 
      </el-table-column>



      <el-table-column align="center" label="DELIVERY AT" width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.citychain">{{scope.row.citychain.delivery_at}}</span>
        </template> 
      </el-table-column>


      <el-table-column align="center" label="RECEIVED" width="160">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.showReceivedButton" v-model="scope.row.hasReceived" @change="updateReceived(scope.row)" ></el-switch>
          <span v-if="scope.row.citychain && scope.row.citychain.received_at">{{scope.row.citychain.received_at}}</span>
        </template> 
      </el-table-column>
      <el-table-column align="center" label="ACTIONS" width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.edit" type="success" @click="confirmEdit(scope.row)" size="small" icon="el-icon-circle-check-outline">Ok</el-button>
          <el-button v-else type="primary" @click='scope.row.edit=!scope.row.edit' size="small" icon="el-icon-edit">Edit</el-button>
          <!-- <el-button type="primary"  size="small" icon="el-icon-edit">RECEIVED</el-button> -->
          
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { fetchList, updatePos } from '@/api/pos'

export default {
  name: 'inlineEditTable',
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        3: 'success',
        4: 'info',
        5: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log(response.data)
        
        this.list = response.data.orders.map(v => {
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
          v.showReceivedButton = false
          
          if(v.citychain && v.citychain.received_at) v.hasReceived = true
          else {
            v.hasReceived = false
            v.showReceivedButton = true
          } 

          v.originalCityId = v.citychain_id //  will be used when user click the cancel botton

          return v
        })
        this.listLoading = false
      })
    },
    cancelEdit(row) {
      row.citychain_id = row.originalCityId
      row.edit = false
      this.$message({
        message: 'The CityChain Order Id has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalCityId = row.citychain_id
      if(!row.citychain_id) return false
      updatePos({
        "undone_id" : row.id,
        "citychain_order_id" : row.citychain_id
      }).then(response => {
          row.citychain = response.data
         this.$message({
          message: 'CityChain Order Id has been edited',
          type: 'success'
        })
      })
    },
    updateReceived(row) {
      if (row.hasReceived) {
        this.$confirm('Are you sure to set this?')
          .then(_ => {
            updatePos({
              "undone_id" : row.id,
              "updateReceived" : 1
            }).then(response => {
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
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
