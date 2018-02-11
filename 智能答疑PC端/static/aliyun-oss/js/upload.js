var OSSupload={
		accessid:'',
		accesskey:'',
		host:'',
		policyBase64:'',
		signature:'',
		callbackbody:'',
		filename:'',
		key:'',
		expire:0,
		g_object_name:'',
		g_object_name_type:'random_name',
		now :Date.parse(new Date()) / 1000,
        timestamp:Date.parse(new Date()) / 1000, 
        send_request:function ()
		{
		    var xmlhttp = null;
		    if (window.XMLHttpRequest)
		    {
		        xmlhttp=new XMLHttpRequest();
		    }
		    else if (window.ActiveXObject)
		    {
		        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		    }
		  
		    if (xmlhttp!=null)
		    {
		        serverUrl = '/ossManage/getOssSignature?userDir='+this.key;
		        xmlhttp.open( "GET", serverUrl, false );
		        xmlhttp.send( null );
		        return xmlhttp.responseText
		    }
		    else
		    {
		        alert("Your browser does not support XMLHTTP.");
		    }
		},
		check_object_radio:function () {
		    var tt = document.getElementsByName('myradio');
		    for (var i = 0; i < tt.length ; i++ )
		    {
		        if(tt[i].checked)
		        {
		            this.g_object_name_type = tt[i].value;
		            break;
		        }
		    }
		},
		get_signature:function ()
		{
		    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
		    now = timestamp = Date.parse(new Date()) / 1000; 
		    if (this.expire < now + 3)
		    {
		        body = this.send_request()
		        var obj = eval ("(" + body + ")");
		        this.host = obj['host']
		        this.policyBase64 = obj['policy']
		        this.accessid = obj['accessid']
		        this.signature = obj['signature']
		        this.expire = parseInt(obj['expire'])
		        this.callbackbody = obj['callback'] 
		        this.key = obj['dir'];
		        return true;
		    }
		    return false;
		},
		random_string:function (len) {
		　　len = len || 32;
		　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789';   
		　　var maxPos = chars.length;
		　　var pwd = '';
		　　for (i = 0; i < len; i++) {
		    　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
		    }
		    return pwd;
		},
		get_suffix:function (filename) {
		    pos = filename.lastIndexOf('.')
		    suffix = ''
		    if (pos != -1) {
		        suffix = filename.substring(pos)
		    }
		    return suffix;
		},
		calculate_object_name:function (filename)
		{
		    if (this.g_object_name_type == 'local_name')
		    {
		    	this.g_object_name += "${filename}"
		    }
		    else if (this.g_object_name_type == 'random_name')
		    {
		    	this.suffix = this.get_suffix(filename);
		    	
		        this.g_object_name = this.key +'/'+this.random_string(10) + this.suffix
		    }
		    return ''
		},
		get_uploaded_object_name:function (filename)
		{
		    if (this.g_object_name_type == 'local_name')
		    {
		        tmp_name = this.g_object_name
		        tmp_name = tmp_name.replace("${filename}", filename);
		        return tmp_name
		    }
		    else if(this.g_object_name_type == 'random_name')
		    {
		        return this.g_object_name
		    }
		},
		set_upload_param:function (up, filename, ret)
		{
		    if (ret == false)
		    {
		        ret = this.get_signature()
		    }
		    this.g_object_name = this.key;
		    if (filename != '') {
		    	this.suffix = this.get_suffix(filename)
		        this.calculate_object_name(filename);
		    }
		    new_multipart_params = {
		        'key':this.g_object_name,
		        'policy': this.policyBase64,
		        'OSSAccessKeyId': this.accessid, 
		        'success_action_status':'200', //让服务端返回200,不然，默认会返回204
		        'callback':this.callbackbody,
		        'signature': this.signature,
		    };

		    up.setOption({
		        'url': this.host,
		        'multipart_params': new_multipart_params
		    });

		    up.start();
		}
}
//aliyun 文件上传
//文件上传（在file输入框添加targetId对应图片或文件路径）
var vedioUploader = new plupload.Uploader({
  	runtimes : 'html5,flash,silverlight,html4',
  	browse_button : [], 
  	//browse_button :'selectfiles',
      multi_selection: false,
  	//container:null,//document.getElementById('alypld_container'),
  	flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
  	silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
    url : 'http://oss.aliyuncs.com',
    filters: {
        mime_types : [ //只允许上传图片和zip,rar文件
        { title : "video files", extensions : "flv,swf,mkv,avi,rm,rmvb,mpeg,mpg,ogg,ogv,mov,wmv,mp4,webm,mp3,wav,mid" }
        ],
        max_file_size:'1024mb', //最大只能上传10mb的文件
        prevent_duplicates:false //不允许选取重复文件
    },
    preinit:function(){
    	//创建container对象
    	var containId="alypld_" + (+ new Date()).toString(32);
			var container=document.createElement("div");//<div id="container" style="display:none">
			container.id=containId;
			container.style.display='none';
			document.body.appendChild(container);        //在body内创建一个div
			uploader.setOption('container',document.getElementById(containId));
    },
  	init: {
  		
  		PostInit: function() {
  			var Odiv=document.createElement("div");
  			Odiv.className="modal";//id="processModel" class="modal" tabindex="-1"
  			Odiv.id="processModel";
  			Odiv.tabindex="-1";
  			Odiv.innerHTML='<div class="modal-dialog" style="width:350px;margin-top:20%;margin-left:auto;margin-right:auto;position:relative;z-index:999999;">'
  				        +'<div class="modal-content" style="border-radius:7px;padding: 0px 15px;">'
  			            +'<div class="modal-body">'
  			            +'<div class="form-inline form-query form-group">'
  			            +'<div id="uploadProcess"></div>'	
                          +'</div></div></div>'
                          +'</div>'
  	        //在div内创建一个span
  	        document.body.appendChild(Odiv);        //在body内创建一个div 
  		},
  		FilesAdded: function(up, files) {
  			$('#processModel').modal("toggle");
  			plupload.each(files, function(file) {
  				OSSupload.set_upload_param(up, '', false);
  				if(file && file.targetid){
  					document.getElementById(file.targetid).value="/"+OSSupload.get_uploaded_object_name(file.name);
  				}
  				document.getElementById('uploadProcess').innerHTML = '<div id="uploadProcessfile">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
  				+'<div class="progress" style="border-radius:7px;"><div class="progress-bar" style="width: 0%"></div></div>'
  				+'</div>';
  			});
  			
  		},
  		BeforeUpload: function(up, file) {
              OSSupload.set_upload_param(up, file.name, true);
          },
  		UploadProgress: function(up, file) {
  			
  		 var d = document.getElementById("uploadProcessfile");
  			d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
              var prog = d.getElementsByTagName('div')[0];
  			var progBar = prog.getElementsByTagName('div')[0]
  			progBar.style.width= 3*file.percent+'px';
  			progBar.setAttribute('aria-valuenow', file.percent);
  		},
  		FileUploaded: function(up, file, info) {
              if (info.status == 200)
              {
              	//alert("上传成功！");
              }
              else
              {
              	alert(info.response);
              } 
              setTimeout(() => {
               $('#processModel').modal("toggle");
				}, 1100);
  		},
  		Error: function(up, err) {
              if (err.code == -600) {
              	alert("选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小");
              }
              else if (err.code == -601) {
              	alert("选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型");
              }
              else if (err.code == -602) {
              	alert("这个文件已经上传过一遍了");
              }
              else 
              {
              	alert(err.response);
              }
  		}
  	}
  });
//aliyun 文件上传
//文件上传（在file输入框添加targetId对应图片或文件路径）
var uploader = new plupload.Uploader({
	runtimes : 'html5,flash,silverlight,html4',
	browse_button : [], 
	//browse_button :'selectfiles',
    multi_selection: false,
	//container:null,//document.getElementById('alypld_container'),
	flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
	silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
  url : 'http://oss.aliyuncs.com',
  filters: {
      mime_types : [ //只允许上传图片和zip,rar文件
      { title : "Image files", extensions : "jpg,jpeg,gif,png,bmp" }
      ],
      max_file_size:'20mb', //最大只能上传10mb的文件
      prevent_duplicates:false //不允许选取重复文件
  },
  preinit:function(){
  	//创建container对象
  	var containId="alypld_" + (+ new Date()).toString(32);
			var container=document.createElement("div");//<div id="container" style="display:none">
			container.id=containId;
			container.style.display='none';
			document.body.appendChild(container);        //在body内创建一个div
			uploader.setOption('container',document.getElementById(containId));
  },
	init: {
		
		PostInit: function() {
			var Odiv=document.createElement("div");
			Odiv.className="modal";//id="processModel" class="modal" tabindex="-1"
			Odiv.id="processModel";
			Odiv.tabindex="-1";
			Odiv.innerHTML='<div class="modal-dialog" style="width:350px;margin-top:20%;margin-left:auto;margin-right:auto;position:relative;z-index:999999;">'
				        +'<div class="modal-content" style="border-radius:7px;padding: 0px 15px;">'
			            +'<div class="modal-body">'
			            +'<div class="form-inline form-query form-group">'
			            +'<div id="uploadProcess"></div>'	
                        +'</div></div></div>'
                        +'</div>'
	        //在div内创建一个span
	        document.body.appendChild(Odiv);        //在body内创建一个div 
		},
		FilesAdded: function(up, files) {
			$('#processModel').modal("toggle");
			plupload.each(files, function(file) {
				OSSupload.set_upload_param(up, '', false);
				if(file && file.targetid){
					document.getElementById(file.targetid).value="/"+OSSupload.get_uploaded_object_name(file.name);
				}
				document.getElementById('uploadProcess').innerHTML = '<div id="uploadProcessfile">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
				+'<div class="progress" style="border-radius:7px;"><div class="progress-bar" style="width: 0%"></div></div>'
				+'</div>';
			});
			
		},
		BeforeUpload: function(up, file) {
            OSSupload.set_upload_param(up, file.name, true);
        },
		UploadProgress: function(up, file) {
			
		 var d = document.getElementById("uploadProcessfile");
			d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
            var prog = d.getElementsByTagName('div')[0];
			var progBar = prog.getElementsByTagName('div')[0]
			progBar.style.width= 3*file.percent+'px';
			progBar.setAttribute('aria-valuenow', file.percent);
		},
		FileUploaded: function(up, file, info) {
            if (info.status == 200)
            {
            	//alert("上传成功！");
            }
            else
            {
            	alert(info.response);
            } 
            setTimeout(() => {
             $('#processModel').modal("toggle");
				}, 1100);
		},
		Error: function(up, err) {
            if (err.code == -600) {
            	alert("选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小");
            }
            else if (err.code == -601) {
            	alert("选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型");
            }
            else if (err.code == -602) {
            	alert("这个文件已经上传过一遍了");
            }
            else 
            {
            	alert(err.response);
            }
		}
	}
});