<template>
    <div class="contenr">
        <div id="add-blog">
            <div v-if="!blogData.submited">
                <input type="text" class="M_Ipt title" v-model="blogData.title" placeholder="文章标题" />
                <br />
                <br />
                <mavon-editor @imgAdd="$imgAdd" :boxShadow="false" :ishljs="true" placeholder="开始编辑" :subfield="false" v-model="blogData.content" />
                <div class="Flex">
                    <div class="col-12">
                        <textarea rows="3" class="M_Ipt describe" v-model="blogData.describe" placeholder="描述" cols="10"></textarea>
                        <div class="author">
                            <input type="text" class="M_Ipt mt10" v-model="blogData.author" placeholder="作者" />
                            <input type="text" class="M_Ipt mt10" v-model="blogData.link" placeholder="如非原创，请注明原文链接" />
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="addimg">
                            <img :src="addimg" @click="addimgbox()" alt />
                        </div>
                    </div>
                </div>
                <button class="M_Btn_Default" type="submit" v-on:click.prevent="post">提交博客</button>
            </div>
            <h3 v-if="blogData.submited">
                提交成功
                <br />
                <router-link to="/">返回首页</router-link>
            </h3>
        </div>
        <div v-if="addimglock" class="addimgcls">
            <div class="imgurl">
                <i data-v-62b9e4d1 aria-hidden="true" @click="lockfalse()" class="fa lockfalse fa-mavon-times"></i>
                <div class="imgurlbox">
                    <input type="text" class="M_Ipt imgurlipt" v-model="blogData.image" placeholder="封面图链接" />
                </div>
                <button class="M_Btn_Default center" @click="submitaddimg()">确认</button>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    // 引入Bmob
    import Bmob from "hydrogen-js-sdk";
    // 初始化SDK
    Bmob.initialize(
        "6ba991ef4d1c12f7bf1e5b61ee05bb60",
        "47e0f6cf681a9d51ca2fea06cdead1d0"
    );
    export default {
        name: "AddBlog",
        data() {
            return {
                blogData: {
                    describe: "",
                    title: "",
                    content: "",
                    categories: [],
                    author: "",
                    submited: false,
                    image: "",
                    link: ""
                },
                addimg:
                    "http://crazy-x-lovemysoul-x-vip.img.abc188.com/images/add.png",
                addimglock: false,
                imgname: "",
                imgurl: ""
            };
        },
        created() {},
        methods: {
            // 上传图片
            $imgAdd(pos, $file) {
                showMessage("暂不支持图床,请自行替换链接", "warning", 3000);
            },
            // 封面图上传
            submitaddimg() {
                if (this.blogData.image == "") {
                    this.addimg =
                        "http://crazy-x-lovemysoul-x-vip.img.abc188.com/images/add.png";
                } else {
                    this.addimg = this.blogData.image;
                }
                // 关闭封面图浮窗盒子
                this.lockfalse();
            },
            // 关闭封面图浮窗盒子
            lockfalse() {
                this.addimglock = false;
            },
            // 开启封面图浮窗盒子
            addimgbox() {
                this.addimglock = true;
            },
            // 增加博文
            post() {
                // 判断标题、内容、描述、作者、封面图
                if (this.blogData.title == "") {
                    showMessage("标题不能为空", "error", 2000);
                    return;
                } else if (this.blogData.content == "") {
                    showMessage("内容不能为空", "error", 2000);
                    return;
                } else if (this.blogData.describe == "") {
                    showMessage("描述不能为空", "error", 2000);
                    return;
                } else if (this.blogData.author == "") {
                    showMessage("作者不能为空", "error", 2000);
                    return;
                } else if (
                    this.blogData.image == "" ||
                    this.blogData.image ==
                        "http://crazy-x-lovemysoul-x-vip.img.abc188.com/images/add.png"
                ) {
                    showMessage("封面不能为空", "error", 2000);
                    return;
                } else if (this.blogData.link == "") {
                    this.blogData.link = "";
                }
                // 传入字段进行修改
                const query = Bmob.Query("Blog_Article");
                query.set("link", this.blogData.link);
                query.set("title", this.blogData.title);
                query.set("describe", this.blogData.describe);
                query.set("content", this.blogData.content);
                query.set("author", this.blogData.author);
                query.set("image", this.blogData.image);
                query.set("categories", this.blogData.categories.join(";"));
                query
                    .save()
                    .then(res => {
                        this.blogData.submited = true;
                        showMessage("发布成功", "success", 2000);
                    })
                    .catch(err => {
                        throw err;
                    });
            }
        }
    };
</script>
<style scoped>
.mt10 {
    margin-top: 10px;
}
.imgurlipt {
    height: 30px;
    line-height: 30px;
}
.lockfalse {
    cursor: pointer;
    width: 100%;
    display: block;
    text-align: right;
}
.center {
    width: 200px;
    text-align: center;
    margin: 0 auto;
}
.imgurl {
    width: 350px;
    height: 200px;
    background-color: #fff;
    margin: 20% auto;
    border-radius: 5px;
    padding: 10px;
    box-sizing: border-box;
}
.imgurlbox > .M_ipt {
    width: 220px !important;
}
.imgurlbox {
    width: 220px;
    margin: 20px auto;
    padding-top: 20px;
}
.addimgcls {
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    left: 0;
    height: 100%;
    width: 100%;
    top: 0;
    z-index: 99999;
}
.addimg {
    width: 100px;
    height: 100px;
    margin-top: 25px;
    margin-left: 20px;
}
.Flex {
    display: flex;
}
.Flex > .col-12 {
    width: 100%;
}
.M_Ipt:focus {
    border: 1px solid #469b6e;
}
.v-note-wrapper {
    border: 1px solid #dcdfe6;
}
.M_Btn_Default {
    background: #469b6e;
    border-color: #469b6e;
}
.describe {
    margin-top: 20px;
    height: 80px;
    width: 100%;
}
.author {
    width: 100%;
}
.contenr {
    padding-left: 260px;
    box-sizing: border-box;
    width: 100%;
}
.title {
    font-size: 16px;
    height: 40px;
    line-height: 40px;
}
.v-note-wrapper {
    min-height: 600px;
}
#add-blog * {
    box-sizing: border-box;
}
#add-blog {
    margin: 0 auto;
    max-width: 80%;
    background-color: #fff;
    padding: 20px;
    min-height: 600px;
}
#add-blog > h3 {
    padding-top: 200px;
}
label {
    display: block;
    margin: 20px 0 10px;
}
input[type="text"],
textarea,
select {
    width: 100%;
}
textarea {
    height: 200px;
    resize: none;
}
#checkboxes {
    margin-bottom: 10px;
}
#checkboxes label {
    display: inline-block;
    margin-top: 0;
}
#checkboxes input[type="checkbox"] {
    display: inline-block;
    margin-right: 10px;
}
button {
    display: block;
    margin-top: 20px;
    width: 180px;
}
#preview {
    padding: 10px 20px;
    border: 1px dotted #ccc;
    margin: 30px 0;
}
h3 {
    margin-top: 10px;
    text-align: center;
}
h2 {
    text-align: center;
}
</style>
