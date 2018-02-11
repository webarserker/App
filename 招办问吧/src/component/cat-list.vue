<style lang="stylus" scoped>
	.catalog{
		background: #FFF;
	}

	.catalog-title{
		padding: 1em;
		font-weight: bold;
		border-bottom: 1px solid #EEE;
	}

	.catalog-items{
		padding: 0 1em;  
		position: relative;
	}

	.catalog-items .collapse-handler{
		display: none;
		position: absolute;
		left: 0;
		bottom: 0; 
		width: 100%;
		padding: 5px 0;
		background: #EEE;
		font-size: .8em;
		text-align: center;
	}

	.catalog-item{
		display: inline-block;
		font-size: .9em;
		margin: 0;
		min-width: 48%;
		padding .5em 0;
	}

	.catalog-item .iconfont{
		display: inline-block;
	}

	.catalog-item-text{
		display: inline-block;
		margin-right: 1em;
	}

	.catalog-item-text.active{
		color: red
	}
</style>

<template>
	<div class="catalog">
		<div class="catalog-title w3-text-theme" v-if="title">
			<span :class="'iconfont ' + icon" v-if="icon"></span>
			{{title}}
		</div>
		<div class="catalog-items">
			<a href="javascript:;" class="collapse-handler" @click="toggleCollapse()">
				{{collapsed ? '显示更多' : '收起'}}
				<span v-if="collapsed" class="iconfont icon-arrow-down"></span>
				<span v-if="!collapsed" class="iconfont icon-arrow-up"></span>
			</a>
			<a class="catalog-item" v-for="item in list"
				:href="item.url || 'javascript:;'">
				<span v-if="itemIcon || item.icon" 
					class="iconfont {{itemIcon || item.icon}} w3-text-theme"></span>
				<span class="catalog-item-text {{item.id == active ? 'active' : ''}}">
					{{item.name}}
				</span>
			</a>
		</div>
	</div>
</template>

<script>
	import {query,css} from '../lib/dom.js';

	export default {
		props: ['title', 'icon', 'list', 'itemIcon', 'active', 'max'],
		data: function(){
			return {
				collapsed: false
			};
		},
		methods: {
			initCollapsed: function(){
				if(this.max && this.list.length > this.max){
					this.toggleCollapse(true);
					css('.catalog-items', {
						paddingBottom: '2em'
					}, this.$el);
					css('.collapse-handler', {
						display: 'block'
					}, this.$el);
				}else{
					this.toggleCollapse(false);
				};
			},
			// 展开/收缩
			toggleCollapse: function(collapsed){
				var max = this.max, style;
				// 
				if(typeof collapsed === 'undefined'){
					collapsed = !this.collapsed;
				};
				this.collapsed = collapsed;
				// 
				if(this.collapsed){
					style = {
						'maxHeight': (max/2 * 38 + 30) + 'px',
						'overflow': 'hidden'
					};
				}else{
					style = {
						'maxHeight': 'none',
						'overflow': 'visible'
					};
				};
				css('.catalog-items', style, this.$el);
			},
		},
		ready: function(){
			this.initCollapsed();
		}
	}
</script>
