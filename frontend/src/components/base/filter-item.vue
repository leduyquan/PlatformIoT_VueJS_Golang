<template>
    <li role="filteritem"
        :class="classes" v-if="model.show">
        <div :class="anchorClasses">
            <span v-on="events">
                <slot :vm="this" :model="model">
                    <label class="control control--checkbox">
                        <div class="control__indicator"></div>
                        {{ model[textFieldName] }}
                    </label>
                </slot>
            </span>
            <i class="fa fa-angle-right" aria-hidden="true" v-if="isFolder" @click="handleItemEnter"></i>
        </div>
        <div class="back-btn" v-if="isFolder"><a href="javascript:void(0)" @click="handleItemOut"><i aria-hidden="true" class="fa fa-long-arrow-left"></i> BACK</a></div>
        <ul role="group" ref="group" class="filter-children" v-if="isFolder">
            <filter-item v-for="(child, index) in model[childrenFieldName]"
                       :key="index"
                       :data="child"
                       :is-search="isSearch"
                       :text-field-name="textFieldName"
                       :value-field-name="valueFieldName"
                       :children-field-name="childrenFieldName"
                       :item-events="itemEvents"
                       :depth="depth+1"
                       :height= "height"
                       :on-item-click="onItemClick"
                       :on-item-toggle="onItemToggle"
                       :klass="index === model[childrenFieldName].length-1?'filter-last':''">
                <template slot-scope="_">
                    <slot :vm="_.vm" :model="_.model">
                        <label class="control control--checkbox">
                            <div class="control__indicator"></div>
                            {{ _.model[textFieldName] }}
                        </label>
                    </slot>
                </template>
            </filter-item>
        </ul>
    </li>
</template>
<script>
  export default {
      name: 'filterItem',
      props: {
          data: {type: Object, required: true},
          textFieldName: {type: String},
          valueFieldName: {type: String},
          childrenFieldName: {type: String},
          itemEvents: {type: Object},
          height: {type: Number, default: 24},
          depth: {type: Number, default: 1},
          onItemClick: {
              type: Function, default: () => false
          },
          onItemToggle: {
              type: Function, default: () => false
          },
          klass: String,
          isSearch:{type:Boolean,default:false}
      },
      data () {
          return {
              isHover: false,
              model: this.data,
              maxHeight: 0,
              events: {}
          }
      },
      watch: {
          data (newValue) {
              this.model = newValue
          },
          'model.opened': {
              handler: function (val, oldVal) {
                  //this.onItemToggle(this, this.model);
              },
              deep: true
          },
          'model.selected': {
              handler: function (val, oldVal) {
                  var self = this;
                  setTimeout(function(){
                      if (self.$parent.$options._componentTag === 'filter-item') {
                          self.$parent.getSelectedCount();
                      }
                  },200)
              },
              deep: true
          }

      },
      computed: {
          isFolder () {
              return this.model[this.childrenFieldName] && this.model[this.childrenFieldName].length
          },
          classes () {
              return [
                  'filter-depth-'+this.depth,
                  {'filter-node': true},
                  {'filter-open': this.model.opened},
                  {'filter-closed': !this.model.opened},
                  {'filter-leaf': !this.isFolder},
                  {'filter-loading': !!this.model.loading},
                  {[this.klass]: !!this.klass}
              ]
          },
          anchorClasses () {
              return [
                  {'filter-anchor': true},
                  {'filter-disabled': this.model.disabled},
                  {'filter-selected': this.model.selected},
                  {'filter-indeterminate': this.model.indeterminate},
                  {'filter-hovered': this.isHover}
              ]
          }
      },
      methods: {
          getSelectedCount(){
              var self = this;
              if(self.model[self.childrenFieldName].length){
                  self.model.selectedCount = 0;
                  self.model[self.childrenFieldName].map(function(item){
                      if(item.selected)
                      {
                          self.model.selectedCount++;
                      }
                  });
                  if(self.model.selectedCount == self.model[self.childrenFieldName].length){
                      self.model.selected = true
                      self.model.indeterminate = false;
                  }else{
                      self.model.selected = false;
                      if(self.model.selectedCount){
                          self.model.indeterminate = true;
                      }else{
                          self.model.indeterminate = false;
                      }
                  }
              }
          },
          handleItemEnter (e) {
              if (this.isFolder) {
                  this.model.opened = true;
                  this.onItemToggle(this, this.model,e,1);
              }
          },
          handleItemOut (e) {
              if (this.isFolder) {
                  this.model.opened = false;
                  this.onItemToggle(this, this.model,e,-1);
              }
          },
          handleGroupMaxHeight () {
              let length = 0
              let childHeight = 0
              if (this.model.opened) {
                  length = this.$children.length
                  for (let children of this.$children) {
                      childHeight += children.maxHeight
                  }
              }
              this.maxHeight = length * this.height + childHeight
              if (this.$parent.$options._componentTag === 'filter-item') {
                  this.$parent.handleGroupMaxHeight()
              }
          },

          handleItemClick (e) {
              var self = this;
              if (this.model.disabled) return
              this.model.selected = !this.model.selected
              this.onItemClick(this, this.model, e)
          },
          handleItemMouseOver () {
              this.isHover = true
          },
          handleItemMouseOut () {
              this.isHover = false
          }
      },
      created () {
          const self = this
          const events = {
              'click': this.handleItemClick,
              'mouseover': this.handleItemMouseOver,
              'mouseout': this.handleItemMouseOut
          }
          for (let itemEvent in this.itemEvents) {
              let itemEventCallback = this.itemEvents[itemEvent]
              if (events.hasOwnProperty(itemEvent)) {
                  let eventCallback = events[itemEvent]
                  events[itemEvent] = function (event) {
                      eventCallback(self, self.model, event)
                      itemEventCallback(self, self.model, event)
                  }
              } else {
                  events[itemEvent] = function (event) {
                      itemEventCallback(self, self.model, event)
                  }
              }
          }
          this.events = events
      },
      mounted () {
          this.handleGroupMaxHeight()
      }
  }
</script>
