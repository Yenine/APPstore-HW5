<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 应用列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                >批量删除</el-button>
                <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    row-key="version"
                    @selection-change="handleSelectionChange"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form v-if="props.row.children" label-position="left" inline class="demo-table-expand">
                            <el-form-item label="应用名">
                                <span>{{ props.row.name }}</span>
                            </el-form-item>
                            <el-form-item label="开发者">
                                <span>{{ props.row.developer }}</span>
                            </el-form-item>
                            <el-form-item label="ID">
                                <span>{{ props.row.id }}</span>
                            </el-form-item>
                            <el-form-item label="版本号">
                                <span>{{ props.row.version }}</span>
                            </el-form-item>
                            <el-form-item label="分类">
                                <span>{{ props.row.category[0] }}/{{ props.row.category[1] }}</span>
                            </el-form-item>
                            <el-form-item label="标签">
                                <el-tag v-for="tag in props.row.tags" type="info">{{ tag }}</el-tag>
                            </el-form-item>
                            <el-form-item label="应用描述">
                                <span>{{ props.row.description }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="应用名"></el-table-column>
                <el-table-column prop="version" label="版本号"></el-table-column>
                <el-table-column label="类别">
                    <template slot-scope="scope">{{scope.row.category[0]}}/{{scope.row.category[1]}}</template>
                </el-table-column>
                <el-table-column label="图标" align="center">
                    <template slot-scope="scope">
                        <el-image
                                class="table-td-thumb"
                                :src="scope.row.thumb"
                                :preview-src-list="[scope.row.thumb]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column  prop="tags" label="标签">
                    <template slot-scope="scope">
                        <el-tag v-for="tag in scope.row.tags" type="info">{{tag}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="state" label="状态" align="center"
                                 :filters="[{ text: '待审核', value: '待审核' }, { text: '未通过', value: '未通过' }, { text: '已通过', value: '已通过' }]"
                                 :filter-method="filterState"
                                 filter-placement="bottom-end">
                    <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.state==='已上架'?'success':(scope.row.state==='未上架'?'danger':'')"
                        >{{scope.row.state}}</el-tag>
                    </template>
                </el-table-column>

                <!--<el-table-column label="状态" align="center">-->
                <!--<template slot-scope="scope">-->
                <!--<el-tag-->
                <!--:type="scope.row.state==='成功'?'success':(scope.row.state==='失败'?'danger':'')"-->
                <!--&gt;{{scope.row.state}}</el-tag>-->
                <!--</template>-->
                <!--</el-table-column>-->

                <el-table-column prop="date" label="上传时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.state === '未上架'"
                                type="text"
                                icon="el-icon-upload2"
                                @click="handleUpper(scope.$index, scope.row)"
                        >上架</el-button>
                        <el-button v-if="scope.row.state === '已上架'"
                                   type="text"
                                   icon="el-icon-download"
                                   @click="handleLower(scope.$index, scope.row)"
                        >下架</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >修改</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="应用名">
                <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="类别">
                    <el-cascader :options="options" v-model="form.category"></el-cascader>
                </el-form-item>
                <el-form-item label="标签">
                    <el-select
                            v-model="form.tags"
                            multiple
                            filterable
                            allow-create
                            default-first-option
                            placeholder="请选择标签">
                        <el-option key="shiyong" label="实用" value="shiyong"></el-option>
                        <el-option key="zhinneg" label="智能" value="zhineng"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.description"></el-input>
                </el-form-item>
                <!--<el-form-item label="应用图标">-->
                    <!--<div class="crop-demo">-->
                        <!--<img :src="cropImg" class="pre-img">-->
                        <!--<div class="crop-demo-btn">选择图片-->
                            <!--<input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>-->
                        <!--</div>-->
                    <!--</div>-->

                    <!--<el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">-->
                        <!--<vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>-->
                        <!--<span slot="footer" class="dialog-footer">-->
                                    <!--<el-button @click="cancelCrop">取 消</el-button>-->
                                    <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
                                 <!--</span>-->
                    <!--</el-dialog>-->
                <!--</el-form-item>-->
            </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
        </el-dialog>


        <el-dialog title="编辑" :visible.sync="upperVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <span>确认上架？</span>
                <!--<el-form-item label="用户名">-->
                <!--<el-input v-model="form.name"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="地址">-->
                <!--<el-input v-model="form.address"></el-input>-->
                <!--</el-form-item>-->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="upperVisible = false">取 消</el-button>
                <el-button type="primary" @click="reqUpper">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑" :visible.sync="lowerVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <span>确认下架？</span>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="lowerVisible = false">取 消</el-button>
                <el-button type="primary" @click="reqLower">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { fetchData1 } from '../../api/index';
    export default {
        name: 'basetable',
        data() {
            return {
                options: [
                    {
                        value: '视频',
                        label: '视频',
                        children: [
                            {
                                value: '直播',
                                label: '直播',
                            },
                            {
                                value: '播放器',
                                label: '播放器',
                            }
                        ]
                    },
                    {
                        value: '阅读',
                        label: '阅读',
                        children: [
                            {
                                value: '电子书',
                                label: '电子书',
                            },
                            {
                                value: '新闻',
                                label: '新闻',
                            },
                            {
                                value: '漫画',
                                label: '漫画',
                            }
                        ]
                    },
                    {
                        value: '社交',
                        label: '社交',
                        children: [
                            {
                                value: '聊天',
                                label: '聊天',
                            },
                            {
                                value: '婚恋',
                                label: '婚恋',
                            }
                        ]
                    },
                    {
                        value: '游戏',
                        label: '游戏',
                        children: [
                            {
                                value: '休闲益智',
                                label: '休闲益智',
                            },
                            {
                                value: '经营策略',
                                label: '经营策略',
                            },
                            {
                                value: '角色扮演',
                                label: '角色扮演',
                            }
                        ]
                    }
                ],
                query: {
                    category: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                delVisible: false,
                upperVisible: false,
                lowerVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1
            };
        },
        created() {
            this.getData();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                fetchData1(this.query).then(res => {
                    console.log(res);
                    this.tableData = res.list;
                    this.pageTotal = res.pageTotal || 50;
                });
            },
            filterState(value, row) {
                return row.state === value;
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                // this.$confirm('确定要删除吗？', '提示', {
                //     type: 'warning'
                // })
                //     .then(() => {
                //         this.$message.success('删除成功');
                //         this.tableData.splice(index, 1);
                //     })
                //     .catch(() => {});
                this.idx = index;
                this.form = row;
                this.delVisible = true;
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                const length = this.multipleSelection.length;
                let str = '';
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error(`删除了${str}`);
                this.multipleSelection = [];
            },

            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$message.success('删除成功');
                        this.tableData.splice(index, 1);
                    })
                    .catch(() => {});
            },

            handleUpper(index, row) {
                this.idx = index;
                this.form = row;
                this.upperVisible = true;
            },
            handleLower(index, row) {
                this.idx = index;
                this.form = row;
                this.lowerVisible = true;
            },
            reqUpper(index, row) {
                // this.idx = index;
                // this.form = row;
                this.upperVisible = false;
                this.form.state='上架';
                //EMIT
            },
            reqLower(index, row) {
                this.lowerVisible = false;
                this.form.state='未上架';
                //EMIT
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.editVisible = true;
            },
            saveDel() {
                this.delVisible = false;
                this.$message.success(`驳回第 ${this.idx + 1} 行成功`);
                this.form.state='未通过';
                this.$set(this.tableData, this.idx, this.form);
                // this.$set(this.tableData, this.idx, this.form);
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                this.form.state='待审核';
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                this.$set(this.tableData, this.idx, this.form);
                // this.$set(this.tableData, this.idx, this.form);
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData();
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
                this.cropImg = this.form.thumb;
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
        }
    };
</script>

<style scoped>

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
    .crop-input {
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }

    .demo-table-expand .el-form-item {

        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    /*.demo-table-expand .el-form-item {*/
    /*margin-right: 0;*/
    /*margin-bottom: 0;*/
    /*width: 50%;*/
    /*}*/
</style>
