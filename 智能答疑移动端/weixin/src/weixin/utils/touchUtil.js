
let TouchUtil ={

    GetSlideAngle(dx, dy) {
        return Math.atan2(dy, dx) * 180 / Math.PI;
    },
    GetSlideDirection(startX, startY, endX, endY) {
        var dy = startY - endY;
        var dx = endX - startX;
        var result = 0;
        //如果滑动距离太短
        if(Math.abs(dx) < 2 && Math.abs(dy) < 2) {
            return result;
        }
        var angle = this.GetSlideAngle(dx, dy);
        if(angle >= -45 && angle < 45) {
            result = 4;
        }else if (angle >= 45 && angle < 135) {
            result = 1;
        }else if (angle >= -135 && angle < -45) {
            result = 2;
        }
        else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            result = 3;
        }
        console.log("last"+result)
        return result;
    },
    touchStart(ev){

        var wapper=ReactDOM.findDOMNode(this.refs.wapper);
        let height=wapper.offsetHeight,pageYOffset=window.pageYOffset,innerHeight=window.innerHeight;
        // offsetHeight内容高度+padding高度+边框宽度
        // innerheight	返回窗口的文档显示区的高度。
        if(innerHeight+pageYOffset>=height&&this.state.loadGoodsDetails&&pageYOffset!=0){//若拉取到底部才进行加载

            this.setState({
                startX:ev.touches[0].pageX,
                startY:ev.touches[0].pageY
            })

        }
    },
    touchEnd(ev){

        var wapper=ReactDOM.findDOMNode(this.refs.wapper);
        let height=wapper.offsetHeight,pageYOffset=window.pageYOffset,innerHeight=window.innerHeight;
        if(innerHeight+pageYOffset<height||!this.state.loadGoodsDetails||pageYOffset==0){//若拉取到底部才进行加载

            return;
        }
        this.setState({
            endX:ev.changedTouches[0].pageX,
            endY:ev.changedTouches[0].pageY
        })
        var that=this;
        var direction = that.GetSlideDirection(this.state.startX, this.state.startY, this.state.endX, this.state.endY);
        switch(direction) {
            case 0://没滑动

                break;
            case 1:

                that.onChildChange(1);
                break;
            case 2:

                that.onChildChange(2);
                break;
            case 3:

                that.onChildChange(3);
                break;
            case 4:

                that.onChildChange(4);
                break;
            default:
        }
    }
}
export default TouchUtil
