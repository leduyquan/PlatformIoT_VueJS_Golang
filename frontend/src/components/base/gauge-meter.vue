<template>
    <div class="meter-area">
        <svg version="1.1" x="0px" y="0px" viewBox="0 0 286 143" class="meter" preserveAspectRatio="none"  shape-rendering="auto">
            <g class="gauge_meter">
            </g>
            <g class="gauge_level gauge_level_0">
                <circle cx="0" cy="0" r="11"/>
                <rect  x="-6" y="4" width="12" height="70"/>
                <circle cx="0" cy="74" r='6'/>
            </g>
        </svg>
    </div>
</template>
<script>
    export default {
        props:['gaugeMeterData'],
        data(){
            return {
                hasExclaim:false,
                percentLevelColor:'#8cc63f',
                widgetRatio:'',
                minRange: 0,
                maxRange: 100,
                currentValuePercent:0
            }
        },
        created () {

        },
        mounted() {
            this.drawGauge();
        },
        computed:{
            currentValue:function () {
                return this.gaugeMeterData.reportData.today;
            }
        },
        watch: {
            gaugeMeterData: {
                deep: true,
                handler(val, oldVal) {
                    this._updateGaugeLevel();
                }
            }
        },
        methods:{
            drawGauge(){
                var self = this;
                self.minRange = Math.min.apply(Math,self.gaugeMeterData.rangeData.map(function(range){return parseInt(range.Start);}));
                self.maxRange = Math.max.apply(Math,self.gaugeMeterData.rangeData.map(function(range){return parseInt(range.End);}));
                self.gaugeMeter = $(this.$el).find('.gauge_meter');
                self.gaugeLevel = $(this.$el).find('.gauge_level');
                var r = 125;
                var cf = 2 * Math.PI * r ;
                var semi_cf=cf/2;
                var stroke_width = 18;
                self.gaugeMeterData.rangeData.forEach(function(item,index){
                    var xmlns = "http://www.w3.org/2000/svg";
                    var $circle = document.createElementNS(xmlns,"circle");
                    var percentStart = ((parseFloat(item.Start) - self.minRange) * 100)/(self.maxRange - self.minRange);
                    var arc_len = semi_cf * (100 - percentStart)/100;
                    $circle.setAttributeNS(null, "cx", '50%');
                    $circle.setAttributeNS(null, "cy", '0');
                    $circle.setAttributeNS(null, "r", r.toString());
                    $circle.setAttributeNS(null, "fill", 'none');
                    $circle.setAttributeNS(null,'stroke',item.Color);
                    $circle.setAttributeNS(null,'stroke-width', stroke_width.toString());
                    $circle.setAttributeNS(null,'stroke-dasharray', arc_len + ',' + cf);
                    if(index==0 || index==(self.gaugeMeterData.rangeData.length - 1)){
                        //$circle.setAttributeNS(null,'stroke-linecap', 'round');
                    }
                    self.gaugeMeter.append($circle);
                });
                self._updateGaugeLevel();
            },
            _updateGaugeLevel:function(){
                var self = this;
                var currentLevel = self.currentValue - self.minRange < 0 ? 0 : (self.currentValue - self.minRange);
                var percentLevel = Math.round((currentLevel  * 100)/(self.maxRange - self.minRange));
                self.gaugeLevel.removeClass(function(index, className) {
                    return (className.match(/(^|\s)gauge_level_\S+/g) || []).join(' ');
                });
                self.gaugeLevel.addClass('gauge_level_'+ percentLevel);
            }
        }

    }
</script>
