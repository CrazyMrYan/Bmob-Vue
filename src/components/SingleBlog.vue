<template>
    <div class="contenr">
        <div class="loading" v-if="loading">
            <i class="fa fa-spinner fa-spin"></i> 日记正在加载中...
        </div>
        <div v-else id="single-blog">
            <h2 class="title">{{blog.title}}</h2>
            <p class="blog-name">
                <b v-if="blog.link!=='null' && blog.link !==''"></b>
                <span v-else>原创</span>
                作者：{{blog.author}}
            </p>
            <mavon-editor :boxShadow="false" :editable="false" defaultOpen="preview" :toolbarsFlag="false" :preview="true" :subfield="false" v-model="markdownV" />
            <p class="bloginfo">作者：{{blog.author}}</p>
            <p class="bloginfo">最后编辑于：{{blog.updatedAt}}</p>
            <p v-if="blog.link!=='null' && blog.link!=='' " class="bloginfo">
                <a class="color" :href="blog.link" target="_blank" rel="noopener noreferrer">阅读原文</a>
            </p>
            <p v-else class="bloginfo">
                <a class="color" :href="link" target="_blank" rel="noopener noreferrer">本文地址：{{link}}</a>
            </p>
            <div class="newcommentbox">
                <textarea class="M_Ipt newcomment" v-model="newcomment" placeholder="评论内容"></textarea>
                <input type="text" class="M_Ipt search" placeholder="昵称" v-model="newcommentname" />
                <br />
                <button class="M_Btn_Default submitbtn" @click="submit()">提交</button>
            </div>
            <div v-if="commentList.length!=0" class="commentbox">
                <b class="commentQ">评论区：</b>
                <div v-for="item in commentList" :key="item.objectId">
                    {{item.comment.objectId}}
                    <p>
                        {{item.nikename}}
                        <br />
                        {{item.createdAt}}
                    </p>
                </div>
            </div>
            <div v-else>
                <b class="commentQ">评论区：</b>
                <div class="nonecomment">暂无评论，快来留下你的足迹吧！</div>
            </div>
        </div>
        <div class="star" @click.stop="GetStar(star)">
            <i :class="[starlock?'starlock fa fa-thumbs-up':'fa fa-thumbs-up']"></i>
            {{star}}
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
        name: "SingleBlog",
        data() {
            return {
                newcomment: "",
                newcommentname: "",
                id: this.$route.params,
                markdownV: "",
                blog: {},
                commentList: [],
                blogid: "",
                link: window.location.href,
                loading: true,
                star: null,
                starlock: false
            };
        },
        created() {
            this.GetListData();
        },
        methods: {
            // 获取文章数据
            GetListData() {
                const query = Bmob.Query("Blog_Article");
                query.get(this.id.objectId).then(
                    res => {
                        this.markdownV = res.content;
                        this.blog = res;
                        this.loading = false;
                        this.star = res.star;
                        if (localStorage.getItem(res.objectId + "Star")) {
                            this.starlock = true;
                        } else {
                            this.starlock = false;
                        }
                    },
                    err => {
                        // 判断Code值进行错误执行方法
                        if (err.code == 101) {
                            showMessage(
                                "文章不见啦!将在3秒后返回首页",
                                "error",
                                3000
                            );
                            var _this = this;
                            setTimeout(function() {
                                _this.$router.push({ path: "/" });
                            }, 3000);
                        }
                    }
                );
                // 进行当前文章的评论查询
                this.getcomment(this.id.objectId);
                this.blogid = this.id.objectId;
            },
            // 进行点赞
            Star(starnum, StarType) {
                const query = Bmob.Query("Blog_Article");
                query.get(this.blogid).then(res => {
                    res.set("star", starnum);
                    res.save();
                    this.star = res.star;
                    this.GetListData();
                    if (StarType == "execute") {
                        showMessage("点赞成功！", "success", 2000);
                        this.starlock = true;
                    } else {
                        showMessage("已取消点赞！", "success", 2000);
                        this.starlock = false;
                    }
                });
            },
            // 执行点赞判断
            GetStar(e) {
                // 因为暂时没有关联用户表，所以这边直接使用本地存储进行判断是否点赞
                var starnum = null;
                if (localStorage.getItem(this.blogid + "Star")) {
                    localStorage.removeItem(this.blogid + "Star");
                    starnum = e - 1;
                    this.Star(starnum, "cancel");
                } else {
                    localStorage.setItem(this.blogid + "Star", true);
                    starnum = e + 1;
                    this.Star(starnum, "execute");
                }
            },
            // 评论提交
            submit() {
                if (this.newcomment == "" || this.newcomment == null) {
                    showMessage("评论内容不能为空", "error", 2000);
                    return;
                } else if (
                    this.newcommentname == "" ||
                    this.newcommentname == null
                ) {
                    showMessage("评论昵称不能为空", "error", 2000);
                    return;
                }
                const query = Bmob.Query("Blog_Comment");
                query
                    .save()
                    .then(res => {
                        this.getpointer(res.objectId);
                    })
                    .catch(err => {
                        throw err;
                    });
            },
            // 评论操作
            getpointer(e) {
                const pointer = Bmob.Pointer("Blog_Article");
                const blog_id = pointer.set(this.blogid);
                const newcomment = pointer.set(this.newcomment);
                const query = Bmob.Query("Blog_Comment");
                query.get(e).then(res => {
                    res.set("id", blog_id);
                    res.set("nikename", this.newcommentname);
                    res.set("comment", newcomment);
                    res.save();
                    this.getcomment(this.blogid);
                    this.newcommentname = "";
                    this.newcomment = "";
                    showMessage("评论成功！", "success", 2000);
                });
            },
            // 评论查询
            getcomment(e) {
                const query = Bmob.Query("Blog_Comment");
                const pointer = Bmob.Pointer("Blog_Article");
                const id = pointer.set(e);
                query.order("-createdAt");
                query.equalTo("id", "==", id);
                query.find().then(res => {
                    this.commentList = res;
                });
            }
        }
    };
</script>
<style scoped>
.starlock {
    color: red;
}
.star {
    width: 60px;
    height: 40px;
    border-radius: 5px;
    background: #fff;
    text-align: center;
    line-height: 40px;
    position: fixed;
    cursor: pointer;
    right: 20px;
    bottom: 50px;
    z-index: 999999;
}
.loading {
    text-align: center;
    padding-top: 20%;
    position: absolute;
    width: 80%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
}
.blog-name {
    text-align: left;
    text-indent: 2em;
    font-size: 14px;
    margin-bottom: 20px;
}
.blog-name > span {
    padding: 2px 5px;
    background: #efefef;
    columns: #666;
}
.nonecomment {
    text-align: center;
    font-size: 14px;
    color: #666;
}
.search {
    margin-top: 10px;
}
.M_Btn_Default {
    background: #469b6e;
    border-color: #469b6e;
}
.submitbtn {
    width: 100px;
    margin-top: 10px;
}
.M_Ipt:focus {
    border: 1px solid #469b6e;
}
.newcommentbox {
    box-sizing: border-box;
    padding: 35px;
    padding-bottom: 0;
    font-size: 16px;
    padding-bottom: 10px;
}
.newcomment {
    width: 100%;
    min-height: 150px;
    display: block;
    font-size: 14px;
}
.commentQ {
    display: block;
    text-indent: 1em;
    padding-bottom: 10px;
    margin-top: 20px;
}
.commentbox {
    width: 100%;
    margin-top: 50px;
    padding: 20px;
    box-sizing: border-box;
}
.commentbox p {
    text-align: right;
    font-size: 12px;
    color: #666;
}
.commentbox > div {
    width: 100%;
    background-color: #efefef;
    padding: 20px;
    box-sizing: border-box;
    margin: 5px;
    border-radius: 5px;
    text-indent: 2em;
}
.color {
    color: #469b6e;
}
.bloginfo {
    text-align: right;
    font-size: 14px;
}
.contenr {
    padding-left: 260px;
    box-sizing: border-box;
    width: 100%;
}
#single-blog {
    max-width: 80%;
    margin: 0 auto;
    background-color: rgb(251, 251, 251);
    padding: 20px;
    box-sizing: border-box;
}
.title {
    font-size: 36px;
    text-indent: 1em;
    margin-bottom: 20px;
}
.v-note-wrapper {
    border: unset;
}
</style>
