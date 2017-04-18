$(function () {
    //游戏充值 选择后金额变化
    $('.game-radio').on('change', function () {
        $('#money').text($('.game-radio[name="card"]:checked').val());
    });
    //注册
    $('#code-btn').on('click', function () {
        var Reg = /(13|14|15|18)[0-9]{9}/;
        var index = 60;
        var timeout = function () {
            if (index == 0) {
                clearTimeout();
                $('#code-btn').removeClass('disabled').addClass('button-dark').prop('disabled', false).text("获取验证码");
            } else {
                setTimeout(function () {
                    index--;
                    $('#code-btn').text(index + "秒后重试");
                    timeout();
                }, 1000)
            }
        };
        if ($('#phone').val() == "" || !Reg.test($('#phone').val())) {
            $.toast("请认真填写手机号码！", 1000);
        } else {
            $('#code-btn').removeClass('button-dark').addClass('disabled').prop('disabled', true);
            timeout();
            //发送手机号
            $.post('', {
                // $('#phone').val()
            }, function (res) {

            });
        }
    });

    //上传头像
    var headUpload = function (file, img) {
        this.file = file;
        this.img = img;
        this.upload();
    };
    headUpload.prototype.upload = function () {
        var oFReader = new FileReader();
        var rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
        var that = this;
        oFReader.onload = function (oFREvent) {
            // ajax上传
            that.img.attr('src', oFREvent.target.result);
        };
        this.file.on('change', function () {
            if (this.files.length === 0) {
                return;
            }
            var oFile = this.files[0];
            if (!rFilter.test(oFile.type)) {
                $.toast("请选择图片！", 1000);
                return;
            }
            else {
            	$.showPreloader('上传中...');
                oFReader.readAsDataURL(oFile);
                var data = new FormData();
                data.append("file", oFile);
                $.ajax({
                    url: '/home/PersonalInfo_Avatar_Upload',
                    type: 'post',
                    processData: false,
                    contentType: false,
                    data: data,
                    success: function (data) {
                		$.hidePreloader();
                        if (data) {
                            $('#prompt-id').hide();
                            $.toast("头像上传成功！", 1000);
                        } else {
                            $('#prompt-id').show();
                            $.toast("头像上传失败！",1000);
                        }
                    }
                });
            }
        });
    };
    var head = new headUpload($('#upload'), $('#upload-img'));

    //生日日历
    $("#info-birthday").calendar({
        onChange: function (p, val, displayvalue) {
            $.ajax({
                url: '/Home/PersonalInfo_Birthday',
                type: 'post',
                data: { 'birthday': displayvalue },
                success: function (data) {
                    if (data) {
                        $.toast("生日修改成功！", 1000);
                    }
                    else {
                        $.toast("生日修改失败！",1000);
                    }
                }
            })
        }
    });

    //性别选择
    $("#info-sex").picker({
        toolbarTemplate: '<header class="bar bar-nav">\
            <button class="button button-link pull-right close-picker">确定</button>\
            <h1 class="title">请选择性别</h1>\
            </header>',
        cols: [
            {
                textAlign: 'center',
                values: ['男', '女']
            }
        ],
        onClose: function () {
            $.ajax({
                url: '/Home/PersonalInfo_Sex',
                type: 'post',
                data: { 'sex': $("#info-sex").val() },
                success: function (data) {
                    if (data) {
                        $.toast("性别修改成功！", 1000);
                    }
                    else {
                        $.toast("性别修改失败！",1000);
                    }
                }
            })
        }
    });

    //上传身份证
    var idUpload = function (file, img, imgBox) {
        this.file = file;
        this.img = img;
        this.imgBox = imgBox;
        this.upload();
    };
    idUpload.prototype.upload = function () {
        var oFReader = new FileReader();
        var rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
        var that = this;
        oFReader.onload = function (oFREvent) {
            that.img.attr('src', oFREvent.target.result);
            that.imgBox.show();
        };
        this.file.on('change', function () {
        	oFReader.readAsDataURL(oFile);
            if (this.files.length === 0) {
                return;
            }
            var oFile = this.files[0];
            if (!rFilter.test(oFile.type)) {
                $.toast("请选择图片！", 1000);
                return;
            }
            else {
            	$.showPreloader('上传中...');
                oFReader.readAsDataURL(oFile);
                // 身份证上传ajax
                var data = new FormData();
                data.append("file", oFile);
                $.ajax({
                    url: '/Account/security_id_idimg',
                    type: 'post',
                    processData: false,
                    contentType: false,
                    data: data,
                    success: function (data) {
                    	$.hidePreloader();
                        if (data) {
                            $('#prompt-id').hide();
                            $.toast("身份证上传成功！", 1000);
                        } else {
                            $('#prompt-id').show();
                            $.toast("身份证上传失败！", 1000);
                        }
                    }
                });
            }

        });
    };
    var id = new idUpload($('#id_upload'), $('#id-img'), $('.id-upload-box .item-media'));

    // 修改身份证号码
    $('#security_id_submit').on('click', function () {
        var Reg = /\d{17}[\d|x]|\d{15}/;
        
        if ($('#ID').val() == '' || !Reg.test($('#ID').val()) || $('#name').val() == '' || $('#name').val().length < 2) {
            $('#id-prompt').show();
            
        } else {
            
            $('#id-prompt').hide();
            $.ajax({
                url: '/Account/Security_Id',
                type: 'post',
                data: {
                    'idcard': $("#ID").val(),
                    'name': $("#name").val(),
                },
                success: function (msg) {
                    if (msg) {
                        $('#prompt-id').hide();
                        $.toast("身份证上传成功！", 1000);
                        location.href = "/Account/Security";
                    } else {
                        $('#prompt-id').show();
                        $.toast("身份证上传失败！",1000);
                    }
                }
            });
        }
    });

    //更改邮箱
    $("#security_email_submit").on('click', function () {
        var Reg = /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/;
        if ($('#security_email_text').val() == '' || !Reg.test($('#security_email_text').val())) {
            $('#email-prompt').show();
        } else {
            $('#email-prompt').hide();
            $.ajax({
                url: '/Account/Security_Email',
                type: 'post',
                data: {
                    'email': $("#security_email_text").val()
                },
                success: function (msg) {
                    if (msg) {
                        $.toast("绑定成功", 1000);
                        location.href = "/Account/Security";
                    }
                    else {
                        $.toast("绑定失败！",1000);
                    }
                }
            });
        }
    });






    //商品支付按钮sellProduct
    $("#sellProduct_pay").on('click', function () {
        $.ajax({
            url: '/Product/SellOrderting',
            type: 'post',
            data: {
                'ProductPrice': $('.game-radio[name="card"]:checked').val()
            },
            success: function (msg) {
                if (msg) {
                    $.toast("支付成功", 1000);
                }
                else {
                    $.toast("支付失败！",1000);
                };
            }
        });
    });
});



