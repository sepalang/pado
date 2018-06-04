const path = require('path');

exports.module = (__pacakgeRoot)=>({
  vue$: 'vue/dist/vue.esm.js',
  "~/": __pacakgeRoot,
  "@/": path.resolve(__pacakgeRoot,"./src"),
  "@layout/": path.resolve(__pacakgeRoot,"src/layout"),
  "@pages/": path.resolve(__pacakgeRoot,"src/pages"),
  "@component/": path.resolve(__pacakgeRoot,"src/component"),
  "@util/": path.resolve(__pacakgeRoot,"src/util"),
  "@pado/": path.resolve(__pacakgeRoot,"../../.src/")
});
