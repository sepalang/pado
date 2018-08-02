<script>
export default {
  props:["theme", "hideHeader", "title", "text", "html", "buttons", "closeButton", "on", "delay"],
  methods: {
    setButtons (value){
      let $placeholder = $(this.$el).find("[msc-buttons-placehodler]");

      if($placeholder && (value instanceof Array)){
        value.forEach(button=>{
          if(typeof button === "string"){
            let buttonText = button;
            button = function(btn){ this.text(buttonText); };
          }

          if(typeof button === "function"){
            var $btn = $(`<button class="btn btn-lg"></button>`);
            button.call($btn,this,$btn);
          
            //휵에 전달했는데 클래스의 변화가 없으면
            if($btn.attr("class") === "btn btn-lg"){
              $btn.addClass("line-2");
            }
          
            $placeholder.append($btn);
          }
        });
      }
    },
    closePromise (delay){
      if(typeof delay === "object" && typeof delay.then === "function"){
        return delay.then(e=>{
          this.close();
          return e;
        });
      } else if(delay === "number") {
        return promise.timeout(e=>{
          this.close();
          return this;
        },parseInt(delay,10)||0);
      } else {
        console.warn("알수 없는 closePromise 인자", delay);
      }
    }
  },
  created (){
    if(this.on && this.on.close){
      this.$on("close",e=>{
        this.on.close()
      })
    }
  },
  mounted (){
    this.setButtons(this.buttons);
    if(typeof this.delay !== "undefined"){
      this.closePromise(this.delay);
    }
  }
}
</script>