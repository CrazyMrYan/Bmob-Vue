<template>
    <div class="contenr">
        <div id="show-blogs">
            <div v-if="!loading">
                <input type="text" class="M_Ipt search" placeholder="标题关键词" v-model="search" />
            </div>
            <div class="loading" v-if="loading">
                <i class="fa fa-spinner fa-spin"></i> 日记正在加载中...
            </div>
            <div v-else class="M_Card_info" style="margin: 20px;" v-for="item in filterBlogs" :key="item.title">
                <div class="M_Card_head">
                    <router-link :to="'/blog/'+item.objectId">
                        {{item.title}} /
                        <span class="author">{{item.author}}</span>
                    </router-link>
                </div>
                <div class="M_Card_body" style="height: 100px;">
                    <router-link class="Flex" style="color:#666;" :to="'/blog/'+item.objectId">
                        <div class="blog-img">
                            <img :src="item.image" alt srcset />
                        </div>
                        <div class="describeBlog">{{item.describe.substring(0,100)+'...'}}</div>
                        <br />
                        <br />
                    </router-link>
                </div>
            </div>
            <div v-show="!loading" class="pages">{{filterBlogs.length}}/{{total}}</div>
            <div class="Addlist" v-show="ListData && search=='' &&!loading " @click="AddList()">点击加载更多</div>
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
        name: "ShowBlog",
        data() {
            return {
                blogs: [],
                search: "",
                loading: true,
                initpage: 3,
                ListLength: "",
                total: ""
            };
        },
        created() {
            // 判断有无数据存贮在本地
            this.GetList(this.initpage);
        },
        watch: {
            // 监听输入框的值
            search(val) {}
        },
        methods: {
            // 查看更多数据的配置
            AddList() {
                this.loading = true;
                this.GetList((this.initpage += 3));
            },
            // 获取列表数据
            GetList(e) {
                const query = Bmob.Query("Blog_Article");
                query.limit(e);
                query.order("-createdAt");
                // 获取文章总页数
                query.count().then(res => {
                    this.total = res;
                });
                query.find().then(res => {
                    this.ListLength = res.length;
                    // 点击查看更多进行窗口移至底部
                    this.$nextTick(function() {
                        var html = document.getElementsByTagName("html")[0];
                        html.scrollTop = html.scrollHeight;
                    });
                    this.blogs = res;
                    this.loading = false;
                });
            },
            // 获取整个表的数据总数
            GetTotal() {
                const query = Bmob.Query("Blog_Article");
                query.count().then(res => {
                    this.total = res;
                });
            }
        },
        computed: {
            // 是否开启查看更多按钮
            ListData() {
                return this.ListLength >= this.total ? false : true;
            },
            // 筛选赋值数据列表
            filterBlogs() {
                return this.blogs.filter(data => {
                    return data.title.match(this.search);
                });
            }
        }
    };
</script>
<style scoped>
.pages {
    text-align: center;
    margin-bottom: 10px;
}
.describeBlog {
    flex: 1;
    margin-left: 20px;
    text-indent: 2em;
}
.Flex {
    display: flex;
}
.blog-img {
    width: 100px;
}
.delete {
    text-align: right;
}
.M_Card_info > .M_Card_head {
    background-color: #83a7a0;
}
.M_Card_info > .M_Card_body {
    background-color: #efefef;
}
.M_Ipt:focus {
    border: 1px solid #83a7a0;
    border-radius: 10px;
}
.Addlist {
    text-align: center;
    cursor: pointer;
    padding-bottom: 15px;
}
.loading {
    text-align: center;
    padding-top: 20%;
    position: absolute;
    display: block;
    width: 68%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
}
.contenr {
    padding-left: 260px;
    box-sizing: border-box;
    width: 100%;
}
.search {
    margin: 20px;
    margin-bottom: 0;
    height: 30px;
    font-size: 14px;
    border-radius: 10px;
}
#show-blogs {
    margin: 0 auto;
    max-width: 80%;
    background: #fff;
    min-height: 900px;
    padding-bottom: 20px;
}
#single-blog {
    box-sizing: border-box;
    padding: 20px;
    margin: 20px 0;
    background-color: #eee;
    height: 150px;
    overflow: hidden;
}
.author {
    font-size: 12px;
}
h1 {
    text-align: center;
}
a {
    color: #fff;
    display: block;
}
</style>
