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
                <Layer>
                  <PadoRect :size="rectSize">
                    <template slot-scope="scope">Root Size<br>{{scope.rect.width}}</template>
                  </PadoRect>
                </Layer>
                <Layer opacity=".5">
                  <PadoRect 
                    v-for="item in piecesRects"
                    :key="[item.meta.col, item.meta.row]+''"
                    :left="item.rect.left"
                    :top="item.rect.top"
                    :width="item.rect.width"
                    :height="item.rect.height"
                    style="border:1px solid silver"
                  >
                  </PadoRect>
                </Layer>
              </Layer>
            </td>
            <td>
              <Layer root :size="rectSize">
                <Layer>
                  <PadoRect :size="rectSize">
                    <template slot-scope="scope">Root Size<br>{{scope.rect.width}}</template>
                  </PadoRect>
                </Layer>
                <Layer>
                  <PadoPoint
                    v-for="point in piecesPoints"
                    :key="point.key"
                    :x="point.x"
                    :y="point.y"
                  ></PadoPoint>
                  
                </Layer>
              </Layer>
            </td>
          </tr>
          <tr>
            <td>
              <Layer root @click="selectRect(';ayer')">
                <PadoRect 
                  v-for="item in piecesRects"
                  :key="[item.meta.col, item.meta.row]+''"
                  :left="item.rect.left"
                  :top="item.rect.top"
                  :width="item.rect.width"
                  :height="item.rect.height"
                  style="border:1px solid silver"
                  @click.native="selectRect(item)"
                >
                </PadoRect>
              </Layer>
            </td>
            <td>
              <Layer root @click="selectRect(';ayer')">
                <PadoRect 
                  v-for="item in selectedRects"
                  :key="[item.meta.col, item.meta.row]+''"
                  :left="item.rect.left"
                  :top="item.rect.top"
                  :width="item.rect.width"
                  :height="item.rect.height"
                  style="border:1px solid silver"
                  @click.native="selectRect(item)"
                >
                </PadoRect>
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
import PadoRect from '@/components/PadoRect.vue';
import PadoPoint from '@/components/PadoPoint.vue';
import { rect } from '@sepalang/pado/.src/modules/stance';

export default {
  components: {
    AppLayout,
    Layer,
    PadoSlider,
    PadoRect,
    PadoPoint
  },
  data: ()=>({
    rectSize    : 150,
    colCount    : 1,
    rowCount    : 1,
    addEachCol  : 0,
    piecesRects : [],
    piecesPoints: [],
  }),
  computed: {
    selectedRects (){
      return this.piecesRects.filter(rect=>rect.selected);
    }
  },
  methods: {
    drawRect (){
      const rootRect = rect(0, 0, this.rectSize, this.rectSize);
      
      this.piecesRects = rootRect.piecesWithCount([this.colCount, this.rowCount],rect=>{
        return {
          selected:false,
          rect,
          meta:rect.meta
        }
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
      rect.selected = !rect.selected
    },
  },
  mounted (){
    this.drawRect();
  }
};
</script>
