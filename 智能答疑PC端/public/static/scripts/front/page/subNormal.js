require.config({
	baseUrl:"../../../static/scripts/front/"
});
require(["../../../static/scripts/front/config.js"],function(){
	require(["jquery","subpage"]);
});