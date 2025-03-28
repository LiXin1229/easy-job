<script setup lang="ts">
import { getAllData, getAppWeekData, getContentWeekData } from '@/api/home'
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

// 上部分数据
const allDataList = ref<any>([])

const loadAllData = async () => {
  // const res = await getAllData()
  allDataList.value = [
    {
    "statisticsName": "App下载", 
    "count": 99, 
    "preCount": 80, 
    "listData": null 
    },
    {
    "statisticsName": "注册用户", 
    "count": 25, 
    "preCount": 18, 
    "listData": null 
    },
    {
    "statisticsName": "八股文", 
    "count": 201, 
    "preCount": 2, 
    "listData": null 
    },
    {
    "statisticsName": "考题", 
    "count": 77, 
    "preCount": 1, 
    "listData": null 
    },
    {
    "statisticsName": "分享", 
    "count": 3, 
    "preCount": 0, 
    "listData": null 
    },
    {
    "statisticsName": "反馈", 
    "count": 7, 
    "preCount": 2, 
    "listData": null 
    }
  ] 
}

// 图表
const theme = 'chalk'

const download = ref<HTMLDivElement>()
const DownlodaChart = ref<any>()
const initDownlodaChart = () => {
  DownlodaChart.value = echarts.init(download.value, theme)
  const initOption = {
    title: {
      text: 'APP下载注册统计'
    },
    tooltip: {}
  }
  DownlodaChart.value.setOption(initOption)
}

const content = ref<HTMLDivElement>()
const ContentChart = ref<any>()
const initContentChart = () => {
  ContentChart.value = echarts.init(content.value, theme)
  const initOption = {
    title: {
      text: 'APP'
    },
    tooltip: {}
  }
  ContentChart.value.setOption(initOption)
}

// 图表数据
const downloadData = ref<any>()
const getDownloadData = async() => {
  // const res = await getAppWeekData()
  downloadData.value = {
    "dateList": [
    "2023-08-20",
    "2023-08-21",
    "2023-08-22",
    "2023-08-23",
    "2023-08-24",
    "2023-08-25",
    "2023-08-26",
    "2023-08-27"
    ], 
    "itemDataList": [
    {
    "statisticsName": "App下载", 
    "count": null, 
    "preCount": null, 
    "listData": [
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    80
    ] 
    },
    {
    "statisticsName": "注册用户", 
    "count": null, 
    "preCount": null, 
    "listData": [
    25,
    19,
    19,
    18,
    18,
    18,
    18,
    18
    ] 
    }
    ] 
  }
  if (true) {
    updateDownlodaChart()
  }
}

const updateDownlodaChart = () => {
  // console.log(downloadData.value)
  const xData = downloadData.value.dateList
  const legendList: any = []
  const seriesData: any = []
  downloadData.value.itemDataList.forEach((ele: any) => {
    seriesData.push({
      name: ele.statisticsName,
      data: ele.listData,
      type: 'bar'
    })
    legendList.push(ele.statisticsName)
  })
  const updateOption = {
    legend: {
      data: legendList
    },
    xAxis: {
      data: xData,
      axisLabel: {
        rotate: 45 
      }
    },
    yAxis: {},
    series: seriesData
  }
  DownlodaChart.value.setOption(updateOption)
}

const contentData = ref<any>()
const getContentData = async() => {
  // const res = await getContentWeekData()
  contentData.value = {
    "dateList": [
    "2023-08-20",
    "2023-08-21",
    "2023-08-22",
    "2023-08-23",
    "2023-08-24",
    "2023-08-25",
    "2023-08-26",
    "2023-08-27"
    ], 
    "itemDataList": [
    {
    "statisticsName": "八股文", 
    "count": null, 
    "preCount": null, 
    "listData": [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    2
    ] 
    },
    {
    "statisticsName": "考题", 
    "count": null, 
    "preCount": null, 
    "listData": [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1
    ] 
    },
    {
    "statisticsName": "分享", 
    "count": null, 
    "preCount": null, 
    "listData": [
    3,
    0,
    0,
    0,
    0,
    0,
    0,
    0
    ] 
    },
    {
    "statisticsName": "反馈", 
    "count": null, 
    "preCount": null, 
    "listData": [
    5,
    0,
    0,
    0,
    0,
    0,
    0,
    2
    ] 
    }
    ]
  }
  if (true) {
    updateContentData()
  }
}

const updateContentData = () => {
  // console.log(contentData.value)
  const xData = contentData.value.dateList
  const legendList: any = []
  const seriesData: any = []
  contentData.value.itemDataList.forEach((ele: any) => {
    seriesData.push({
      name: ele.statisticsName,
      data: ele.listData,
      type: 'bar'
    })
    legendList.push(ele.statisticsName)
  })
  const updateOption = {
    legend: {
      data: legendList
    },
    xAxis: {
      data: xData,
      axisLabel: {
        rotate: 45 
      }
    },
    yAxis: {},
    series: seriesData
  }
  ContentChart.value.setOption(updateOption)
}

onMounted(() => {
  loadAllData()
  initDownlodaChart()
  initContentChart()

  getDownloadData()
  getContentData()
})
</script>

<template>
  <div class="part-panel">
    <el-card style="max-width: 1450px;" class="cart-body">
      <template #header>
        <div class="card-header">
          <span>数据概括</span>
        </div>
      </template>
      <div class="data-list">
        <el-row :gutter="10">
          <el-col
            :span="4"
            v-for="i in allDataList"
            :key="i.statisticsName"
          >
            <div class="data-item">
              <div class="title">
                {{ i.statisticsName }}
              </div>
              <div class="data-panel">
                <div class="data">
                  {{ i.count }}
                </div>
                <div class="pre">
                  昨日新增： 
                  <span>
                    {{ i.preCount }}
                  </span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
  <div class="part-panel">
    <el-card style="max-width: 1450px;" class="cart-body">
      <template #header>
        <div class="card-header">
          <span>近日数据</span>
        </div>
      </template>
      <div class="chart-panel">
        <el-row :gutter="10">
          <el-col :span="12">
            <div ref="download" class="download"></div>
          </el-col>
          <el-col :span="12">
            <div ref="content" class="content"></div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.part-panel {
  :deep(.cart-body) {
    padding: 15px;
    margin-bottom: 10px;

    .el-card__header {
      padding: 0;
      margin-bottom: 10px;
      border: none;

      .card-header>span {
        font-size: 20px;
        font-weight: bold;
      }
    }

    .el-card__body {
      padding: 0;
    }

    .data-list {
      .data-item {
        background-color: var(--el-color-primary-light-9);
        border-radius: 8px;
        padding: 10px;

        .title {
          color: #606266;
          font-style: italic;
          margin-bottom: 8px;
        }

        .data-panel {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;

          .data {
            font-size: 20px;
            font-weight: bold;
          }

          .pre {
            font-size: 14px;
            margin-right: 5px;

            span {
              font-size: 18px;
              color: #F56C6C;
            }
          }
        }
      }
    }

    .chart-panel {
      .download {
        width: 100%;
        height: 400px;
      }
      
      .content {
        width: 100%;
        height: 400px;
      }
    }
  }
}
</style>
