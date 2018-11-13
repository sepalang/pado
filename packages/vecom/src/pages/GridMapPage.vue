<template>
  <AppLayout>
    <div>GridMapPage</div>
    <div>
      <table class="form-table" style="width:400px;">
        <colgroup>
          <col style="width:100px;">
          <col>
          <col style="width:50px;">
        </colgroup>
        <tbody>
          <tr>
            <th>root size</th>
            <td>
              <PadoSlider v-model="rectSize" input-cycle="enter" min-value="100" max-value="250" @input="drawRect"></PadoSlider>
            </td>
            <td>{{ rectSize }}</td>
          </tr>
          <tr>
            <th>col count</th>
            <td>
              <PadoSlider v-model="colCount" input-cycle="enter" min-value="1" max-value="20" @input="drawRect"></PadoSlider>
            </td>
            <td>{{ colCount }}</td>
          </tr>
          <tr>
            <th>row count</th>
            <td>
              <PadoSlider v-model="rowCount" input-cycle="enter" min-value="1" max-value="20"  @input="drawRect"></PadoSlider>
            </td>
            <td>{{ rowCount }}</td>
          </tr>
          <tr>
            <th>addEachCol</th>
            <td>
              <PadoSlider v-model="addEachCol" input-cycle="enter" min-value="1" max-value="20"  @input="drawRect"></PadoSlider>
            </td>
            <td>{{ addEachCol }}</td>
          </tr>
        </tbody>
      </table>
      <table class="cell-table">
        <tbody>
          <tr>
            <td>
              <Layer root :size="rectSize">
                <Layer root @click="selectRect(';ayer')">
                  <VERect 
                    v-for="item in piecesRects"
                    :key="item.meta.coords+''"
                    :left="item.rect.left"
                    :top="item.rect.top"
                    :width="item.rect.width"
                    :height="item.rect.height"
                    style="border:1px solid silver"
                    @click.native="selectRect(item)"
                  >
                  </VERect>
                </Layer>
              </Layer>
            </td>
            <td>
              <Layer root :size="rectSize">
                <Layer>
                  <VERect :size="rectSize">
                    <template slot-scope="scope">Root Size<br>{{scope.rect.width}}</template>
                  </VERect>
                </Layer>
                <Layer>
                  <VEPoint
                    v-for="point in piecesPoints"
                    :key="point.key"
                    :x="point.x"
                    :y="point.y"
                  ></VEPoint>
                </Layer>
              </Layer>
            </td>
          </tr>
          <tr>
            <td>
              <Layer root :size="rectSize">
                <VERect 
                  v-for="item in selectedRects"
                  :key="item.meta.coords+''"
                  :left="item.rect.left"
                  :top="item.rect.top"
                  :width="item.rect.width"
                  :height="item.rect.height"
                  style="border:1px solid silver"
                  @click.native="selectRect(item)"
                >
                </VERect>
              </Layer>
            </td>
            <td>
              <Layer root :size="rectSize">
                <VEPoint
                  v-for="item in selectedPoints"
                  :key="item.meta.coords+''"
                  :x="item.point.x"
                  :y="item.point.y"
                >
                </VEPoint>
              </Layer>
            </td>
          </tr>
          <tr>
            <td>
              <Layer root :size="rectSize">
                <VEPoint
                  v-for="item in selectedPoints"
                  :key="item.meta.coords+''"
                  :x="item.point.x"
                  :y="item.point.y"
                  placement="top"
                >
                  <div style="width:50px;height:20px;border:1px solid blue;">{{item.meta.coords}}</div>
                </VEPoint>
              </Layer>
            </td>
            <td>
              <Layer root :size="rectSize">
                <VEPoint
                  v-for="item in selectedPoints"
                  :key="item.meta.coords+''"
                  :x="item.point.x"
                  :y="item.point.y"
                  placement="top"
                  pointer="true"
                >
                  <div style="width:50px;height:20px;border:1px solid blue;">{{item.meta.coords}}</div>
                </VEPoint>
              </Layer>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <Layer root :size="rectSize*2">
                <VEPoint
                  v-for="item in relativePoints"
                  :key="item.meta.coords+''"
                  :rx="item.point.rx"
                  :ry="item.point.ry"
                  placement="top"
                  pointer="true"
                >
                  <div style="width:50px;height:20px;border:1px solid blue;">
                    asdf
                  </div>
                </VEPoint>
              </Layer>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AppLayout>
</template>
<script>
import AppLayout from '@/layouts/AppLayout.vue';
import Layer from '@/components/Layer.vue';
import PadoSlider from '@/components/PadoSlider.vue';
import VERect from '@/components/VERect.vue';
import VEPoint from '@/components/VEPoint.vue';
import { rect } from '@sepalang/pado/modules/stance';

export default {
  components: {
    AppLayout,
    Layer,
    PadoSlider,
    VERect,
    VEPoint
  },
  data: ()=>({
    rectSize    : 150,
    colCount    : 3,
    rowCount    : 3,
    addEachCol  : 0,
    piecesRects : [],
    piecesPoints: []
  }),
  computed: {
    selectedRects (){
      return this.piecesRects.filter(item=>item.selected);
    },
    selectedPoints (){
      return this.selectedRects.map(item=>{
        const { rect } = item;
        item.point = rect.findPoint("middle center");
        return item;
      });
    },
    relativePoints (){
      return this.selectedPoints.map(item=>{
        item.point = item.point.clone().call(point=>{
          point.y += point.meta.column * 10;
          return point;
        });
        return item;
      });
    }
  },
  methods: {
    drawRect (){
      const rootRect = rect(0, 0, this.rectSize, this.rectSize);
      
      this.piecesRects = rootRect.piecesWithCount([this.colCount, this.rowCount], rect=>{
        return {
          selected: false,
          rect,
          meta    : rect.meta
        };
      });
      
      const pointArr = rootRect.piecesWithCount([this.colCount, this.rowCount], (rect, i, c, r)=>{
        return {
          key: [c, r] + "",
          ...rect.findPoint("middle center").toJSON()
        };
      });
      
      
      this.piecesPoints = pointArr;
    },
    selectRect (rect){
      rect.selected = !rect.selected;
    }
  },
  mounted (){
    this.drawRect();
    const recta = rect(0, 0, 50, 100);
    recta.fit(rect(0, 0, 10, 20));
  }
};
</script>
