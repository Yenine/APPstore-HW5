<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单
                </el-breadcrumb-item>
                <el-breadcrumb-item>应用上传</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="应用名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="选择器">
                        <el-select v-model="form.region" placeholder="请选择">
                            <el-option key="bbk" label="步步高" value="bbk"></el-option>
                            <el-option key="xtc" label="小天才" value="xtc"></el-option>
                            <el-option key="imoo" label="imoo" value="imoo"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="日期时间">
                        <el-col :span="11">
                            <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="form.date1"
                                value-format="yyyy-MM-dd"
                                style="width: 100%;"
                            ></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-time-picker
                                placeholder="选择时间"
                                v-model="form.date2"
                                style="width: 100%;"
                            ></el-time-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="应用类别">
                        <el-cascader :options="options" v-model="form.options"></el-cascader>
                    </el-form-item>
                    <el-form-item label="测试版本">
                        <el-switch v-model="form.delivery"></el-switch>
                    </el-form-item>

                    <div v-if="form.delivery === false">
                        <el-form-item label="应用ID">
                            <el-input v-model="form.version"></el-input>
                        </el-form-item>
                    </div>

                    <el-form-item label="自定义">
                        <el-select
                                v-model="tagValue"
                                multiple
                                filterable
                                allow-create
                                default-first-option
                                placeholder="请选择标签">
                            <el-option key="shiyong" label="实用" value="shiyong"></el-option>
                            <el-option key="zhinneg" label="智能" value="zhineng"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="多选标签">
                        <el-checkbox-group v-model="form.type">
                            <el-checkbox label="益智" name="type"></el-checkbox>
                            <el-checkbox label="实用" name="type"></el-checkbox>
                            <el-checkbox label="智能" name="type"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="单选标签">
                        <el-radio-group v-model="form.resource">
                            <el-radio label="步步高"></el-radio>
                            <el-radio label="小天才"></el-radio>
                            <el-radio label="imoo"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="介绍文本">
                        <el-input type="textarea" rows="5" v-model="form.desc"></el-input>
                    </el-form-item>


                    <el-form-item label="上传文件">
                        <div class="container">
                            <el-upload
                                    class="upload-demo"
                                    drag
                                    action="http://jsonplaceholder.typicode.com/api/posts/"
                                    multiple>
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                        </div>
                    </el-form-item>
                    <el-form-item label="应用图标">
                        <div class="crop-demo">
                            <img :src="cropImg" class="pre-img">
                            <div class="crop-demo-btn">选择图片
                                <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                            </div>
                        </div>

                        <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
                            <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
                            <span slot="footer" class="dialog-footer">
                                    <el-button @click="cancelCrop">取 消</el-button>
                                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                                 </span>
                        </el-dialog>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
export default {
    name: 'baseform',
    data() {
        return {
            options: [
                {
                    value: 'shipin',
                    label: '视频',
                    children: [
                        {
                            value: 'zhibo',
                            label: '直播',
                        },
                        {
                            value: 'bofangqi',
                            label: '播放器',
                        }
                    ]
                },
                {
                    value: 'yuedu',
                    label: '阅读',
                    children: [
                        {
                            value: 'dianzishu',
                            label: '电子书',
                        },
                        {
                            value: 'xinwen',
                            label: '新闻',
                        },
                        {
                            value: 'manhua',
                            label: '漫画',
                        }
                    ]
                },
                {
                    value: 'shejiao',
                    label: '社交',
                    children: [
                        {
                            value: 'liaotian',
                            label: '聊天',
                        },
                        {
                            value: 'hunlian',
                            label: '婚恋',
                        }
                    ]
                },
                {
                    value: 'youxi',
                    label: '游戏',
                    children: [
                        {
                            value: 'xiuxian',
                            label: '休闲益智',
                        },
                        {
                            value: 'jingying',
                            label: '经营策略',
                        },
                        {
                            value: 'juese',
                            label: '角色扮演',
                        }
                    ]
                }
            ],
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: true,
                type: ['步步高'],
                resource: '小天才',
                desc: '',
                options: [],
                version:''
            },

            defaultSrc: require('../../assets/img/img.jpg'),
            fileList: [],
            imgSrc: '',
            cropImg: '',
            dialogVisible: false,

            tagValue:[]
        };
    },
    components: {
        VueCropper
    },
    methods: {
        onSubmit() {
            this.$message.success('提交成功！');
        },
        setImage(e){
            const file = e.target.files[0];
            if (!file.type.includes('image/')) {
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                this.dialogVisible = true;
                this.imgSrc = event.target.result;
                this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
            };
            reader.readAsDataURL(file);
        },
        cropImage () {
            this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
        },
        cancelCrop(){
            this.dialogVisible = false;
            this.cropImg = this.defaultSrc;
        },
        imageuploaded(res) {
            console.log(res)
        },
        handleError(){
            this.$notify.error({
                title: '上传失败',
                message: '图片上传接口上传失败，可更改为自己的服务器接口'
            });
        }
    },
    created(){
        this.cropImg = this.defaultSrc;
    }
};
</script>

<style scoped>
    .content-title{
        font-weight: 400;
        line-height: 50px;
        margin: 0 0;
        font-size: 12px;
        color: #1f2f3d;
    }
    .pre-img{
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
</style>